import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Testimonials } from "@/components/home/Testimonials";
import { VideoReviews } from "@/components/home/VideoReviews";
import { CustomQuote } from "@/components/home/CustomQuote";
import { TrustpilotBanner } from "@/components/reviews/TrustpilotBanner";

export const metadata = createMetadata({
  title: "Reviews",
  description:
    "Read verified written reviews and watch live Umrah video testimonials from UK pilgrims who travelled with Haram Travel.",
  path: "/reviews",
});

export default function ReviewsPage() {
  return (
    <>
      <section className="bg-cream pt-12 pb-6 md:pb-8">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Reviews" }]} />
          <h1 className="break-words font-display text-xl font-semibold uppercase leading-snug tracking-wide text-charcoal sm:text-3xl md:text-4xl lg:text-5xl">
            Reviews
          </h1>
          <p className="mt-4 max-w-2xl text-muted md:text-lg">
            Verified written stories and live courtyard video reviews from British Muslim
            families who trusted Haram Travel for their Umrah journey.
          </p>
          <TrustpilotBanner />
        </div>
      </section>
      <Testimonials limit={3} showSeeMore />
      <VideoReviews limit={3} showSeeMore />
      <CustomQuote />
    </>
  );
}
