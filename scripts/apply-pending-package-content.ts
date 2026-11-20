/**
 * Applies pending Word-doc package blurbs to Package.shortDescription + description.
 * Match key: season + stars + nights.
 *
 * Usage: npx tsx scripts/apply-pending-package-content.ts
 */
import { PrismaClient } from "@prisma/client";
import copy from "../content/pending-package-copy.json";

const prisma = new PrismaClient();

async function main() {
  let updated = 0;
  let missing = 0;

  for (const item of copy.packages) {
    const season = item.season as
      | "ALL"
      | "JANUARY"
      | "FEBRUARY"
      | "EASTER"
      | "RAMADAN"
      | "SEPTEMBER"
      | "OCTOBER"
      | "NOVEMBER"
      | "DECEMBER";

    const matches = await prisma.package.findMany({
      where: {
        deletedAt: null,
        season,
        stars: item.stars,
        nights: item.nights,
      },
      select: { id: true, title: true },
    });

    if (!matches.length) {
      missing += 1;
      console.warn(
        `No package for ${season} ${item.stars}* ${item.nights}n — skipped`
      );
      continue;
    }

    for (const pkg of matches) {
      await prisma.package.update({
        where: { id: pkg.id },
        data: {
          shortDescription: item.text,
          description: item.text,
        },
      });
      updated += 1;
      console.log(`Updated ${pkg.title}`);
    }
  }

  console.log(`Done. Updated ${updated}. Missing keys: ${missing}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
