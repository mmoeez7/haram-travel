import { ShieldCheck, Footprints, Wallet, Headset } from "lucide-react";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { PackageFinder } from "./PackageFinder";

const trustItems = [
  { icon: Footprints, label: "Footsteps From Haram" },
  { icon: ShieldCheck, label: "100% ATOL Protected" },
  { icon: Wallet, label: `£${SITE.depositFrom}pp Deposit Lock` },
  { icon: Headset, label: "24/7 UK & Saudi Care" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_#2a5248_0%,_#1a3c34_45%,_#0f241f_100%)] text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23c5a059%22 fill-opacity=%220.06%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 lg:px-6 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mb-5 inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-gold-soft">
            Voted UK&apos;s Most Reliable Umrah Specialist 2024/25
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-wide md:text-5xl lg:text-6xl">
            Your Sacred Journey,{" "}
            <span className="text-gold-soft">Handled With Royal Care.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
            All-inclusive bespoke UK Umrah packages from £745 per person. Direct UK flights, verified
            walking-distance Haram hotels, visas & private ground transfers.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {trustItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/90"
              >
                <Icon className="h-3.5 w-3.5 text-gold-soft" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <PackageFinder />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            href={whatsappUrl("Assalamu Alaikum, I'd like an instant price lock.")}
            variant="whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chat on WhatsApp for Instant Price Lock
          </Button>
          <Button href={telUrl()} variant="outline" className="!border-white/30 !bg-transparent !text-white hover:!border-gold-soft hover:!text-gold-soft">
            Speak to Umrah Desk: {SITE.phone}
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-8 text-center">
          <div>
            <p className="font-display text-3xl font-semibold text-gold-soft">
              {SITE.trustpilotRating}/5
            </p>
            <p className="mt-1 text-sm text-white/70">
              Trustpilot · {SITE.trustpilotReviews} reviews
            </p>
          </div>
          <div className="hidden h-10 w-px bg-white/20 sm:block" />
          <div>
            <p className="font-display text-3xl font-semibold text-gold-soft">
              +{SITE.pilgrimsGuided}
            </p>
            <p className="mt-1 text-sm text-white/70">British Pilgrims Guided</p>
          </div>
        </div>
      </div>
    </section>
  );
}
