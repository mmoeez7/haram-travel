"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BedDouble,
  FilePenLine,
  Package,
  Plus,
  Star,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import { adminPageClass } from "@/components/admin/admin-ui";
import { AdminLoadingLink } from "@/components/admin/AdminLoadingLink";

type TrendPoint = { label: string; count: number };

type DashboardData = {
  bookingsTotal: number;
  hotelsActive: number;
  packagesActive: number;
  reviewsActive: number;
  bookingsDeltaPct: number;
  hotelsDeltaPct: number;
  packagesDeltaPct: number;
  reviewsDeltaPct: number;
  trend: TrendPoint[];
  range: "30" | "all";
};

function formatDelta(pct: number) {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct}%`;
}

function DeltaBadge({ pct, onDark = false }: { pct: number; onDark?: boolean }) {
  const positive = pct >= 0;
  if (onDark) {
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm ${
          positive
            ? "bg-[#00b67a] text-white"
            : "bg-call-border text-white"
        }`}
      >
        {formatDelta(pct)}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        positive
          ? "bg-forest/15 text-forest"
          : "bg-call-border/15 text-call-border"
      }`}
    >
      {formatDelta(pct)}
    </span>
  );
}

function MiniStatCard({
  label,
  value,
  deltaPct,
  icon,
  loading,
  accentClass,
  className = "",
}: {
  label: string;
  value: number | string;
  deltaPct: number;
  icon: ReactNode;
  loading?: boolean;
  accentClass: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2.5 rounded-xl border border-border bg-white px-3.5 py-3 shadow-sm transition duration-300 ease-out hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-md ${className}`}
    >
      <div className="min-w-0">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted">
          {label}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <p
            key={loading ? "loading" : String(value)}
            className="font-display text-2xl font-semibold text-charcoal transition-opacity duration-300"
          >
            {loading ? "—" : value}
          </p>
          {!loading ? <DeltaBadge pct={deltaPct} /> : null}
        </div>
      </div>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition duration-300 ${accentClass}`}
      >
        {icon}
      </span>
    </div>
  );
}

function yAxisTicks(max: number) {
  const niceMax = Math.max(4, Math.ceil(max / 4) * 4);
  const step = niceMax / 4;
  return [0, step, step * 2, step * 3, niceMax].map((n) => Math.round(n));
}

function BookingsTrendChart({
  trend,
  loading,
}: {
  trend: TrendPoint[];
  loading?: boolean;
}) {
  const maxCount = Math.max(0, ...trend.map((t) => t.count));
  const ticks = useMemo(() => yAxisTicks(maxCount || 4), [maxCount]);
  const chartMax = ticks[ticks.length - 1] || 4;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-white p-5 shadow-[0_10px_28px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
            Bookings Trend
          </h2>
          <p className="mt-0.5 text-xs text-muted">Inquiries received per week</p>
        </div>
        <span className="rounded-full border border-border bg-cream px-3 py-1 text-[11px] font-semibold text-muted">
          This Month
        </span>
      </div>

      {loading ? (
        <div className="flex min-h-[220px] flex-1 items-end gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full animate-pulse rounded-t-lg bg-cream"
                style={{ height: `${40 + i * 15}%` }}
              />
              <div className="h-3 w-12 animate-pulse rounded bg-cream" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[220px] flex-1 flex-col">
          <div className="flex flex-1 gap-2">
            {/* Y-axis */}
            <div className="flex w-9 shrink-0 flex-col justify-between pb-7 pr-1 text-right">
              {[...ticks].reverse().map((tick) => (
                <span key={tick} className="text-[10px] font-semibold tabular-nums text-muted">
                  {tick}
                </span>
              ))}
            </div>

            <div className="relative flex min-w-0 flex-1 flex-col">
              {/* Grid lines */}
              <div className="pointer-events-none absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between">
                {ticks.map((tick) => (
                  <div key={tick} className="border-t border-dashed border-border/70" />
                ))}
              </div>

              <div className="relative z-10 flex flex-1 items-end gap-3 sm:gap-4">
                {trend.map((point, index) => {
                  const heightPct =
                    chartMax <= 0
                      ? 0
                      : Math.max(point.count > 0 ? 10 : 0, (point.count / chartMax) * 100);
                  return (
                    <div
                      key={point.label}
                      className="flex flex-1 flex-col items-center justify-end gap-2"
                    >
                      <span className="text-[11px] font-bold tabular-nums text-charcoal admin-enter">
                        {point.count}
                      </span>
                      <div className="flex h-40 w-full items-end justify-center sm:h-44">
                        <div
                          className="admin-bar-grow w-[72%] max-w-[3.25rem] rounded-t-xl bg-gradient-to-t from-forest to-forest/70 shadow-sm transition hover:from-forest hover:to-gold-dark"
                          style={{
                            height: `${heightPct}%`,
                            animationDelay: `${0.1 + index * 0.08}s`,
                          }}
                          title={`${point.label}: ${point.count} inquiries`}
                        />
                      </div>
                      <p className="text-[11px] font-semibold text-muted">{point.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[11px] font-medium text-muted">
            <span>Y-axis: Inquiries</span>
            <span>X-axis: Week</span>
          </div>
        </div>
      )}
    </div>
  );
}

const quickActions = [
  {
    href: "/admin/packages/new",
    label: "Add Package",
    icon: <Plus className="h-4 w-4" aria-hidden />,
  },
  {
    href: "/admin/hotels/new",
    label: "Add Hotel",
    icon: <BedDouble className="h-4 w-4" aria-hidden />,
  },
  {
    href: "/admin/blogs/new",
    label: "Publish Blog",
    icon: <FilePenLine className="h-4 w-4" aria-hidden />,
  },
] as const;

export function AdminDashboardClient() {
  const [range, setRange] = useState<"30" | "all">("30");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    adminFetch<DashboardData>(`/api/admin/dashboard?range=${range}`)
      .then((payload) => {
        if (!cancelled) setData(payload);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <div className={adminPageClass}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 admin-enter">
        <div>
          <h1 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">Travel insights at a glance.</p>
        </div>
        <label className="sr-only" htmlFor="dashboard-range">
          Date range
        </label>
        <select
          id="dashboard-range"
          value={range}
          onChange={(e) => setRange(e.target.value === "all" ? "all" : "30")}
          className="admin-select h-10 rounded-xl border border-border bg-white px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2"
        >
          <option value="30">Last 30 Days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Left focus: hero + trend. Right: compact sidebar (no extra scroll). */}
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(200px,0.75fr)] lg:items-start lg:gap-4">
        <div className="space-y-3 lg:space-y-4">
          {/* Total Bookings hero */}
          <div className="admin-enter relative min-h-[200px] overflow-hidden rounded-2xl border border-border shadow-[0_12px_32px_rgba(0,0,0,0.08)] md:min-h-[230px]">
            <Image
              src="/images/admin-dashboard-plane.jpg"
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 65vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal/90 via-charcoal/55 to-gold-dark/35" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-charcoal/50 to-transparent" />
            <div className="relative z-10 flex h-full min-h-[200px] flex-col justify-between p-5 md:min-h-[230px] md:p-6">
              <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                Total Bookings
              </div>
              <div className="flex flex-wrap items-end gap-3">
                <p className="font-display text-5xl font-semibold leading-none text-white drop-shadow md:text-6xl">
                  {loading || !data ? "—" : data.bookingsTotal}
                </p>
                {!loading && data ? (
                  <DeltaBadge pct={data.bookingsDeltaPct} onDark />
                ) : null}
              </div>
            </div>
          </div>

          {/* Bookings trend — main focus */}
          <div className="admin-enter admin-enter-delay-2 min-h-[280px]">
            <BookingsTrendChart trend={data?.trend ?? []} loading={loading} />
          </div>
        </div>

        {/* Compact right column — staggered enter */}
        <div className="space-y-3 lg:sticky lg:top-4">
          <MiniStatCard
            className="admin-enter admin-enter-delay-1"
            label="Active Hotels"
            value={data?.hotelsActive ?? "—"}
            deltaPct={data?.hotelsDeltaPct ?? 0}
            loading={loading}
            accentClass="bg-sky-50 text-sky-700"
            icon={<BedDouble className="h-4 w-4" aria-hidden />}
          />
          <MiniStatCard
            className="admin-enter admin-enter-delay-2"
            label="Active Packages"
            value={data?.packagesActive ?? "—"}
            deltaPct={data?.packagesDeltaPct ?? 0}
            loading={loading}
            accentClass="bg-amber-50 text-amber-700"
            icon={<Package className="h-4 w-4" aria-hidden />}
          />
          <MiniStatCard
            className="admin-enter admin-enter-delay-3"
            label="Reviews"
            value={data?.reviewsActive ?? "—"}
            deltaPct={data?.reviewsDeltaPct ?? 0}
            loading={loading}
            accentClass="bg-gold/15 text-gold-dark"
            icon={<Star className="h-4 w-4" aria-hidden />}
          />

          <div className="admin-enter admin-enter-delay-4 rounded-xl border border-border bg-gradient-to-b from-white to-cream/40 p-3.5 shadow-sm transition duration-300 hover:border-gold/30 hover:shadow-md">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-charcoal">
              Quick Actions
            </h2>
            <div className="mt-2.5 grid gap-2">
              {quickActions.map((action) => (
                <AdminLoadingLink
                  key={action.href}
                  href={action.href}
                  pendingLabel="Opening…"
                  showPlus={false}
                  className="!justify-start gap-2.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-charcoal shadow-none transition duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/10"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/15 text-gold-dark">
                    {action.icon}
                  </span>
                  {action.label}
                </AdminLoadingLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
