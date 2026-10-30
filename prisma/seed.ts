import { PrismaClient, type JourneyType, type SeasonType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { hajjPackages, umrahPackages } from "../lib/packages-seed-data";

const prisma = new PrismaClient();

function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapSeason(season?: string): SeasonType {
  switch (season) {
    case "december":
      return "DECEMBER";
    case "easter":
      return "EASTER";
    case "ramadan":
      return "RAMADAN";
    default:
      return "ALL";
  }
}

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL ?? "admin@haramtravel.co.uk";
  const password = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMeNow!2026";
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      passwordHash,
      name: "Haram Travel Admin",
      role: "SUPER_ADMIN",
      isActive: true,
      deletedAt: null,
    },
    create: {
      email,
      passwordHash,
      name: "Haram Travel Admin",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  const categories = [
    { name: "3 Star", slug: "3-star", kind: "STAR" as const, sortOrder: 10 },
    { name: "4 Star", slug: "4-star", kind: "STAR" as const, sortOrder: 20 },
    { name: "5 Star", slug: "5-star", kind: "STAR" as const, sortOrder: 30 },
    { name: "December", slug: "december", kind: "SEASON" as const, sortOrder: 40 },
    { name: "Easter / Half-Term", slug: "easter", kind: "SEASON" as const, sortOrder: 50 },
    { name: "Ramadan", slug: "ramadan", kind: "SEASON" as const, sortOrder: 60 },
    { name: "Umrah", slug: "umrah", kind: "JOURNEY" as const, sortOrder: 70 },
    { name: "Hajj", slug: "hajj", kind: "JOURNEY" as const, sortOrder: 80 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        kind: category.kind,
        sortOrder: category.sortOrder,
        published: true,
        deletedAt: null,
      },
      create: {
        ...category,
        published: true,
      },
    });
  }

  const hotelsSeed = [
    {
      name: "Haram Courtyard Economy",
      slug: "haram-courtyard-economy",
      city: "MAKKAH" as const,
      stars: 3,
      walkingMinutes: 8,
      distanceToHaramM: 450,
      amenities: ["WiFi", "Family rooms", "Breakfast option"],
      coverImageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    },
    {
      name: "Ajyad Executive Near Haram",
      slug: "ajyad-executive-near-haram",
      city: "MAKKAH" as const,
      stars: 4,
      walkingMinutes: 5,
      distanceToHaramM: 280,
      amenities: ["WiFi", "Restaurant", "Family rooms"],
      coverImageUrl:
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    },
    {
      name: "Clock Tower VIP Stay",
      slug: "clock-tower-vip-stay",
      city: "MAKKAH" as const,
      stars: 5,
      walkingMinutes: 2,
      distanceToHaramM: 80,
      amenities: ["WiFi", "Luxury dining", "Haram view rooms"],
      coverImageUrl:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    },
    {
      name: "Madinah Quiet Comfort",
      slug: "madinah-quiet-comfort",
      city: "MADINAH" as const,
      stars: 3,
      walkingMinutes: 10,
      distanceToHaramM: 600,
      amenities: ["WiFi", "Family rooms"],
      coverImageUrl:
        "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80",
    },
    {
      name: "Madinah Executive Near Masjid",
      slug: "madinah-executive-near-masjid",
      city: "MADINAH" as const,
      stars: 4,
      walkingMinutes: 6,
      distanceToHaramM: 350,
      amenities: ["WiFi", "Restaurant", "Quiet rooms"],
      coverImageUrl:
        "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&q=80",
    },
    {
      name: "Madinah Premium Courtyard",
      slug: "madinah-premium-courtyard",
      city: "MADINAH" as const,
      stars: 5,
      walkingMinutes: 3,
      distanceToHaramM: 150,
      amenities: ["WiFi", "Premium dining", "Near Prophet's Mosque"],
      coverImageUrl:
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    },
  ];

  const hotelByKey = new Map<string, string>();

  for (const [index, hotel] of hotelsSeed.entries()) {
    const saved = await prisma.hotel.upsert({
      where: { slug: hotel.slug },
      update: {
        name: hotel.name,
        city: hotel.city,
        stars: hotel.stars,
        walkingMinutes: hotel.walkingMinutes,
        distanceToHaramM: hotel.distanceToHaramM,
        amenities: hotel.amenities,
        coverImageUrl: hotel.coverImageUrl,
        coverImageAlt: hotel.name,
        shortDescription: `${hotel.stars}-star walking-distance stay in ${hotel.city === "MAKKAH" ? "Makkah" : "Madinah"}.`,
        published: true,
        sortOrder: index,
        deletedAt: null,
      },
      create: {
        name: hotel.name,
        slug: hotel.slug,
        city: hotel.city,
        stars: hotel.stars,
        walkingMinutes: hotel.walkingMinutes,
        distanceToHaramM: hotel.distanceToHaramM,
        amenities: hotel.amenities,
        coverImageUrl: hotel.coverImageUrl,
        coverImageAlt: hotel.name,
        shortDescription: `${hotel.stars}-star walking-distance stay in ${hotel.city === "MAKKAH" ? "Makkah" : "Madinah"}.`,
        published: true,
        sortOrder: index,
      },
    });
    hotelByKey.set(`${hotel.city}-${hotel.stars}`, saved.id);
  }

  const allSeedPackages = [...umrahPackages, ...hajjPackages];

  for (const [index, pkg] of allSeedPackages.entries()) {
    const journeyType: JourneyType = pkg.category === "hajj" ? "HAJJ" : "UMRAH";
    const season = mapSeason(pkg.season);
    const slug = toSlug(pkg.id);

    const created = await prisma.package.upsert({
      where: { slug },
      update: {
        title: pkg.title,
        subtitle: pkg.subtitle,
        journeyType,
        stars: pkg.stars,
        nights: pkg.nights,
        makkahNights: pkg.makkahNights,
        madinahNights: pkg.madinahNights,
        priceFrom: pkg.priceFrom,
        deposit: pkg.deposit,
        badge: pkg.badge,
        season,
        features: pkg.features,
        coverImageUrl: pkg.image,
        coverImageAlt: pkg.title,
        published: true,
        featured: pkg.stars === 5 && season === "ALL",
        sortOrder: index,
        publishedAt: new Date(),
        deletedAt: null,
        updatedById: admin.id,
      },
      create: {
        title: pkg.title,
        subtitle: pkg.subtitle,
        slug,
        journeyType,
        stars: pkg.stars,
        nights: pkg.nights,
        makkahNights: pkg.makkahNights,
        madinahNights: pkg.madinahNights,
        priceFrom: pkg.priceFrom,
        deposit: pkg.deposit,
        badge: pkg.badge,
        season,
        features: pkg.features,
        coverImageUrl: pkg.image,
        coverImageAlt: pkg.title,
        published: true,
        featured: pkg.stars === 5 && season === "ALL",
        sortOrder: index,
        publishedAt: new Date(),
        createdById: admin.id,
        updatedById: admin.id,
      },
    });

    const categorySlugs = [
      journeyType === "HAJJ" ? "hajj" : "umrah",
      `${pkg.stars}-star`,
      ...(pkg.season && pkg.season !== "all" ? [pkg.season] : []),
    ];

    for (const categorySlug of categorySlugs) {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (!category) continue;
      await prisma.packageCategory.upsert({
        where: {
          packageId_categoryId: {
            packageId: created.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          packageId: created.id,
          categoryId: category.id,
        },
      });
    }

    const makkahHotelId = hotelByKey.get(`MAKKAH-${pkg.stars}`);
    const madinahHotelId = hotelByKey.get(`MADINAH-${pkg.stars}`);

    await prisma.packageHotel.deleteMany({ where: { packageId: created.id } });
    if (makkahHotelId) {
      await prisma.packageHotel.create({
        data: {
          packageId: created.id,
          hotelId: makkahHotelId,
          role: "MAKKAH",
          nights: pkg.makkahNights,
        },
      });
    }
    if (madinahHotelId) {
      await prisma.packageHotel.create({
        data: {
          packageId: created.id,
          hotelId: madinahHotelId,
          role: "MADINAH",
          nights: pkg.madinahNights,
        },
      });
    }
  }

  console.log(
    `Seeded admin ${email}, ${allSeedPackages.length} packages, ${hotelsSeed.length} hotels, and ${categories.length} categories.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
