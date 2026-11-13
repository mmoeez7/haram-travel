/** Ramadan VIP label year — bump after May so the next season stays current. */
export function getRamadanSeasonYear(now = new Date()) {
  const year = now.getFullYear();
  return now.getMonth() >= 5 ? year + 1 : year;
}

export const INQUIRY_SEASONS = [
  { value: "winter", label: "Winter (Nov - Feb)" },
  { value: "ramadan", label: () => `Ramadan ${getRamadanSeasonYear()} VIP` },
  { value: "spring", label: "Spring / Easter" },
  { value: "flexible", label: "Flexible Annual" },
] as const;

export const INQUIRY_DEPARTURES = [
  { value: "london", label: "London Airports" },
  { value: "manchester", label: "Manchester" },
  { value: "birmingham", label: "Birmingham" },
] as const;

export const INQUIRY_NIGHTS = [7, 10, 12, 14] as const;

export const INQUIRY_HOTEL_TIERS = [
  { value: "clock_tower_5", label: "5★ Clock Tower" },
  { value: "footsteps_4", label: "4★ Footsteps (3-5m)" },
  { value: "shuttle_3", label: "3★ Shuttle Comfort" },
] as const;

export const INQUIRY_PASSENGERS = [
  { value: "1", label: "1 Pax" },
  { value: "2", label: "2 Pax" },
  { value: "3", label: "3 Pax" },
  { value: "4_plus", label: "4+ Pax" },
] as const;

export const INQUIRY_STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;

export type InquirySeason = (typeof INQUIRY_SEASONS)[number]["value"];
export type InquiryDeparture = (typeof INQUIRY_DEPARTURES)[number]["value"];
export type InquiryHotelTier = (typeof INQUIRY_HOTEL_TIERS)[number]["value"];
export type InquiryPassengers = (typeof INQUIRY_PASSENGERS)[number]["value"];
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export function seasonLabel(value: string | null | undefined) {
  if (!value) return "—";
  const option = INQUIRY_SEASONS.find((s) => s.value === value);
  if (!option) return value;
  return resolveSeasonOptionLabel(option);
}

export function departureLabel(value: string | null | undefined) {
  if (!value) return "—";
  return INQUIRY_DEPARTURES.find((d) => d.value === value)?.label ?? value;
}

export function hotelTierLabel(value: string | null | undefined) {
  if (!value) return "—";
  return INQUIRY_HOTEL_TIERS.find((h) => h.value === value)?.label ?? value;
}

export function passengersLabel(value: string | null | undefined) {
  if (!value) return "—";
  return INQUIRY_PASSENGERS.find((p) => p.value === value)?.label ?? value;
}

export function inquirySourceLabel(value: string | null | undefined) {
  if (value === "CONTACT") return "Contact";
  if (value === "HOME_MATCHER") return "Matcher";
  return value || "—";
}

export function resolveSeasonOptionLabel(
  option: (typeof INQUIRY_SEASONS)[number]
) {
  return typeof option.label === "function" ? option.label() : option.label;
}
