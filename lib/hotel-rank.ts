/** Sort Makkah hotels before Madinah (client-safe helper). */
export function makkahFirstRank(city: "MAKKAH" | "MADINAH" | string) {
  return city === "MADINAH" ? 1 : 0;
}
