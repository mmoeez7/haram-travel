import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { getPublishedVideoReviews } from "@/lib/video-reviews";
import { VideoReviewsClient } from "@/components/home/VideoReviewsClient";

type VideoReviewsProps = {
  /** Cap videos shown (home teaser). Omit to show all. */
  limit?: number;
  /** Show See more CTA to the full listing page. */
  showSeeMore?: boolean;
};

export async function VideoReviews({
  limit,
  showSeeMore = false,
}: VideoReviewsProps = {}) {
  const videos = await getPublishedVideoReviews(limit);
  if (!videos.length) return null;

  return (
    <section id="video-reviews" className="scroll-mt-24 bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <Reveal className="mb-7 md:mb-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-2.5 inline-block rounded-full bg-gold-soft/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-dark md:mb-3 md:text-xs">
              Live Experience
            </span>
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal md:text-4xl">
              Customer Umrah Video Reviews
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:mt-4 md:text-base">
              Watch real UK pilgrims share their sacred journey experiences recorded live
              from the courtyards of Makkah and Madinah.
            </p>
          </div>
        </Reveal>
        <VideoReviewsClient videos={videos} />
        {showSeeMore ? (
          <div className="mt-8 flex justify-center">
            <Link
              href="/customer-video-reviews"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-gold hover:text-gold-dark"
            >
              See more
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
