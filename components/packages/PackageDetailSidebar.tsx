import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { PackageDetail } from "@/lib/packages";
import { telUrl, whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function PackageDetailSidebar({ pkg }: { pkg: PackageDetail }) {
  const waMessage = `Assalamu Alaikum, I'm interested in ${pkg.title} (${pkg.subtitle}) from £${pkg.priceFrom}pp.`;

  return (
    <aside className="rounded-2xl border border-border bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <p className="text-xs uppercase tracking-wide text-muted">Price from</p>
      <p className="mt-1 font-display text-4xl font-semibold text-charcoal">
        £{pkg.priceFrom.toLocaleString()}
        <span className="text-base font-sans font-medium text-muted"> /pp</span>
      </p>
      <span className="mt-3 inline-flex rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
        Deposit: £{pkg.deposit}pp
      </span>

      <div className="mt-5 space-y-2">
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
        <Button href="/booking-form" variant="gold" className="w-full">
          Inquire & Book Now →
        </Button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Speak with a UK advisor for exact dates, room types, and flight options.
      </p>
    </aside>
  );
}
