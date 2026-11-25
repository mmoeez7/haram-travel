"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { whatsappUrl, type NavItem } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

function normalizePath(path: string) {
  if (!path) return "/";
  const bare = path.split("?")[0].split("#")[0];
  if (bare.length > 1 && bare.endsWith("/")) return bare.slice(0, -1);
  return bare || "/";
}

function pathMatches(pathname: string, href: string) {
  const current = normalizePath(pathname);
  const target = normalizePath(href);
  if (target === "/") return current === "/";
  return current === target || current.startsWith(`${target}/`);
}

function isNavItemActive(pathname: string, item: NavItem) {
  // Dropdown parents: prefer child matches so a shared/placeholder parent href
  // cannot light up the wrong group. Also allow exact parent-href match for
  // real listing pages (e.g. Umrah Packages → /umrah-packages).
  if (item.children?.length) {
    if (item.children.some((child) => pathMatches(pathname, child.href))) {
      return true;
    }
    const current = normalizePath(pathname);
    const parent = normalizePath(item.href);
    return current === parent;
  }
  return pathMatches(pathname, item.href);
}

const navLinkIdle = "text-ink transition hover:text-gold-dark";
const navLinkActive =
  "font-semibold text-gold-dark underline decoration-gold decoration-2 underline-offset-[10px]";

function DesktopNavItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = isNavItemActive(pathname, item);

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
        aria-current={active ? "page" : undefined}
        className={`text-base font-medium ${active ? navLinkActive : navLinkIdle}`}
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
      <Link
        href={item.href}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-current={active ? "page" : undefined}
        className={`inline-flex items-center gap-1 text-base font-medium ${
          active ? navLinkActive : navLinkIdle
        }`}
      >
        {item.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </Link>

      {open ? (
        <div className="absolute left-0 top-full z-50 max-h-[70vh] min-w-[260px] overflow-y-auto rounded-md border border-border bg-white pt-2 shadow-lg">
          {item.children.map((child, index) => {
            const childActive = pathMatches(pathname, child.href);
            return (
              <Link
                key={`${child.href}-${child.label}`}
                href={child.href}
                aria-current={childActive ? "page" : undefined}
                className={`block px-4 py-2.5 text-sm transition hover:bg-cream hover:text-gold-dark ${
                  index > 0 ? "border-t border-border" : ""
                } ${
                  childActive
                    ? "bg-gold/10 font-semibold text-gold-dark"
                    : "text-charcoal"
                }`}
                onClick={() => setOpen(false)}
              >
                {child.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function Header({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/95 backdrop-blur-sm transition-shadow duration-300 supports-[backdrop-filter]:bg-cream/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-6 lg:px-8">
        <Logo priority />

        <nav className="hidden items-center gap-4 xl:flex">
          {navItems.map((item) => (
            <DesktopNavItem key={item.label} item={item} pathname={pathname} />
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
            <FaWhatsapp className="h-4 w-4" />
            WhatsApp
          </Button>
          <Button href="/umrah-packages" variant="swipe" className="!rounded-full">
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
        <div className="border-t border-border bg-cream px-5 py-4 sm:px-6 xl:hidden">
          <nav className="flex flex-col">
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const expanded = mobileExpanded === item.label;
              const active = isNavItemActive(pathname, item);

              if (!hasChildren) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`border-b border-border py-3 text-sm font-medium ${
                      active ? "font-semibold text-gold-dark" : "text-ink"
                    }`}
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
                    className="flex w-full items-center gap-2 py-3 text-left"
                    onClick={() => setMobileExpanded(expanded ? null : item.label)}
                    aria-expanded={expanded}
                    aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
                  >
                    <span
                      className={`min-w-0 flex-1 text-sm font-medium ${
                        active ? "font-semibold text-gold-dark" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-gold-dark transition ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expanded ? (
                    <div className="mb-3 max-h-72 overflow-y-auto rounded-md border border-border bg-white">
                      {item.children!.map((child, index) => {
                        const childActive = pathMatches(pathname, child.href);
                        return (
                          <Link
                            key={`${child.href}-${child.label}`}
                            href={child.href}
                            aria-current={childActive ? "page" : undefined}
                            className={`block px-4 py-2.5 text-sm ${
                              index > 0 ? "border-t border-border" : ""
                            } ${
                              childActive
                                ? "bg-gold/10 font-semibold text-gold-dark"
                                : "text-charcoal"
                            }`}
                            onClick={() => setOpen(false)}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
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
              <FaWhatsapp className="h-4 w-4" />
              WhatsApp
            </Button>
            <Button href="/umrah-packages" variant="swipe" className="!rounded-full">
              Find Package →
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
