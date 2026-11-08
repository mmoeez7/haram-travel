"use client";

import toast from "react-hot-toast";
import Link from "next/link";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  ADMIN_PAGE_SIZE,
  type AdminPaginationMeta,
} from "@/lib/admin-pagination";
import {
  AdminCard,
  AdminPageHeader,
  AdminTableSkeleton,
  adminDangerButtonClass,
  adminEditLinkClass,
  adminPageClass,
  adminStatusDraftClass,
  adminStatusPublishedClass,
  adminTitleLinkClass,
} from "@/components/admin/admin-ui";
import { AdminLoadingLink } from "@/components/admin/AdminLoadingLink";
import { AdminAsyncButton } from "@/components/admin/AdminAsyncButton";
import { AdminPagination } from "@/components/admin/AdminPagination";

const filterControlClass =
  "h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2";

const filterSelectClass =
  "admin-select h-10 w-full rounded-xl border border-border px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2";

type ReviewRow = {
  id: string;
  youtubeId: string;
  videoUrl: string;
  title: string;
  description: string;
  published: boolean;
};

const emptyMeta: AdminPaginationMeta = {
  page: 1,
  pageSize: ADMIN_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

export function AdminReviewsClient() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [pagination, setPagination] = useState<AdminPaginationMeta>(emptyMeta);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(nextQ = q, nextStatus = status, nextPage = page) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("limit", String(ADMIN_PAGE_SIZE));
      if (nextQ) params.set("q", nextQ);
      if (nextStatus) params.set("status", nextStatus);
      const data = await adminFetch<{
        reviews: ReviewRow[];
        pagination: AdminPaginationMeta;
      }>(`/api/admin/reviews?${params.toString()}`);
      setReviews(data.reviews);
      setPagination(data.pagination ?? emptyMeta);
      setPage(data.pagination?.page ?? nextPage);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this video review?")) return;
    await adminFetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    toast.success("Review deleted");
    const nextPage = reviews.length === 1 && page > 1 ? page - 1 : page;
    setPage(nextPage);
    await load(q, status, nextPage);
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title="Reviews"
        description="Add YouTube pilgrim video reviews for the home page."
      />

      <form
        className="admin-enter admin-enter-delay-1 mb-4 flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          void load(q, status, 1);
        }}
      >
        <label className="relative block min-w-[220px] max-w-xs flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search reviews"
            className={`${filterControlClass} pl-9`}
          />
        </label>
        <select
          value={status}
          onChange={(e) => {
            const nextStatus = e.target.value;
            setStatus(nextStatus);
            setPage(1);
            void load(q, nextStatus, 1);
          }}
          className={`${filterSelectClass} max-w-[180px]`}
          aria-label="Filter by status"
        >
          <option value="">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <div className="ml-auto">
          <AdminLoadingLink href="/admin/reviews/new" pendingLabel="Opening…">
            Add review
          </AdminLoadingLink>
        </div>
      </form>

      <AdminCard className="admin-enter admin-enter-delay-2">
        {loading ? (
          <AdminTableSkeleton rows={5} cols={4} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-2 py-2">Description</th>
                    <th className="px-2 py-2">YouTube</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="border-b border-border/60">
                      <td className="max-w-md px-2 py-3">
                        <Link
                          href={`/admin/reviews/${review.id}`}
                          className={adminTitleLinkClass}
                        >
                          <span className="line-clamp-2">{review.description}</span>
                        </Link>
                      </td>
                      <td className="px-2 py-3 font-mono text-xs text-muted">
                        {review.youtubeId}
                      </td>
                      <td className="px-2 py-3">
                        <span
                          className={
                            review.published
                              ? adminStatusPublishedClass
                              : adminStatusDraftClass
                          }
                        >
                          {review.published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/reviews/${review.id}`}
                            className={adminEditLinkClass}
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                            Edit
                          </Link>
                          <AdminAsyncButton
                            onClick={() => remove(review.id)}
                            pendingLabel="Deleting…"
                            idleIcon={<Trash2 className="h-3.5 w-3.5" />}
                            className={adminDangerButtonClass}
                          >
                            Delete
                          </AdminAsyncButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination
              meta={pagination}
              disabled={loading}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                void load(q, status, nextPage);
              }}
            />
          </>
        )}
      </AdminCard>
    </div>
  );
}
