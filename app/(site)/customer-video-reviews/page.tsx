import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { VideoReviews } from "@/components/home/VideoReviews";
import { CustomQuote } from "@/components/home/CustomQuote";

export const metadata = createMetadata({
  title: "Customer Video Reviews",
  description:
    "Watch live Umrah video reviews from UK pilgrims filmed in the courtyards of Makkah and Madinah with Haram Travel.",
  path: "/customer-video-reviews",
});

export default function CustomerVideoReviewsPage() {
  return (
    <>
      <section className="bg-cream pt-12 pb-4">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Customer Video Reviews" },
            ]}
          />
          <h1 className="break-words font-display text-xl font-semibold uppercase leading-snug tracking-wide text-charcoal sm:text-3xl md:text-4xl lg:text-5xl">
            Customer Video Reviews
          </h1>
          <p className="mt-4 max-w-2xl text-muted md:text-lg">
            Live courtyard video testimonials from British Muslim families on their Umrah
            journey with Haram Travel.
          </p>
        </div>
      </section>
      <VideoReviews />
      <CustomQuote />
    </>
  );
}
