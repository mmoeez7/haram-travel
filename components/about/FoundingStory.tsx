import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

export function FoundingStory() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Reveal variant="left">
          <span className="mb-3 inline-block rounded-full bg-gold-soft/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-gold-dark">
          OUR COMMITMENT TO YOUR JOURNEY
          </span>
          <h2 className="break-words font-display text-xl font-semibold uppercase leading-snug tracking-wide text-charcoal sm:text-2xl md:text-3xl lg:text-4xl">
            Your Umrah Deserves Care, Comfort &amp; Trust.
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted md:text-base">
            <p>
              At Haram Travel, we believe your Umrah journey should be about devotion, not the
              stress of planning. We bring together carefully selected hotels, reliable travel
              arrangements and dedicated customer support to make every step easier.
            </p>
            <p>
              From your first enquiry to your return home, our team is committed to providing a
              seamless, transparent and well-organised experience — so you can focus on what truly
              matters.
            </p>
          </div>
        </Reveal>
        <Reveal variant="right" delay={120}>
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
                  Travel with confidence. Worship with peace.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
