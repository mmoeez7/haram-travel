"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement: (element: HTMLElement, force?: boolean) => void;
    };
  }
}

/** Official Trustpilot Review Collector TrustBox (one instance per section). */
export function TrustpilotReviewCollector({ className = "" }: { className?: string }) {
  const widgetRef = useRef<HTMLDivElement>(null);

  function loadWidget() {
    const el = widgetRef.current;
    if (!el || !window.Trustpilot) return;
    window.Trustpilot.loadFromElement(el, true);
  }

  useEffect(() => {
    loadWidget();
  }, []);

  return (
    <>
      <Script
        id="trustpilot-bootstrap"
        src="https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="afterInteractive"
        onLoad={loadWidget}
      />
      <div
        className={`overflow-hidden rounded-2xl border border-[#e8e2d6] bg-white p-3 shadow-sm md:p-4 ${className}`.trim()}
      >
        <div
          ref={widgetRef}
          className="trustpilot-widget"
          data-locale="en-US"
          data-template-id="56278e9abfbbba0bdcd568bc"
          data-businessunit-id="680ff1b339171fdff8df7ff6"
          data-style-height="52px"
          data-style-width="100%"
        >
          <a
            href="https://www.trustpilot.com/review/haramtravel.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm font-semibold text-[#00b67a]"
          >
            Trustpilot
          </a>
        </div>
      </div>
    </>
  );
}
