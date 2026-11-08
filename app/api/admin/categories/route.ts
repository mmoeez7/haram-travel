import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, slugify, isSlugTaken } from "@/lib/admin";
import { categorySchema } from "@/lib/admin-schemas";
import {
  UMRAH_DEALS_ROOT_SLUG,
  UMRAH_PACKAGES_ROOT_SLUG,
  isUmrahRootSlug,
} from "@/lib/category-roots";
import {
  buildPaginationMeta,
  parseAdminPage,
  parseAdminPageSize,
} from "@/lib/admin-pagination";
import { categoryListingHref } from "@/lib/package-paths";
import { sanitizeSeoHtml } from "@/lib/sanitize-html";

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get("parentId");
  const root = searchParams.get("root");
  const rootsOnly = searchParams.get("rootsOnly") === "1";
  const q = searchParams.get("q")?.trim();
  const page = parseAdminPage(searchParams);
  const pageSize = parseAdminPageSize(searchParams);

  let resolvedParentId = parentId;

  if (root) {
    if (!isUmrahRootSlug(root)) {
      return jsonError("Invalid root. Use umrah-packages or umrah-deals.");
    }
    const rootCategory = await prisma.category.findFirst({
      where: { slug: root, deletedAt: null, parentId: null },
      select: { id: true },
    });
    if (!rootCategory) return jsonError("Root category not found", 404);
    resolvedParentId = rootCategory.id;
  }

  const where = {
    deletedAt: null,
    ...(rootsOnly ? { parentId: null } : {}),
    ...(resolvedParentId ? { parentId: resolvedParentId } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const include = {
    parent: { select: { id: true, name: true, slug: true } },
    _count: { select: { children: true } },
  } as const;

  if (page === null) {
    const categories = await prisma.category.findMany({
      where,
      include,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ categories });
  }

  const total = await prisma.category.count({ where });
  const pagination = buildPaginationMeta(total, page, pageSize);
  const categories = await prisma.category.findMany({
    where,
    include,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    skip: (pagination.page - 1) * pagination.pageSize,
    take: pagination.pageSize,
  });

  return NextResponse.json({ categories, pagination });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;

  const body = await request.json();
  const parsed = categorySchema.safeParse({
    ...body,
    slug: body.slug || slugify(String(body.name || "")),
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid category");
  }

  const parentIdRaw = parsed.data.parentId;
  const parentId =
    parentIdRaw && String(parentIdRaw).trim() ? String(parentIdRaw).trim() : null;

  if (!parentId) {
    return jsonError("Select a parent group (Umrah Packages or Umrah Deals).");
  }

  const parent = await prisma.category.findFirst({
    where: { id: parentId, deletedAt: null, parentId: null },
  });
  if (
    !parent ||
    (parent.slug !== UMRAH_PACKAGES_ROOT_SLUG && parent.slug !== UMRAH_DEALS_ROOT_SLUG)
  ) {
    return jsonError("Parent must be Umrah Packages or Umrah Deals.");
  }

  if (
    parsed.data.slug === UMRAH_PACKAGES_ROOT_SLUG ||
    parsed.data.slug === UMRAH_DEALS_ROOT_SLUG
  ) {
    return jsonError("That slug is reserved for a root category.");
  }
  if (await isSlugTaken("category", parsed.data.slug)) {
    return jsonError("Slug is already in use");
  }

  const seoContent = sanitizeSeoHtml(parsed.data.seoContent) || null;

  const category = await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      kind: parsed.data.kind,
      parentId: parent.id,
      description: parsed.data.description || null,
      seoContent,
      coverImageUrl: parsed.data.coverImageUrl || null,
      coverImageAlt: parsed.data.coverImageAlt || parsed.data.name,
      sortOrder: parsed.data.sortOrder,
      published: parsed.data.published,
    },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "CATEGORY_CREATE",
    entityType: "category",
    entityId: category.id,
    metadata: { slug: category.slug, parentId: parent.id },
  });

  revalidatePath("/", "layout");
  revalidatePath(`/categories/${category.slug}`);
  revalidatePath(categoryListingHref(category.slug));
  return NextResponse.json({ category }, { status: 201 });
}
