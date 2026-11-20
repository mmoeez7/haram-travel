import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { HeroInquiryForm } from "@/components/home/HeroInquiryForm";

function HeroCopy() {
  return (
    <div className="w-full max-w-xl text-left text-white md:max-w-2xl">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-gold-soft sm:text-sm md:text-xl md:tracking-[0.18em]">
        {SITE.name}
      </p>

      <h1 className="mt-1 font-display text-[1.35rem] font-semibold leading-snug tracking-wide sm:text-3xl md:mt-3 md:text-5xl md:leading-[1.15] lg:text-[3.25rem] lg:leading-[1.12]">
        Your Sacred Journey,{" "}
        <span className="italic text-gold-soft">Handled With Royal Care.</span>
      </h1>

      <div className="mt-2 flex flex-wrap items-center justify-start gap-3 sm:gap-6 md:mt-3.5 md:gap-8">
        <div>
          <p className="font-display text-lg font-semibold text-gold-soft sm:text-2xl md:text-3xl">
            {SITE.trustpilotRating}/5
          </p>
          <p className="mt-0.5 text-[10px] leading-tight text-white/80 sm:text-xs md:text-sm">
            Trustpilot · {SITE.trustpilotReviews} reviews
          </p>
        </div>
        <div className="h-7 w-px bg-white/25 sm:h-10" aria-hidden />
        <div>
          <p className="font-display text-lg font-semibold text-gold-soft sm:text-2xl md:text-3xl">
            +{SITE.pilgrimsGuided}
          </p>
          <p className="mt-0.5 text-[10px] leading-tight text-white/80 sm:text-xs md:text-sm">
            British Pilgrims Guided
          </p>
        </div>
      </div>

      <p className="mt-2 max-w-lg text-xs leading-relaxed text-white/90 sm:text-sm md:mt-3.5 md:text-base">
        All-inclusive UK Umrah packages from £745pp — flights, walking-distance
        Haram hotels, visas & private transfers.
      </p>

      <div className="mt-3 mb-2 flex w-full flex-row items-stretch gap-2 sm:mt-4 sm:mb-0 sm:gap-3 md:justify-start">
        <Button
          href="/umrah-packages"
          variant="swipe"
          className="h-9 min-w-0 flex-1 !rounded-full !px-2.5 !text-[11px] !leading-none whitespace-nowrap sm:h-12 sm:max-w-[200px] sm:flex-none sm:!px-6 sm:!text-sm"
        >
          Explore Packages
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden />
        </Button>
        <a
          href="#video-reviews"
          className="inline-flex h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded-full border border-white/30 bg-charcoal/25 px-2.5 text-[11px] font-semibold leading-none whitespace-nowrap text-white backdrop-blur-sm transition hover:border-gold/50 hover:bg-charcoal/40 sm:h-12 sm:max-w-[200px] sm:flex-none sm:gap-2 sm:px-6 sm:text-sm"
        >
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/45 sm:h-7 sm:w-7">
            <Play className="h-2 w-2 fill-white sm:h-3 sm:w-3" aria-hidden />
          </span>
          Watch Reviews
        </a>
      </div>
    </div>
  );
}

function HeroOverlays() {
  return (
    <>
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25"
        aria-hidden
      />
    </>
  );
}

export function Hero() {
  return (
    <section className="bg-cream pb-[4.75rem] md:pb-0">
      {/* Mobile: natural height. Desktop: fit under header in one view. */}
      <div className="mx-auto flex max-w-7xl flex-col px-3 pt-3 pb-4 sm:px-6 sm:pt-4 md:h-[calc(100dvh-4.5rem)] md:px-6 md:pb-5 md:pt-5 lg:px-8">
        <div className="relative min-h-[42dvh] overflow-hidden rounded-2xl sm:min-h-[48dvh] md:min-h-0 md:flex-1 md:rounded-3xl">
          <div className="absolute inset-0 md:hidden">
            <Image
              src="/images/hero-mobile.jpg"
              alt="The Holy Kaaba in Makkah"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-[center_35%]"
            />
          </div>

          <div className="absolute inset-0 hidden md:block">
            <Image
              src="/images/hero-desktop.jpg"
              alt="Al-Masjid an-Nabawi in Madinah"
              fill
              priority
              unoptimized
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover object-[center_42%]"
            />
          </div>

          <HeroOverlays />

          <div className="absolute inset-0 z-10 flex items-start px-4 py-5 pb-16 sm:items-center sm:px-6 sm:py-8 sm:pb-24 md:pb-28 lg:px-8">
            <HeroCopy />
          </div>
        </div>

        <div className="relative z-20 mx-auto w-full shrink-0 -mt-6 px-0.5 sm:-mt-12 sm:px-2">
          <HeroInquiryForm />
        </div>
      </div>
    </section>
  );
}
