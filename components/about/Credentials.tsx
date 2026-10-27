import { Shield, Landmark, Plane, Star } from "lucide-react";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
    <section className="bg-charcoal py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold uppercase tracking-wide md:text-4xl">
            Perform Umrah with Total Peace of Mind
          </h2>
          <p className="mt-4 text-white/75">
            Speak with UK Umrah advisors to craft tailored dates and itineraries that are ATOL
            protected from day one.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button href="/booking-form" variant="gold">
              Find My Package
            </Button>
            <Button
              href={whatsappUrl()}
              variant="whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </Button>
          </div>
        </div>

        <div className="mt-14">
          <SectionHeading
            eyebrow="Legal Transparency"
            title="Licensed, Bonded & Directly Contracted"
            light
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {cards.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <Icon className="mb-4 h-7 w-7 text-gold-soft" />
                <h3 className="font-display text-lg font-semibold uppercase tracking-wide">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{text}</p>
              </article>
            ))}
          </div>
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
