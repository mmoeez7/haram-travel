import "server-only";

import { prisma } from "@/lib/db";
import {
  UMRAH_DEALS_ROOT_SLUG,
  UMRAH_PACKAGES_ROOT_SLUG,
  type UmrahRootSlug,
} from "@/lib/category-roots";
import { pickPackageCover } from "@/lib/package-cover-images";
import { categoryListingHref } from "@/lib/package-paths";
import { mapPackageToItem, type PackageItem } from "@/lib/packages";

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  seoContent: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  parent: { id: string; name: string; slug: string };
};

export async function getChildCategoriesForRoot(
  rootSlug: UmrahRootSlug
): Promise<{ href: string; label: string }[]> {
  const root = await prisma.category.findFirst({
    where: { slug: rootSlug, deletedAt: null, parentId: null, published: true },
    select: { id: true },
  });
  if (!root) return [];

  const children = await prisma.category.findMany({
    where: {
      parentId: root.id,
      deletedAt: null,
      published: true,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { name: true, slug: true },
  });

  return children.map((child) => ({
    href: categoryListingHref(child.slug),
    label: child.name.trim(),
  }));
}

export async function getCategoryBySlug(slug: string): Promise<PublicCategory | null> {
  const category = await prisma.category.findFirst({
    where: {
      slug,
      deletedAt: null,
      published: true,
      parentId: { not: null },
    },
    include: {
      parent: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!category?.parent) return null;
  if (
    category.parent.slug !== UMRAH_PACKAGES_ROOT_SLUG &&
    category.parent.slug !== UMRAH_DEALS_ROOT_SLUG
  ) {
    return null;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    seoContent: category.seoContent,
    coverImageUrl: category.coverImageUrl,
    coverImageAlt: category.coverImageAlt,
    parent: category.parent,
  };
}

export type CategorySeoBlock = {
  html: string | null;
  imageSrc: string;
  imageAlt: string;
};

/** SEO HTML plus a per-category background image (cover, or stable slug fallback). */
export async function getCategorySeoBlock(slug: string): Promise<CategorySeoBlock> {
  const category = await prisma.category.findFirst({
    where: { slug, deletedAt: null, published: true },
    select: { seoContent: true, coverImageUrl: true, coverImageAlt: true },
  });

  const fallback = pickPackageCover(slug);
  const cover = category?.coverImageUrl?.trim();

  return {
    html: category?.seoContent?.trim() || null,
    imageSrc: cover || fallback.url,
    imageAlt: category?.coverImageAlt?.trim() || fallback.alt,
  };
}

export async function getCategorySeoContent(slug: string): Promise<string | null> {
  const block = await getCategorySeoBlock(slug);
  return block.html;
}

export async function getPackagesByCategorySlug(slug: string): Promise<PackageItem[]> {
  const category = await getCategoryBySlug(slug);
  if (!category) return [];

  const links = await prisma.packageCategory.findMany({
    where: { categoryId: category.id },
    include: {
      package: true,
    },
  });

  return links
    .map((link) => link.package)
    .filter((pkg) => pkg.deletedAt === null && pkg.published)
    .sort((a, b) => a.sortOrder - b.sortOrder || Number(a.priceFrom) - Number(b.priceFrom))
    .map(mapPackageToItem);
}
