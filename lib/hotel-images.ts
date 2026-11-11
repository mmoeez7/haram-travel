import type { Prisma } from "@prisma/client";

type DbClient =
  | Prisma.TransactionClient
  | {
      hotelImage: {
        deleteMany: (args: { where: { hotelId: string } }) => Promise<unknown>;
        create: (args: {
          data: {
            hotelId: string;
            url: string;
            alt: string | null;
            isCover: boolean;
            sortOrder: number;
          };
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
  // Neon HTTP adapter does not support createMany (uses transactions).
  for (let index = 0; index < urls.length; index += 1) {
    await db.hotelImage.create({
      data: {
        hotelId,
        url: urls[index],
        alt: altName,
        isCover: index === 0,
        sortOrder: index,
      },
    });
  }
  return {
    coverImageUrl: urls[0] ?? null,
    coverImageAlt: urls[0] ? altName : null,
  };
}
