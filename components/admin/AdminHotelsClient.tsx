"use client";

import Link from "next/link";
import { Copy, Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
  AdminPageHeader,
  AdminTableSkeleton,
  adminDangerButtonClass,
  adminDuplicateButtonClass,
  adminEditLinkClass,
  adminPageClass,
  adminStatusDraftClass,
  adminStatusPublishedClass,
  adminTitleLinkClass,
} from "@/components/admin/admin-ui";
import { AdminLoadingLink } from "@/components/admin/AdminLoadingLink";
import { AdminAsyncButton } from "@/components/admin/AdminAsyncButton";

const filterControlClass =
  "h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2";

const filterSelectClass =
  "admin-select h-10 w-full rounded-xl border border-border px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2";

type Hotel = {
  id: string;
  name: string;
  city: string;
  stars: number;
  published: boolean;
};

type CityFilter = "" | "MAKKAH" | "MADINAH";

export function AdminHotelsClient() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [q, setQ] = useState("");
  const [cityFilter, setCityFilter] = useState<CityFilter>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await adminFetch<{ hotels: Hotel[] }>("/api/admin/hotels");
      setHotels(data.hotels);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const filteredHotels = useMemo(() => {
    const query = q.trim().toLowerCase();
    return hotels.filter((hotel) => {
      if (cityFilter && hotel.city !== cityFilter) return false;
      if (!query) return true;
      return hotel.name.toLowerCase().includes(query);
    });
  }, [hotels, cityFilter, q]);

  async function remove(id: string) {
    if (!confirm("Delete this hotel?")) return;
    await adminFetch(`/api/admin/hotels/${id}`, { method: "DELETE" });
    await load();
  }

  async function duplicate(id: string) {
    try {
      await adminFetch(`/api/admin/hotels/${id}/duplicate`, { method: "POST" });
      await load();
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplicate failed");
    }
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title="Hotels"
        description="Makkah and Madinah properties linked to packages."
      />
      {error ? (
        <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
          {error}
        </p>
      ) : null}
      <div className="admin-enter admin-enter-delay-1 mb-3 flex flex-wrap items-center gap-2">
        <label className="relative block min-w-[220px] max-w-xs flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search hotels"
            className={`${filterControlClass} pl-9`}
            aria-label="Search hotels"
          />
        </label>
        <select
          value={cityFilter}
          onChange={(event) => setCityFilter(event.target.value as CityFilter)}
          className={`${filterSelectClass} max-w-[180px]`}
          aria-label="Filter hotels by city"
        >
          <option value="">All cities</option>
          <option value="MAKKAH">Makkah</option>
          <option value="MADINAH">Madinah</option>
        </select>
        <div className="ml-auto">
          <AdminLoadingLink href="/admin/hotels/new" pendingLabel="Opening…">
            Add hotel
          </AdminLoadingLink>
        </div>
      </div>
      <AdminCard className="admin-enter admin-enter-delay-2">
        {loading ? (
          <AdminTableSkeleton rows={6} cols={5} />
        ) : filteredHotels.length === 0 ? (
          <p className="text-sm text-muted">
            {q.trim() || cityFilter
              ? "No hotels match your search."
              : "No hotels yet."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">City</th>
                  <th className="px-2 py-2">Stars</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHotels.map((hotel) => (
                  <tr key={hotel.id} className="border-b border-border/60">
                    <td className="px-2 py-3">
                      <Link
                        href={`/admin/hotels/${hotel.id}/view`}
                        className={adminTitleLinkClass}
                      >
                        {hotel.name}
                      </Link>
                    </td>
                    <td className="px-2 py-3">{hotel.city}</td>
                    <td className="px-2 py-3">{hotel.stars}★</td>
                    <td className="px-2 py-3">
                      <span
                        className={
                          hotel.published
                            ? adminStatusPublishedClass
                            : adminStatusDraftClass
                        }
                      >
                        {hotel.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/hotels/${hotel.id}`}
                          className={adminEditLinkClass}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                          Edit
                        </Link>
                        <AdminAsyncButton
                          onClick={() => duplicate(hotel.id)}
                          pendingLabel="Copying…"
                          idleIcon={<Copy className="h-3.5 w-3.5" />}
                          className={adminDuplicateButtonClass}
                        >
                          Duplicate
                        </AdminAsyncButton>
                        <AdminAsyncButton
                          onClick={() => remove(hotel.id)}
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
        )}
      </AdminCard>
    </div>
  );
}
