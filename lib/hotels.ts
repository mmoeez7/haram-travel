import "server-only";

import { prisma } from "@/lib/db";
import type { PublicHotel } from "@/lib/public-hotel";

export type { PublicHotel, PublicHotelImage } from "@/lib/public-hotel";

export async function getPublishedHotelById(
  id: string
): Promise<PublicHotel | null> {
  const hotel = await prisma.hotel.findFirst({
    where: {
      id,
      deletedAt: null,
      published: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      city: true,
      stars: true,
      walkingMinutes: true,
      distanceToHaramM: true,
      shortDescription: true,
      description: true,
      coverImageUrl: true,
      coverImageAlt: true,
      amenities: true,
      images: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, url: true, alt: true, sortOrder: true },
      },
    },
  });

  if (!hotel) return null;

  const images =
    hotel.images.length > 0
      ? hotel.images
      : hotel.coverImageUrl
        ? [
            {
              id: "legacy-cover",
              url: hotel.coverImageUrl,
              alt: hotel.coverImageAlt,
              sortOrder: 0,
            },
          ]
        : [];

  return {
    ...hotel,
    coverImageUrl: images[0]?.url ?? hotel.coverImageUrl,
    coverImageAlt: images[0]?.alt ?? hotel.coverImageAlt,
    images,
  };
}
