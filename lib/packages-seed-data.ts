export type SeedSeason =
  | "all"
  | "january"
  | "february"
  | "easter"
  | "ramadan"
  | "september"
  | "october"
  | "november"
  | "december";

export type PackageItem = {
  id: string;
  title: string;
  subtitle: string;
  stars: 3 | 4 | 5;
  nights: number;
  makkahNights: number;
  madinahNights: number;
  priceFrom: number;
  deposit: number;
  badge: string;
  features: string[];
  season?: SeedSeason;
  category: "umrah" | "hajj";
  image: string;
};

const features = ["Flight & Visa Included"];

type Stay = {
  nights: number;
  makkahNights: number;
  madinahNights: number;
};

const stays: Record<number, Stay> = {
  7: { nights: 7, makkahNights: 4, madinahNights: 3 },
  10: { nights: 10, makkahNights: 5, madinahNights: 5 },
  12: { nights: 12, makkahNights: 6, madinahNights: 6 },
  14: { nights: 14, makkahNights: 7, madinahNights: 7 },
};

const monthLabel: Record<Exclude<SeedSeason, "all">, string> = {
  january: "January",
  february: "February",
  easter: "Easter",
  ramadan: "Ramadan",
  september: "September",
  october: "October",
  november: "November",
  december: "December",
};

function packageItem(
  season: SeedSeason,
  stars: 3 | 4 | 5,
  nights: number,
  priceFrom: number
): PackageItem {
  const stay = stays[nights];
  const month = season === "all" ? "" : monthLabel[season];
  const title = `${month ? `${month} ` : ""}${stars} Star ${nights} Nights Umrah Package`;
  const slug = `${month ? `${season}-` : ""}${stars}-star-${nights}-nights`;

  return {
    id: slug,
    title,
    subtitle: `${stars} STAR · ${nights} NIGHTS`,
    stars,
    nights: stay.nights,
    makkahNights: stay.makkahNights,
    madinahNights: stay.madinahNights,
    priceFrom,
    deposit: 99,
    badge: month || `${stars} Star`,
    features,
    season,
    category: "umrah",
    image: "",
  };
}

/** Standard packages from https://haramtravel.uk/ */
const standardPrices: Array<[3 | 4 | 5, number, number]> = [
  [3, 7, 515],
  [3, 10, 549],
  [3, 14, 580],
  [4, 7, 589],
  [4, 10, 615],
  [4, 14, 660],
  [5, 7, 699],
  [5, 10, 745],
  [5, 14, 830],
];

/** Monthly deals from the Umrah Deals pages. Prices are [3★7, 3★10, 3★12, 3★14, 4★7, 4★10, 4★12, 4★14, 5★7, 5★10, 5★12, 5★14]. */
const dealPrices: Record<Exclude<SeedSeason, "all">, number[]> = {
  january: [535, 565, 599, 625, 575, 605, 640, 659, 635, 699, 740, 775],
  february: [555, 595, 625, 660, 610, 645, 670, 699, 699, 725, 760, 825],
  easter: [690, 735, 770, 799, 720, 785, 845, 885, 785, 870, 920, 985],
  ramadan: [670, 705, 745, 790, 749, 799, 829, 880, 830, 945, 1070, 1149],
  september: [519, 550, 575, 620, 588, 610, 649, 675, 699, 740, 799, 839],
  october: [535, 570, 587, 630, 605, 640, 666, 689, 717, 750, 799, 850],
  november: [510, 529, 549, 580, 615, 640, 670, 695, 740, 775, 810, 860],
  december: [615, 645, 670, 720, 680, 719, 749, 799, 760, 820, 895, 949],
};

const dealShapes: Array<[3 | 4 | 5, number]> = [
  [3, 7],
  [3, 10],
  [3, 12],
  [3, 14],
  [4, 7],
  [4, 10],
  [4, 12],
  [4, 14],
  [5, 7],
  [5, 10],
  [5, 12],
  [5, 14],
];

export const umrahPackages: PackageItem[] = [
  ...standardPrices.map(([stars, nights, price]) =>
    packageItem("all", stars, nights, price)
  ),
  ...Object.entries(dealPrices).flatMap(([season, prices]) =>
    dealShapes.map(([stars, nights], index) =>
      packageItem(season as Exclude<SeedSeason, "all">, stars, nights, prices[index])
    )
  ),
];

export const hajjPackages: PackageItem[] = [];
