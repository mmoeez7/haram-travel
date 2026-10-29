import Image from "next/image";
import { ShieldCheck, Footprints, Wallet, Headset } from "lucide-react";
import { SITE } from "@/lib/constants";
import { PackageFinder } from "./PackageFinder";

const trustItems = [
  { icon: Footprints, label: "Footsteps From Haram" },
  { icon: ShieldCheck, label: "100% ATOL Protected" },
  { icon: Wallet, label: `£${SITE.depositFrom}pp Deposit Lock` },
  { icon: Headset, label: "24/7 UK & Saudi Care" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden py-20 text-white md:h-[100dvh] md:min-h-[100dvh] md:py-0">
      <Image
        src="/images/hero-bg.jpg"
        alt="Makkah Royal Clock Tower"
        fill
        priority
        className="hero-bg object-cover object-left"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-black/25"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="hero-enter mb-2.5 inline-block rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-soft backdrop-blur-sm md:mb-3 md:px-4 md:py-1.5 md:text-xs md:tracking-[0.16em]">
            Voted UK&apos;s Most Reliable Umrah Specialist 2024/25
          </span>
          <h1 className="hero-enter hero-enter-delay-1 font-display text-[1.65rem] font-semibold leading-tight tracking-wide sm:text-3xl md:text-5xl lg:text-6xl">
            Your Sacred Journey,{" "}
            <span className="text-gold-soft">Handled With Royal Care.</span>
          </h1>
          <p className="hero-enter hero-enter-delay-2 mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-white/90 sm:text-sm md:mt-4 md:text-lg">
            All-inclusive bespoke UK Umrah packages from £745 per person. Direct UK flights,
            verified walking-distance Haram hotels, visas & private ground transfers.
          </p>

          <div className="hero-enter hero-enter-delay-3 mt-4 flex flex-wrap items-center justify-center gap-2 md:mt-6 md:gap-3">
            {trustItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-sm md:gap-2 md:px-3 md:py-1.5 md:text-xs"
              >
                <Icon className="h-3 w-3 text-gold-soft md:h-3.5 md:w-3.5" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="hero-enter hero-enter-delay-4 mt-5 md:mt-8">
          <PackageFinder />
        </div>

        <div className="hero-enter hero-enter-delay-5 mt-5 flex flex-wrap items-center justify-center gap-6 border-t border-white/15 pt-4 text-center md:mt-8 md:gap-8 md:pt-6">
          <div>
            <p className="font-display text-2xl font-semibold text-gold-soft md:text-3xl">
              {SITE.trustpilotRating}/5
            </p>
            <p className="mt-1 text-xs text-white/80 md:text-sm">
              Trustpilot · {SITE.trustpilotReviews} reviews
            </p>
          </div>
          <div className="hidden h-10 w-px bg-white/25 sm:block" />
          <div>
            <p className="font-display text-2xl font-semibold text-gold-soft md:text-3xl">
              +{SITE.pilgrimsGuided}
            </p>
            <p className="mt-1 text-xs text-white/80 md:text-sm">British Pilgrims Guided</p>
          </div>
        </div>
      </div>
    </section>
  );
}
