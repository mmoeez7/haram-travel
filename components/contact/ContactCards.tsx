import { MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

const cards = [
  {
    icon: MessageCircle,
    title: "WhatsApp Live Concierge",
    text: "Typical response within 15 minutes during UK business hours.",
    action: {
      href: whatsappUrl(),
      label: "Chat on WhatsApp Now",
      variant: "whatsapp" as const,
      external: true,
    },
    detail: SITE.whatsappDisplay,
  },
  {
    icon: Phone,
    title: "Direct Telephone Helpline",
    text: "24/7 UK booking line for urgent itinerary and family quotes.",
    action: {
      href: telUrl(),
      label: `Call ${SITE.phone}`,
      variant: "dark" as const,
      external: false,
    },
    detail: SITE.phone,
  },
  {
    icon: MapPin,
    title: "London Head Office",
    text: "Walk-in office near the London Muslim Centre — appointments welcome.",
    action: {
      href: "https://maps.google.com/?q=142+Whitechapel+Road+London+E1+1JE",
      label: "Get Google Maps Directions",
      variant: "outline" as const,
      external: true,
    },
    detail: SITE.address,
  },
];

export function ContactCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {cards.map(({ icon: Icon, title, text, action, detail }) => (
        <article
          key={title}
          className="flex flex-col rounded-2xl border border-border bg-white p-6"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft/50 text-gold-dark">
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-semibold text-charcoal">{title}</h3>
          <p className="mt-2 flex-1 text-sm text-muted">{text}</p>
          <p className="mt-3 text-sm font-medium text-charcoal">{detail}</p>
          <Button
            href={action.href}
            variant={action.variant}
            className="mt-5 w-full"
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noopener noreferrer" : undefined}
          >
            {action.label}
          </Button>
        </article>
      ))}
    </div>
  );
}
