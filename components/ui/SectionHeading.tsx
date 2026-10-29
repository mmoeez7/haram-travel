"use client";

import { Reveal } from "@/components/ui/Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={`mb-7 max-w-3xl md:mb-10 ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow ? (
        <span
          className={`mb-2.5 inline-block rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] md:mb-3 md:text-xs ${
            light ? "bg-white/15 text-gold-soft" : "bg-gold-soft/60 text-gold-dark"
          }`}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={`font-display text-2xl font-semibold uppercase tracking-wide md:text-4xl ${
          light ? "text-white" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-3 text-sm leading-relaxed md:mt-4 md:text-base ${
            light ? "text-white/80" : "text-muted"
          }`}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
