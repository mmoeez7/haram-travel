import Link from "next/link";
import { Phone } from "lucide-react";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-[#fdfbf7] py-14 md:py-20">
      {/* Soft concentric rings */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div className="absolute h-[280px] w-[280px] rounded-full border border-[#e8dfd0]/70 md:h-[420px] md:w-[420px]" />
        <div className="absolute h-[420px] w-[420px] rounded-full border border-[#e8dfd0]/50 md:h-[620px] md:w-[620px]" />
        <div className="absolute h-[560px] w-[560px] rounded-full border border-[#e8dfd0]/35 md:h-[820px] md:w-[820px]" />
        <div className="absolute h-[720px] w-[720px] rounded-full border border-[#e8dfd0]/20 md:h-[1020px] md:w-[1020px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,253,248,0.9)_0%,rgba(253,251,247,0.55)_45%,rgba(250,246,239,0.2)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center lg:px-6">
        <nav aria-label="Breadcrumb" className="mb-5 text-sm">
          <ol className="flex flex-wrap items-center justify-center gap-2">
            <li>
              <Link href="/" className="font-medium text-gold-dark hover:underline">
                Home
              </Link>
            </li>
            <li className="text-[#b0a89c]">/</li>
            <li className="text-[#9a9288]">Contact Us</li>
          </ol>
        </nav>

        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-dark md:text-xs">
          <Phone className="h-3.5 w-3.5 text-[#7c5cbf]" />
          Dedicated UK Pilgrimage Advisors
        </span>

        <h1 className="font-display text-3xl font-semibold uppercase leading-tight tracking-wide text-[#001a26] sm:text-4xl md:text-5xl lg:text-[3.25rem]">
          Speak Directly to a
          <br className="hidden sm:block" /> British Umrah Specialist
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-[#555555] md:mt-6 md:text-base">
          Whether you are planning your first Umrah, organizing a family half-term trip with elderly
          parents, or looking for 5-star Clock Tower suites — our London-based team is ready to
          guide you.
        </p>
      </div>
    </section>
  );
}
