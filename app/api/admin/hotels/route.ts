import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, slugify } from "@/lib/admin";
import { csvToArray, hotelSchema } from "@/lib/admin-schemas";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  const hotels = await prisma.hotel.findMany({
    where: { deletedAt: null },
    orderBy: [{ city: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
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
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid hotel");
  }

  const coverImageUrl = parsed.data.coverImageUrl || null;
  const hotel = await prisma.hotel.create({
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
    action: "HOTEL_CREATE",
    entityType: "hotel",
    entityId: hotel.id,
    metadata: { slug: hotel.slug },
  });

  return NextResponse.json({ hotel }, { status: 201 });
}
