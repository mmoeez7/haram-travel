import Image from "next/image";
import Link from "next/link";
import { Check, MessageCircle, Phone } from "lucide-react";
import type { PackageItem } from "@/lib/packages";
import { telUrl, whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function PackageCard({ pkg }: { pkg: PackageItem }) {
  const waMessage = `Assalamu Alaikum, I'm interested in ${pkg.title} (${pkg.subtitle}) from £${pkg.priceFrom}pp.`;
  const href = `/packages/${pkg.id}`;

  return (
    <article className="card-lift flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm md:rounded-2xl">
      <Link href={href} className="relative block h-36 overflow-hidden sm:h-40 md:h-48">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 80vw, 33vw"
        />
        <span className="absolute left-2.5 top-2.5 rounded-md bg-gold px-2 py-0.5 text-[10px] font-semibold text-charcoal md:left-3 md:top-3 md:px-2.5 md:py-1 md:text-xs">
          {pkg.badge}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4 md:p-5">
        <h3 className="font-display text-base font-semibold uppercase tracking-wide text-charcoal sm:text-lg md:text-xl">
          <Link href={href} className="hover:text-gold-dark">
            {pkg.title}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs font-medium text-gold-dark md:mt-1 md:text-sm">
          {pkg.subtitle}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-1.5 md:mt-4 md:gap-2">
          <div className="rounded-lg bg-cream px-2 py-1.5 text-center text-[10px] font-medium leading-snug text-ink md:px-3 md:py-2 md:text-xs">
            {String(pkg.makkahNights).padStart(2, "0")} Nights in Makkah
          </div>
          <div className="rounded-lg bg-cream px-2 py-1.5 text-center text-[10px] font-medium leading-snug text-ink md:px-3 md:py-2 md:text-xs">
            {String(pkg.madinahNights).padStart(2, "0")} Nights in Madinah
          </div>
        </div>

        <ul className="mt-3 space-y-1.5 md:mt-4 md:space-y-2">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-start gap-1.5 text-xs text-muted md:gap-2 md:text-sm">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest md:h-4 md:w-4" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-4 md:pt-5">
          <div className="mb-3 flex items-end justify-between gap-2 md:mb-4 md:gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted md:text-xs">From</p>
              <p className="font-display text-2xl font-semibold text-charcoal md:text-3xl">
                £{pkg.priceFrom.toLocaleString()}
                <span className="text-sm font-sans font-medium text-muted md:text-base"> /pp</span>
              </p>
            </div>
            <span className="rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-semibold text-forest md:px-3 md:py-1 md:text-xs">
              Deposit: £{pkg.deposit}pp
            </span>
          </div>

          <div className="mb-2 grid grid-cols-2 gap-1.5 md:gap-2">
            <Button
              href={whatsappUrl(waMessage)}
              variant="whatsapp"
              className="!px-2 !py-1.5 text-[11px] md:!px-3 md:!py-2 md:text-xs"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-3.5 w-3.5 text-white" />
              WhatsApp
            </Button>
            <Button
              href={telUrl()}
              variant="call"
              className="!px-2 !py-1.5 text-[11px] md:!px-3 md:!py-2 md:text-xs"
            >
              <Phone className="h-3.5 w-3.5" />
              Call Now
            </Button>
          </div>
          <Button href="/booking-form" variant="gold" className="w-full !py-2 text-xs md:!py-2.5 md:text-sm">
            Inquire & Book Now →
          </Button>
        </div>
      </div>
    </article>
  );
}
