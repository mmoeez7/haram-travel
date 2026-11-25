import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";

const stats = [
  { value: SITE.pilgrimsGuided, label: "British Pilgrims Guided" },
  { value: "100%", label: "ATOL Protected" },
  { value: "5-Star", label: "Courtyard Walking Guarantee" },
  { value: "4.8/5", label: "Trustpilot Rating" },
];

export function AboutHero() {
  return (
    <section className="bg-cream py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <Reveal>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Haram Travel" }]} />
          <span className="mb-4 inline-block rounded-full bg-gold-soft/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">
            Official UK Licensed Umrah Specialist
          </span>
          <h1 className="max-w-4xl break-words font-display text-xl font-semibold uppercase leading-snug tracking-wide text-charcoal sm:text-3xl md:text-4xl lg:text-5xl">
            Guiding British Pilgrims with Reverence, Honesty & Royal Care
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
            Haram Travel was born from a responsibility to replace deceptive &quot;near Haram&quot;
            claims with verified hotels, legal UK financial protection, and on-ground care worthy of
            every Guest of Allah.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 90} variant="scale">
              <div className="rounded-2xl border border-border bg-white px-5 py-6 text-center">
                <p className="font-display text-3xl font-semibold text-gold-dark">{stat.value}</p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
