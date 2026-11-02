/** Fixed public root category slugs for Umrah Packages / Umrah Deals. */
export const UMRAH_PACKAGES_ROOT_SLUG = "umrah-packages";
export const UMRAH_DEALS_ROOT_SLUG = "umrah-deals";

export const UMRAH_ROOT_SLUGS = [
  UMRAH_PACKAGES_ROOT_SLUG,
  UMRAH_DEALS_ROOT_SLUG,
] as const;

export type UmrahRootSlug = (typeof UMRAH_ROOT_SLUGS)[number];

export function isUmrahRootSlug(value: string): value is UmrahRootSlug {
  return (UMRAH_ROOT_SLUGS as readonly string[]).includes(value);
}
