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
    <section className="relative h-[100dvh] min-h-[100dvh] overflow-hidden text-white">
      <Image
        src="/images/hero-bg.jpg"
        alt="Makkah Royal Clock Tower"
        fill
        priority
        className="object-cover object-left"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-black/25"
        aria-hidden
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-3 inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-soft backdrop-blur-sm">
              Voted UK&apos;s Most Reliable Umrah Specialist 2024/25
            </span>
            <h1 className="font-display text-3xl font-semibold leading-tight tracking-wide md:text-5xl lg:text-6xl">
              Your Sacred Journey,{" "}
              <span className="text-gold-soft">Handled With Royal Care.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/90 md:mt-4 md:text-lg">
              All-inclusive bespoke UK Umrah packages from £745 per person. Direct UK flights,
              verified walking-distance Haram hotels, visas & private ground transfers.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:mt-6">
              {trustItems.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/90 backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-gold-soft" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 md:mt-8">
            <PackageFinder />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 border-t border-white/15 pt-5 text-center md:mt-8 md:pt-6">
            <div>
              <p className="font-display text-3xl font-semibold text-gold-soft">
                {SITE.trustpilotRating}/5
              </p>
              <p className="mt-1 text-sm text-white/80">
                Trustpilot · {SITE.trustpilotReviews} reviews
              </p>
            </div>
            <div className="hidden h-10 w-px bg-white/25 sm:block" />
            <div>
              <p className="font-display text-3xl font-semibold text-gold-soft">
                +{SITE.pilgrimsGuided}
              </p>
              <p className="mt-1 text-sm text-white/80">British Pilgrims Guided</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
