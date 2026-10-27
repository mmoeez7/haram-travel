import { SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

export function CustomQuote() {
  return (
    <section className="bg-cream-dark py-14">
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
        <h2 className="font-display text-3xl font-semibold uppercase tracking-wide text-charcoal md:text-4xl">
          Need Custom Dates, Itinerary or Family Quote?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted">
          Don&apos;t see your exact dates? Our UK Umrah specialists can tailor flights, nights, and
          hotels to your exact budget in 15 minutes.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Button href={whatsappUrl()} variant="whatsapp" target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </Button>
          <Button href={telUrl()} variant="dark">
            Call {SITE.phone}
          </Button>
        </div>
      </div>
    </section>
  );
}
