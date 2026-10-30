import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/db";
import type { NavChild, NavItem } from "@/lib/constants";

function toNavChild(pkg: { title: string; slug: string }): NavChild {
  return {
    href: `/packages/${pkg.slug}`,
    label: pkg.title.trim(),
  };
}

/** Build public navbar from published packages in the database. */
export async function getSiteNavItems(): Promise<NavItem[]> {
  noStore();

  const packages = await prisma.package.findMany({
    where: { deletedAt: null, published: true },
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    select: {
      title: true,
      slug: true,
      journeyType: true,
      season: true,
    },
  });

  const umrahCore = packages
    .filter((pkg) => pkg.journeyType === "UMRAH" && pkg.season === "ALL")
    .map(toNavChild);

  const umrahDeals = packages
    .filter((pkg) => pkg.journeyType === "UMRAH" && pkg.season !== "ALL")
    .map(toNavChild);

  const hajj = packages
    .filter((pkg) => pkg.journeyType === "HAJJ")
    .map(toNavChild);

  const items: NavItem[] = [{ href: "/", label: "Home" }];

  if (umrahCore.length) {
    items.push({
      href: "/umrah-packages",
      label: "Umrah Packages",
      children: umrahCore,
    });
  } else {
    items.push({ href: "/umrah-packages", label: "Umrah Packages" });
  }

  if (umrahDeals.length) {
    items.push({
      href: "/umrah-packages",
      label: "Umrah Deals",
      children: umrahDeals,
    });
  }

  if (hajj.length) {
    items.push({
      href: "/hajj-packages",
      label: "Hajj Packages",
      children: hajj,
    });
  }

  items.push(
    { href: "/blogs", label: "Blogs" },
    { href: "/customized-umrah-packages", label: "Beat My Price" },
    { href: "/about-us", label: "About Us" },
    { href: "/contact-us", label: "Contact Us" }
  );

  return items;
}
