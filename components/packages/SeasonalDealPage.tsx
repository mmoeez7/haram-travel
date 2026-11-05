import { getPackagesByCategorySlug } from "@/lib/categories";
import { getSeasonalPackages, type DealSeason } from "@/lib/packages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { StarGroupedPackages } from "@/components/packages/StarGroupedPackages";
import { CustomQuote } from "@/components/home/CustomQuote";

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
  let packages = await getPackagesByCategorySlug(season);
  if (!packages.length) {
    packages = await getSeasonalPackages(season);
  }

  return (
    <>
      <section className="bg-cream pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-3 lg:px-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Umrah Packages", href: "/umrah-packages" },
              { label: pathLabel },
            ]}
          />
          <h1 className="font-display text-3xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-muted">{description}</p>
        </div>
      </section>

      {packages.length ? (
        <StarGroupedPackages packages={packages} eyebrow="Umrah Deals" />
      ) : (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-3 lg:px-4">
            <p className="text-muted">
              No published packages in this deal yet. Please check back soon or contact our
              advisors for a bespoke quote.
            </p>
          </div>
        </section>
      )}

      <CustomQuote />
    </>
  );
}
