import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { FOOTER_PACKAGES, SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Logo } from "@/components/layout/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#faf6ef] pb-24 md:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-6 md:gap-10 md:py-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16 lg:px-8">
        <div className="w-full max-w-md lg:max-w-sm lg:shrink-0">
          <div className="mb-3 md:mb-4">
            <Logo />
          </div>
          <p className="text-sm leading-relaxed text-muted">
            Haram Travel is a premier UK travel agency specializing in tailored Umrah and Islamic
            pilgrimage packages. Guided by our motto &apos;Trusted Umrah, Seamless Journey&apos;, we
            ensure every detail is handled with reverence and precision.
          </p>
          <p className="mt-3 text-sm font-semibold text-gold-dark md:mt-4">
            ATOL Holder &amp; Ministry of Hajj &amp; Umrah Authorized
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:w-auto lg:min-w-0 lg:flex-none lg:gap-16">
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-charcoal md:mb-4">
              Umrah Packages
            </h3>
            <ul className="space-y-2 md:space-y-2.5">
              {FOOTER_PACKAGES.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-muted hover:text-gold-dark">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-charcoal md:mb-4">
              Contact &amp; Support
            </h3>
            <ul className="space-y-2.5 text-sm text-muted md:space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" />
                <span className="min-w-0 break-words">
                  <span className="font-semibold text-charcoal">UK Office:</span> {SITE.address}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" />
                <a href={telUrl()} className="min-w-0 break-words hover:text-gold-dark">
                  <span className="font-semibold text-charcoal">Telephone:</span> {SITE.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <FaWhatsapp className="mt-0.5 h-4 w-4 shrink-0 text-[#25d366]" />
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 break-words hover:text-gold-dark"
                >
                  <span className="font-semibold text-charcoal">WhatsApp:</span>{" "}
                  {SITE.whatsappDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#e11d48]" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="min-w-0 break-all hover:text-gold-dark sm:break-words"
                >
                  <span className="font-semibold text-charcoal">Email:</span> {SITE.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 sm:px-6 md:py-6 lg:flex-row lg:items-start lg:justify-between lg:px-8">
          <div className="max-w-3xl space-y-2 text-xs leading-relaxed text-muted">
            <p>
              © {new Date().getFullYear()} Haram Travel. All Rights Reserved. Company Registered
              in England &amp; Wales.
            </p>
            <p>
              All the flight-inclusive holidays on this website are financially protected by the ATOL
              scheme. When you pay you will be supplied with an ATOL Certificate. Please ask for it
              and check to ensure that everything you booked is listed on it.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-muted lg:justify-end lg:pt-0.5">
            <Link href="/about-us" className="hover:text-gold-dark">
              About Us
            </Link>
            <Link href="/contact-us" className="hover:text-gold-dark">
              Contact Us
            </Link>
            <Link href="/privacy-policy" className="hover:text-gold-dark">
              Privacy Policy
            </Link>
            <Link href="/privacy-policy" className="hover:text-gold-dark">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
