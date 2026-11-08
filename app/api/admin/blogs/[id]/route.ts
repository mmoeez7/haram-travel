import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, isSlugTaken } from "@/lib/admin";
import { blogPostSchema } from "@/lib/admin-schemas";
import { sanitizeSeoHtml } from "@/lib/sanitize-html";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { id } = await params;

  const post = await prisma.blogPost.findFirst({
    where: { id, deletedAt: null },
  });
  if (!post) return jsonError("Blog post not found", 404);
  return NextResponse.json({ post });
}

export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.blogPost.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Blog post not found", 404);

  const parsed = blogPostSchema.safeParse({
    ...body,
    slug: body.slug || existing.slug,
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid blog post");
  }

  if (await isSlugTaken("blog", parsed.data.slug, id)) {
    return jsonError("Slug is already in use");
  }

  const content = sanitizeSeoHtml(parsed.data.content) || null;
  const publishedAt = parsed.data.published
    ? existing.publishedAt ?? new Date()
    : null;

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      content,
      coverImageUrl: parsed.data.coverImageUrl || null,
      coverImageAlt: parsed.data.coverImageAlt || parsed.data.title,
      metaTitle: parsed.data.metaTitle || null,
      metaDescription: parsed.data.metaDescription || null,
      sortOrder: parsed.data.sortOrder,
      published: parsed.data.published,
      publishedAt,
    },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "BLOG_UPDATE",
    entityType: "blog",
    entityId: post.id,
    metadata: { slug: post.slug },
  });

  revalidatePath("/blogs");
  revalidatePath(`/blogs/${existing.slug}`);
  revalidatePath(`/blogs/${post.slug}`);
  revalidatePath("/", "layout");
  return NextResponse.json({ post });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const existing = await prisma.blogPost.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Blog post not found", 404);

  await prisma.blogPost.update({
    where: { id },
    data: { deletedAt: new Date(), published: false },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "BLOG_DELETE",
    entityType: "blog",
    entityId: id,
  });

  revalidatePath("/blogs");
  revalidatePath(`/blogs/${existing.slug}`);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
