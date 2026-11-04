import type { ReactNode } from "react";
import { AdminBackButton } from "@/components/admin/AdminBackButton";

export const adminPageClass =
  "relative z-10 flex flex-1 flex-col px-4 pb-8 pt-4 text-sm lg:px-6";

export const adminPanelClass =
  "relative overflow-hidden rounded-2xl border border-border bg-ivory text-ink shadow-sm";

export function AdminPageHeader({
  title,
  description,
  actions,
  className = "",
  showBack = false,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  /** Only for create/edit forms — not list screens from the sidebar. */
  showBack?: boolean;
}) {
  return (
    <div
      className={`mb-6 flex flex-wrap items-start justify-between gap-3 admin-enter ${className}`}
    >
      <div>
        {showBack ? (
          <div className="mb-3">
            <AdminBackButton />
          </div>
        ) : null}
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-dark">
          Haram Travel Admin
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold uppercase tracking-wide text-charcoal md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${adminPanelClass} p-4 md:p-5 ${className}`}>{children}</div>
  );
}

export function AdminStatCard({
  label,
  value,
  hint,
  className = "",
  loading = false,
}: {
  label: string;
  value: number | string;
  hint?: string;
  className?: string;
  loading?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-white p-4 shadow-sm ${className}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      {loading ? (
        <div className="admin-shimmer mt-3 h-9 w-16" aria-hidden />
      ) : (
        <p className="mt-2 font-display text-3xl font-semibold text-charcoal">{value}</p>
      )}
      {hint && !loading ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function AdminShimmerBlock({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`admin-shimmer ${className}`} aria-hidden />;
}

export function AdminTableSkeleton({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <AdminShimmerBlock key={`h-${i}`} className="h-3 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={`r-${row}`}
          className="grid gap-3 border-t border-border/50 pt-3"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, col) => (
            <AdminShimmerBlock
              key={`c-${row}-${col}`}
              className={`h-4 ${col === 0 ? "w-[85%]" : "w-full"}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function AdminFormSkeleton({ fields = 8 }: { fields?: number }) {
  return (
    <div
      className="grid gap-4 md:grid-cols-2"
      role="status"
      aria-label="Loading form"
    >
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <AdminShimmerBlock className="h-3 w-24" />
          <AdminShimmerBlock className="h-10 w-full rounded-xl" />
        </div>
      ))}
      <div className="md:col-span-2 space-y-2">
        <AdminShimmerBlock className="h-3 w-28" />
        <AdminShimmerBlock className="h-24 w-full rounded-xl" />
      </div>
      <div className="flex gap-2 md:col-span-2">
        <AdminShimmerBlock className="h-10 w-32 rounded-xl" />
        <AdminShimmerBlock className="h-10 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export const adminInputClass =
  "mt-1 w-full rounded-xl border border-border bg-white px-3.5 py-2 text-sm text-ink outline-none ring-gold focus:ring-2";

/** Uses `.admin-select` in globals.css for a padded chevron icon */
export const adminSelectClass =
  "admin-select mt-1 w-full rounded-xl border border-border px-3.5 py-2 text-sm text-ink outline-none ring-gold focus:ring-2";

export const adminLabelClass = "block text-sm font-medium text-charcoal";

export const adminPrimaryButtonClass =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-80";

export const adminSecondaryButtonClass =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-80";

export const adminDangerButtonClass =
  "inline-flex h-8 cursor-pointer items-center justify-center gap-2 rounded-xl border border-call-border/40 bg-call px-3 text-xs font-semibold text-call-border transition hover:bg-call-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-80";

export const adminEditLinkClass =
  "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 text-xs font-semibold text-gold-dark transition hover:border-gold hover:bg-gold/20";

export const adminDuplicateButtonClass =
  "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-3 text-xs font-semibold text-ink transition hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-80";

export const adminStatusPublishedClass =
  "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700";

export const adminStatusDraftClass =
  "inline-flex rounded-full bg-stone-200/80 px-2.5 py-0.5 text-[10px] font-semibold text-stone-600";

export const adminGoldButtonClass =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-gold-dark px-4 py-2.5 text-sm font-semibold text-charcoal transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-80";

export const adminCancelButtonClass =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-call-border/40 bg-call px-4 py-2.5 text-sm font-semibold text-call-border transition hover:bg-call-hover hover:text-white disabled:cursor-not-allowed disabled:opacity-80";
