import { Building2, Shield, CreditCard, Headset } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardRail } from "@/components/ui/CardRail";

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
    <section id="why-us" className="bg-ivory py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="The Haram Travel Difference"
          title="Why UK Pilgrims Choose Us"
          description="We don't just sell packages — we guide your divine journey with honesty, transparency, and care from doorstep to Haram."
        />
        <CardRail cols="md:grid-cols-2 xl:grid-cols-4">
          {points.map(({ icon: Icon, title, text, iconTone }) => (
            <article
              key={title}
              className="card-lift rounded-xl border border-border bg-white p-4 hover:border-gold/50 md:rounded-2xl md:p-6"
            >
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl md:mb-4 md:h-12 md:w-12 ${iconTone}`}
              >
                <Icon className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <h3 className="font-display text-base font-semibold uppercase tracking-wide text-charcoal md:text-lg">
                {title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted md:mt-3 md:text-sm">{text}</p>
            </article>
          ))}
        </CardRail>
      </div>
    </section>
  );
}
