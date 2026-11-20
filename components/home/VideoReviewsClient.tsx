"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import type { PublicVideoReview } from "@/lib/video-review-types";

export function VideoReviewsClient({
  videos,
}: {
  videos: PublicVideoReview[];
}) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
      {videos.map((video, index) => {
        const isPlaying = playingId === video.youtubeId;
        const thumbSrc = `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`;

        return (
          <Reveal
            key={video.id}
            delay={Math.min(index * 90, 360)}
            className="w-[calc(50%-0.375rem)] max-w-[200px] shrink-0 sm:w-[200px] sm:max-w-none md:w-[220px]"
          >
            <article className="card-lift overflow-hidden rounded-xl shadow-[0_10px_28px_rgba(0,0,0,0.08)] md:rounded-2xl">
              <div className="relative aspect-[9/16] overflow-hidden">
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                    title={video.title}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <Image
                      src={thumbSrc}
                      alt=""
                      fill
                      aria-hidden
                      className="scale-110 object-cover blur-2xl"
                      sizes="(max-width: 640px) 45vw, 220px"
                    />
                    <Image
                      src={thumbSrc}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 45vw, 220px"
                    />

                    <div className="absolute left-2 top-2 right-2 flex items-center gap-1.5 rounded-full bg-black/40 px-1.5 py-1 backdrop-blur-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold text-[8px] font-bold text-charcoal">
                        HT
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[9px] font-semibold text-white">
                          {video.title}
                        </p>
                        <p className="truncate text-[8px] text-white/75">
                          Alharam Travel - UK
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPlayingId(video.youtubeId)}
                      className="absolute inset-0 flex items-center justify-center"
                      aria-label={`Play ${video.title}`}
                    >
                      <span className="flex h-8 w-11 items-center justify-center rounded-lg bg-[#ff0000] shadow-lg transition hover:scale-105 hover:bg-[#e60000]">
                        <svg
                          viewBox="0 0 24 24"
                          className="ml-0.5 h-4 w-4"
                          aria-hidden
                        >
                          <path fill="white" d="M8 5.14v13.72L19 12 8 5.14Z" />
                        </svg>
                      </span>
                    </button>
                  </>
                )}
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
