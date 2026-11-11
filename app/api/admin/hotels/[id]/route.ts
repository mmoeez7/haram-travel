import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, isSlugTaken } from "@/lib/admin";
import { csvToArray, hotelSchema } from "@/lib/admin-schemas";
import { syncHotelImages } from "@/lib/hotel-images";
import { cleanupRemovedBlobUrls } from "@/lib/uploads";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { id } = await params;

  const hotel = await prisma.hotel.findFirst({
    where: { id, deletedAt: null },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!hotel) return jsonError("Hotel not found", 404);
  return NextResponse.json({ hotel });
}

export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.hotel.findFirst({
    where: { id, deletedAt: null },
    include: { images: { select: { url: true } } },
  });
  if (!existing) return jsonError("Hotel not found", 404);

  const parsed = hotelSchema.safeParse({
    ...body,
    slug: body.slug || existing.slug,
    amenities: Array.isArray(body.amenities)
      ? body.amenities.join(", ")
      : body.amenities,
    imageUrls: body.imageUrls ?? [],
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid hotel");
  }
  if (await isSlugTaken("hotel", parsed.data.slug, id)) {
    return jsonError("Slug is already in use");
  }

  const previousUrls = [
    ...existing.images.map((img) => img.url),
    existing.coverImageUrl ?? "",
  ].filter(Boolean);

  try {
    const synced = await syncHotelImages(
      prisma,
      id,
      parsed.data.imageUrls,
      parsed.data.name
    );

    // Neon HTTP adapter: update+include uses transactions — split the read.
    await prisma.hotel.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        city: parsed.data.city,
        stars: parsed.data.stars,
        walkingMinutes: parsed.data.walkingMinutes ?? null,
        distanceToHaramM: parsed.data.distanceToHaramM ?? null,
        description: parsed.data.description || null,
        amenities: csvToArray(parsed.data.amenities),
        coverImageUrl: synced.coverImageUrl,
        coverImageAlt: synced.coverImageAlt,
        sortOrder: parsed.data.sortOrder,
        published: parsed.data.published,
      },
    });

    const hotel = await prisma.hotel.findFirstOrThrow({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    await cleanupRemovedBlobUrls(previousUrls, parsed.data.imageUrls);

    await writeAuditLog({
      adminUserId: session.user.id,
      action: "HOTEL_UPDATE",
      entityType: "hotel",
      entityId: hotel.id,
      metadata: { slug: hotel.slug, imageCount: hotel.images.length },
    });

    return NextResponse.json({ hotel });
  } catch (err) {
    console.error("HOTEL_UPDATE failed", err);
    return jsonError(
      err instanceof Error ? err.message : "Could not update hotel",
      500
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const existing = await prisma.hotel.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Hotel not found", 404);

  await prisma.hotel.update({
    where: { id },
    data: { deletedAt: new Date(), published: false },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "HOTEL_DELETE",
    entityType: "hotel",
    entityId: id,
  });

  return NextResponse.json({ ok: true });
}
