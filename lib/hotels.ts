import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/db";

export type PublicHotelImage = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

export type PublicHotel = {
  id: string;
  name: string;
  slug: string;
  city: "MAKKAH" | "MADINAH";
  stars: number;
  walkingMinutes: number | null;
  distanceToHaramM: number | null;
  shortDescription: string | null;
  description: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  amenities: string[];
  images: PublicHotelImage[];
};

export async function getPublishedHotelById(
  id: string
): Promise<PublicHotel | null> {
  noStore();
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
