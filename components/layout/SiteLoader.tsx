"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const MIN_VISIBLE_MS = 200;
const FADE_MS = 450;

/**
 * Full-screen reload / first-paint loader with the Haram Travel logo.
 * Shows once per hard load of the public site layout.
 */
export function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let fadeTimer: ReturnType<typeof setTimeout> | undefined;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const startedAt = Date.now();

    function finish() {
      if (cancelled) return;
      const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt));
      fadeTimer = setTimeout(() => {
        if (cancelled) return;
        setFading(true);
        removeTimer = setTimeout(() => {
          if (!cancelled) setVisible(false);
        }, FADE_MS);
      }, remaining);
    }

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", finish);
      if (fadeTimer) clearTimeout(fadeTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`site-loader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream ${
        fading ? "site-loader-out" : ""
      }`}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className="site-loader-mark flex flex-col items-center gap-5">
        <Image
          src="/images/haram-travel-logo.png"
          alt="Haram Travel"
          width={260}
          height={76}
          priority
          className="site-loader-logo h-14 w-auto md:h-16"
        />
        <div className="site-loader-bar" aria-hidden />
        <span className="sr-only">Loading Haram Travel</span>
      </div>
    </div>
  );
}
