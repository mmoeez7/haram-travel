import { createMetadata } from "@/lib/seo";
import { getSeasonalPackages } from "@/lib/packages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryFilters } from "@/components/packages/CategoryFilters";
import { PackageSection } from "@/components/packages/PackageSection";
import { CustomQuote } from "@/components/home/CustomQuote";

export const metadata = createMetadata({
  title: "December Umrah Packages | Affordable UK",
  description:
    "Affordable December Umrah packages from the UK with flights, visas, and walking-distance hotels. From £699pp.",
  path: "/december-umrah-packages",
});

export default async function DecemberUmrahPackagesPage() {
  const packages = await getSeasonalPackages("december");

  return (
    <>
      <section className="bg-cream pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Umrah Packages", href: "/umrah-packages" },
              { label: "December Packages" },
            ]}
          />
          <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            December Umrah Packages
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Affordable, reliable December Umrah packages crafted for UK families and groups.
          </p>
          <div className="mt-8">
            <CategoryFilters active="december" />
          </div>
        </div>
      </section>
      <PackageSection
        title="December Special Offers"
        description="Budget to elite options for winter Umrah departures from major UK airports."
        packages={packages}
      />
      <CustomQuote />
    </>
  );
}
