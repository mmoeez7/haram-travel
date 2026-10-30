import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Steps } from "@/components/home/Steps";
import { CustomQuote } from "@/components/home/CustomQuote";

export const metadata = createMetadata({
  title: "Hotel Walking Guide",
  description:
    "Verified walking-distance Haram hotels in Makkah and Madinah — courtyard proximity guide for UK Umrah pilgrims.",
  path: "/hotel-walking-guide",
});

const zones = [
  {
    title: "0–50m Courtyard Edge",
    text: "Direct pedestrian access to Mataf gates. Ideal for elderly parents, wheelchair users, and families with toddlers.",
  },
  {
    title: "50–150m Near Haram",
    text: "Short flat walk to main courtyard entrances. Strong value for first-time pilgrims wanting comfort without Clock Tower pricing.",
  },
  {
    title: "150–250m Walking Zone",
    text: "Still walkable for most adults. We only recommend hotels we have personally verified — never shuttle-bus claims marketed as walking distance.",
  },
];

export default function HotelWalkingGuidePage() {
  return (
    <>
      <section className="bg-cream py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Hotel Walking Guide" }]}
          />
          <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            Hotel Walking Guide
          </h1>
          <p className="mt-4 max-w-2xl text-muted md:text-lg">
            How we verify courtyard proximity so your family walks to the Haram with ease — not a
            25-minute shuttle in the heat.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {zones.map((zone) => (
              <article
                key={zone.title}
                className="rounded-2xl border border-border bg-white p-6 shadow-sm"
              >
                <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
                  {zone.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{zone.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Steps />
      <CustomQuote />
    </>
  );
}
