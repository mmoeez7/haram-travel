import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { OfficeHours } from "@/components/contact/OfficeHours";

export const metadata = createMetadata({
  title: "Booking Form",
  description:
    "Book your Hajj or Umrah journey with Haram Travel. Share your preferences and receive a tailored ATOL-protected quote.",
  path: "/booking-form",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function BookingFormPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const initial = {
    departure: typeof params.departure === "string" ? params.departure : undefined,
    month: typeof params.month === "string" ? params.month : undefined,
    pilgrims: typeof params.pilgrims === "string" ? params.pilgrims : undefined,
    comfort: typeof params.comfort === "string" ? params.comfort : undefined,
  };

  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Booking Form" }]} />
        <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
          Find & Book Your Sacred Package
        </h1>
        <p className="mt-4 max-w-2xl text-muted md:text-lg">
          Share your journey preferences and our UK Umrah advisors will verify live airline seats
          and hotel contracts for your tailored quote.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <InquiryForm title="Complete Your Booking Inquiry" initial={initial} />
          <OfficeHours />
        </div>
      </div>
    </section>
  );
}
