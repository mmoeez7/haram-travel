import { HeartHandshake, ShieldCheck, Sparkles, Headset } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Trusted Islamic Travel Experts",
    text: "Experienced UK specialists who plan Umrah journeys with care from booking to return.",
  },
  {
    icon: Headset,
    title: "Dedicated Customer Support",
    text: "Friendly guidance whenever you need it — before travel, on the ground, and after return.",
  },
  {
    icon: Sparkles,
    title: "Transparent Pricing",
    text: "Clear package details upfront with no hidden charges or surprise extras.",
  },
  {
    icon: HeartHandshake,
    title: "Satisfaction Comes First",
    text: "Comfort, honesty, and a peaceful pilgrimage experience for every traveller.",
  },
];

export function PackageTrustStrip() {
  return (
    <section className="rounded-2xl border border-border bg-ivory px-4 py-6 md:px-6 md:py-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-charcoal">{title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted md:text-sm">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
