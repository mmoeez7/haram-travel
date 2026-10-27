import { createMetadata } from "@/lib/seo";
import { getSeasonalPackages } from "@/lib/packages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryFilters } from "@/components/packages/CategoryFilters";
import { PackageSection } from "@/components/packages/PackageSection";
import { CustomQuote } from "@/components/home/CustomQuote";

export const metadata = createMetadata({
  title: "Easter Umrah Packages",
  description:
    "February half-term and Easter Umrah packages from the UK with family-friendly hotels and flights included.",
  path: "/easter-umrah-packages",
});

export default function EasterUmrahPackagesPage() {
  return (
    <>
      <section className="bg-cream pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Umrah Packages", href: "/umrah-packages" },
              { label: "Easter / Half-Term" },
            ]}
          />
          <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            Easter & Half-Term Umrah Packages
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Family-friendly spring departures timed for UK school holidays.
          </p>
          <div className="mt-8">
            <CategoryFilters active="easter" />
          </div>
        </div>
      </section>
      <PackageSection
        title="Half-Term & Easter Offers"
        description="Comfort and premium packages designed around UK school calendars."
        packages={getSeasonalPackages("easter")}
      />
      <CustomQuote />
    </>
  );
}
