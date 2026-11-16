import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Testimonials } from "@/components/home/Testimonials";
import { CustomQuote } from "@/components/home/CustomQuote";

export const metadata = createMetadata({
  title: "Customer Reviews",
  description:
    "Read verified written reviews from UK pilgrims who travelled with Haram Travel for Umrah.",
  path: "/customer-reviews",
});

export default function CustomerReviewsPage() {
  return (
    <>
      <section className="bg-cream pt-12 pb-4">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Customer Reviews" }]}
          />
          <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            Customer Reviews
          </h1>
          <p className="mt-4 max-w-2xl text-muted md:text-lg">
            Verified written stories from British Muslim families who trusted Haram Travel
            for their Umrah journey.
          </p>
        </div>
      </section>
      <Testimonials />
      <CustomQuote />
    </>
  );
}
