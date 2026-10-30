import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, slugify } from "@/lib/admin";
import { csvToArray, hotelSchema } from "@/lib/admin-schemas";

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

  const parsed = hotelSchema.safeParse({
    ...body,
    slug: body.slug || slugify(String(body.name || "")),
    amenities: Array.isArray(body.amenities)
      ? body.amenities.join(", ")
      : body.amenities,
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid hotel");
  }

  const existing = await prisma.hotel.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Hotel not found", 404);

  const coverImageUrl = parsed.data.coverImageUrl || null;
  const hotel = await prisma.hotel.update({
    where: { id },
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
      coverImageUrl,
      coverImageAlt: parsed.data.coverImageAlt || parsed.data.name,
      sortOrder: parsed.data.sortOrder,
      published: parsed.data.published,
    },
  });

  if (coverImageUrl) {
    await prisma.hotelImage.deleteMany({
      where: { hotelId: hotel.id, isCover: true },
    });
    await prisma.hotelImage.create({
      data: {
        hotelId: hotel.id,
        url: coverImageUrl,
        alt: hotel.coverImageAlt,
        isCover: true,
        sortOrder: 0,
      },
    });
  }

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "HOTEL_UPDATE",
    entityType: "hotel",
    entityId: hotel.id,
    metadata: { slug: hotel.slug },
  });

  return NextResponse.json({ hotel });
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
