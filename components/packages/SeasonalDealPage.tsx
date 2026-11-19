import {
  getCategorySeoBlock,
  getPackagesByCategorySlug,
} from "@/lib/categories";
import { getSeasonalPackages, type DealSeason } from "@/lib/packages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DealFiltersBar } from "@/components/packages/DealFiltersBar";
import { CustomQuote } from "@/components/home/CustomQuote";
import { SeoContent } from "@/components/content/SeoContent";

type SeasonalDealPageProps = {
  title: string;
  description: string;
  pathLabel: string;
  season: DealSeason;
};

export async function SeasonalDealPage({
  title,
  description,
  pathLabel,
  season,
}: SeasonalDealPageProps) {
  const seo = await getCategorySeoBlock(season);
  let packages = await getPackagesByCategorySlug(season);
  if (!packages.length) {
    packages = await getSeasonalPackages(season);
  }

  return (
    <>
      <section className="bg-cream pt-8 pb-5 sm:pt-12 sm:pb-6">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Umrah Packages", href: "/umrah-packages" },
              { label: pathLabel },
            ]}
          />
          <h1 className="mt-1 max-w-3xl break-words font-display text-xl font-semibold uppercase leading-snug tracking-wide text-charcoal sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted sm:mt-4 sm:text-base">
            {description}
          </p>
        </div>
      </section>

      {packages.length ? (
        <DealFiltersBar season={season} packages={packages} eyebrow="Umrah Deals" />
      ) : (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <p className="text-muted">
              No published packages in this deal yet. Please check back soon or contact our
              advisors for a bespoke quote.
            </p>
          </div>
        </section>
      )}

      <SeoContent html={seo.html} imageSrc={seo.imageSrc} imageAlt={seo.imageAlt} />
      <CustomQuote />
    </>
  );
}
