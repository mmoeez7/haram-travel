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
    <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
      {packageFilters.map((filter) => {
        const isActive = active === filter.id;
        return (
          <Link
            key={filter.id}
            href={filterHrefs[filter.id] ?? "/umrah-packages"}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition md:px-4 md:py-2 md:text-sm ${
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
