/** Client-safe hotel shapes (no Prisma / server imports). */

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
