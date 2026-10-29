"use client";

import { MessageCircle, Phone } from "lucide-react";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CustomQuote() {
  return (
    <section className="bg-cream-dark py-10 md:py-14">
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal md:text-4xl">
            Need Custom Dates, Itinerary or Family Quote?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted md:mt-4 md:text-base">
            Don&apos;t see your exact dates? Our UK Umrah specialists can tailor flights, nights, and
            hotels to your exact budget in 15 minutes.
          </p>
        </Reveal>
        <Reveal delay={120} className="mt-5 flex flex-col items-stretch justify-center gap-2.5 sm:flex-row sm:flex-wrap sm:items-center md:mt-7 md:gap-3">
          <Button href={whatsappUrl()} variant="whatsapp" target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </Button>
          <Button href={telUrl()} variant="call">
            <Phone className="h-4 w-4" />
            Call {SITE.phone}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
