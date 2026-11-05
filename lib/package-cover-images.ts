/** Remote Makkah & Madinah cover photos (Unsplash CDN — not stored in the repo). */
export const MAKKAH_COVER_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1713302752681-0b14c1034707?auto=format&fit=crop&w=1600&q=80",
    alt: "The Kaaba at Masjid al-Haram in Makkah",
  },
  {
    url: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=1600&q=80",
    alt: "Pilgrims around the Kaaba in Makkah",
  },
  {
    url: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1600&q=80",
    alt: "Kaaba illuminated in Makkah",
  },
  {
    url: "https://images.unsplash.com/photo-1577295605163-132e25c3c914?auto=format&fit=crop&w=1600&q=80",
    alt: "Masjid al-Haram courtyard in Makkah",
  },
  {
    url: "https://images.unsplash.com/photo-1744711815074-1f12a88cc5d1?auto=format&fit=crop&w=1600&q=80",
    alt: "Worship at Masjid al-Haram in Makkah",
  },
] as const;

export const MADINAH_COVER_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1600&q=80",
    alt: "Masjid an-Nabawi in Madinah",
  },
  {
    url: "https://images.unsplash.com/photo-1677835238946-20fc43ab0533?auto=format&fit=crop&w=1600&q=80",
    alt: "Prophet's Mosque exterior in Madinah",
  },
  {
    url: "https://images.unsplash.com/photo-1739029995207-c633ff65afcc?auto=format&fit=crop&w=1600&q=80",
    alt: "Peaceful view of Madinah's Prophet Mosque",
  },
] as const;

export type PackageCoverImage = {
  url: string;
  alt: string;
};

export const PACKAGE_COVER_IMAGES: PackageCoverImage[] = [
  ...MAKKAH_COVER_IMAGES,
  ...MADINAH_COVER_IMAGES,
];

/** Stable pick so the same package keeps the same cover across seeds. */
export function pickPackageCover(seed: string): PackageCoverImage {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PACKAGE_COVER_IMAGES[hash % PACKAGE_COVER_IMAGES.length];
}

/** Fresh random pick for one-off assignment scripts. */
export function randomPackageCover(): PackageCoverImage {
  const index = Math.floor(Math.random() * PACKAGE_COVER_IMAGES.length);
  return PACKAGE_COVER_IMAGES[index];
}
