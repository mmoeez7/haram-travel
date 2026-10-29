import { MessageCircle, Phone, Ticket } from "lucide-react";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";

const baseBtn =
  "group flex h-11 max-w-11 items-center overflow-hidden rounded-full shadow-lg transition-all duration-700 ease-in-out hover:max-w-[260px] focus-visible:max-w-[260px]";

export function FloatingWidgets() {
  return (
    <div className="fixed right-3 bottom-4 z-40 flex flex-col items-end gap-2.5 md:right-5">
      <a
        href={whatsappUrl("Assalamu Alaikum, I'd like to claim the £50pp voucher.")}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseBtn} bg-gradient-to-l from-gold to-gold-dark text-charcoal`}
        aria-label="Claim £50pp Voucher"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center">
          <Ticket className="h-4 w-4" />
        </span>
        <span className="whitespace-nowrap pr-4 text-xs font-semibold opacity-0 transition-opacity duration-700 delay-100 group-hover:opacity-100 group-focus-visible:opacity-100">
          Claim £50pp Voucher
        </span>
      </a>

      <a
        href={telUrl()}
        className={`${baseBtn} border border-call-border bg-call text-call-border hover:border-call-hover hover:bg-call-hover hover:text-white [&_svg]:text-call-border hover:[&_svg]:text-white`}
        aria-label={`Call ${SITE.phone}`}
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center">
          <Phone className="h-4 w-4" />
        </span>
        <span className="whitespace-nowrap pr-4 text-xs font-semibold opacity-0 transition-opacity duration-700 delay-100 group-hover:opacity-100 group-focus-visible:opacity-100">
          Call {SITE.phone}
        </span>
      </a>

      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseBtn} bg-whatsapp text-white hover:bg-whatsapp-dark`}
        aria-label="Chat on WhatsApp"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center">
          <MessageCircle className="h-4 w-4" />
        </span>
        <span className="whitespace-nowrap pr-4 text-xs font-semibold opacity-0 transition-opacity duration-700 delay-100 group-hover:opacity-100 group-focus-visible:opacity-100">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
