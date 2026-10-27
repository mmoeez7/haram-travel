import Image from "next/image";
import { Check, MessageCircle, Phone } from "lucide-react";
import type { PackageItem } from "@/lib/packages";
import { telUrl, whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function PackageCard({ pkg }: { pkg: PackageItem }) {
  const waMessage = `Assalamu Alaikum, I'm interested in ${pkg.title} (${pkg.subtitle}) from £${pkg.priceFrom}pp.`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-md bg-charcoal/90 px-2.5 py-1 text-xs font-semibold text-white">
          {pkg.badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
          {pkg.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-gold-dark">{pkg.subtitle}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-cream px-3 py-2 text-center text-xs font-medium text-ink">
            {String(pkg.makkahNights).padStart(2, "0")} Nights in Makkah
          </div>
          <div className="rounded-lg bg-cream px-3 py-2 text-center text-xs font-medium text-ink">
            {String(pkg.madinahNights).padStart(2, "0")} Nights in Madinah
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">From</p>
              <p className="font-display text-3xl font-semibold text-charcoal">
                £{pkg.priceFrom.toLocaleString()}
                <span className="text-base font-sans font-medium text-muted"> /pp</span>
              </p>
            </div>
            <span className="rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
              Deposit: £{pkg.deposit}pp
            </span>
          </div>

          <div className="mb-2 grid grid-cols-2 gap-2">
            <Button
              href={whatsappUrl(waMessage)}
              variant="outline"
              className="!px-3 !py-2 text-xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-3.5 w-3.5 text-whatsapp" />
              WhatsApp
            </Button>
            <Button href={telUrl()} variant="outline" className="!px-3 !py-2 text-xs">
              <Phone className="h-3.5 w-3.5 text-gold" />
              Call Now
            </Button>
          </div>
          <Button href="/booking-form" variant="gold" className="w-full">
            Inquire & Book Now →
          </Button>
        </div>
      </div>
    </article>
  );
}
