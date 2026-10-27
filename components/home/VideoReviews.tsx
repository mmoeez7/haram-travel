import { Play } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const videos = [
  { title: "Customer Review — Family Umrah Experience", meta: "Makkah Courtyard" },
  { title: "Customer Review — First-Time Pilgrims", meta: "Madinah Stay" },
  { title: "Customer Review — Elderly Parents Package", meta: "Walking Distance Hotels" },
  { title: "Customer Review — Ramadan Journey", meta: "Last 10 Nights" },
];

export function VideoReviews() {
  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          title="Customer Umrah Video Reviews"
          description="Watch real UK pilgrims share their sacred journey experiences recorded live from the courtyards of Makkah and Madinah."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {videos.map((video) => (
            <article
              key={video.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-forest"
            >
              <div className="flex aspect-video flex-col items-center justify-center bg-gradient-to-br from-forest to-[#0f241f] p-6 text-center text-white">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-charcoal transition group-hover:scale-105">
                  <Play className="h-6 w-6 fill-charcoal" />
                </div>
                <h3 className="font-display text-lg font-semibold">{video.title}</h3>
                <p className="mt-2 text-sm text-white/70">{video.meta}</p>
                <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold-soft">
                  Watch on YouTube
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
