"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { PackageItem } from "@/lib/packages";
import { seasonListingCardTitle } from "@/lib/package-card-title";
import { DEAL_SEASON_OPTIONS } from "@/lib/package-paths";
import { StarGroupedPackages } from "@/components/packages/StarGroupedPackages";

type StarFilter = "all" | 3 | 4 | 5;

const STAR_FILTERS: { id: StarFilter; label: string }[] = [
  { id: "all", label: "All Packages" },
  { id: 3, label: "3 Star" },
  { id: 4, label: "4 Star" },
  { id: 5, label: "5 Star" },
];

type DealFiltersBarProps = {
  season: string;
  packages: PackageItem[];
  eyebrow?: string;
  /** Override card titles; defaults to season listing title. */
  titleOverride?: string;
};

export function DealFiltersBar({
  season,
  packages,
  eyebrow = "Umrah Deals",
  titleOverride,
}: DealFiltersBarProps) {
  const cardTitle = titleOverride ?? seasonListingCardTitle(season);
  const router = useRouter();
  const [starFilter, setStarFilter] = useState<StarFilter>("all");

  const filtered = useMemo(() => {
    if (starFilter === "all") return packages;
    return packages.filter((pkg) => pkg.stars === starFilter);
  }, [packages, starFilter]);

  return (
    <>
      <div className="border-y border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3.5 sm:gap-4 sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Filter by:
            </span>
            <div className="grid w-full grid-cols-4 gap-1.5 sm:flex sm:w-auto sm:flex-wrap sm:gap-2">
              {STAR_FILTERS.map((filter) => {
                const active = starFilter === filter.id;
                return (
                  <button
                    key={String(filter.id)}
                    type="button"
                    onClick={() => setStarFilter(filter.id)}
                    className={`whitespace-nowrap rounded-full border px-1.5 py-1.5 text-center text-[11px] font-semibold transition sm:px-3.5 sm:text-sm ${
                      active
                        ? "border-forest bg-forest text-white"
                        : "border-border bg-white text-charcoal hover:border-forest/40"
                    }`}
                  >
                    {filter.id === "all" ? (
                      <>
                        <span className="sm:hidden">All</span>
                        <span className="hidden sm:inline">{filter.label}</span>
                      </>
                    ) : (
                      filter.label
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex w-full flex-col gap-1.5 sm:max-w-xs sm:flex-row sm:items-center sm:gap-2.5 lg:w-auto lg:max-w-sm">
            <span className="shrink-0 text-sm text-muted">Switch Month:</span>
            <select
              value={season}
              onChange={(event) => {
                const next = DEAL_SEASON_OPTIONS.find(
                  (option) => option.slug === event.target.value
                );
                if (next) router.push(next.href);
              }}
              className="h-10 w-full rounded-full border border-border bg-white px-3.5 text-sm font-medium text-charcoal outline-none ring-gold transition focus:ring-2"
              aria-label="Switch month"
            >
              {DEAL_SEASON_OPTIONS.map((option) => (
                <option key={option.slug} value={option.slug}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filtered.length ? (
        <StarGroupedPackages
          packages={filtered}
          eyebrow={eyebrow}
          titleOverride={cardTitle}
        />
      ) : (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <p className="text-muted">
              No packages match this star filter. Try All Packages or another star rating.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
