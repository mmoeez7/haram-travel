import { getUmrahByStars } from "@/lib/packages";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CategoryFilters } from "@/components/packages/CategoryFilters";
import { PackageCard } from "@/components/packages/PackageCard";

export function FeaturedPackages() {
  const threeStar = getUmrahByStars(3);
  const fourStar = getUmrahByStars(4);
  const fiveStar = getUmrahByStars(5);

  return (
    <section id="packages" className="bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="Handcrafted Itineraries"
          title="Featured Umrah Packages 2026/27"
          description="Every Package includes return UK flights, handpicked hotels, full Saudi Umrah visa handling, and private ground transport"
        />
        <CategoryFilters active="all" />

        <div className="mt-14 space-y-16">
          <div>
            <h3 className="mb-2 font-display text-2xl font-semibold uppercase tracking-wide text-charcoal">
              3 Star Umrah Packages
            </h3>
            <p className="mb-6 max-w-2xl text-sm text-muted">
              Reliable economy comfort with flights included, courtyard-friendly hotels, and full
              visa support for first-time and returning pilgrims.
            </p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {threeStar.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 font-display text-2xl font-semibold uppercase tracking-wide text-charcoal">
              4 Star Umrah Packages
            </h3>
            <p className="mb-6 max-w-2xl text-sm text-muted">
              Executive hotels closer to the Haram with elevated dining, quieter rooms, and family
              configurations for 7, 10 or 12 nights.
            </p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {fourStar.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>

          <div id="5-star">
            <h3 className="mb-2 font-display text-2xl font-semibold uppercase tracking-wide text-charcoal">
              5 Star Umrah Packages
            </h3>
            <p className="mb-6 max-w-2xl text-sm text-muted">
              Clock Tower and courtyard VIP stays for pilgrims who want footsteps-from-Haram luxury
              with white-glove UK & Saudi support.
            </p>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {fiveStar.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
