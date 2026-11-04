import type { Prisma } from "@prisma/client";

type DbClient =
  | Prisma.TransactionClient
  | {
      hotelImage: {
        deleteMany: (args: { where: { hotelId: string } }) => Promise<unknown>;
        createMany: (args: {
          data: Array<{
            hotelId: string;
            url: string;
            alt: string | null;
            isCover: boolean;
            sortOrder: number;
          }>;
        }) => Promise<unknown>;
      };
    };

/** Replace all HotelImage rows and return first URL for legacy cover sync. */
export async function syncHotelImages(
  db: DbClient,
  hotelId: string,
  imageUrls: string[],
  altName: string
) {
  const urls = imageUrls.map((url) => url.trim()).filter(Boolean);
  await db.hotelImage.deleteMany({ where: { hotelId } });
  if (urls.length) {
    await db.hotelImage.createMany({
      data: urls.map((url, index) => ({
        hotelId,
        url,
        alt: altName,
        isCover: index === 0,
        sortOrder: index,
      })),
    });
  }
  return {
    coverImageUrl: urls[0] ?? null,
    coverImageAlt: urls[0] ? altName : null,
  };
}
