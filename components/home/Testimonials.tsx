import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardRail } from "@/components/ui/CardRail";

const reviews = [
  {
    title: "Exceptional Experience from Start to End!",
    name: "Asma Faisal",
    initial: "A",
    text: "Every detail was handled with care — hotels truly near the Haram, and the UK team stayed reachable throughout. Our parents felt safe and supported from departure to return.",
  },
  {
    title: "Booking with them was a Fuss-Free Process",
    name: "Fiza Yousefzai",
    initial: "F",
    text: "Clear pricing, ATOL protection explained properly, and our elderly parents managed the walking distance easily. The advisors were honest and never pushed unnecessary upgrades.",
  },
  {
    title: "I am 100% Satisfied with Haram Travel",
    name: "Alizeh Kamran",
    initial: "A",
    text: "From deposit to return, the advisors were honest and responsive. Highly recommend for UK families looking for a peaceful, well-organised Umrah journey.",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="bg-[#faf6ef] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="Real British Muslim Stories"
          title="What Customers Say About Us!"
          description="Trusted by 18,500+ UK pilgrims across London, Manchester, and Birmingham. Read real verified experiences and watch live pilgrim videos from Makkah and Madinah."
        />

        <CardRail cols="md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="card-lift flex h-full flex-col rounded-2xl bg-white px-4 pb-5 pt-4 shadow-[0_10px_28px_rgba(0,0,0,0.07)] md:rounded-[18px] md:px-6 md:pb-6 md:pt-5"
            >
              <span
                className="block font-serif text-[48px] leading-[0.75] text-[#e0b83a] md:text-[64px]"
                aria-hidden
              >
                “
              </span>

              <h3 className="-mt-1 text-[15px] font-bold leading-snug text-[#111827] md:text-[17px]">
                {review.title}
              </h3>

              <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-[#6b7280] md:mt-3 md:text-[14px]">
                {review.text}
              </p>

              <div className="mt-4 border-t border-[#ece7dc] pt-3.5 md:mt-5 md:pt-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#efe6d4] font-serif text-base font-bold text-[#1f2937] md:h-11 md:w-11 md:text-lg">
                    {review.initial}
                  </span>

                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[#111827] md:text-[14px]">
                      {review.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 md:mt-1.5 md:gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-[#e0b83a] text-[#e0b83a] md:h-3.5 md:w-3.5"
                          />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f7ee] px-2 py-0.5 text-[10px] font-semibold text-[#1a7a4c] md:px-2.5 md:text-[11px]">
                        ✓ Verified Pilgrim
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </CardRail>
      </div>
    </section>
  );
}
