import { createMetadata } from "@/lib/seo";
import { getSeasonalPackages } from "@/lib/packages";
import { seasonListingCardTitle } from "@/lib/package-card-title";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryFilters } from "@/components/packages/CategoryFilters";
import { StarGroupedPackages } from "@/components/packages/StarGroupedPackages";
import { CustomQuote } from "@/components/home/CustomQuote";
import { seasonPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "Easter Umrah Packages",
  description:
    seasonPageDescription("easter"),
  path: "/easter-umrah-packages",
});

export default async function EasterUmrahPackagesPage() {
  const packages = await getSeasonalPackages("easter");

  return (
    <>
      <section className="bg-cream pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Umrah Packages", href: "/umrah-packages" },
              { label: "Easter / Half-Term" },
            ]}
          />
          <h1 className="break-words font-display text-xl font-semibold uppercase leading-snug tracking-wide text-charcoal sm:text-3xl md:text-4xl lg:text-5xl">
            Easter & Half-Term Umrah Packages
          </h1>
          <p className="mt-4 max-w-2xl text-muted">{seasonPageDescription("easter")}</p>
          <div className="mt-8">
            <CategoryFilters active="easter" />
          </div>
        </div>
      </section>
      <StarGroupedPackages
        packages={packages}
        eyebrow="Umrah Deals"
        titleOverride={seasonListingCardTitle("easter")}
      />
      <CustomQuote />
    </>
  );
}
