import Image from "next/image";
import { SITE } from "@/lib/constants";

export const TRUSTPILOT_REVIEW_URL = "https://www.trustpilot.com/review/haramtravel.uk";

function TrustpilotStars({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-5 w-5" : "h-6 w-6 sm:h-7 sm:w-7";
  const star = size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5 sm:h-4 sm:w-4";

  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={`inline-flex ${box} items-center justify-center rounded-[3px] bg-[#00b67a]`}
        >
          <svg viewBox="0 0 24 24" className={`${star} fill-white`} aria-hidden>
            <path d="M12 2.5l2.9 6.1 6.7.9-4.9 4.6 1.2 6.6L12 17.8 6.1 20.7l1.2-6.6L2.4 9.5l6.7-.9L12 2.5z" />
          </svg>
        </span>
      ))}
    </div>
  );
}

export function TrustpilotBanner() {
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#00b67a]/35 bg-white px-4 py-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5">
      <div>
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <TrustpilotStars />
          <p className="font-display text-xl font-semibold text-charcoal sm:text-2xl">
            {SITE.trustpilotRating}{" "}
            <span className="text-base font-medium text-muted sm:text-lg">/ 5</span>
          </p>
        </div>
        <p className="mt-1.5 text-sm text-muted">
          Rated Excellent on <span className="font-semibold text-charcoal">Trustpilot</span>
        </p>
      </div>

      <a
        href={TRUSTPILOT_REVIEW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#00b67a]/50 bg-white px-4 py-2.5 text-sm font-semibold text-[#00b67a] transition hover:border-[#00b67a] hover:bg-[#00b67a]/5"
      >
        Review us on Trustpilot
        <Image
          src="/images/trustpilot.png"
          alt=""
          width={88}
          height={22}
          className="h-4 w-auto object-contain"
        />
      </a>
    </div>
  );
}
