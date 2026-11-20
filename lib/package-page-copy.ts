import copy from "@/content/pending-package-copy.json";

export type DealSeasonKey =
  | "january"
  | "february"
  | "easter"
  | "ramadan"
  | "september"
  | "october"
  | "november"
  | "december";

export function seasonPageDescription(season: DealSeasonKey): string {
  return copy.seasonIntros[season];
}

export function starPageDescription(stars: 3 | 4 | 5): string {
  return (copy.starIntros as Record<string, string>)[String(stars)]!;
}
