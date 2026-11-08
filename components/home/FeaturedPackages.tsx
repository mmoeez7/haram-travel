"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PackageItem } from "@/lib/packages";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CategoryFilters } from "@/components/packages/CategoryFilters";
import { PackageCarousel } from "@/components/packages/PackageCarousel";

type FeaturedPackagesProps = {
  threeStar: PackageItem[];
  fourStar: PackageItem[];
  fiveStar: PackageItem[];
};

export function FeaturedPackages({
  threeStar,
  fourStar,
  fiveStar,
}: FeaturedPackagesProps) {
  const groups = [
    {
      id: undefined as string | undefined,
      title: "3 Star Umrah Packages",
      description:
        "Reliable economy comfort with flights included, courtyard-friendly hotels, and full visa support for first-time and returning pilgrims.",
      packages: threeStar,
      seeMoreHref: "/3-star-umrah-packages",
    },
    {
      id: undefined as string | undefined,
      title: "4 Star Umrah Packages",
      description:
        "Executive hotels closer to the Haram with elevated dining, quieter rooms, and family configurations for 7, 10 or 12 nights.",
      packages: fourStar,
      seeMoreHref: "/4-star-umrah-packages",
    },
    {
      id: "5-star" as string | undefined,
      title: "5 Star Umrah Packages",
      description:
        "Clock Tower and courtyard VIP stays for pilgrims who want footsteps-from-Haram luxury with white-glove UK & Saudi support.",
      packages: fiveStar,
      seeMoreHref: "/5-star-umrah-packages",
    },
  ];

  return (
    <section id="packages" className="bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Handcrafted Itineraries"
          title="Featured Umrah Packages 2026/27"
          description="Every Package includes return UK flights, handpicked hotels, full Saudi Umrah visa handling, and private ground transport"
        />
        <Reveal delay={100}>
          <CategoryFilters active="all" />
        </Reveal>

        <div className="mt-8 space-y-10 md:mt-14 md:space-y-16">
          {groups.map((group) =>
            group.packages.length ? (
              <div key={group.title} id={group.id}>
                <Reveal>
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                      <h3 className="mb-2 font-display text-xl font-semibold uppercase tracking-wide text-charcoal md:text-2xl">
                        {group.title}
                      </h3>
                      <p className="text-sm text-muted">{group.description}</p>
                    </div>
                    <Link
                      href={group.seeMoreHref}
                      className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-gold hover:text-gold-dark sm:self-auto"
                    >
                      See more
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </Reveal>
                <PackageCarousel packages={group.packages} limit={3} />
              </div>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
