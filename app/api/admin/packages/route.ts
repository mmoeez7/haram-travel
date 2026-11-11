import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, slugify, isSlugTaken } from "@/lib/admin";
import { linesToArray, packageSchema } from "@/lib/admin-schemas";
import { assertAssignableUmrahCategory } from "@/lib/package-category";
import {
  buildPaginationMeta,
  parseAdminPage,
  parseAdminPageSize,
} from "@/lib/admin-pagination";
import { syncPackageImages } from "@/lib/package-images";
import { revalidatePath } from "next/cache";

function normalizeFeatures(value: unknown) {
  if (Array.isArray(value)) return value.join("\n");
  return String(value ?? "");
}

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();
  const page = parseAdminPage(searchParams);
  const pageSize = parseAdminPageSize(searchParams);

  const where: Prisma.PackageWhereInput = {
    deletedAt: null,
    ...(status === "draft" ? { published: false } : {}),
    ...(status === "published" ? { published: true } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { subtitle: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { badge: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const packageListInclude = {
    categories: {
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parent: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    },
  } as const;

  if (page === null) {
    const packages = await prisma.package.findMany({
      where,
      include: packageListInclude,
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });
    return NextResponse.json({ packages });
  }

  const total = await prisma.package.count({ where });
  const pagination = buildPaginationMeta(total, page, pageSize);
  const packages = await prisma.package.findMany({
    where,
    include: packageListInclude,
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    skip: (pagination.page - 1) * pagination.pageSize,
    take: pagination.pageSize,
  });

  return NextResponse.json({ packages, pagination });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;

  const body = await request.json();
  const parsed = packageSchema.safeParse({
    ...body,
    slug: body.slug || slugify(String(body.title || "")),
    features: normalizeFeatures(body.features),
    categoryId: body.categoryId ?? "",
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid package");
  }
  if (parsed.data.makkahNights + parsed.data.madinahNights > parsed.data.nights) {
    return jsonError("Makkah + Madinah nights cannot exceed total nights.");
  }
  if (await isSlugTaken("package", parsed.data.slug)) {
    return jsonError("Slug is already in use");
  }

  const categoryId =
    parsed.data.journeyType === "UMRAH" ? parsed.data.categoryId || "" : "";
  if (categoryId) {
    const check = await assertAssignableUmrahCategory(prisma, categoryId);
    if (!check.ok) return jsonError(check.message);
  }

  const imageUrls =
    (parsed.data.imageUrls?.length ?? 0) > 0
      ? parsed.data.imageUrls
      : parsed.data.coverImageUrl
        ? [parsed.data.coverImageUrl]
        : [];

  const data = {
    title: parsed.data.title,
    subtitle: parsed.data.subtitle,
    slug: parsed.data.slug,
    journeyType: parsed.data.journeyType,
    stars: parsed.data.stars,
    nights: parsed.data.nights,
    makkahNights: parsed.data.makkahNights,
    madinahNights: parsed.data.madinahNights,
    priceFrom: parsed.data.priceFrom,
    deposit: parsed.data.deposit,
    badge: parsed.data.badge || null,
    season: parsed.data.season,
    features: linesToArray(parsed.data.features),
    shortDescription: parsed.data.shortDescription || null,
    description: parsed.data.description || null,
    coverImageUrl: imageUrls[0] ?? null,
    coverImageAlt: parsed.data.coverImageAlt || parsed.data.title,
    featured: parsed.data.featured,
    published: parsed.data.published,
    sortOrder: parsed.data.sortOrder,
    publishedAt: parsed.data.published ? new Date() : null,
    createdById: session.user.id,
    updatedById: session.user.id,
  };

  const pkg = await prisma.package.create({ data });

  if (categoryId) {
    await prisma.packageCategory.create({
      data: { packageId: pkg.id, categoryId },
    });
  }
  if (parsed.data.makkahHotelId) {
    await prisma.packageHotel.create({
      data: {
        packageId: pkg.id,
        hotelId: parsed.data.makkahHotelId,
        role: "MAKKAH",
        nights: parsed.data.makkahNights,
      },
    });
  }
  if (parsed.data.madinahHotelId) {
    await prisma.packageHotel.create({
      data: {
        packageId: pkg.id,
        hotelId: parsed.data.madinahHotelId,
        role: "MADINAH",
        nights: parsed.data.madinahNights,
      },
    });
  }

  const synced = await syncPackageImages(
    prisma,
    pkg.id,
    imageUrls,
    data.coverImageAlt
  );
  if (synced.coverImageUrl !== data.coverImageUrl) {
    await prisma.package.update({
      where: { id: pkg.id },
      data: {
        coverImageUrl: synced.coverImageUrl,
        coverImageAlt: synced.coverImageAlt,
      },
    });
  }

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "PACKAGE_CREATE",
    entityType: "package",
    entityId: pkg.id,
    metadata: { slug: pkg.slug, published: pkg.published },
  });

  revalidatePath("/", "layout");
  revalidatePath("/umrah-packages");
  revalidatePath("/3-star-umrah-packages");
  revalidatePath("/4-star-umrah-packages");
  revalidatePath("/5-star-umrah-packages");
  revalidatePath("/hajj-packages");
  revalidatePath("/categories", "layout");
  revalidatePath(`/${pkg.slug}`);
  return NextResponse.json({ package: pkg }, { status: 201 });
}
