import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Testimonials } from "@/components/home/Testimonials";
import { VideoReviews } from "@/components/home/VideoReviews";
import { CustomQuote } from "@/components/home/CustomQuote";

export const metadata = createMetadata({
  title: "Pilgrims Reviews",
  description:
    "Real UK pilgrim reviews and video testimonials of Haram Travel Umrah journeys from Makkah and Madinah.",
  path: "/pilgrim-reviews",
});

export default function PilgrimReviewsPage() {
  return (
    <>
      <section className="bg-cream pt-12 pb-4">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pilgrims Reviews" }]} />
          <h1 className="font-display text-4xl font-semibold uppercase tracking-wide text-charcoal md:text-5xl">
            Pilgrims Reviews
          </h1>
          <p className="mt-4 max-w-2xl text-muted md:text-lg">
            Verified written stories and live courtyard video reviews from British Muslim families.
          </p>
        </div>
      </section>
      <Testimonials />
      <VideoReviews />
      <CustomQuote />
    </>
  );
}
