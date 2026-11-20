"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const MIN_VISIBLE_MS = 200;
const FADE_MS = 450;

export const SITE_LOADER_EVENT = "haram:show-site-loader";

/** Show the full-screen Haram Travel loader (same as refresh / first paint). */
export function showSiteLoader() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SITE_LOADER_EVENT));
}

/**
 * Full-screen reload / first-paint loader with the Haram Travel logo.
 * Also reappears when `showSiteLoader()` is called (e.g. Inquire & Book Now).
 */
export function SiteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const startedAt = useRef(Date.now());
  const mode = useRef<"boot" | "nav">("boot");
  const pathnameRef = useRef(pathname);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const visibleRef = useRef(true);

  visibleRef.current = visible;

  function clearTimers() {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    if (removeTimer.current) clearTimeout(removeTimer.current);
    fadeTimer.current = undefined;
    removeTimer.current = undefined;
  }

  function dismiss() {
    clearTimers();
    const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt.current));
    fadeTimer.current = setTimeout(() => {
      setFading(true);
      removeTimer.current = setTimeout(() => {
        setVisible(false);
        setFading(false);
      }, FADE_MS);
    }, remaining);
  }

  // First paint / hard refresh
  useEffect(() => {
    mode.current = "boot";
    startedAt.current = Date.now();

    function finish() {
      dismiss();
    }

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      window.removeEventListener("load", finish);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot once on mount
  }, []);

  // Triggered navigations (Inquire & Book Now, etc.)
  useEffect(() => {
    function onShow() {
      clearTimers();
      mode.current = "nav";
      startedAt.current = Date.now();
      pathnameRef.current = window.location.pathname;
      setFading(false);
      setVisible(true);
    }

    window.addEventListener(SITE_LOADER_EVENT, onShow);
    return () => window.removeEventListener(SITE_LOADER_EVENT, onShow);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable listeners
  }, []);

  // Hide after client navigation completes
  useEffect(() => {
    if (pathnameRef.current === pathname) return;
    pathnameRef.current = pathname;
    if (mode.current === "nav" && visibleRef.current) {
      dismiss();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pathname-driven dismiss
  }, [pathname]);

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
