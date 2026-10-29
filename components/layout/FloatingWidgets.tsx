import { MessageCircle, Phone, Ticket } from "lucide-react";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";

const baseBtn =
  "group flex h-10 max-w-10 items-center overflow-hidden rounded-full shadow-lg transition-all duration-700 ease-in-out hover:max-w-[260px] focus-visible:max-w-[260px] md:h-11 md:max-w-11";

export function FloatingWidgets() {
  return (
    <div className="float-in fixed right-2.5 bottom-3 z-40 flex flex-col items-end gap-2 md:right-5 md:bottom-4 md:gap-2.5">
      <a
        href={whatsappUrl("Assalamu Alaikum, I'd like to claim the £50pp voucher.")}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseBtn} bg-gradient-to-l from-gold to-gold-dark text-charcoal`}
        aria-label="Claim £50pp Voucher"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center md:h-11 md:w-11">
          <Ticket className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
        <span className="flex h-10 w-10 shrink-0 items-center justify-center md:h-11 md:w-11">
          <Phone className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
        <span className="flex h-10 w-10 shrink-0 items-center justify-center md:h-11 md:w-11">
          <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </span>
        <span className="whitespace-nowrap pr-4 text-xs font-semibold opacity-0 transition-opacity duration-700 delay-100 group-hover:opacity-100 group-focus-visible:opacity-100">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
