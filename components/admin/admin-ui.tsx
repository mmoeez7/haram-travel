import type { ReactNode } from "react";

export const adminPageClass =
  "relative z-10 flex flex-1 flex-col px-4 pb-8 pt-4 text-sm lg:px-6";

export const adminPanelClass =
  "relative overflow-hidden rounded-2xl border border-border bg-ivory text-ink shadow-sm";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
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
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold text-charcoal">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export const adminInputClass =
  "mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none ring-gold focus:ring-2";

export const adminLabelClass = "block text-sm font-medium text-charcoal";

export const adminPrimaryButtonClass =
  "inline-flex items-center justify-center rounded-xl bg-forest px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-charcoal";

export const adminSecondaryButtonClass =
  "inline-flex items-center justify-center rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-gold hover:text-gold-dark";

export const adminDangerButtonClass =
  "inline-flex items-center justify-center rounded-xl border border-call-border/40 bg-call px-3 py-1.5 text-xs font-semibold text-call-border transition hover:bg-call-hover hover:text-white";

export const adminGoldButtonClass =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-l from-gold to-gold-dark px-4 py-2.5 text-sm font-semibold text-charcoal transition hover:opacity-95";
