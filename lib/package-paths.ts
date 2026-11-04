/** Known WordPress oddballs that do not follow the padded-star pattern. */
const WORDPRESS_SLUG_OVERRIDES: Record<string, string> = {
  "3-star-7-nights": "3-star-7-nights-packages-details",
};

const STAR_LISTING: Record<string, string> = {
  "3-star": "/3-star-umrah-packages",
  "4-star": "/4-star-umrah-packages",
  "5-star": "/5-star-umrah-packages",
};

const SEASON_LISTING = new Set([
  "january",
  "february",
  "easter",
  "ramadan",
  "september",
  "october",
  "november",
  "december",
]);

export function legacyPackageSlug(input: {
  season?: string | null;
  stars: number;
  nights: number;
}) {
  const season = input.season && input.season !== "all" ? String(input.season) : "";
  return `${season ? `${season}-` : ""}${input.stars}-star-${input.nights}-nights`;
}

/** Public package path matching haramtravel.uk (root slug, no /packages prefix). */
export function packageHref(slug: string) {
  return `/${slug.replace(/^\/+/, "")}`;
}

/**
 * WordPress-style package slug, e.g.
 * `05-star-10-nights-umrah-package`,
 * `november-03-star-7-nights-umrah-package`.
 */
export function wordpressPackageSlug(input: {
  season?: string | null;
  stars: number;
  nights: number;
}) {
  const legacy = legacyPackageSlug(input);
  if (WORDPRESS_SLUG_OVERRIDES[legacy]) {
    return WORDPRESS_SLUG_OVERRIDES[legacy];
  }
  const body = `0${input.stars}-star-${input.nights}-nights-umrah-package`;
  const season = input.season && input.season !== "all" ? String(input.season) : "";
  return season ? `${season}-${body}` : body;
}

/** Nav / breadcrumb listing URL for a child category slug. */
export function categoryListingHref(childSlug: string) {
  if (STAR_LISTING[childSlug]) return STAR_LISTING[childSlug];
  if (SEASON_LISTING.has(childSlug)) return `/${childSlug}-umrah-package`;
  return `/categories/${childSlug}`;
}

/** Permanent redirects from old app paths + legacy package slugs to WordPress URLs. */
export function wordpressUrlRedirects(): Array<{
  source: string;
  destination: string;
  permanent: boolean;
}> {
  const redirects: Array<{
    source: string;
    destination: string;
    permanent: boolean;
  }> = [];

  for (const [slug, href] of Object.entries(STAR_LISTING)) {
    redirects.push({
      source: `/categories/${slug}`,
      destination: href,
      permanent: true,
    });
  }

  for (const season of SEASON_LISTING) {
    redirects.push({
      source: `/categories/${season}`,
      destination: `/${season}-umrah-package`,
      permanent: true,
    });
  }

  const shapes: Array<{ season: string; stars: 3 | 4 | 5; nights: number }> = [];
  for (const stars of [3, 4, 5] as const) {
    for (const nights of [7, 10, 12, 14]) {
      shapes.push({ season: "all", stars, nights });
    }
  }
  for (const season of SEASON_LISTING) {
    for (const stars of [3, 4, 5] as const) {
      for (const nights of [7, 10, 12, 14]) {
        shapes.push({ season, stars, nights });
      }
    }
  }

  const seen = new Set<string>();
  for (const shape of shapes) {
    const legacy = legacyPackageSlug(shape);
    const wp = wordpressPackageSlug(shape);
    if (legacy === wp || seen.has(legacy)) continue;
    seen.add(legacy);
    // Specific legacy mappings before the /packages/:slug catch-all
    redirects.push(
      { source: `/${legacy}`, destination: `/${wp}`, permanent: true },
      {
        source: `/packages/${legacy}`,
        destination: `/${wp}`,
        permanent: true,
      }
    );
  }

  redirects.push({
    source: "/packages/:slug",
    destination: "/:slug",
    permanent: true,
  });

  return redirects;
}
