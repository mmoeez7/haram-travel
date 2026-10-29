import {
  ArrowRight,
  Building2,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Zap,
} from "lucide-react";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";
import { CardRail } from "@/components/ui/CardRail";

const cards = [
  {
    badge: {
      icon: Zap,
      label: "Fastest Channel • 15 Min Response",
      className: "bg-[#e8f7ef] text-[#0f8f66]",
    },
    icon: MessageCircle,
    iconBox: "bg-[#e8f7ef] text-[#00b374] border-[#b8e6d0]",
    title: "WhatsApp Live Concierge",
    text: "Chat directly with a senior UK pilgrimage consultant. Get instant customized hotel rates, GDS flight options, and visa advice.",
    detail: SITE.whatsappDisplay,
    detailHref: whatsappUrl(),
    cta: {
      href: whatsappUrl(),
      label: "Chat on WhatsApp Now",
      icon: MessageCircle,
      iconClass: "text-white",
      className:
        "bg-[#00b374] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#009a64] hover:shadow-md active:translate-y-0",
      external: true,
    },
  },
  {
    badge: {
      icon: Phone,
      label: "24/7 UK Booking Line",
      className: "bg-[#ececf3] text-[#4b5563]",
    },
    icon: PhoneCall,
    iconBox: "bg-[#fee2e2] text-[#dc2626] border-[#fecaca]",
    title: "Direct Telephone Helpline",
    text: "Speak to our dedicated UK advisors for instant flight queries, wheelchair bookings, group arrangements, and deposit locks.",
    detail: SITE.phone,
    detailHref: telUrl(),
    cta: {
      href: telUrl(),
      label: `Call ${SITE.phone}`,
      icon: Phone,
      iconClass: "text-[#ef4444]",
      className:
        "bg-[#12181b] text-white shadow-sm hover:-translate-y-0.5 hover:bg-black hover:shadow-md active:translate-y-0",
      external: false,
    },
  },
  {
    badge: {
      icon: Building2,
      label: "London Walk-In Office",
      className: "bg-[#f3ebd8] text-[#8a7340]",
    },
    icon: MapPin,
    iconBox: "bg-[#fee2e2] text-[#dc2626] border-[#fecaca]",
    title: "London Head Office",
    text: "Visit our Whitechapel consultation rooms for private family appointments. Located 3 minutes from East London Mosque.",
    detail: "142 Whitechapel Rd, London E1 1JE",
    detailHref: "https://maps.google.com/?q=142+Whitechapel+Road+London+E1+1JE",
    cta: {
      href: "https://maps.google.com/?q=142+Whitechapel+Road+London+E1+1JE",
      label: "Get Google Maps Directions",
      icon: MapPin,
      iconClass: "text-[#dc2626]",
      className:
        "border border-[#d4c4a0] bg-[#faf6ef] text-charcoal shadow-sm hover:-translate-y-0.5 hover:border-gold hover:bg-white hover:shadow-md active:translate-y-0",
      external: true,
    },
  },
];

export function ContactCards() {
  return (
    <CardRail cols="md:grid-cols-3">
      {cards.map((card) => {
        const BadgeIcon = card.badge.icon;
        const Icon = card.icon;
        const CtaIcon = card.cta.icon;

        return (
          <article
            key={card.title}
            className="card-lift flex h-full flex-col rounded-2xl border border-border bg-[#faf8f3] p-5 md:p-6"
          >
            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide md:text-[11px] ${card.badge.className}`}
            >
              <BadgeIcon className="h-3 w-3" />
              {card.badge.label}
            </span>

            <div
              className={`mt-4 flex h-12 w-12 items-center justify-center rounded-xl border md:h-14 md:w-14 ${card.iconBox}`}
            >
              <Icon className="h-6 w-6 md:h-7 md:w-7" />
            </div>

            <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-wide text-[#001a26] md:text-xl">
              {card.title}
            </h3>

            <p className="mt-3 flex-1 text-sm leading-relaxed text-[#5c5650]">{card.text}</p>

            <a
              href={card.detailHref}
              target={card.cta.external ? "_blank" : undefined}
              rel={card.cta.external ? "noopener noreferrer" : undefined}
              className="mt-4 text-sm font-bold text-[#001a26] transition hover:text-gold-dark"
            >
              {card.detail}
            </a>

            <a
              href={card.cta.href}
              target={card.cta.external ? "_blank" : undefined}
              rel={card.cta.external ? "noopener noreferrer" : undefined}
              className={`group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 ${card.cta.className}`}
            >
              <CtaIcon className={`h-4 w-4 ${card.cta.iconClass}`} />
              {card.cta.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </article>
        );
      })}
    </CardRail>
  );
}
