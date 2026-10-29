import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
    <section id="reviews" className="bg-[#faf6ef] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="Real British Muslim Stories"
          title="What Customers Say About Us!"
          description="Trusted by 18,500+ UK pilgrims across London, Manchester, and Birmingham. Read real verified experiences and watch live pilgrim videos from Makkah and Madinah."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="flex h-full flex-col rounded-[18px] bg-white px-6 pb-6 pt-5 shadow-[0_10px_28px_rgba(0,0,0,0.07)]"
            >
              <span
                className="block font-serif text-[64px] leading-[0.75] text-[#e0b83a]"
                aria-hidden
              >
                “
              </span>

              <h3 className="-mt-1 text-[17px] font-bold leading-snug text-[#111827]">
                {review.title}
              </h3>

              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[#6b7280]">
                {review.text}
              </p>

              <div className="mt-5 border-t border-[#ece7dc] pt-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efe6d4] font-serif text-lg font-bold text-[#1f2937]">
                    {review.initial}
                  </span>

                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#111827]">{review.name}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5 fill-[#e0b83a] text-[#e0b83a]"
                          />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f7ee] px-2.5 py-0.5 text-[11px] font-semibold text-[#1a7a4c]">
                        ✓ Verified Pilgrim
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
