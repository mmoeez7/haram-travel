"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const videos = [
  {
    id: "T5TI-APFLsc",
    title: "Customer Umrah Experience",
    description: "Recorded Live in Madinah Munawwarah — British Pilgrim Review",
    cta: "Watch Story",
  },
  {
    id: "KB2xbX5nvxU",
    title: "Customer Review of Umrah (Series)",
    description: "Family Reviews & Sacred Journey Highlights — #umrah #islam",
    cta: "Watch Playlist",
  },
];

export function VideoReviews() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <section className="bg-cream py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="Live Experience"
          title="Customer Umrah Video Reviews"
          description="Watch real UK pilgrims share their sacred journey experiences recorded live from the courtyards of Makkah and Madinah."
        />

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {videos.map((video) => {
            const isPlaying = playingId === video.id;

            return (
              <article
                key={video.id}
                className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-video bg-charcoal">
                  {isPlaying ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                      title={video.title}
                      className="absolute inset-0 h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <Image
                        src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/25" />

                      <div className="absolute left-3 top-3 flex max-w-[75%] items-center gap-2 rounded-full bg-black/55 px-2.5 py-1.5 backdrop-blur-sm">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-charcoal">
                          HT
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-semibold text-white">
                            {video.title}
                          </p>
                          <p className="truncate text-[10px] text-white/75">Alharam Travel - UK</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPlayingId(video.id)}
                        className="absolute inset-0 flex items-center justify-center"
                        aria-label={`Play ${video.title}`}
                      >
                        <span className="flex h-[52px] w-[74px] items-center justify-center rounded-[14px] bg-[#ff0000] shadow-lg transition hover:scale-105 hover:bg-[#e60000]">
                          <svg viewBox="0 0 24 24" className="ml-0.5 h-7 w-7" aria-hidden>
                            <path fill="white" d="M8 5.14v13.72L19 12 8 5.14Z" />
                          </svg>
                        </span>
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-end justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <h3 className="text-[16px] font-bold text-charcoal">{video.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{video.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlayingId(video.id)}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#e8f7ee] px-3.5 py-2 text-xs font-semibold text-[#1a7a4c] transition hover:bg-[#d8f0e2]"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    {isPlaying ? "Playing…" : video.cta}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
