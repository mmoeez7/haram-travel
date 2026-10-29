import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FOOTER_DEPARTURES, FOOTER_PACKAGES, SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#faf6ef]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <div className="mb-4">
            <Logo />
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Haram Travel is a premier UK travel agency specializing in tailored Umrah and Islamic
            pilgrimage packages. Guided by our motto &apos;Trusted Umrah, Seamless Journey&apos;, we
            ensure every detail is handled with reverence and precision.
          </p>
          <p className="mt-4 text-sm font-semibold text-gold-dark">
            ATOL Holder &amp; Ministry of Hajj &amp; Umrah Authorized
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-charcoal">
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
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-charcoal">
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
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-charcoal">
            Contact &amp; Support
          </h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" />
              <span>
                <span className="font-semibold text-charcoal">UK Office:</span> {SITE.address}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" />
              <a href={telUrl()} className="hover:text-gold-dark">
                <span className="font-semibold text-charcoal">Telephone:</span> {SITE.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" />
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-dark"
              >
                <span className="font-semibold text-charcoal">WhatsApp:</span>{" "}
                {SITE.whatsappDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" />
              <a href={`mailto:${SITE.email}`} className="hover:text-gold-dark">
                <span className="font-semibold text-charcoal">Email:</span> {SITE.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 lg:flex-row lg:items-start lg:justify-between lg:px-6">
          <div className="max-w-3xl space-y-2 text-xs leading-relaxed text-muted">
            <p>
              © {new Date().getFullYear()} Haram Travel Ltd. All Rights Reserved. Company Registered
              in England &amp; Wales.
            </p>
            <p>
              All the flight-inclusive holidays on this website are financially protected by the ATOL
              scheme. When you pay you will be supplied with an ATOL Certificate. Please ask for it
              and check to ensure that everything you booked is listed on it.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-medium text-muted lg:justify-end">
            <Link href="/privacy-policy" className="hover:text-gold-dark">
              Privacy Policy
            </Link>
            <Link href="/privacy-policy" className="hover:text-gold-dark">
              Terms &amp; Conditions
            </Link>
            <Link href="/about-us" className="hover:text-gold-dark">
              ATOL Protection Details
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
