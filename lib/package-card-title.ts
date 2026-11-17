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

export function seasonListingCardTitle(season: string): string {
  const slug = season.trim().toLowerCase();
  const labels: Record<string, string> = {
    january: "January Umrah Package",
    february: "February Umrah Package",
    easter: "Easter Umrah Package",
    ramadan: "Ramadan Umrah Package",
    september: "September Umrah Package",
    october: "October Umrah Package",
    november: "November Umrah Package",
    december: "December Umrah Package",
  };
  return labels[slug] ?? listingCardTitle(season);
}
