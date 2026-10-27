import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

const stats = [
  { value: "18,500+", label: "British Pilgrims Guided" },
  { value: "100%", label: "ATOL Protected" },
  { value: "5-Star", label: "Courtyard Walking Guarantee" },
  { value: "4.9/5", label: "Trustpilot Rating" },
];

export function AboutHero() {
  return (
    <section className="bg-cream py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Haram Travel" }]} />
        <span className="mb-4 inline-block rounded-full bg-gold-soft/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">
          Official UK Licensed Umrah Specialist
        </span>
        <h1 className="max-w-4xl font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
          Guiding British Pilgrims with Reverence, Honesty & Royal Care
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
          Haram Travel was born from a responsibility to replace deceptive &quot;near Haram&quot;
          claims with verified hotels, legal UK financial protection, and on-ground care worthy of
          every Guest of Allah.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-white px-5 py-6 text-center"
            >
              <p className="font-display text-3xl font-semibold text-gold-dark">{stat.value}</p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
