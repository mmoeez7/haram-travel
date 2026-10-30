export const SITE = {
  name: "Haram Travel",
  legalName: "Bukhari Travel T/A Haram Travel",
  url: "https://haramtravel.co.uk",
  email: "info@haramtravel.co.uk",
  phone: "020 8123 7860",
  phoneTel: "+442081237860",
  whatsapp: "+447752456789",
  whatsappDisplay: "+44 7752 456789",
  address: "142 Whitechapel Road, London E1 1JE",
  addressShort: "London E1 1JE",
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
    href: "https://api.whatsapp.com/send/?phone=441619491387&text=Salam%2C+I%27m+looking+for+Umrah+Package&type=phone_number&app_absent=0",
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
  { href: "/blogs", label: "Blogs" },
  { href: "/customized-umrah-packages", label: "Beat My Price" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
];

/** @deprecated Prefer getSiteNavItems() */
export const NAV_LINKS = NAV_ITEMS.map(({ href, label }) => ({ href, label }));

export const FOOTER_PACKAGES = [
  { href: "/umrah-packages", label: "3-Star Economy Umrah" },
  { href: "/umrah-packages", label: "4-Star Executive Packages" },
  { href: "/umrah-packages", label: "5-Star VIP Clock Tower" },
  { href: "/ramadan-umrah-packages", label: "Ramadan 2027 Packages" },
  { href: "/umrah-packages", label: "Family & Group Umrah" },
  { href: "/#guides", label: "Pilgrim Guides & Articles" },
] as const;

export const FOOTER_DEPARTURES = [
  { href: "/umrah-packages", label: "Umrah from London Heathrow" },
  { href: "/umrah-packages", label: "Umrah from London Gatwick" },
  { href: "/umrah-packages", label: "Umrah from Manchester" },
  { href: "/umrah-packages", label: "Umrah from Birmingham" },
  { href: "/umrah-packages", label: "Umrah from Scotland" },
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
