import { createMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CustomerReviewsGrid } from "@/components/home/CustomerReviewsGrid";
import { VideoReviews } from "@/components/home/VideoReviews";
import { CustomQuote } from "@/components/home/CustomQuote";
import {
  getTestimonialsPage,
  TESTIMONIALS_PAGE_SIZE,
} from "@/lib/testimonials";

export const metadata = createMetadata({
  title: "Pilgrims Reviews",
  description:
    "Real UK pilgrim reviews and video testimonials of Haram Travel Umrah journeys from Makkah and Madinah.",
  path: "/pilgrim-reviews",
});

export default async function PilgrimReviewsPage() {
  const { reviews, total } = await getTestimonialsPage({
    offset: 0,
    limit: TESTIMONIALS_PAGE_SIZE,
  });

  return (
    <>
      <section className="bg-cream pt-12 pb-4">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pilgrims Reviews" }]} />
          <h1 className="break-words font-display text-xl font-semibold uppercase leading-snug tracking-wide text-charcoal sm:text-3xl md:text-4xl lg:text-5xl">
            Pilgrims Reviews
          </h1>
          <p className="mt-4 max-w-2xl text-muted md:text-lg">
            Verified written stories and live courtyard video reviews from British Muslim families.
          </p>
        </div>
      </section>
      <CustomerReviewsGrid initialReviews={reviews} total={total} />
      <VideoReviews limit={3} showSeeMore />
      <CustomQuote />
    </>
  );
}
