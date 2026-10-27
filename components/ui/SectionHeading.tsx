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
    <div className={`mb-10 max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? (
        <span
          className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
            light ? "bg-white/15 text-gold-soft" : "bg-gold-soft/60 text-gold-dark"
          }`}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={`font-display text-3xl font-semibold uppercase tracking-wide md:text-4xl ${
          light ? "text-white" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/80" : "text-muted"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
