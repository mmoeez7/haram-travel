import { Check } from "lucide-react";
import type { PackageDetail } from "@/lib/packages";

export function PackageDetailBody({ pkg }: { pkg: PackageDetail }) {
  const overview =
    pkg.description?.trim() ||
    pkg.shortDescription?.trim() ||
    `${pkg.subtitle}. A carefully arranged ${pkg.nights}-night journey with ${pkg.makkahNights} nights in Makkah and ${pkg.madinahNights} nights in Madinah.`;

  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal md:text-3xl">
          Package Overview
        </h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted md:text-base">
          {overview}
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal md:text-3xl">
          Package Summary
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:max-w-md">
          <div className="rounded-xl border border-border bg-white px-3 py-3 text-center text-sm font-medium text-ink">
            {String(pkg.makkahNights).padStart(2, "0")} Nights in Makkah
          </div>
          <div className="rounded-xl border border-border bg-white px-3 py-3 text-center text-sm font-medium text-ink">
            {String(pkg.madinahNights).padStart(2, "0")} Nights in Madinah
          </div>
        </div>

        {pkg.features.length ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {pkg.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 rounded-xl border border-border/70 bg-white/70 px-3.5 py-3 text-sm text-ink"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                {feature}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-2xl border border-gold/30 bg-gold/5 px-4 py-4 md:px-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gold-dark">
          Please note
        </h3>
        <ul className="mt-2 space-y-1.5 text-sm text-muted">
          <li>Package prices are typically based on quad sharing unless stated otherwise.</li>
          <li>Direct flights and ground upgrades may be available on request.</li>
          <li>All packages advertised are subject to availability.</li>
        </ul>
      </section>
    </div>
  );
}
