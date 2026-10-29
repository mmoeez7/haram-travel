"use client";

import Link from "next/link";
import { ChevronDown, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, whatsappUrl, type NavItem } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

function DesktopNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        className="text-sm font-medium text-ink transition hover:text-gold-dark"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink transition hover:text-gold-dark"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {item.label}
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-50 min-w-[240px] overflow-hidden rounded-md border border-border bg-white pt-2 shadow-lg">
          {item.children.map((child, index) => (
            <Link
              key={child.href}
              href={child.href}
              className={`block px-4 py-2.5 text-sm text-charcoal transition hover:bg-cream hover:text-gold-dark ${
                index > 0 ? "border-t border-border" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              {child.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/95 backdrop-blur-sm transition-shadow duration-300 supports-[backdrop-filter]:bg-cream/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Logo priority />

        <nav className="hidden items-center gap-5 xl:flex">
          {NAV_ITEMS.map((item) => (
            <DesktopNavItem key={item.label} item={item} />
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            href={whatsappUrl()}
            variant="whatsapp"
            className="!rounded-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button href="/booking-form" variant="dark" className="!rounded-full">
            Find Package →
          </Button>
        </div>

        <button
          type="button"
          className="rounded-md border border-border p-2 xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-cream px-4 py-4 xl:hidden">
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const expanded = mobileExpanded === item.label;

              if (!hasChildren) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="border-b border-border py-3 text-sm font-medium text-ink"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div key={item.label} className="border-b border-border">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-ink"
                    onClick={() => setMobileExpanded(expanded ? null : item.label)}
                    aria-expanded={expanded}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 text-gold-dark transition ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded ? (
                    <div className="mb-3 overflow-hidden rounded-md border border-border bg-white">
                      {item.children!.map((child, index) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`block px-4 py-2.5 text-sm text-charcoal ${
                            index > 0 ? "border-t border-border" : ""
                          }`}
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="mt-4 flex flex-col gap-2">
            <Button
              href={whatsappUrl()}
              variant="whatsapp"
              className="!rounded-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button href="/booking-form" variant="dark" className="!rounded-full">
              Find Package →
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
