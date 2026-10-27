import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";

const faqs = [
  {
    question: "What is included in every Haram Travel Umrah package?",
    answer:
      "Return flights from major UK airports (London, Manchester, Birmingham), hotel accommodation in Makkah and Madinah, Saudi Umrah visa processing, airport and intercity transfers, and 24/7 UK & Saudi support.",
  },
  {
    question: "How does the £99 deposit and installment plan work?",
    answer:
      "Lock your preferred dates and hotel category with a £99 per person deposit. Spread the remaining balance with 0% interest monthly installments until two weeks before departure.",
  },
  {
    question: "How quickly is the Saudi Umrah visa issued?",
    answer:
      "Once complete passenger documents are received, visas are typically processed within 24–48 hours through the official Ministry of Hajj & Umrah channels.",
  },
  {
    question: "Can you accommodate elderly pilgrims or wheelchair requests?",
    answer:
      "Yes. We prioritise walking-distance courtyard hotels and can arrange wheelchair assistance, private transfers, and ground support tailored for elderly or mobility-needs pilgrims.",
  },
];

export function FAQ() {
  return (
    <section className="bg-ivory py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-4 lg:px-6">
        <SectionHeading
          title="Frequently Asked Questions"
          description="Clear answers to the most common queries from UK pilgrims."
        />
        <Accordion items={faqs} />
      </div>
    </section>
  );
}
