import { unstable_noStore as noStore } from "next/cache";
import type { Package as DbPackage, SeasonType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { makkahFirstRank } from "@/lib/hotels";

export type PackageItem = {
  id: string;
  title: string;
  subtitle: string;
  stars: 3 | 4 | 5;
  nights: number;
  makkahNights: number;
  madinahNights: number;
  priceFrom: number;
  deposit: number;
  badge: string;
  features: string[];
  season?: "all" | "december" | "easter" | "ramadan";
  category: "umrah" | "hajj";
  image: string;
};

export const packageFilters = [
  { id: "all", label: "All Packages" },
  { id: "december", label: "December Packages" },
  { id: "easter", label: "February Half-Term" },
  { id: "ramadan", label: "Ramadan Packages" },
  { id: "luxury", label: "5-Star Luxury VIP" },
] as const;

function seasonToUi(season: SeasonType): PackageItem["season"] {
  switch (season) {
    case "DECEMBER":
      return "december";
    case "EASTER":
      return "easter";
    case "RAMADAN":
      return "ramadan";
    default:
      return "all";
  }
}

function seasonToDb(
  season: "december" | "easter" | "ramadan"
): SeasonType {
  switch (season) {
    case "december":
      return "DECEMBER";
    case "easter":
      return "EASTER";
    case "ramadan":
      return "RAMADAN";
  }
}

export function mapPackageToItem(pkg: DbPackage): PackageItem {
  const stars = (pkg.stars === 4 || pkg.stars === 5 ? pkg.stars : 3) as 3 | 4 | 5;
  return {
    id: pkg.slug || pkg.id,
    title: pkg.title,
    subtitle: pkg.subtitle,
    stars,
    nights: pkg.nights,
    makkahNights: pkg.makkahNights,
    madinahNights: pkg.madinahNights,
    priceFrom: Number(pkg.priceFrom),
    deposit: Number(pkg.deposit),
    badge: pkg.badge ?? "",
    features: pkg.features,
    season: seasonToUi(pkg.season),
    category: pkg.journeyType === "HAJJ" ? "hajj" : "umrah",
    image: pkg.coverImageUrl ?? "",
  };
}

const publicWhere = {
  deletedAt: null,
  published: true,
} as const;

export async function getUmrahByStars(stars: 3 | 4 | 5): Promise<PackageItem[]> {
  noStore();
  const packages = await prisma.package.findMany({
    where: {
      ...publicWhere,
      journeyType: "UMRAH",
      stars,
      season: "ALL",
    },
    orderBy: [{ sortOrder: "asc" }, { priceFrom: "asc" }],
  });
  return packages.map(mapPackageToItem);
}

export async function getSeasonalPackages(
  season: "december" | "easter" | "ramadan"
): Promise<PackageItem[]> {
  noStore();
  const packages = await prisma.package.findMany({
    where: {
      ...publicWhere,
      journeyType: "UMRAH",
      season: seasonToDb(season),
    },
    orderBy: [{ sortOrder: "asc" }, { priceFrom: "asc" }],
  });
  return packages.map(mapPackageToItem);
}

export async function getHajjPackages(): Promise<PackageItem[]> {
  noStore();
  const packages = await prisma.package.findMany({
    where: {
      ...publicWhere,
      journeyType: "HAJJ",
    },
    orderBy: [{ sortOrder: "asc" }, { priceFrom: "asc" }],
  });
  return packages.map(mapPackageToItem);
}

export async function getPackageBySlug(slug: string): Promise<PackageItem | null> {
  noStore();
  const pkg = await prisma.package.findFirst({
    where: {
      ...publicWhere,
      slug,
    },
  });
  return pkg ? mapPackageToItem(pkg) : null;
}

export type PackageHotelRef = {
  hotelId: string;
  nights: number | null;
  notes: string | null;
  role: "MAKKAH" | "MADINAH";
};

export type PackageDetailCategory = {
  name: string;
  slug: string;
  parentName: string | null;
  parentSlug: string | null;
};

export type PackageDetail = PackageItem & {
  slug: string;
  shortDescription: string | null;
  description: string | null;
  coverImageAlt: string | null;
  makkahHotelRef: PackageHotelRef | null;
  madinahHotelRef: PackageHotelRef | null;
  hotelRefs: PackageHotelRef[];
  linkedCategory: PackageDetailCategory | null;
};

export async function getPackageDetailBySlug(
  slug: string
): Promise<PackageDetail | null> {
  noStore();
  const pkg = await prisma.package.findFirst({
    where: {
      ...publicWhere,
      slug,
    },
    include: {
      hotels: {
        orderBy: { role: "asc" },
        select: {
          role: true,
          hotelId: true,
          nights: true,
          notes: true,
        },
      },
      categories: {
        include: {
          category: {
            include: {
              parent: { select: { name: true, slug: true, deletedAt: true } },
            },
          },
        },
      },
    },
  });

  if (!pkg) return null;

  const toHotelRef = (link: (typeof pkg.hotels)[number]): PackageHotelRef => ({
    hotelId: link.hotelId,
    nights: link.nights,
    notes: link.notes,
    role: link.role,
  });
  const hotelRefs = [...pkg.hotels]
    .sort((a, b) => makkahFirstRank(a.role) - makkahFirstRank(b.role))
    .map(toHotelRef);

  const linkedCategory = pkg.categories
    .map((c) => c.category)
    .find((c) => c.deletedAt === null && c.published && c.parentId);

  return {
    ...mapPackageToItem(pkg),
    slug: pkg.slug,
    shortDescription: pkg.shortDescription,
    description: pkg.description,
    coverImageAlt: pkg.coverImageAlt,
    makkahHotelRef: hotelRefs.find((hotel) => hotel.role === "MAKKAH") ?? null,
    madinahHotelRef: hotelRefs.find((hotel) => hotel.role === "MADINAH") ?? null,
    hotelRefs,
    linkedCategory: linkedCategory
      ? {
          name: linkedCategory.name,
          slug: linkedCategory.slug,
          parentName: linkedCategory.parent?.deletedAt
            ? null
            : (linkedCategory.parent?.name ?? null),
          parentSlug: linkedCategory.parent?.deletedAt
            ? null
            : (linkedCategory.parent?.slug ?? null),
        }
      : null,
  };
}

/** @deprecated Prefer getHajjPackages() */
export const hajjPackages: PackageItem[] = [];
