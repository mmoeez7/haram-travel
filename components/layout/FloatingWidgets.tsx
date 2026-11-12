import { Phone, Ticket } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";

const voucherHref = whatsappUrl(
  "Assalamu Alaikum, I'd like to claim the £50pp voucher."
);

const floatBtn =
  "group flex h-10 max-w-10 items-center overflow-hidden rounded-full shadow-lg transition-all duration-700 ease-in-out hover:max-w-[260px] focus-visible:max-w-[260px] md:h-11 md:max-w-11";

export function FloatingWidgets() {
  return (
    <>
      {/* Mobile: sticky bottom action bar */}
      <div className="float-in fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-cream/95 px-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          <a
            href={telUrl()}
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg border border-call-border bg-call text-sm font-semibold text-call-border"
            aria-label={`Call ${SITE.phone}`}
          >
            <Phone className="h-4 w-4 shrink-0" aria-hidden />
            Call
          </a>
          <a
            href={voucherHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-l from-gold to-gold-dark text-sm font-semibold text-charcoal"
            aria-label="Claim £50pp Voucher"
          >
            <Ticket className="h-4 w-4 shrink-0" aria-hidden />
            Voucher
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-whatsapp text-sm font-semibold text-white"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp className="h-4 w-4 shrink-0" aria-hidden />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Desktop / tablet: floating expand-on-hover buttons */}
      <div className="float-in fixed right-5 bottom-4 z-40 hidden flex-col items-end gap-2.5 md:flex">
        <a
          href={voucherHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${floatBtn} bg-gradient-to-l from-gold to-gold-dark text-charcoal`}
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
          className={`${floatBtn} border border-call-border bg-call text-call-border hover:border-call-hover hover:bg-call-hover hover:text-white [&_svg]:text-call-border hover:[&_svg]:text-white`}
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
          className={`${floatBtn} bg-whatsapp text-white hover:bg-whatsapp-dark`}
          aria-label="Chat on WhatsApp"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center">
            <FaWhatsapp className="h-4 w-4" />
          </span>
          <span className="whitespace-nowrap pr-4 text-xs font-semibold opacity-0 transition-opacity duration-700 delay-100 group-hover:opacity-100 group-focus-visible:opacity-100">
            Chat on WhatsApp
          </span>
        </a>
      </div>
    </>
  );
}
