"use client";

import toast from "react-hot-toast";
import { Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  ADMIN_PAGE_SIZE,
  type AdminPaginationMeta,
} from "@/lib/admin-pagination";
import {
  departureLabel,
  hotelTierLabel,
  inquirySourceLabel,
  passengersLabel,
  seasonLabel,
} from "@/lib/package-inquiry";
import {
  AdminCard,
  AdminPageHeader,
  AdminTableSkeleton,
  adminDangerButtonClass,
  adminPageClass,
  adminStatusDraftClass,
  adminStatusPublishedClass,
} from "@/components/admin/admin-ui";
import { AdminAsyncButton } from "@/components/admin/AdminAsyncButton";
import { AdminPagination } from "@/components/admin/AdminPagination";

const filterControlClass =
  "h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2";

const filterSelectClass =
  "admin-select h-10 w-full rounded-xl border border-border px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2";

type InquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  season: string | null;
  departure: string | null;
  nights: number | null;
  hotelTier: string | null;
  passengers: string | null;
  message: string | null;
  source: string;
  status: string;
  createdAt: string;
};

const emptyMeta: AdminPaginationMeta = {
  page: 1,
  pageSize: ADMIN_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

function statusClass(status: string) {
  if (status === "NEW") return adminStatusPublishedClass;
  if (status === "CONTACTED")
    return "rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-gold-dark";
  return adminStatusDraftClass;
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function AdminInquiriesClient() {
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [pagination, setPagination] = useState<AdminPaginationMeta>(emptyMeta);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(
    nextQ = q,
    nextStatus = status,
    nextSource = source,
    nextPage = page
  ) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("limit", String(ADMIN_PAGE_SIZE));
      if (nextQ) params.set("q", nextQ);
      if (nextStatus) params.set("status", nextStatus);
      if (nextSource) params.set("source", nextSource);
      const data = await adminFetch<{
        inquiries: InquiryRow[];
        pagination: AdminPaginationMeta;
      }>(`/api/admin/inquiries?${params.toString()}`);
      setInquiries(data.inquiries);
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

  async function updateStatus(id: string, nextStatus: string) {
    await adminFetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
    });
    toast.success("Status updated");
    await load(q, status, source, page);
  }

  async function remove(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    await adminFetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    toast.success("Inquiry deleted");
    const nextPage = inquiries.length === 1 && page > 1 ? page - 1 : page;
    setPage(nextPage);
    await load(q, status, source, nextPage);
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title="Inquiries"
        description="Leads from the home package matcher and Contact Us form."
      />

      <form
        className="admin-enter admin-enter-delay-1 mb-4 flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          void load(q, status, source, 1);
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
            placeholder="Search name, email, phone, message"
            className={`${filterControlClass} pl-9`}
          />
        </label>
        <select
          value={source}
          onChange={(e) => {
            const nextSource = e.target.value;
            setSource(nextSource);
            setPage(1);
            void load(q, status, nextSource, 1);
          }}
          className={`${filterSelectClass} max-w-[160px]`}
          aria-label="Filter by source"
        >
          <option value="">All sources</option>
          <option value="HOME_MATCHER">Matcher</option>
          <option value="CONTACT">Contact</option>
        </select>
        <select
          value={status}
          onChange={(e) => {
            const nextStatus = e.target.value;
            setStatus(nextStatus);
            setPage(1);
            void load(q, nextStatus, source, 1);
          }}
          className={`${filterSelectClass} max-w-[160px]`}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CLOSED">Closed</option>
        </select>
        <button
          type="submit"
          className="h-10 rounded-xl bg-charcoal px-4 text-sm font-semibold text-white transition hover:bg-ink"
        >
          Search
        </button>
      </form>

      <AdminCard className="admin-enter admin-enter-delay-2">
        {loading ? (
          <AdminTableSkeleton rows={6} cols={9} />
        ) : inquiries.length === 0 ? (
          <p className="px-2 py-8 text-center text-sm text-muted">
            No inquiries yet.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-2 py-2">Date</th>
                    <th className="px-2 py-2">Source</th>
                    <th className="px-2 py-2">Client</th>
                    <th className="px-2 py-2">Details</th>
                    <th className="px-2 py-2">Message</th>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((row) => (
                    <tr key={row.id} className="border-b border-border/60 align-top">
                      <td className="whitespace-nowrap px-2 py-3 text-xs text-muted">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="px-2 py-3 text-xs font-semibold text-charcoal">
                        {inquirySourceLabel(row.source)}
                      </td>
                      <td className="px-2 py-3">
                        <p className="font-semibold text-charcoal">{row.name}</p>
                        <p className="text-xs text-muted">{row.phone}</p>
                        <p className="text-xs text-muted">{row.email}</p>
                      </td>
                      <td className="px-2 py-3 text-xs text-muted">
                        {row.source === "CONTACT" ? (
                          <span>—</span>
                        ) : (
                          <div className="space-y-0.5">
                            <p>{seasonLabel(row.season)}</p>
                            <p>{departureLabel(row.departure)}</p>
                            <p>
                              {row.nights != null ? `${row.nights} nights` : "—"} ·{" "}
                              {hotelTierLabel(row.hotelTier)} ·{" "}
                              {passengersLabel(row.passengers)}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="max-w-xs px-2 py-3 text-xs text-muted">
                        {row.message ? (
                          <p className="line-clamp-3" title={row.message}>
                            {row.message}
                          </p>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-2 py-3">
                        <span className={statusClass(row.status)}>{row.status}</span>
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
                          <select
                            value={row.status}
                            onChange={(e) =>
                              void updateStatus(row.id, e.target.value)
                            }
                            className={`${filterSelectClass} min-w-[130px]`}
                            aria-label={`Update status for ${row.name}`}
                          >
                            <option value="NEW">NEW</option>
                            <option value="CONTACTED">CONTACTED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                          <AdminAsyncButton
                            onClick={() => remove(row.id)}
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
                void load(q, status, source, nextPage);
              }}
            />
          </>
        )}
      </AdminCard>
    </div>
  );
}
