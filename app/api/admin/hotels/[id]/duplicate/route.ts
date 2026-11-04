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

  const source = await prisma.hotel.findFirst({
    where: { id, deletedAt: null },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!source) return jsonError("Hotel not found", 404);

  const slug = duplicateSlug(source.slug);

  try {
    const copy = await prisma.$transaction(async (tx) => {
      const created = await tx.hotel.create({
        data: {
          name: `${source.name} (Copy)`,
          slug,
          city: source.city,
          stars: source.stars,
          walkingMinutes: source.walkingMinutes,
          distanceToHaramM: source.distanceToHaramM,
          address: source.address,
          shortDescription: source.shortDescription,
          description: source.description,
          coverImageUrl: source.coverImageUrl,
          coverImageAlt: source.coverImageAlt,
          amenities: source.amenities,
          published: false,
          sortOrder: source.sortOrder,
        },
      });

      if (source.images.length) {
        await tx.hotelImage.createMany({
          data: source.images.map((image) => ({
            hotelId: created.id,
            url: image.url,
            alt: image.alt,
            sortOrder: image.sortOrder,
            isCover: image.isCover,
          })),
        });
      }

      return tx.hotel.findFirstOrThrow({
        where: { id: created.id },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });
    });

    await writeAuditLog({
      adminUserId: session.user.id,
      action: "HOTEL_DUPLICATE",
      entityType: "hotel",
      entityId: copy.id,
      metadata: { sourceId: source.id, slug: copy.slug, published: false },
    });

    return NextResponse.json({ hotel: copy }, { status: 201 });
  } catch (err) {
    console.error("HOTEL_DUPLICATE failed", err);
    return jsonError(
      err instanceof Error ? err.message : "Could not duplicate hotel",
      500
    );
  }
}
