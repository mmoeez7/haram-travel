import { createMetadata } from "@/lib/seo";
import { getSeasonalPackages } from "@/lib/packages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryFilters } from "@/components/packages/CategoryFilters";
import { StarGroupedPackages } from "@/components/packages/StarGroupedPackages";
import { CustomQuote } from "@/components/home/CustomQuote";

export const metadata = createMetadata({
  title: "Ramadan Umrah Packages",
  description:
    "Ramadan Umrah packages from the UK including Last 10 Nights and full-month stays near the Haram.",
  path: "/ramadan-umrah-packages",
});

export default async function RamadanUmrahPackagesPage() {
  const packages = await getSeasonalPackages("ramadan");

  return (
    <>
      <section className="bg-cream pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Umrah Packages", href: "/umrah-packages" },
              { label: "Ramadan Packages" },
            ]}
          />
          <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            Ramadan Umrah Packages
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Last 10 Nights and full Ramadan stays with courtyard hotels and dedicated UK support.
          </p>
          <div className="mt-8">
            <CategoryFilters active="ramadan" />
          </div>
        </div>
      </section>
      <StarGroupedPackages packages={packages} eyebrow="Umrah Deals" />
      <CustomQuote />
    </>
  );
}
