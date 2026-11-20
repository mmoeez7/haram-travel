"use client";

import toast from "react-hot-toast";
import Link from "next/link";
import { GripVertical, Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import type { ReviewKind } from "@/components/admin/ReviewFormClient";

const filterControlClass =
  "h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2";

const filterSelectClass =
  "admin-select h-10 w-full rounded-xl border border-border px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2";

type VideoReviewRow = {
  id: string;
  youtubeId: string;
  videoUrl: string;
  title: string;
  description: string;
  published: boolean;
};

type TextReviewRow = {
  id: string;
  title: string;
  name: string;
  initial: string;
  text: string;
  published: boolean;
};

const emptyMeta: AdminPaginationMeta = {
  page: 1,
  pageSize: ADMIN_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

export function AdminReviewsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const kind: ReviewKind = typeParam === "text" ? "text" : "video";

  const [videoReviews, setVideoReviews] = useState<VideoReviewRow[]>([]);
  const [textReviews, setTextReviews] = useState<TextReviewRow[]>([]);
  const [pagination, setPagination] = useState<AdminPaginationMeta>(emptyMeta);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const dragFromRef = useRef<number | null>(null);
  const orderSnapshotRef = useRef<VideoReviewRow[] | null>(null);
  const videoOrderRef = useRef(videoReviews);
  videoOrderRef.current = videoReviews;

  const canReorderVideo = kind === "video" && !q.trim() && !status;

  function setKind(next: ReviewKind) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", next);
    router.replace(`/admin/reviews?${params.toString()}`);
  }

  async function load(nextQ = q, nextStatus = status, nextPage = page, nextKind = kind) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("limit", String(ADMIN_PAGE_SIZE));
      if (nextQ) params.set("q", nextQ);
      if (nextStatus) params.set("status", nextStatus);

      if (nextKind === "video") {
        const data = await adminFetch<{
          reviews: VideoReviewRow[];
          pagination: AdminPaginationMeta;
        }>(`/api/admin/reviews?${params.toString()}`);
        setVideoReviews(data.reviews);
        setTextReviews([]);
        setPagination(data.pagination ?? emptyMeta);
        setPage(data.pagination?.page ?? nextPage);
      } else {
        const data = await adminFetch<{
          reviews: TextReviewRow[];
          pagination: AdminPaginationMeta;
        }>(`/api/admin/text-reviews?${params.toString()}`);
        setTextReviews(data.reviews);
        setVideoReviews([]);
        setPagination(data.pagination ?? emptyMeta);
        setPage(data.pagination?.page ?? nextPage);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
    void load(q, status, 1, kind);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  async function remove(id: string) {
    const label = kind === "video" ? "video review" : "text review";
    if (!confirm(`Delete this ${label}?`)) return;
    const endpoint =
      kind === "video" ? `/api/admin/reviews/${id}` : `/api/admin/text-reviews/${id}`;
    await adminFetch(endpoint, { method: "DELETE" });
    toast.success("Review deleted");
    const rows = kind === "video" ? videoReviews : textReviews;
    const nextPage = rows.length === 1 && page > 1 ? page - 1 : page;
    setPage(nextPage);
    await load(q, status, nextPage, kind);
  }

  async function persistVideoOrder(nextRows: VideoReviewRow[]) {
    const snapshot = orderSnapshotRef.current;
    setSavingOrder(true);
    try {
      await adminFetch("/api/admin/reviews/reorder", {
        method: "PUT",
        body: JSON.stringify({
          ids: nextRows.map((row) => row.id),
          page,
          pageSize: pagination.pageSize || ADMIN_PAGE_SIZE,
        }),
      });
      toast.success("Order saved", { duration: 1600 });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save order");
      if (snapshot) setVideoReviews(snapshot);
    } finally {
      setSavingOrder(false);
      orderSnapshotRef.current = null;
    }
  }

  function reorderVideoLive(from: number, to: number) {
    if (from === to || from < 0 || to < 0) return;
    const rows = videoOrderRef.current;
    if (to >= rows.length) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    dragFromRef.current = to;
    videoOrderRef.current = next;
    setVideoReviews(next);
    setDragIndex(to);
  }

  function finishVideoDrag() {
    const from = dragFromRef.current;
    dragFromRef.current = null;
    setDragIndex(null);
    if (from === null) return;

    const snapshot = orderSnapshotRef.current;
    const next = videoOrderRef.current;
    const unchanged =
      snapshot &&
      snapshot.length === next.length &&
      snapshot.every((row, i) => row.id === next[i]?.id);

    if (unchanged) {
      orderSnapshotRef.current = null;
      return;
    }

    void persistVideoOrder(next);
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title="Reviews"
        description="Manage YouTube video reviews and written pilgrim reviews for the site."
      />

      <div className="admin-enter mb-4 flex flex-wrap gap-2">
        {(
          [
            { id: "video", label: "Video reviews" },
            { id: "text", label: "Text reviews" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setKind(tab.id)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
              kind === tab.id
                ? "border-gold bg-gold/15 text-gold-dark"
                : "border-border bg-white text-muted hover:border-gold/50 hover:text-charcoal"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form
        className="admin-enter admin-enter-delay-1 mb-4 flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          void load(q, status, 1, kind);
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
            placeholder={kind === "video" ? "Search video reviews" : "Search text reviews"}
            className={`${filterControlClass} pl-9`}
          />
        </label>
        <select
          value={status}
          onChange={(e) => {
            const nextStatus = e.target.value;
            setStatus(nextStatus);
            setPage(1);
            void load(q, nextStatus, 1, kind);
          }}
          className={`${filterSelectClass} max-w-[180px]`}
          aria-label="Filter by status"
        >
          <option value="">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <div className="ml-auto">
          <AdminLoadingLink
            href={`/admin/reviews/new?type=${kind}`}
            pendingLabel="Opening…"
          >
            {kind === "video" ? "Add video review" : "Add text review"}
          </AdminLoadingLink>
        </div>
      </form>

      <AdminCard className="admin-enter admin-enter-delay-2">
        {loading ? (
          <AdminTableSkeleton rows={5} cols={4} />
        ) : (
          <>
            <div className="overflow-x-auto">
              {kind === "video" ? (
                <>
                  {canReorderVideo ? (
                    <p className="border-b border-border px-2 py-2 text-xs text-muted">
                      Drag the handle to set which video shows first on the site.
                      {savingOrder ? " Saving…" : null}
                    </p>
                  ) : (
                    <p className="border-b border-border px-2 py-2 text-xs text-muted">
                      Clear search/status filters to rearrange video order.
                    </p>
                  )}
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted">
                      <tr>
                        <th className="w-10 px-2 py-2" aria-label="Reorder" />
                        <th className="px-2 py-2">Description</th>
                        <th className="px-2 py-2">YouTube</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videoReviews.map((review, index) => (
                        <tr
                          key={review.id}
                          onDragOver={(event) => {
                            if (!canReorderVideo || dragFromRef.current === null) return;
                            event.preventDefault();
                            event.dataTransfer.dropEffect = "move";
                            const from = dragFromRef.current;
                            if (from !== null && from !== index) {
                              reorderVideoLive(from, index);
                            }
                          }}
                          className={`border-b border-border/60 transition-colors ${
                            dragIndex === index ? "bg-gold/10" : ""
                          }`}
                        >
                          <td className="px-2 py-3 align-middle">
                            <button
                              type="button"
                              draggable={canReorderVideo && !savingOrder}
                              onDragStart={(event) => {
                                if (!canReorderVideo) return;
                                orderSnapshotRef.current = videoReviews;
                                dragFromRef.current = index;
                                setDragIndex(index);
                                event.dataTransfer.effectAllowed = "move";
                                event.dataTransfer.setData("text/plain", review.id);
                              }}
                              onDragEnd={() => finishVideoDrag()}
                              disabled={!canReorderVideo || savingOrder}
                              className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
                                canReorderVideo
                                  ? "cursor-grab text-muted hover:bg-cream hover:text-charcoal active:cursor-grabbing"
                                  : "cursor-not-allowed text-border"
                              }`}
                              title={
                                canReorderVideo
                                  ? "Drag to reorder"
                                  : "Clear filters to reorder"
                              }
                              aria-label="Drag to reorder"
                            >
                              <GripVertical className="h-4 w-4" />
                            </button>
                          </td>
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
                </>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted">
                    <tr>
                      <th className="px-2 py-2">Title</th>
                      <th className="px-2 py-2">Pilgrim</th>
                      <th className="px-2 py-2">Status</th>
                      <th className="px-2 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {textReviews.map((review) => (
                      <tr key={review.id} className="border-b border-border/60">
                        <td className="max-w-md px-2 py-3">
                          <Link
                            href={`/admin/reviews/text/${review.id}`}
                            className={adminTitleLinkClass}
                          >
                            <span className="line-clamp-2">{review.title}</span>
                          </Link>
                        </td>
                        <td className="px-2 py-3 text-muted">{review.name}</td>
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
                              href={`/admin/reviews/text/${review.id}`}
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
              )}
            </div>
            <AdminPagination
              meta={pagination}
              disabled={loading}
              onPageChange={(nextPage) => {
                setPage(nextPage);
                void load(q, status, nextPage, kind);
              }}
            />
          </>
        )}
      </AdminCard>
    </div>
  );
}
