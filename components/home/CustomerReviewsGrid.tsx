"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CardRail } from "@/components/ui/CardRail";
import { TestimonialCard } from "@/components/home/TestimonialCard";
import {
  TESTIMONIALS_PAGE_SIZE,
  type Testimonial,
  type TestimonialsPage,
} from "@/lib/testimonial-types";

type CustomerReviewsGridProps = {
  initialReviews: Testimonial[];
  total: number;
};

export function CustomerReviewsGrid({
  initialReviews,
  total,
}: CustomerReviewsGridProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = reviews.length < total;

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        offset: String(reviews.length),
        limit: String(TESTIMONIALS_PAGE_SIZE),
      });
      const res = await fetch(`/api/testimonials?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load more reviews");
      const data = (await res.json()) as TestimonialsPage;
      setReviews((prev) => {
        const seen = new Set(prev.map((r) => r.id));
        const next = data.reviews.filter((r) => !seen.has(r.id));
        return [...prev, ...next];
      });
    } catch {
      setError("Could not load more reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!reviews.length) return null;

  return (
    <section id="reviews" className="bg-[#faf6ef] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <Reveal className="mb-7 md:mb-10">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-2.5 inline-block rounded-full bg-gold-soft/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-dark md:mb-3 md:text-xs">
              Real British Muslim Stories
            </span>
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal md:text-4xl">
              What Customers Say About Us!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted md:mt-4 md:text-base">
              Trusted by 8000+ UK pilgrims across London, Manchester, and
              Birmingham. Read real verified experiences from British Muslim
              families.
            </p>
          </div>
        </Reveal>

        <CardRail cols="md:grid-cols-3">
          {reviews.map((review) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
        </CardRail>

        {hasMore ? (
          <div className="mt-8 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Loading…
                </>
              ) : (
                <>
                  See more
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </button>
            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
