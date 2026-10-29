"use client";

import { getUmrahByStars } from "@/lib/packages";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardRail } from "@/components/ui/CardRail";
import { Reveal } from "@/components/ui/Reveal";
import { CategoryFilters } from "@/components/packages/CategoryFilters";
import { PackageCard } from "@/components/packages/PackageCard";

export function FeaturedPackages() {
  const threeStar = getUmrahByStars(3);
  const fourStar = getUmrahByStars(4);
  const fiveStar = getUmrahByStars(5);

  const groups = [
    {
      id: undefined as string | undefined,
      title: "3 Star Umrah Packages",
      description:
        "Reliable economy comfort with flights included, courtyard-friendly hotels, and full visa support for first-time and returning pilgrims.",
      packages: threeStar,
    },
    {
      id: undefined as string | undefined,
      title: "4 Star Umrah Packages",
      description:
        "Executive hotels closer to the Haram with elevated dining, quieter rooms, and family configurations for 7, 10 or 12 nights.",
      packages: fourStar,
    },
    {
      id: "5-star" as string | undefined,
      title: "5 Star Umrah Packages",
      description:
        "Clock Tower and courtyard VIP stays for pilgrims who want footsteps-from-Haram luxury with white-glove UK & Saudi support.",
      packages: fiveStar,
    },
  ];

  return (
    <section id="packages" className="bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="Handcrafted Itineraries"
          title="Featured Umrah Packages 2026/27"
          description="Every Package includes return UK flights, handpicked hotels, full Saudi Umrah visa handling, and private ground transport"
        />
        <Reveal delay={100}>
          <CategoryFilters active="all" />
        </Reveal>

        <div className="mt-8 space-y-10 md:mt-14 md:space-y-16">
          {groups.map((group) => (
            <div key={group.title} id={group.id}>
              <Reveal>
                <h3 className="mb-2 font-display text-xl font-semibold uppercase tracking-wide text-charcoal md:text-2xl">
                  {group.title}
                </h3>
                <p className="mb-6 max-w-2xl text-sm text-muted">{group.description}</p>
              </Reveal>
              <CardRail>
                {group.packages.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </CardRail>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
