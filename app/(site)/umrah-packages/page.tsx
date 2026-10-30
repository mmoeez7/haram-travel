import { createMetadata } from "@/lib/seo";
import { getUmrahByStars } from "@/lib/packages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryFilters } from "@/components/packages/CategoryFilters";
import { PackageSection } from "@/components/packages/PackageSection";
import { CustomQuote } from "@/components/home/CustomQuote";

export const metadata = createMetadata({
  title: "Umrah Packages from UK",
  description:
    "3, 4 and 5-star Umrah packages from the UK with flights included, walking-distance hotels, visas and transfers. From £745pp.",
  path: "/umrah-packages",
});

export default async function UmrahPackagesPage() {
  const [threeStar, fourStar, fiveStar] = await Promise.all([
    getUmrahByStars(3),
    getUmrahByStars(4),
    getUmrahByStars(5),
  ]);

  return (
    <>
      <section className="bg-cream pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Umrah Packages" }]} />
          <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            Umrah Packages from the UK
          </h1>
          <p className="mt-4 max-w-2xl text-muted">
            Handcrafted itineraries across 3, 4 and 5-star comfort — flights included, ATOL
            protected, with verified courtyard hotels.
          </p>
          <div className="mt-8">
            <CategoryFilters active="all" />
          </div>
        </div>
      </section>

      <PackageSection
        title="3 Star Umrah Packages"
        description="Reliable economy comfort with flights included for 7, 10 and 12 night stays."
        packages={threeStar}
      />
      <div className="bg-ivory">
        <PackageSection
          title="4 Star Umrah Packages"
          description="Executive hotels closer to the Haram with elevated comfort for families."
          packages={fourStar}
        />
      </div>
      <div id="5-star">
        <PackageSection
          title="5 Star Umrah Packages"
          description="Clock Tower and courtyard VIP stays with white-glove UK & Saudi support."
          packages={fiveStar}
        />
      </div>
      <CustomQuote />
    </>
  );
}
