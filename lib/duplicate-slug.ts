import { slugify } from "@/lib/admin";

/**
 * Always-unique draft slug for duplicated records.
 * Avoids colliding with live or soft-deleted rows.
 */
export function duplicateSlug(base: string) {
  const root = slugify(base) || "item";
  return `${root}-copy-${Date.now().toString(36)}`;
}
