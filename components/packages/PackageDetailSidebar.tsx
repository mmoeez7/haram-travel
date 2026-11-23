import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { PackageDetail } from "@/lib/packages";
import { packageDetailDisplayTitle } from "@/lib/package-card-title";
import { telUrl, whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { SiteLoadingButton } from "@/components/layout/SiteLoadingButton";

export function PackageDetailSidebar({ pkg }: { pkg: PackageDetail }) {
  const displayTitle = packageDetailDisplayTitle(pkg);
  const waMessage = `Assalamu Alaikum, I'm interested in ${displayTitle} (${pkg.subtitle}) from £${pkg.priceFrom}pp.`;

  return (
    <aside className="rounded-xl border border-border bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 lg:sticky lg:top-24">
      <p className="text-xs uppercase tracking-wide text-muted">Price from</p>
      <p className="mt-1 font-display text-3xl font-semibold text-charcoal sm:text-4xl">
        £{pkg.priceFrom.toLocaleString()}
        <span className="text-sm font-sans font-medium text-muted sm:text-base">
          {" "}
          /pp
        </span>
      </p>
      <span className="mt-3 inline-flex rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
        Deposit: £{pkg.deposit}pp
      </span>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <Button
          href={whatsappUrl(waMessage)}
          variant="whatsapp"
          className="w-full"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="h-4 w-4 text-white" />
          WhatsApp
        </Button>
        <Button href={telUrl()} variant="call" className="w-full">
          <Phone className="h-4 w-4" />
          Call Now
        </Button>
        <SiteLoadingButton
          href="/contact-us"
          variant="swipe"
          className="w-full sm:col-span-2 lg:col-span-1"
        >
          Inquire & Book Now →
        </SiteLoadingButton>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Speak with a UK advisor for exact dates, room types, and flight options.
      </p>
    </aside>
  );
}
