import {
  ClipboardList,
  FileCheck2,
  Car,
  Landmark,
  Clock3,
  BadgeCheck,
  Sparkles,
  Headset,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CardRail } from "@/components/ui/CardRail";

const steps = [
  {
    num: "01",
    title: "Bespoke Itinerary & GDS Flight Match",
    text: "Tailored dates, family configurations, and confirmed seats via live GDS airline systems.",
    badge: "Response within 15 mins",
    badgeTone: "bg-red-50 text-call-border",
    BadgeIcon: Clock3,
    Icon: ClipboardList,
    iconTone: "text-[#c47a3a]",
    highlighted: false,
  },
  {
    num: "02",
    title: "Saudi Visa & 40-Page Travel Pack",
    text: "Official Ministry of Hajj & Umrah visas processed within 24–48 hours, plus medical cover and dua booklet.",
    badge: "100% Guaranteed MoFA Approval",
    badgeTone: "bg-[#e8f1fb] text-[#2f6fed]",
    BadgeIcon: BadgeCheck,
    Icon: FileCheck2,
    iconTone: "text-[#2f6fed]",
    highlighted: false,
  },
  {
    num: "03",
    title: "VIP Terminal Greeting & Private GMC",
    text: "Touchdown in Jeddah or Madinah with private chauffeur, chilled Zamzam, and high-speed 5G SIMs.",
    badge: "Chilled Private AC Transfers",
    badgeTone: "bg-teal-50 text-teal-700",
    BadgeIcon: Sparkles,
    Icon: Car,
    iconTone: "text-teal-600",
    highlighted: false,
  },
  {
    num: "04",
    title: "Haram Footsteps & Guided Ziyarat",
    text: "Handpicked courtyard hotels with 24/7 UK & Saudi support throughout your sacred stay.",
    badge: "24/7 UK & Saudi Care",
    badgeTone: "bg-emerald-50 text-emerald-700",
    BadgeIcon: Headset,
    Icon: Landmark,
    iconTone: "text-gold-dark",
    highlighted: true,
  },
];

export function Steps() {
  return (
    <section id="hotel-guide" className="bg-cream py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <SectionHeading
          eyebrow="The Sacred Road to Makkah"
          title="From London Doorstep to the Mataf in 4 Steps"
          description="A clear, guided process so you can focus on worship while we handle every detail."
        />

        <div className="relative">
          <div
            className="pointer-events-none absolute top-[4.5rem] right-[8%] left-[8%] hidden h-[3px] rounded-full bg-[#7cb89a] xl:block"
            aria-hidden
          />

          <CardRail cols="md:grid-cols-2 xl:grid-cols-4">
            {steps.map(
              ({
                num,
                title,
                text,
                badge,
                badgeTone,
                BadgeIcon,
                Icon,
                iconTone,
                highlighted,
              }) => (
                <article
                  key={num}
                  className={`card-lift relative flex h-full flex-col rounded-xl bg-white p-4 shadow-sm md:rounded-2xl md:p-6 ${
                    highlighted ? "border-2 border-gold" : "border border-border"
                  }`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3 md:mb-5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-l from-gold to-gold-dark text-xs font-bold text-charcoal shadow-sm md:h-9 md:w-9 md:text-sm">
                      {num}
                    </span>
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-cream md:h-10 md:w-10 ${iconTone}`}
                    >
                      <Icon className="h-4 w-4 md:h-5 md:w-5" />
                    </span>
                  </div>

                  <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal md:text-lg">
                    {title}
                  </h3>
                  <p className="mt-2.5 flex-1 text-xs leading-relaxed text-muted md:mt-3 md:text-sm">
                    {text}
                  </p>

                  <span
                    className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold md:mt-5 md:px-3 md:py-1.5 md:text-xs ${badgeTone}`}
                  >
                    <BadgeIcon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    {badge}
                  </span>
                </article>
              )
            )}
          </CardRail>
        </div>
      </div>
    </section>
  );
}
