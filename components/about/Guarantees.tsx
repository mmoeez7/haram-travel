import { SectionHeading } from "@/components/ui/SectionHeading";

const guarantees = [
  {
    title: "0–250m Courtyard Promise",
    text: "Hotels in Makkah and Madinah selected for pedestrian access to courtyard gates — seamless for elderly parents and toddlers.",
  },
  {
    title: "100% ATOL Protected",
    text: "All flight-inclusive bookings are financially protected under ATOL through Bukhari Travel T/A Haram Travel.",
  },
  {
    title: "£99 Deposit & Price Lock",
    text: "Lock flight seats and hotel contracts with £99 per person, then pay monthly at 0% interest until two weeks before departure.",
  },
  {
    title: "British Ground Care",
    text: "Bilingual UK coordinators greet you at Jeddah/Madinah airports with chilled Zamzam and high-speed travel eSIMs.",
  },
];

export function Guarantees() {
  return (
    <section className="bg-ivory py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="The Haram Travel Difference"
          title="The 4 Sacred Guarantees"
          description="Every itinerary we prepare is anchored in four uncompromising commitments to your family's comfort, dignity, and spiritual focus."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {guarantees.map((item, i) => (
            <article key={item.title} className="rounded-2xl border border-border bg-white p-6">
              <span className="font-display text-3xl font-semibold text-gold-soft">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
