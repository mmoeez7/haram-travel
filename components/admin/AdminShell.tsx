"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  Tags,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

type AdminShellProps = {
  user: { name?: string | null; email?: string | null };
  children: ReactNode;
};

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, match: "exact" as const },
  { label: "Packages", href: "/admin/packages", icon: Package, match: "prefix" as const },
  { label: "Categories", href: "/admin/categories", icon: Tags, match: "prefix" as const },
  { label: "Hotels", href: "/admin/hotels", icon: Building2, match: "prefix" as const },
];

function isActive(pathname: string, href: string, match: "exact" | "prefix") {
  if (match === "exact") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin/login");
      router.refresh();
    }
  }

  const nav = (
    <nav className="mt-8 flex flex-1 flex-col gap-1.5">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(pathname, item.href, item.match);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
              active
                ? "border border-gold/40 bg-gold/15 text-charcoal"
                : "border border-transparent text-ink/80 hover:border-border hover:bg-cream"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                active ? "bg-gold/25 text-gold-dark" : "bg-cream text-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="relative flex min-h-screen">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
          <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-forest/5 blur-3xl" />
        </div>

        <aside className="relative z-20 hidden w-64 shrink-0 flex-col border-r border-border bg-ivory/90 px-4 py-6 backdrop-blur lg:flex">
          <div>
            <p className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
              Haram Travel
            </p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-dark">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin Workspace
            </div>
          </div>
          {nav}
          <div className="mt-4 rounded-2xl border border-border bg-white p-3">
            <p className="truncate text-sm font-semibold text-charcoal">
              {user.name ?? "Admin"}
            </p>
            <p className="truncate text-xs text-muted">{user.email}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-ink hover:border-gold"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </aside>

        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between border-b border-border bg-ivory/90 px-4 py-3 backdrop-blur lg:hidden">
            <p className="font-display font-semibold uppercase tracking-wide text-charcoal">
              Admin
            </p>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-lg border border-border bg-white p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </header>

          {mobileOpen ? (
            <div className="border-b border-border bg-ivory px-4 py-4 lg:hidden">
              {nav}
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-call-border"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          ) : null}

          <div className={pathname.startsWith("/admin") ? "flex-1" : ""}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
