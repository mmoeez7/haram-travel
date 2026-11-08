import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { createMetadata } from "@/lib/seo";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { BeatPriceForm } from "@/components/contact/InquiryForm";

export const metadata = createMetadata({
  title: "Beat My Price | Customized Umrah Packages",
  description:
    "Found a cheaper quote elsewhere? Share it with Haram Travel and we will beat the price on a comparable ATOL-protected Umrah package.",
  path: "/customized-umrah-packages",
});

export default function BeatMyPricePage() {
  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Beat My Price" },
          ]}
        />
        <h1 className="font-display text-3xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
          Beat My Price
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Already have a quote from another agency? Share your dates, hotels, and price — our UK
          advisors will customise a matching or better ATOL-protected itinerary.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={whatsappUrl("Assalamu Alaikum, I'd like you to beat my Umrah quote.")} variant="whatsapp" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="h-4 w-4" />
            WhatsApp Your Quote
          </Button>
          <Button href={telUrl()} variant="call">
            <Phone className="h-4 w-4" />
            Call {SITE.phone}
          </Button>
        </div>

        <div className="mt-10 max-w-3xl">
          <BeatPriceForm />
        </div>
      </div>
    </section>
  );
}
