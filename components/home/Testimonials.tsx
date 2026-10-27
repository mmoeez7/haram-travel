import { Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const reviews = [
  {
    title: "Exceptional Experience from Start to End.",
    name: "Asma Faisal",
    text: "Every detail was handled with care — hotels truly near the Haram, and the UK team stayed reachable throughout.",
  },
  {
    title: "Booking with Them Was a Fuss-Free Process.",
    name: "Fiza Yousafzai",
    text: "Clear pricing, ATOL protection explained properly, and our elderly parents managed the walking distance easily.",
  },
  {
    title: "I Am 100% Satisfied with Haram Travel.",
    name: "Aizah Kamran",
    text: "From deposit to return, the advisors were honest and responsive. Highly recommend for UK families.",
  },
];

export function Testimonials() {
  return (
    <section id="reviews" className="bg-ivory py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="Real British Muslim Stories"
          title="What Customers Say About Us!"
          description="Trusted by 18,500+ UK pilgrims across London, Manchester, and Birmingham. Read verified experiences from Makkah and Madinah."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="rounded-2xl border border-border bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold" />
                ))}
              </div>
              <h3 className="font-display text-lg font-semibold text-charcoal">{review.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{review.text}</p>
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-semibold text-charcoal">{review.name}</p>
                <p className="text-xs text-muted">Verified Pilgrim</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
