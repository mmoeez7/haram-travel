import Image from "next/image";
import type { PackageDetail } from "@/lib/packages";
import { categoryListingHref } from "@/lib/package-paths";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function PackageDetailHero({ pkg }: { pkg: PackageDetail }) {
  const intro = pkg.shortDescription?.trim() || pkg.subtitle;
  const categoryHref = pkg.linkedCategory
    ? categoryListingHref(pkg.linkedCategory.slug)
    : "/umrah-packages";
  const categoryLabel = pkg.linkedCategory?.name ?? "Umrah Packages";

  return (
    <div className="grid gap-6 lg:gap-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: categoryLabel, href: categoryHref },
          { label: pkg.title },
        ]}
      />

      <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-border bg-white shadow-sm sm:min-h-[300px] md:min-h-[380px]">
        {pkg.image ? (
          <Image
            src={pkg.image}
            alt={pkg.coverImageAlt || pkg.title}
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

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">
          {pkg.stars}★ · {pkg.nights} nights
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold uppercase tracking-wide text-charcoal md:text-4xl lg:text-5xl">
          {pkg.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted md:text-lg">{intro}</p>
      </div>
    </div>
  );
}
