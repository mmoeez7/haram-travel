import { PrismaClient } from "@prisma/client";
import { randomPackageCover } from "../lib/package-cover-images";

const prisma = new PrismaClient();

async function main() {
  const packages = await prisma.package.findMany({
    where: { deletedAt: null },
    select: { id: true, title: true, slug: true },
  });

  let updated = 0;
  for (const pkg of packages) {
    const cover = randomPackageCover();
    await prisma.package.update({
      where: { id: pkg.id },
      data: {
        coverImageUrl: cover.url,
        coverImageAlt: cover.alt,
      },
    });
    await prisma.packageImage.deleteMany({
      where: { packageId: pkg.id, isCover: true },
    });
    await prisma.packageImage.create({
      data: {
        packageId: pkg.id,
        url: cover.url,
        alt: cover.alt,
        isCover: true,
        sortOrder: 0,
      },
    });
    updated += 1;
  }

  console.log(`Assigned remote Makkah/Madinah covers to ${updated} packages.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
