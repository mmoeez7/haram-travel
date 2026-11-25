import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CardRail } from "@/components/ui/CardRail";
import { TestimonialCard } from "@/components/home/TestimonialCard";
import { SITE } from "@/lib/constants";
import { getTestimonials } from "@/lib/testimonials";

type TestimonialsProps = {
  /** Cap cards shown (home teaser). Omit to show all. */
  limit?: number;
  /** Show See more CTA to the full listing page. */
  showSeeMore?: boolean;
};

export async function Testimonials({
  limit,
  showSeeMore = false,
}: TestimonialsProps = {}) {
  const reviews = await getTestimonials(limit);
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
              Trusted by {SITE.pilgrimsGuided} UK pilgrims across London, Manchester, and Birmingham.
              Read real verified experiences from British Muslim families.
            </p>
          </div>
        </Reveal>

        <CardRail cols="md:grid-cols-3">
          {reviews.map((review) => (
            <TestimonialCard key={review.id} review={review} />
          ))}
        </CardRail>

        {showSeeMore ? (
          <div className="mt-8 flex justify-center">
            <Link
              href="/customer-reviews"
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
