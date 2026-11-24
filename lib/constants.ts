export const SITE = {
  name: "Haram Travel",
  legalName: "Haram Travel",
  url: "https://haramtravel.uk",
  email: "info@haramtravel.uk",
  phone: "01616609992",
  phoneTel: "+441616609992",
  whatsapp: "+441616609992",
  whatsappDisplay: "+441616609992",
  address: "618A Stockport Rd, Longsight, Manchester M13 0RX, United Kingdom",
  addressShort: "Manchester M13 0RX",
  trustpilotRating: "4.8",
  trustpilotReviews: "8,200+",
  pilgrimsGuided: "25,800+",
  depositFrom: 99,
} as const;

export const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61577346712744",
  },
  {
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send/?phone=441616609992&text=Salam%2C+I%27m+looking+for+Umrah+Package&type=phone_number&app_absent=0",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/haramtravel_uk",
  },
] as const;

export type NavChild = { href: string; label: string };

export type NavItem = {
  href: string;
  label: string;
  children?: NavChild[];
};

/**
 * Static fallback only. Live site nav is built from published packages
 * via `getSiteNavItems()` in `lib/nav.ts`.
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/umrah-packages", label: "Umrah Packages" },
  { href: "/reviews", label: "Reviews" },
  { href: "/blogs", label: "Blogs" },
  { href: "/about-us", label: "About Us" },
];

/** @deprecated Prefer getSiteNavItems() */
export const NAV_LINKS = NAV_ITEMS.map(({ href, label }) => ({ href, label }));

export const FOOTER_PACKAGES = [
  { href: "/3-star-umrah-packages/", label: "3-Star Economy Umrah" },
  { href: "/4-star-umrah-packages/", label: "4-Star Executive Packages" },
  { href: "/5-star-umrah-packages/", label: "5-Star VIP Clock Tower" },
  { href: "/ramadan-umrah-package/", label: "Ramadan 2027 Packages" },
  { href: "/umrah-packages/", label: "Family & Group Umrah" },
  { href: "/blogs/", label: "Pilgrim Guides & Articles" },
] as const;

export function whatsappUrl(message?: string) {
  const text = encodeURIComponent(
    message ?? "Assalamu Alaikum, I would like to enquire about an Umrah package."
  );
  return `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${text}`;
}

export function telUrl() {
  return `tel:${SITE.phoneTel}`;
}
