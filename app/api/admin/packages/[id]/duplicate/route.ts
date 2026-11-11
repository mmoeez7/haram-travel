import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog } from "@/lib/admin";
import { duplicateSlug } from "@/lib/duplicate-slug";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const source = await prisma.package.findFirst({
    where: { id, deletedAt: null },
    include: {
      categories: true,
      hotels: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!source) return jsonError("Package not found", 404);

  const slug = duplicateSlug(source.slug);

  try {
    const copy = await prisma.package.create({
      data: {
        title: `${source.title} (Copy)`,
        subtitle: source.subtitle,
        slug,
        journeyType: source.journeyType,
        stars: source.stars,
        nights: source.nights,
        makkahNights: source.makkahNights,
        madinahNights: source.madinahNights,
        priceFrom: source.priceFrom,
        deposit: source.deposit,
        badge: source.badge,
        season: source.season,
        features: source.features,
        shortDescription: source.shortDescription,
        description: source.description,
        coverImageUrl: source.coverImageUrl,
        coverImageAlt: source.coverImageAlt,
        featured: false,
        published: false,
        sortOrder: source.sortOrder,
        publishedAt: null,
        createdById: session.user.id,
        updatedById: session.user.id,
      },
    });

    if (source.categories.length) {
      await prisma.packageCategory.createMany({
        data: source.categories.map((link) => ({
          packageId: copy.id,
          categoryId: link.categoryId,
        })),
      });
    }

    if (source.hotels.length) {
      await prisma.packageHotel.createMany({
        data: source.hotels.map((link) => ({
          packageId: copy.id,
          hotelId: link.hotelId,
          role: link.role,
          nights: link.nights,
          notes: link.notes,
        })),
      });
    }

    if (source.images.length) {
      await prisma.packageImage.createMany({
        data: source.images.map((image) => ({
          packageId: copy.id,
          url: image.url,
          alt: image.alt,
          sortOrder: image.sortOrder,
          isCover: image.isCover,
        })),
      });
    }

    await writeAuditLog({
      adminUserId: session.user.id,
      action: "PACKAGE_DUPLICATE",
      entityType: "package",
      entityId: copy.id,
      metadata: { sourceId: source.id, slug: copy.slug, published: false },
    });

    return NextResponse.json({ package: copy }, { status: 201 });
  } catch (err) {
    console.error("PACKAGE_DUPLICATE failed", err);
    return jsonError(
      err instanceof Error ? err.message : "Could not duplicate package",
      500
    );
  }
}
