"use client";

import Link from "next/link";
import { packageFilters } from "@/lib/packages";

const filterHrefs: Record<string, string> = {
  all: "/umrah-packages",
  december: "/december-umrah-packages",
  easter: "/easter-umrah-packages",
  ramadan: "/ramadan-umrah-packages",
  luxury: "/umrah-packages#5-star",
};

export function CategoryFilters({ active = "all" }: { active?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {packageFilters.map((filter) => {
        const isActive = active === filter.id;
        return (
          <Link
            key={filter.id}
            href={filterHrefs[filter.id] ?? "/umrah-packages"}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-gradient-to-l from-gold to-gold-dark text-charcoal"
                : "border border-border bg-white text-ink hover:border-gold hover:text-gold-dark"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
}
