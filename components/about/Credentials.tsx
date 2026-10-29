import { Shield, Landmark, Plane, Star, MessageCircle } from "lucide-react";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardRail } from "@/components/ui/CardRail";

const cards = [
  {
    icon: Shield,
    title: "ATOL Protected Holidays",
    text: "Flight-inclusive packages financially protected under the ATOL scheme.",
  },
  {
    icon: Landmark,
    title: "Ministry of Hajj & Umrah",
    text: "Authorised intermediary portal for Nusuk permits and visas.",
  },
  {
    icon: Plane,
    title: "Direct Airline Contracts",
    text: "Seat allocations with Saudi, British Airways, Emirates, and Qatar Airways.",
  },
  {
    icon: Star,
    title: "Trustpilot Verified Partner",
    text: `Rated ${SITE.trustpilotRating}/5 based on verified British pilgrim reviews.`,
  },
];

export function Credentials() {
  return (
    <section className="bg-charcoal py-12 text-white md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-wide md:text-4xl">
            Perform Umrah with Total Peace of Mind
          </h2>
          <p className="mt-3 text-sm text-white/75 md:mt-4 md:text-base">
            Speak with UK Umrah advisors to craft tailored dates and itineraries that are ATOL
            protected from day one.
          </p>
          <div className="mt-5 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:items-center md:mt-7 md:gap-3">
            <Button href="/booking-form" variant="gold">
              Find My Package
            </Button>
            <Button
              href={whatsappUrl()}
              variant="whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </Button>
          </div>
        </div>

        <div className="mt-10 md:mt-14">
          <SectionHeading
            eyebrow="Legal Transparency"
            title="Licensed, Bonded & Directly Contracted"
            light
          />
          <CardRail cols="md:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="h-full rounded-xl border border-white/10 bg-white/5 p-4 md:rounded-2xl md:p-5"
              >
                <Icon className="mb-3 h-6 w-6 text-gold-soft md:mb-4 md:h-7 md:w-7" />
                <h3 className="font-display text-base font-semibold uppercase tracking-wide md:text-lg">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70 md:mt-3 md:text-sm">{text}</p>
              </article>
            ))}
          </CardRail>
        </div>

        <p className="mt-10 text-center text-sm text-white/60">
          Prefer to talk? Call our UK desk on{" "}
          <a href={telUrl()} className="text-gold-soft hover:underline">
            {SITE.phone}
          </a>
        </p>
      </div>
    </section>
  );
}
