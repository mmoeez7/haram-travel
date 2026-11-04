import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog } from "@/lib/admin";
import { duplicateSlug } from "@/lib/duplicate-slug";
import {
  UMRAH_DEALS_ROOT_SLUG,
  UMRAH_PACKAGES_ROOT_SLUG,
} from "@/lib/category-roots";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const source = await prisma.category.findFirst({
    where: { id, deletedAt: null },
  });
  if (!source) return jsonError("Category not found", 404);

  const isRoot =
    source.parentId === null &&
    (source.slug === UMRAH_PACKAGES_ROOT_SLUG ||
      source.slug === UMRAH_DEALS_ROOT_SLUG);

  if (isRoot) {
    return jsonError("Root categories cannot be duplicated.");
  }
  if (!source.parentId) {
    return jsonError("Only subcategories can be duplicated.");
  }

  const slug = duplicateSlug(source.slug);

  try {
    const copy = await prisma.category.create({
      data: {
        name: `${source.name} (Copy)`,
        slug,
        kind: source.kind,
        parentId: source.parentId,
        description: source.description,
        coverImageUrl: source.coverImageUrl,
        coverImageAlt: source.coverImageAlt,
        sortOrder: source.sortOrder,
        published: false,
      },
    });

    await writeAuditLog({
      adminUserId: session.user.id,
      action: "CATEGORY_DUPLICATE",
      entityType: "category",
      entityId: copy.id,
      metadata: { sourceId: source.id, slug: copy.slug, published: false },
    });

    return NextResponse.json({ category: copy }, { status: 201 });
  } catch (err) {
    console.error("CATEGORY_DUPLICATE failed", err);
    return jsonError(
      err instanceof Error ? err.message : "Could not duplicate category",
      500
    );
  }
}
