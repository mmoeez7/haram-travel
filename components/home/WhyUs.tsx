import { Building2, Shield, CreditCard, Headset } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const points = [
  {
    icon: Building2,
    title: "Walking Distance Hotels",
    text: "No exhausting shuttle bus journeys. Our selected hotels are footsteps from the courtyard, ideal for elders, families, and young children.",
    iconTone: "bg-[#f3ebdc] text-charcoal",
  },
  {
    icon: Shield,
    title: "100% ATOL Protected",
    text: "Every penny of your money is protected under UK law. Book with complete peace of mind knowing your pilgrimage is safe and insured.",
    iconTone: "bg-[#e8f1fb] text-[#2f6fed]",
  },
  {
    icon: CreditCard,
    title: "Flexible 0% Installments",
    text: "Secure today's low price with just a £99 deposit per person, then spread the remaining balance comfortably before your departure date.",
    iconTone: "bg-[#e8f1fb] text-[#2f6fed]",
  },
  {
    icon: Headset,
    title: "24/7 Ground Support",
    text: "Our dedicated UK and Saudi team members meet you at Jeddah/Madinah airports and remain reachable around the clock for any assistance.",
    iconTone: "bg-[#f7efd8] text-[#d4af37]",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="bg-ivory py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="The Haram Travel Difference"
          title="Why UK Pilgrims Choose Us"
          description="We don't just sell packages — we guide your divine journey with honesty, transparency, and care from doorstep to Haram."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {points.map(({ icon: Icon, title, text, iconTone }) => (
            <article
              key={title}
              className="rounded-2xl border border-border bg-white p-6 transition hover:border-gold/50"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${iconTone}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
