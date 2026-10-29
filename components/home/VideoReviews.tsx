"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardRail } from "@/components/ui/CardRail";

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
    <section className="bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="Live Experience"
          title="Customer Umrah Video Reviews"
          description="Watch real UK pilgrims share their sacred journey experiences recorded live from the courtyards of Makkah and Madinah."
        />

        <div className="mx-auto max-w-5xl">
          <CardRail cols="md:grid-cols-2">
            {videos.map((video) => {
              const isPlaying = playingId === video.id;

              return (
                <article
                  key={video.id}
                  className="card-lift overflow-hidden rounded-xl bg-white shadow-[0_10px_28px_rgba(0,0,0,0.08)] md:rounded-2xl"
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
                          sizes="(max-width: 768px) 80vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-black/25" />

                        <div className="absolute left-2.5 top-2.5 flex max-w-[80%] items-center gap-2 rounded-full bg-black/55 px-2 py-1 backdrop-blur-sm md:left-3 md:top-3 md:px-2.5 md:py-1.5">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-charcoal md:h-7 md:w-7 md:text-[10px]">
                            HT
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[10px] font-semibold text-white md:text-[11px]">
                              {video.title}
                            </p>
                            <p className="truncate text-[9px] text-white/75 md:text-[10px]">
                              Alharam Travel - UK
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setPlayingId(video.id)}
                          className="absolute inset-0 flex items-center justify-center"
                          aria-label={`Play ${video.title}`}
                        >
                          <span className="flex h-10 w-14 items-center justify-center rounded-xl bg-[#ff0000] shadow-lg transition hover:scale-105 hover:bg-[#e60000] md:h-[52px] md:w-[74px] md:rounded-[14px]">
                            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 md:h-7 md:w-7" aria-hidden>
                              <path fill="white" d="M8 5.14v13.72L19 12 8 5.14Z" />
                            </svg>
                          </span>
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 p-3.5 sm:flex-row sm:items-end sm:justify-between sm:gap-4 md:p-5">
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-charcoal md:text-[16px]">
                        {video.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted md:text-sm">
                        {video.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPlayingId(video.id)}
                      className="inline-flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-[#e8f7ee] px-3 py-1.5 text-[11px] font-semibold text-[#1a7a4c] transition hover:bg-[#d8f0e2] sm:self-auto md:px-3.5 md:py-2 md:text-xs"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      {isPlaying ? "Playing…" : video.cta}
                    </button>
                  </div>
                </article>
              );
            })}
          </CardRail>
        </div>
      </div>
    </section>
  );
}
