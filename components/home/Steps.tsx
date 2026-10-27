import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    num: "01",
    title: "Bespoke Itinerary & GDS Flight Match",
    text: "Tailored dates, family configurations, and confirmed seats via live GDS airline systems.",
    badge: "Response within 15 mins",
  },
  {
    num: "02",
    title: "Saudi Visa & 40-Page Travel Pack",
    text: "Official Ministry of Hajj & Umrah visas processed within 24–48 hours, plus medical cover and dua booklet.",
    badge: "100% Guaranteed MoFA Approval",
  },
  {
    num: "03",
    title: "VIP Terminal Greeting & Private GMC",
    text: "Touchdown in Jeddah or Madinah with private chauffeur, chilled Zamzam, and high-speed 5G SIMs.",
    badge: "Chauffeur / Private AC Transfers",
  },
  {
    num: "04",
    title: "Haram Footsteps & Guided Ziyarat",
    text: "Handpicked courtyard hotels with 24/7 UK & Saudi support throughout your sacred stay.",
    badge: "24/7 UK & Saudi Care",
  },
];

export function Steps() {
  return (
    <section id="hotel-guide" className="bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          title="From London Doorstep to the Mataf in 4 Steps"
          description="A clear, guided process so you can focus on worship while we handle every detail."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {steps.map((step) => (
            <article
              key={step.num}
              className="relative overflow-hidden rounded-2xl border border-border bg-white p-6 md:p-8"
            >
              <span className="font-display text-5xl font-semibold text-gold-soft/80">
                {step.num}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
              <span className="mt-5 inline-block rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                {step.badge}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
