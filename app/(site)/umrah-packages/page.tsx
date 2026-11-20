import { createMetadata } from "@/lib/seo";
import { getUmrahByStars } from "@/lib/packages";
import { starListingCardTitle } from "@/lib/package-card-title";
import { getCategorySeoBlock } from "@/lib/categories";
import { UMRAH_PACKAGES_ROOT_SLUG } from "@/lib/category-roots";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryFilters } from "@/components/packages/CategoryFilters";
import { PackageSection } from "@/components/packages/PackageSection";
import { CustomQuote } from "@/components/home/CustomQuote";
import { SeoContent } from "@/components/content/SeoContent";
import { starPageDescription } from "@/lib/package-page-copy";

export const metadata = createMetadata({
  title: "Umrah Packages from UK",
  description:
    "3, 4 and 5-star Umrah packages from the UK with flights included, walking-distance hotels, visas and transfers. From £745pp.",
  path: "/umrah-packages",
});

export default async function UmrahPackagesPage() {
  const [threeStar, fourStar, fiveStar, seo] = await Promise.all([
    getUmrahByStars(3),
    getUmrahByStars(4),
    getUmrahByStars(5),
    getCategorySeoBlock(UMRAH_PACKAGES_ROOT_SLUG),
  ]);

  return (
    <>
      <section className="bg-cream pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Umrah Packages" }]} />
          <h1 className="break-words font-display text-xl font-semibold uppercase leading-snug tracking-wide text-charcoal sm:text-3xl md:text-4xl lg:text-5xl">
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
        description={starPageDescription(3)}
        packages={threeStar}
        titleOverride={starListingCardTitle(3)}
      />
      <div className="bg-ivory">
        <PackageSection
          title="4 Star Umrah Packages"
          description={starPageDescription(4)}
          packages={fourStar}
          titleOverride={starListingCardTitle(4)}
        />
      </div>
      <div id="5-star">
        <PackageSection
          title="5 Star Umrah Packages"
          description={starPageDescription(5)}
          packages={fiveStar}
          titleOverride={starListingCardTitle(5)}
        />
      </div>
      <SeoContent html={seo.html} imageSrc={seo.imageSrc} imageAlt={seo.imageAlt} />
      <CustomQuote />
    </>
  );
}
