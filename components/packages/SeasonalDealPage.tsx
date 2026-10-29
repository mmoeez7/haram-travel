import { getUmrahByStars, getSeasonalPackages, type PackageItem } from "@/lib/packages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PackageSection } from "@/components/packages/PackageSection";
import { CustomQuote } from "@/components/home/CustomQuote";

type SeasonKey = "december" | "easter" | "ramadan";

type SeasonalDealPageProps = {
  title: string;
  description: string;
  pathLabel: string;
  season?: SeasonKey;
};

function packagesForSeason(season?: SeasonKey): PackageItem[] {
  if (season) {
    const seasonal = getSeasonalPackages(season);
    if (seasonal.length) return seasonal;
  }
  return [...getUmrahByStars(3), ...getUmrahByStars(4)].slice(0, 6);
}

export function SeasonalDealPage({
  title,
  description,
  pathLabel,
  season,
}: SeasonalDealPageProps) {
  return (
    <>
      <section className="bg-cream pt-12 pb-6">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
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
      <PackageSection
        title={title}
        description={description}
        packages={packagesForSeason(season)}
      />
      <CustomQuote />
    </>
  );
}
