import Image from "next/image";
import type { PackageDetail } from "@/lib/packages";
import { packageDetailDisplayTitle } from "@/lib/package-card-title";
import { categoryListingHref } from "@/lib/package-paths";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function PackageDetailHero({ pkg }: { pkg: PackageDetail }) {
  const displayTitle = packageDetailDisplayTitle(pkg);
  const intro = pkg.shortDescription?.trim() || pkg.subtitle;
  const categoryHref = pkg.linkedCategory
    ? categoryListingHref(pkg.linkedCategory.slug)
    : "/umrah-packages";
  const categoryLabel = pkg.linkedCategory?.name ?? "Umrah Packages";

  return (
    <div className="grid gap-5 sm:gap-6 lg:gap-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: categoryLabel, href: categoryHref },
          { label: displayTitle },
        ]}
      />

      <div className="relative min-h-[200px] overflow-hidden rounded-xl border border-border bg-white shadow-sm sm:min-h-[280px] sm:rounded-2xl md:min-h-[380px]">
        {pkg.image ? (
          <Image
            src={pkg.image}
            alt={pkg.coverImageAlt || displayTitle}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-cream" />
        )}
        {pkg.badge ? (
          <span className="absolute left-3 top-3 rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-charcoal md:left-4 md:top-4">
            {pkg.badge}
          </span>
        ) : null}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">
          {pkg.stars}★ · {pkg.nights} nights
        </p>
        <h1 className="mt-1.5 break-words font-display text-xl font-semibold uppercase leading-snug tracking-wide text-charcoal sm:mt-2 sm:text-2xl md:text-3xl">
          {displayTitle}
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-muted sm:text-base md:text-lg">
          {intro}
        </p>
      </div>
    </div>
  );
}
