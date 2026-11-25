import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Logo } from "@/components/layout/Logo";

/** Hardcoded public routes — native anchors so navigation always works. */
const FOOTER_PACKAGES = [
  { href: "/3-star-umrah-packages/", label: "3-Star Economy Umrah" },
  { href: "/4-star-umrah-packages/", label: "4-Star Executive Packages" },
  { href: "/5-star-umrah-packages/", label: "5-Star VIP Clock Tower" },
  { href: "/ramadan-umrah-package/", label: "Ramadan 2027 Packages" },
  { href: "/umrah-packages/", label: "Family & Group Umrah" },
  { href: "/blogs/", label: "Pilgrim Guides & Articles" },
] as const;

const LEGAL_LINKS = [
  { href: "/about-us/", label: "About Us" },
  { href: "/contact-us/", label: "Contact Us" },
  { href: "/privacy-policy/", label: "Privacy Policy" },
  // { href: "/privacy-policy/", label: "Terms & Conditions" },
] as const;

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="relative z-20 border-t border-border bg-[#faf6ef] pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-0"
    >
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-5">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              Haram Travel is a premier UK travel agency specializing in tailored Umrah and Islamic
              pilgrimage packages. Guided by our motto &apos;Trusted Umrah, Seamless Journey&apos;, we
              ensure every detail is handled with reverence and precision.
            </p>
            <p className="mt-4 text-sm font-semibold text-gold-dark">
              ATOL Holder &amp; Ministry of Hajj &amp; Umrah Authorized
            </p>
          </div>

          {/* Packages */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-charcoal md:text-base">
              Umrah Packages
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_PACKAGES.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-muted transition hover:text-gold-dark"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-charcoal md:text-base">
              Contact &amp; Support
            </h3>
            <ul className="space-y-3.5 text-sm text-muted">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" aria-hidden />
                <div className="min-w-0 leading-relaxed">
                  <p className="font-semibold text-charcoal">UK Office</p>
                  <p className="mt-0.5">{SITE.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" aria-hidden />
                <div className="min-w-0">
                  <p className="font-semibold text-charcoal">Telephone</p>
                  <a href={telUrl()} className="mt-0.5 inline-block hover:text-gold-dark">
                    {SITE.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaWhatsapp className="mt-0.5 h-4 w-4 shrink-0 text-[#25d366]" aria-hidden />
                <div className="min-w-0">
                  <p className="font-semibold text-charcoal">WhatsApp</p>
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-block hover:text-gold-dark"
                  >
                    {SITE.whatsappDisplay}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" aria-hidden />
                <div className="min-w-0">
                  <p className="font-semibold text-charcoal">Email</p>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="mt-0.5 inline-block break-all hover:text-gold-dark"
                  >
                    {SITE.email}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border/80">
        <div className="mx-auto max-w-7xl space-y-4 px-5 py-5 sm:px-6 md:py-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <p className="text-xs leading-relaxed text-muted">
              © {new Date().getFullYear()} Haram Travel. All Rights Reserved. Company Registered
              in England &amp; Wales.
            </p>
            <nav
              aria-label="Legal"
              className="flex shrink-0 flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted sm:justify-end"
            >
              {LEGAL_LINKS.map((item) => (
                <Link key={item.label} href={item.href} className="hover:text-gold-dark">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <p className="w-full text-xs leading-relaxed text-muted">
            Some flights and flight-inclusive holidays offered by Haram Travel are financially
            protected under the ATOL scheme. ATOL protection does not cover all travel services, and
            protection varies depending on your booking. Please confirm the applicable protection
            before booking. For further information, visit the CAA&apos;s ATOL guidance.
          </p>
        </div>
      </div>
    </footer>
  );
}
