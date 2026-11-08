import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { createMetadata } from "@/lib/seo";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

export const metadata = createMetadata({
  title: "0% Cost Calculator",
  description:
    "Calculate your Umrah budget with 0% interest installments. Lock today's price with a low deposit and plan monthly payments.",
  path: "/cost-calculator",
});

export default function CostCalculatorPage() {
  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "0% Cost Calculator" }]} />
        <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
          Instant Umrah Budget & Installment Calculator
        </h1>
        <p className="mt-4 max-w-2xl text-muted md:text-lg">
          0% interest Umrah payment plans. Lock today&apos;s price with a £{SITE.depositFrom}pp
          deposit and spread the balance before departure.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            href={whatsappUrl("Assalamu Alaikum, I'd like help planning my Umrah budget.")}
            variant="whatsapp"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button href={telUrl()} variant="call">
            <Phone className="h-4 w-4" />
            Call {SITE.phone}
          </Button>
        </div>
      </div>
    </section>
  );
}
