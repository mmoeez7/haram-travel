import { Building2, Shield, CreditCard, Headset } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const points = [
  {
    icon: Building2,
    title: "Walking Distance Hotels",
    text: "No exhausting shuttle bus journeys — hotels footsteps from the courtyard gates for elderly parents and toddlers.",
  },
  {
    icon: Shield,
    title: "100% ATOL Protected",
    text: "All flight-inclusive bookings are financially protected under ATOL for complete peace of mind.",
  },
  {
    icon: CreditCard,
    title: "Flexible 0% Installments",
    text: "Secure today's low price with a £99 deposit and spread the remaining balance interest-free.",
  },
  {
    icon: Headset,
    title: "24/7 Ground Support",
    text: "Dedicated UK and Saudi teams available around the clock from booking to return.",
  },
];

export function WhyUs() {
  return (
    <section id="why-us" className="bg-ivory py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="The Haram Travel Difference"
          title="Why UK Pilgrims Choose Us"
          description="Four uncompromising commitments to your family's comfort, dignity, and spiritual focus."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {points.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-border bg-white p-6 transition hover:border-gold/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft/50 text-gold-dark">
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
