/** Normalize a listing/parent label into the singular card title. */
export function listingCardTitle(parentLabel: string): string {
  const trimmed = parentLabel.trim().replace(/\s+/g, " ");
  if (!trimmed) return trimmed;

  return trimmed
    .replace(/\bUmrah\s+Packages\b/gi, "Umrah Package")
    .replace(/\bPackages\b/gi, "Package");
}

export function starListingCardTitle(stars: 3 | 4 | 5): string {
  return `${stars} Star Umrah Package`;
}

const SEASON_PACKAGE_TITLES: Record<string, string> = {
  january: "January Umrah Package",
  february: "February Umrah Package",
  easter: "Easter Umrah Package",
  ramadan: "Ramadan Umrah Package",
  september: "September Umrah Package",
  october: "October Umrah Package",
  november: "November Umrah Package",
  december: "December Umrah Package",
};

export function seasonListingCardTitle(season: string): string {
  const slug = season.trim().toLowerCase();
  return SEASON_PACKAGE_TITLES[slug] ?? listingCardTitle(season);
}

type DetailTitleSource = {
  title: string;
  stars: number;
  linkedCategory?: {
    name: string;
    slug: string;
  } | null;
};

/** Same display title used on listing cards — parent/season label, not the stored package name. */
export function packageDetailDisplayTitle(pkg: DetailTitleSource): string {
  const category = pkg.linkedCategory;
  if (category) {
    const seasonTitle = SEASON_PACKAGE_TITLES[category.slug.trim().toLowerCase()];
    if (seasonTitle) return seasonTitle;

    const fromName = listingCardTitle(category.name);
    if (fromName) return fromName;
  }

  if (pkg.stars === 3 || pkg.stars === 4 || pkg.stars === 5) {
    return starListingCardTitle(pkg.stars);
  }

  return pkg.title;
}
