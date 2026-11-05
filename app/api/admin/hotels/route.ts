import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, slugify, isSlugTaken } from "@/lib/admin";
import { csvToArray, hotelSchema } from "@/lib/admin-schemas";
import { syncHotelImages } from "@/lib/hotel-images";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  const hotels = await prisma.hotel.findMany({
    where: { deletedAt: null },
    include: {
      images: { orderBy: { sortOrder: "asc" }, select: { id: true, url: true } },
    },
    orderBy: [{ stars: "asc" }, { city: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({ hotels });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;

  const body = await request.json();
  const parsed = hotelSchema.safeParse({
    ...body,
    slug: body.slug || slugify(String(body.name || "")),
    amenities: Array.isArray(body.amenities)
      ? body.amenities.join(", ")
      : body.amenities,
    imageUrls: body.imageUrls ?? [],
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid hotel");
  }
  if (await isSlugTaken("hotel", parsed.data.slug)) {
    return jsonError("Slug is already in use");
  }

  const hotel = await prisma.$transaction(async (tx) => {
    const created = await tx.hotel.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        city: parsed.data.city,
        stars: parsed.data.stars,
        walkingMinutes: parsed.data.walkingMinutes ?? null,
        distanceToHaramM: parsed.data.distanceToHaramM ?? null,
        address: parsed.data.address || null,
        shortDescription: parsed.data.shortDescription || null,
        description: parsed.data.description || null,
        amenities: csvToArray(parsed.data.amenities),
        coverImageUrl: null,
        coverImageAlt: null,
        sortOrder: parsed.data.sortOrder,
        published: parsed.data.published,
      },
    });

    const synced = await syncHotelImages(
      tx,
      created.id,
      parsed.data.imageUrls,
      parsed.data.name
    );

    return tx.hotel.update({
      where: { id: created.id },
      data: {
        coverImageUrl: synced.coverImageUrl,
        coverImageAlt: synced.coverImageAlt,
      },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "HOTEL_CREATE",
    entityType: "hotel",
    entityId: hotel.id,
    metadata: { slug: hotel.slug, imageCount: hotel.images.length },
  });

  return NextResponse.json({ hotel }, { status: 201 });
}
