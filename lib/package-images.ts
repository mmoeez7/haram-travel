import type { Prisma } from "@prisma/client";

type DbClient =
  | Prisma.TransactionClient
  | {
      packageImage: {
        deleteMany: (args: { where: { packageId: string } }) => Promise<unknown>;
        createMany: (args: {
          data: Array<{
            packageId: string;
            url: string;
            alt: string | null;
            isCover: boolean;
            sortOrder: number;
          }>;
        }) => Promise<unknown>;
      };
    };

/** Replace all PackageImage rows; first URL is cover. */
export async function syncPackageImages(
  db: DbClient,
  packageId: string,
  imageUrls: string[],
  altName: string
) {
  const urls = imageUrls.map((url) => url.trim()).filter(Boolean);
  await db.packageImage.deleteMany({ where: { packageId } });
  if (urls.length) {
    await db.packageImage.createMany({
      data: urls.map((url, index) => ({
        packageId,
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
