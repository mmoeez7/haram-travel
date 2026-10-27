import { MessageCircle, Phone, Ticket } from "lucide-react";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";

export function FloatingWidgets() {
  return (
    <div className="fixed right-3 bottom-4 z-40 flex flex-col items-end gap-2 md:right-5">
      <a
        href={whatsappUrl("Assalamu Alaikum, I'd like to claim the £50pp voucher.")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-gold-dark"
      >
        <Ticket className="h-4 w-4" />
        Claim £50pp Voucher
      </a>
      <a
        href={telUrl()}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-xs font-semibold text-charcoal shadow-lg transition hover:border-gold"
      >
        <Phone className="h-4 w-4 text-gold" />
        Call {SITE.phone}
      </a>
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition hover:bg-whatsapp-dark"
      >
        <MessageCircle className="h-4 w-4" />
        Chat on WhatsApp
      </a>
    </div>
  );
}
