import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, isSlugTaken } from "@/lib/admin";
import { categorySchema } from "@/lib/admin-schemas";
import {
  UMRAH_DEALS_ROOT_SLUG,
  UMRAH_PACKAGES_ROOT_SLUG,
} from "@/lib/category-roots";
import { categoryListingHref } from "@/lib/package-paths";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { id } = await params;

  const category = await prisma.category.findFirst({
    where: { id, deletedAt: null },
    include: {
      parent: { select: { id: true, name: true, slug: true } },
      _count: { select: { children: true } },
    },
  });
  if (!category) return jsonError("Category not found", 404);
  return NextResponse.json({ category });
}

export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.category.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Category not found", 404);

  const isRoot =
    existing.parentId === null &&
    (existing.slug === UMRAH_PACKAGES_ROOT_SLUG ||
      existing.slug === UMRAH_DEALS_ROOT_SLUG);

  const parsed = categorySchema.safeParse({
    ...body,
    slug: body.slug || existing.slug,
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid category");
  }

  let parentId = existing.parentId;
  if (!isRoot) {
    const parentIdRaw = parsed.data.parentId;
    const nextParentId =
      parentIdRaw && String(parentIdRaw).trim() ? String(parentIdRaw).trim() : null;
    if (!nextParentId) {
      return jsonError("Select a parent group (Umrah Packages or Umrah Deals).");
    }
    const parent = await prisma.category.findFirst({
      where: { id: nextParentId, deletedAt: null, parentId: null },
    });
    if (
      !parent ||
      (parent.slug !== UMRAH_PACKAGES_ROOT_SLUG &&
        parent.slug !== UMRAH_DEALS_ROOT_SLUG)
    ) {
      return jsonError("Parent must be Umrah Packages or Umrah Deals.");
    }
    parentId = parent.id;
  }

  if (
    !isRoot &&
    (parsed.data.slug === UMRAH_PACKAGES_ROOT_SLUG ||
      parsed.data.slug === UMRAH_DEALS_ROOT_SLUG)
  ) {
    return jsonError("That slug is reserved for a root category.");
  }
  if (
    !isRoot &&
    (await isSlugTaken("category", parsed.data.slug, id))
  ) {
    return jsonError("Slug is already in use");
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug: isRoot ? existing.slug : parsed.data.slug,
      kind: parsed.data.kind,
      parentId: isRoot ? null : parentId,
      description: parsed.data.description || null,
      coverImageUrl: parsed.data.coverImageUrl || null,
      coverImageAlt: parsed.data.coverImageAlt || parsed.data.name,
      sortOrder: parsed.data.sortOrder,
      published: parsed.data.published,
    },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "CATEGORY_UPDATE",
    entityType: "category",
    entityId: category.id,
    metadata: { slug: category.slug, parentId: category.parentId },
  });

  revalidatePath("/", "layout");
  revalidatePath(`/categories/${category.slug}`);
  revalidatePath(categoryListingHref(category.slug));
  return NextResponse.json({ category });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const existing = await prisma.category.findFirst({
    where: { id, deletedAt: null },
    include: { _count: { select: { children: true } } },
  });
  if (!existing) return jsonError("Category not found", 404);

  const isRoot =
    existing.parentId === null &&
    (existing.slug === UMRAH_PACKAGES_ROOT_SLUG ||
      existing.slug === UMRAH_DEALS_ROOT_SLUG);

  if (isRoot) {
    return jsonError("Root categories cannot be deleted.");
  }

  if (existing._count.children > 0) {
    return jsonError("Delete or move child categories first.");
  }

  await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date(), published: false },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "CATEGORY_DELETE",
    entityType: "category",
    entityId: id,
  });

  return NextResponse.json({ ok: true });
}
