import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedVideoReviews } from "@/lib/video-reviews";
import { VideoReviewsClient } from "@/components/home/VideoReviewsClient";

export async function VideoReviews() {
  const videos = await getPublishedVideoReviews();
  if (!videos.length) return null;

  return (
    <section className="bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Live Experience"
          title="Customer Umrah Video Reviews"
          description="Watch real UK pilgrims share their sacred journey experiences recorded live from the courtyards of Makkah and Madinah."
        />
        <VideoReviewsClient videos={videos} />
      </div>
    </section>
  );
}
