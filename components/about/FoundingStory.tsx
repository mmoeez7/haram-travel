import Image from "next/image";

export function FoundingStory() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2 lg:px-6">
        <div>
          <span className="mb-3 inline-block rounded-full bg-gold-soft/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">
            Our Founding Story
          </span>
          <h2 className="font-display text-3xl font-semibold uppercase tracking-wide text-charcoal md:text-4xl">
            A Sacred Journey Deserves Complete Honesty.
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted md:text-base">
            <p>
              The UK Umrah market was once dominated by middle-tier brokers making deceptive claims
              about hotel distances. Families discovered too late that &quot;near the Haram&quot;
              meant a 25-minute shuttle in 40°C heat with elderly parents.
            </p>
            <p>
              We founded Haram Travel to treat every pilgrim not as a customer, but as a Guest of
              Allah (Dhuyuf al-Rahman) — with verified walking-distance hotels, legal ATOL
              protection, and bilingual ground care from London to the Mataf.
            </p>
            <p className="font-medium text-charcoal">
              — Managing Director & Founding Team, Haram Travel UK
            </p>
            <p>
              Serving British Muslims in London, Birmingham, Manchester, and Scotland.
            </p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative aspect-[4/3]">
            <Image
              src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80"
              alt="Masjid an-Nabawi at sunset"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-5">
              <p className="text-sm font-semibold text-gold-soft">
                The 0m Courtyard Promise: Direct pedestrian access to King Fahd & Bab Al Salam
                gates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
