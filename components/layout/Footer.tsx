import Link from "next/link";
import { FOOTER_DEPARTURES, FOOTER_PACKAGES, SITE } from "@/lib/constants";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream-dark">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <div className="mb-4">
            <Logo />
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Specialised, guided Umrah and Hajj services for the British Muslim community — verified
            walking-distance hotels, ATOL protection, and 24/7 UK & Saudi care.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-charcoal">
            Umrah Packages
          </h3>
          <ul className="space-y-2.5">
            {FOOTER_PACKAGES.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-muted hover:text-gold-dark">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-charcoal">
            UK Departure Cities
          </h3>
          <ul className="space-y-2.5">
            {FOOTER_DEPARTURES.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-muted hover:text-gold-dark">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-charcoal">
            Contact & Support
          </h3>
          <ul className="space-y-2.5 text-sm text-muted">
            <li>
              <span className="font-medium text-charcoal">UK Office:</span> {SITE.address}
            </li>
            <li>
              <span className="font-medium text-charcoal">Telephone:</span> {SITE.phone}
            </li>
            <li>
              <span className="font-medium text-charcoal">WhatsApp:</span> {SITE.whatsappDisplay}
            </li>
            <li>
              <span className="font-medium text-charcoal">Email:</span> {SITE.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-5 text-xs text-muted sm:flex-row sm:items-center lg:px-6">
          <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-gold-dark">
              Privacy Policy
            </Link>
            <Link href="/privacy-policy" className="hover:text-gold-dark">
              Terms & Conditions
            </Link>
            <Link href="/about-us" className="hover:text-gold-dark">
              ATOL Protection
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
