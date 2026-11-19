import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { HeroInquiryForm } from "@/components/home/HeroInquiryForm";

function HeroCopy() {
  return (
    <div className="mx-auto max-w-xl text-center text-white md:mx-0 md:max-w-2xl md:text-left">
      <p className="font-display text-lg font-semibold uppercase tracking-[0.18em] text-gold-soft md:text-xl">
        {SITE.name}
      </p>

      <h1 className="mt-2 font-display text-[1.85rem] font-semibold leading-[1.15] tracking-wide sm:text-4xl md:mt-3 md:text-5xl lg:text-6xl">
        Your Sacred Journey,{" "}
        <span className="italic text-gold-soft">Handled With Royal Care.</span>
      </h1>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-5 sm:gap-8 md:mt-4 md:justify-start">
        <div>
          <p className="font-display text-2xl font-semibold text-gold-soft md:text-3xl">
            {SITE.trustpilotRating}/5
          </p>
          <p className="mt-0.5 text-xs text-white/80 md:text-sm">
            Trustpilot · {SITE.trustpilotReviews} reviews
          </p>
        </div>
        <div className="hidden h-10 w-px bg-white/25 sm:block" aria-hidden />
        <div>
          <p className="font-display text-2xl font-semibold text-gold-soft md:text-3xl">
            +{SITE.pilgrimsGuided}
          </p>
          <p className="mt-0.5 text-xs text-white/80 md:text-sm">
            British Pilgrims Guided
          </p>
        </div>
      </div>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/90 md:mt-4 md:text-base lg:mx-0 lg:text-lg">
        All-inclusive UK Umrah packages from £745pp — flights, walking-distance
        Haram hotels, visas & private transfers.
      </p>

      <div className="mt-4 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-5 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
        <Button
          href="/umrah-packages"
          variant="swipe"
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
  );
}

export function Hero() {
  return (
    <section className="relative w-full bg-cream pb-10 sm:pb-12">
      {/* Mobile */}
      <div className="relative h-[100dvh] w-full overflow-hidden md:hidden">
        <Image
          src="/images/hero-mobile.jpg"
          alt="The Holy Kaaba in Makkah"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25"
          aria-hidden
        />
        <div className="absolute inset-0 z-10 flex items-center px-5 py-10">
          <HeroCopy />
        </div>
      </div>

      {/* Desktop */}
      <div className="relative hidden h-[100dvh] w-full overflow-hidden md:block">
        <Image
          src="/images/hero-desktop.jpg"
          alt="Al-Masjid an-Nabawi in Madinah"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_42%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25"
          aria-hidden
        />
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
            <HeroCopy />
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-10 max-w-7xl px-4 sm:-mt-14 sm:px-6 lg:px-8">
        <HeroInquiryForm />
      </div>
    </section>
  );
}
