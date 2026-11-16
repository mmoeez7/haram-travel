"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PackageItem } from "@/lib/packages";
import { PackageCard } from "@/components/packages/PackageCard";

type PackageCarouselProps = {
  packages: PackageItem[];
  /** Max cards in the carousel. Omit to show all packages. */
  limit?: number;
};

export function PackageCarousel({ packages, limit }: PackageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const items = limit != null ? packages.slice(0, limit) : packages;

  const updateActive = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-carousel-card]")
    );
    if (!cards.length) return;

    const trackLeft = track.scrollLeft;
    let closest = 0;
    let closestDist = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const dist = Math.abs(card.offsetLeft - trackLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closest = index;
      }
    });
    setActive(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    updateActive();
    track.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      track.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [updateActive, items.length]);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelectorAll<HTMLElement>("[data-carousel-card]")[index];
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setActive(index);
  }

  function goPrev() {
    goTo(Math.max(0, active - 1));
  }

  function goNext() {
    goTo(Math.min(items.length - 1, active + 1));
  }

  if (!items.length) return null;

  // Desktop shows 3 cards at once — only navigate when there's overflow.
  const showArrows = items.length > 3;
  const atStart = active <= 0;
  const atEnd = active >= items.length - 1;

  return (
    <div>
      <div className="relative">
        {showArrows ? (
          <>
            <button
              type="button"
              aria-label="Previous packages"
              onClick={goPrev}
              disabled={atStart}
              className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/95 text-charcoal shadow-md transition hover:border-gold hover:text-gold-dark disabled:pointer-events-none disabled:opacity-35 lg:flex"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next packages"
              onClick={goNext}
              disabled={atEnd}
              className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white/95 text-charcoal shadow-md transition hover:border-gold hover:text-gold-dark disabled:pointer-events-none disabled:opacity-35 lg:flex"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </>
        ) : null}

        <div
          ref={trackRef}
          className="flex flex-col gap-4 overflow-visible pb-2 lg:snap-x lg:snap-mandatory lg:flex-row lg:gap-6 lg:overflow-x-auto lg:scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden"
        >
          {items.map((pkg) => (
            <div
              key={pkg.id}
              data-carousel-card
              className="w-full lg:w-[calc((100%-3rem)/3)] lg:shrink-0 lg:snap-start"
            >
              <PackageCard pkg={pkg} />
            </div>
          ))}
        </div>
      </div>

      {showArrows ? (
        <div
          className="mt-4 hidden items-center justify-center gap-2 lg:flex"
          role="tablist"
          aria-label="Package slides"
        >
          {items.map((pkg, index) => (
            <button
              key={pkg.id}
              type="button"
              role="tab"
              aria-label={`Show package ${index + 1}`}
              aria-selected={active === index}
              onClick={() => goTo(index)}
              className={`h-2.5 rounded-full transition ${
                active === index
                  ? "w-6 bg-gold"
                  : "w-2.5 bg-border hover:bg-gold/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
