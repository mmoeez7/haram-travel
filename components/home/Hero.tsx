import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { SITE } from "@/lib/constants";
import { HeroInquiryForm } from "@/components/home/HeroInquiryForm";

function HeroCopy() {
  return (
    <div className="relative z-10 max-w-xl space-y-3 text-left text-white sm:space-y-4 md:max-w-2xl">
      <p className="hero-enter font-display text-xs font-semibold uppercase tracking-[0.14em] text-gold-soft sm:text-sm md:text-base md:tracking-[0.18em]">
        {SITE.name}
      </p>

      <h1 className="hero-enter hero-enter-delay-1 font-display text-3xl font-semibold leading-[1.14] tracking-tight sm:text-5xl lg:text-[54px] lg:leading-[1.12]">
        Your Sacred Journey,{" "}
        <span className="italic text-gold-soft">Handled With Royal Care.</span>
      </h1>

      <div className="hero-enter hero-enter-delay-2 flex flex-wrap items-center gap-3 sm:gap-6 md:gap-8">
        <div>
          <p className="font-display text-xl font-semibold text-gold-soft sm:text-2xl md:text-3xl">
            {SITE.trustpilotRating}/5
          </p>
          <p className="mt-0.5 text-[11px] leading-tight text-white/80 sm:text-xs md:text-sm">
            Trustpilot · {SITE.trustpilotReviews} reviews
          </p>
        </div>
        <div className="h-8 w-px bg-white/25 sm:h-10" aria-hidden />
        <div>
          <p className="font-display text-xl font-semibold text-gold-soft sm:text-2xl md:text-3xl">
            +{SITE.pilgrimsGuided}
          </p>
          <p className="mt-0.5 text-[11px] leading-tight text-white/80 sm:text-xs md:text-sm">
            British Pilgrims Guided
          </p>
        </div>
      </div>

      <p className="hero-enter hero-enter-delay-3 max-w-xl text-xs leading-relaxed text-slate-200 sm:text-sm md:text-base">
        All-inclusive UK Umrah packages from £745pp — flights, walking-distance
        Haram hotels, visas & private transfers.
      </p>

      <div className="hero-enter hero-enter-delay-4 relative z-30 flex flex-wrap items-center gap-2.5 pt-1 sm:gap-3">
        <Link
          href="/umrah-packages"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gold px-5 text-xs font-bold uppercase tracking-wider text-charcoal transition duration-200 hover:bg-gold-dark hover:text-white sm:h-12 sm:px-7 sm:text-sm"
        >
          Explore Packages
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
        </Link>
        <a
          href="#video-reviews"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/20 px-5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md sm:h-12 sm:px-6 sm:text-sm"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/45 sm:h-6 sm:w-6">
            <Play className="h-2.5 w-2.5 fill-current sm:h-3 sm:w-3" aria-hidden />
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
        className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/25 sm:to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40"
        aria-hidden
      />
    </>
  );
}

export function Hero() {
  return (
    <section className="relative w-full bg-cream pt-4 pb-[5.5rem] sm:pt-6 sm:pb-14 md:pt-8 md:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Inset cinematic banner — taller on large screens; extra bottom pad so CTAs stay clear of form */}
        <div className="relative flex min-h-[460px] items-start overflow-hidden rounded-2xl border border-[#EAE3D6] p-5 pb-16 shadow-xl sm:min-h-[500px] sm:items-center sm:rounded-3xl sm:p-12 sm:pb-14 lg:min-h-[540px] lg:p-14 lg:pb-16 xl:min-h-[560px]">
          <div className="absolute inset-0 md:hidden">
            <Image
              src="/images/hero-mobile.jpg"
              alt="The Holy Kaaba in Makkah"
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-[center_right] sm:object-center"
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
              className="object-cover object-center"
            />
          </div>

          <HeroOverlays />
          <HeroCopy />
        </div>

        {/* Overlapping enquiry bar */}
        <div className="hero-enter hero-enter-delay-5 relative z-20 mx-auto -mt-10 max-w-6xl px-0 sm:-mt-12 sm:px-2 lg:-mt-14">
          <HeroInquiryForm />
        </div>
      </div>
    </section>
  );
}
