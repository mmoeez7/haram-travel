"use client";

import { useEffect, useState } from "react";
import { Phone, Search } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { SITE, telUrl, whatsappUrl } from "@/lib/constants";

const findPackageHref = "/#package-matcher";

function onFindPackageClick(event: React.MouseEvent<HTMLAnchorElement>) {
  const path = window.location.pathname;
  if (path !== "/" && path !== "") return;
  const target = document.getElementById("package-matcher");
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

const floatBtn =
  "group flex items-center overflow-hidden rounded-full shadow-lg transition-all duration-700 ease-in-out";
const floatBtnMd =
  "h-11 max-w-11 hover:max-w-[260px] focus-visible:max-w-[260px]";
const floatBtnLg =
  "h-14 max-w-14 hover:max-w-[280px] focus-visible:max-w-[280px]";

export function FloatingWidgets() {
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(Boolean(entry?.isIntersecting)),
      { root: null, threshold: 0.05, rootMargin: "0px 0px -48px 0px" },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Mobile: sticky bottom action bar — hide when footer is on screen so links stay clickable */}
      <div
        className={`float-in fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-cream/95 px-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm transition duration-200 md:hidden ${
          footerVisible
            ? "pointer-events-none translate-y-full opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          <a
            href={telUrl()}
            className="inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-call-border bg-call text-xs font-semibold text-call-border"
            aria-label={`Call ${SITE.phone}`}
          >
            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Call
          </a>
          <a
            href={findPackageHref}
            onClick={onFindPackageClick}
            className="inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-gradient-to-l from-gold to-gold-dark px-1 text-[11px] font-semibold leading-tight text-charcoal"
            aria-label="Find Package"
          >
            <Search className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Find Package
          </a>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-1 rounded-lg bg-whatsapp text-xs font-semibold text-white"
            aria-label="Chat on WhatsApp"
          >
            <FaWhatsapp className="h-3.5 w-3.5 shrink-0" aria-hidden />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Desktop: call sits on the left, same size as WhatsApp */}
      <div
        className={`float-in fixed bottom-4 left-5 z-40 hidden transition duration-200 md:block ${
          footerVisible
            ? "pointer-events-none translate-y-3 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <a
          href={telUrl()}
          className={`${floatBtn} ${floatBtnLg} border border-call-border bg-call text-call-border hover:border-call-hover hover:bg-call-hover hover:text-white [&_svg]:text-call-border hover:[&_svg]:text-white`}
          aria-label={`Call ${SITE.phone}`}
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center">
            <Phone className="h-6 w-6" />
          </span>
          <span className="whitespace-nowrap pr-4 text-sm font-semibold opacity-0 transition-opacity duration-700 delay-100 group-hover:opacity-100 group-focus-visible:opacity-100">
            Call {SITE.phone}
          </span>
        </a>
      </div>

      {/* Desktop / tablet: floating expand-on-hover buttons */}
      <div
        className={`float-in fixed right-5 bottom-4 z-40 hidden flex-col items-end gap-2.5 transition duration-200 md:flex ${
          footerVisible
            ? "pointer-events-none translate-y-3 opacity-0"
            : "translate-y-0 opacity-100"
        }`}
      >
        <a
          href={findPackageHref}
          onClick={onFindPackageClick}
          className={`${floatBtn} ${floatBtnMd} bg-gradient-to-l from-gold to-gold-dark text-charcoal`}
          aria-label="Find Package"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center">
            <Search className="h-4 w-4" />
          </span>
          <span className="whitespace-nowrap pr-4 text-xs font-semibold opacity-0 transition-opacity duration-700 delay-100 group-hover:opacity-100 group-focus-visible:opacity-100">
            Find Package
          </span>
        </a>

        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={`${floatBtn} ${floatBtnLg} bg-whatsapp text-white hover:bg-whatsapp-dark`}
          aria-label="Chat on WhatsApp"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center">
            <FaWhatsapp className="h-7 w-7" />
          </span>
          <span className="whitespace-nowrap pr-4 text-sm font-semibold opacity-0 transition-opacity duration-700 delay-100 group-hover:opacity-100 group-focus-visible:opacity-100">
            Chat on WhatsApp
          </span>
        </a>
      </div>
    </>
  );
}
