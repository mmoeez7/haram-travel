import Image from "next/image";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/testimonial-types";

export function TestimonialCard({ review }: { review: Testimonial }) {
  return (
    <article className="card-lift flex h-full flex-col rounded-2xl bg-white px-4 pb-5 pt-4 shadow-[0_10px_28px_rgba(0,0,0,0.07)] md:rounded-[18px] md:px-6 md:pb-6 md:pt-5">
      <span
        className="block font-serif text-[48px] leading-[0.75] text-[#e0b83a] md:text-[64px]"
        aria-hidden
      >
        “
      </span>

      <h3 className="-mt-1 line-clamp-2 min-h-[2.5rem] text-[15px] font-bold leading-snug text-[#111827] md:min-h-[2.75rem] md:text-[17px]">
        {review.title}
      </h3>

      <p className="mt-2.5 h-[6.5rem] overflow-y-auto pr-1 text-[13px] leading-relaxed text-[#6b7280] md:mt-3 md:h-[7.125rem] md:text-[14px]">
        {review.text}
      </p>

      <div className="mt-auto border-t border-[#ece7dc] pt-3.5 md:pt-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#efe6d4] font-serif text-base font-bold text-[#1f2937] md:h-11 md:w-11 md:text-lg">
            {review.initial}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-[#111827] md:text-[14px]">
              {review.name}
            </p>
            <div className="mt-1 flex items-center gap-0.5 md:mt-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3 w-3 fill-[#e0b83a] text-[#e0b83a] md:h-3.5 md:w-3.5"
                />
              ))}
            </div>
          </div>
        </div>

        <a
          href="https://www.trustpilot.com/review/haramtravel.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-3.5 flex w-full items-center justify-between gap-3 rounded-xl bg-[#191919] px-3.5 py-2.5 transition hover:bg-black hover:shadow-[0_8px_20px_rgba(0,182,122,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00b67a]"
          aria-label="Leave a review on Trustpilot"
        >
          <span className="text-[11px] font-semibold tracking-wide text-white/75 transition group-hover:text-white md:text-xs">
            Review us
          </span>
          <Image
            src="/images/trustpilot.png"
            alt="Trustpilot"
            width={100}
            height={24}
            className="h-4 w-auto object-contain transition group-hover:scale-[1.03] md:h-[18px]"
          />
        </a>
      </div>
    </article>
  );
}
