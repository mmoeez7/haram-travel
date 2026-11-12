import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden py-24 text-white md:h-[100dvh] md:min-h-[100dvh] md:py-0">
      <Image
        src="/images/hero-bg.jpg"
        alt="Masjid al-Haram and the Kaaba in Makkah"
        fill
        priority
        quality={95}
        // Full Unsplash master — skip optimizer recompression.
        unoptimized
        sizes="100vw"
        className="hero-bg object-cover object-[45%_center] md:object-center"
      />

      {/* Mobile/tablet: even scrim. Desktop: strong left shade for left copy */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-charcoal/55 to-charcoal/70 lg:hidden"
        aria-hidden
      />
      <div
        className="absolute inset-0 hidden bg-gradient-to-r from-black/95 via-charcoal/80 to-transparent lg:block lg:from-black/90 lg:via-charcoal/65 lg:to-charcoal/10"
        aria-hidden
      />
      <div
        className="absolute inset-0 hidden bg-gradient-to-t from-charcoal/55 via-transparent to-charcoal/20 lg:block"
        aria-hidden
      />

      {/* Decorative gold curves — desktop only */}
      <svg
        className="pointer-events-none absolute bottom-0 left-0 hidden h-[42%] w-[38%] max-w-xl opacity-35 lg:block"
        viewBox="0 0 480 320"
        fill="none"
        aria-hidden
      >
        <path
          d="M-20 280C80 220 140 160 120 90C100 20 200 -10 280 40"
          stroke="currentColor"
          strokeWidth="1.25"
          className="text-gold/55"
        />
        <path
          d="M-40 300C60 250 160 200 150 120C140 40 240 10 340 70"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gold/30"
        />
        <path
          d="M20 310C110 270 200 230 210 150C220 70 310 40 400 100"
          stroke="currentColor"
          strokeWidth="0.75"
          className="text-gold/20"
        />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center md:max-w-2xl lg:mx-0 lg:text-left">
          <p className="hero-enter font-display text-lg font-semibold uppercase tracking-[0.18em] text-gold-soft md:text-xl">
            {SITE.name}
          </p>

          <h1 className="hero-enter hero-enter-delay-1 mt-4 font-display text-[1.85rem] font-semibold leading-[1.15] tracking-wide sm:text-4xl md:mt-5 md:text-5xl lg:text-6xl">
            Your Sacred Journey,{" "}
            <span className="text-gold-soft">Handled With Royal Care.</span>
          </h1>

          <div className="hero-enter hero-enter-delay-2 mt-5 flex flex-wrap items-center justify-center gap-5 sm:gap-8 md:mt-6 lg:justify-start">
            <div>
              <p className="font-display text-2xl font-semibold text-gold-soft md:text-3xl">
                {SITE.trustpilotRating}/5
              </p>
              <p className="mt-1 text-xs text-white/80 md:text-sm">
                Trustpilot · {SITE.trustpilotReviews} reviews
              </p>
            </div>
            <div className="hidden h-10 w-px bg-white/25 sm:block" aria-hidden />
            <div>
              <p className="font-display text-2xl font-semibold text-gold-soft md:text-3xl">
                +{SITE.pilgrimsGuided}
              </p>
              <p className="mt-1 text-xs text-white/80 md:text-sm">
                British Pilgrims Guided
              </p>
            </div>
          </div>

          <p className="hero-enter hero-enter-delay-3 mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/90 md:mt-6 md:text-base lg:mx-0 lg:text-lg">
            All-inclusive UK Umrah packages from £745pp — flights, walking-distance
            Haram hotels, visas & private transfers.
          </p>

          <div className="hero-enter hero-enter-delay-4 mt-7 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
            <Button
              href="/umrah-packages"
              variant="gold"
              className="h-12 w-full !rounded-full px-6 sm:w-[200px]"
            >
              Explore Packages
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
            <a
              href="#video-reviews"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-charcoal/25 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-gold/50 hover:bg-charcoal/40 sm:w-[200px]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/45">
                <Play className="h-3 w-3 fill-white" aria-hidden />
              </span>
              Watch Reviews
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
