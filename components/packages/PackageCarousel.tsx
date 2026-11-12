"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

  if (!items.length) return null;

  return (
    <div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((pkg) => (
          <div
            key={pkg.id}
            data-carousel-card
            className="w-[min(100%,340px)] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-3rem)/3)]"
          >
            <PackageCard pkg={pkg} />
          </div>
        ))}
      </div>

      {items.length > 1 ? (
        <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Package slides">
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
