import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  UMRAH_DEALS_ROOT_SLUG,
  UMRAH_PACKAGES_ROOT_SLUG,
} from "@/lib/category-roots";

type DbClient = typeof prisma | Prisma.TransactionClient;

/** Validate categoryId is a child under Umrah Packages or Umrah Deals. */
export async function assertAssignableUmrahCategory(
  db: DbClient,
  categoryId: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  const category = await db.category.findFirst({
    where: { id: categoryId, deletedAt: null },
    include: { parent: { select: { slug: true, parentId: true } } },
  });

  if (!category) {
    return { ok: false, message: "Category not found" };
  }
  if (!category.parentId || !category.parent) {
    return { ok: false, message: "Choose a subcategory, not a root group" };
  }
  if (
    category.parent.slug !== UMRAH_PACKAGES_ROOT_SLUG &&
    category.parent.slug !== UMRAH_DEALS_ROOT_SLUG
  ) {
    return {
      ok: false,
      message: "Category must belong to Umrah Packages or Umrah Deals",
    };
  }

  return { ok: true };
}
