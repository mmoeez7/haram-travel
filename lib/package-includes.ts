const DEFAULT_INCLUDES_BY_STARS: Record<3 | 4 | 5, string[]> = {
  3: [
    "Flight & Visa Included",
    "Hotels Included",
    "Transportation",
    "Umrah Guide",
  ],
  4: [
    "Flight & Visa Included",
    "Hotels Included",
    "Transportation",
    "Breakfast (Optional)",
  ],
  5: [
    "Flight & Visa Included",
    "Hotels Included",
    "Transportation",
    "Breakfast",
    "Umrah Guide",
  ],
};

const LEGACY_SEED_INCLUDES = ["Flight & Visa Included"] as const;

function sameIncludes(a: string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
}

export function defaultIncludesForStars(stars: number): string[] {
  if (stars === 3 || stars === 4 || stars === 5) {
    return [...DEFAULT_INCLUDES_BY_STARS[stars]];
  }
  return [];
}

/** True when features still match the untouched default for that star rating. */
export function isDefaultIncludes(features: string[], stars: number): boolean {
  return sameIncludes(features, defaultIncludesForStars(stars));
}

/** Empty or legacy seed-only includes that should be upgraded to star defaults. */
export function shouldBackfillIncludes(features: string[]): boolean {
  if (features.length === 0) return true;
  return sameIncludes(features, LEGACY_SEED_INCLUDES);
}
