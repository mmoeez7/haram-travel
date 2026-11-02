"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { AdminPaginationMeta } from "@/lib/admin-pagination";
import { ADMIN_PAGE_SIZE } from "@/lib/admin-pagination";

type AdminPaginationProps = {
  meta: AdminPaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export function AdminPagination({
  meta,
  onPageChange,
  disabled = false,
}: AdminPaginationProps) {
  if (meta.total <= (meta.pageSize || ADMIN_PAGE_SIZE)) return null;

  const from = (meta.page - 1) * meta.pageSize + 1;
  const to = Math.min(meta.page * meta.pageSize, meta.total);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      <p className="text-xs text-muted">
        Showing {from}–{to} of {meta.total}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-xl border border-border bg-white px-3 text-xs font-semibold text-ink transition hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
          Prev
        </button>
        <span className="text-xs font-medium text-muted">
          Page {meta.page} / {meta.totalPages}
        </span>
        <button
          type="button"
          disabled={disabled || meta.page >= meta.totalPages}
          onClick={() => onPageChange(meta.page + 1)}
          className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-xl border border-border bg-white px-3 text-xs font-semibold text-ink transition hover:border-gold hover:text-gold-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
