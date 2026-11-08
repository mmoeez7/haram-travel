import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, slugify, isSlugTaken } from "@/lib/admin";
import { blogPostSchema } from "@/lib/admin-schemas";
import {
  buildPaginationMeta,
  parseAdminPage,
  parseAdminPageSize,
} from "@/lib/admin-pagination";
import { sanitizeSeoHtml } from "@/lib/sanitize-html";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();
  const page = parseAdminPage(searchParams);
  const pageSize = parseAdminPageSize(searchParams);

  const where: Prisma.BlogPostWhereInput = {
    deletedAt: null,
    ...(status === "draft" ? { published: false } : {}),
    ...(status === "published" ? { published: true } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { excerpt: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  if (page === null) {
    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    });
    return NextResponse.json({ posts });
  }

  const total = await prisma.blogPost.count({ where });
  const pagination = buildPaginationMeta(total, page, pageSize);
  const posts = await prisma.blogPost.findMany({
    where,
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
    skip: (pagination.page - 1) * pagination.pageSize,
    take: pagination.pageSize,
  });

  return NextResponse.json({ posts, pagination });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;

  const body = await request.json();
  const parsed = blogPostSchema.safeParse({
    ...body,
    slug: body.slug || slugify(String(body.title || "")),
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid blog post");
  }

  if (await isSlugTaken("blog", parsed.data.slug)) {
    return jsonError("Slug is already in use");
  }

  const content = sanitizeSeoHtml(parsed.data.content) || null;
  const publishedAt = parsed.data.published ? new Date() : null;

  const post = await prisma.blogPost.create({
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
    action: "BLOG_CREATE",
    entityType: "blog",
    entityId: post.id,
    metadata: { slug: post.slug },
  });

  revalidatePath("/blogs");
  revalidatePath(`/blogs/${post.slug}`);
  revalidatePath("/", "layout");
  return NextResponse.json({ post }, { status: 201 });
}
