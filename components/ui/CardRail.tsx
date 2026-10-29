"use client";

import { Children, type ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type CardRailProps = {
  children: ReactNode;
  /** Grid column classes applied from md+ (default 2 / 3 cols). */
  cols?: string;
  className?: string;
};

/**
 * Mobile: vertical single-column stack (compact cards).
 * Tablet/desktop: responsive grid.
 * Cards reveal on scroll with a light stagger.
 */
export function CardRail({
  children,
  cols = "md:grid-cols-2 xl:grid-cols-3",
  className = "",
}: CardRailProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 md:gap-6 ${cols} ${className}`}>
      {Children.map(children, (child, index) => (
        <Reveal
          key={index}
          delay={Math.min(index * 90, 360)}
          className="mx-auto w-full max-w-[340px] md:mx-0 md:h-full md:max-w-none"
        >
          <div className="h-full w-full">{child}</div>
        </Reveal>
      ))}
    </div>
  );
}
