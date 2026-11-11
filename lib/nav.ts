import "server-only";

import type { NavItem } from "@/lib/constants";
import {
  UMRAH_DEALS_ROOT_SLUG,
  UMRAH_PACKAGES_ROOT_SLUG,
} from "@/lib/category-roots";
import { getChildCategoriesForRoot } from "@/lib/categories";

/** Build public navbar from Umrah category roots. */
export async function getSiteNavItems(): Promise<NavItem[]> {
  const [umrahPackagesChildren, umrahDealsChildren] = await Promise.all([
    getChildCategoriesForRoot(UMRAH_PACKAGES_ROOT_SLUG),
    getChildCategoriesForRoot(UMRAH_DEALS_ROOT_SLUG),
  ]);

  const items: NavItem[] = [{ href: "/", label: "Home" }];

  if (umrahPackagesChildren.length) {
    items.push({
      href: "/umrah-packages",
      label: "Umrah Packages",
      children: umrahPackagesChildren,
    });
  } else {
    items.push({ href: "/umrah-packages", label: "Umrah Packages" });
  }

  if (umrahDealsChildren.length) {
    items.push({
      href: "/umrah-packages",
      label: "Umrah Deals",
      children: umrahDealsChildren,
    });
  }

  items.push(
    { href: "/blogs", label: "Blogs" },
    { href: "/about-us", label: "About Us" },
    { href: "/contact-us", label: "Contact Us" }
  );

  return items;
}
