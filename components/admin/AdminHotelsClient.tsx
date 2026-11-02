"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
  AdminPageHeader,
  AdminTableSkeleton,
  adminDangerButtonClass,
  adminEditLinkClass,
  adminPageClass,
  adminStatusDraftClass,
  adminStatusPublishedClass,
} from "@/components/admin/admin-ui";
import { AdminLoadingLink } from "@/components/admin/AdminLoadingLink";
import { AdminAsyncButton } from "@/components/admin/AdminAsyncButton";

type Hotel = {
  id: string;
  name: string;
  city: string;
  stars: number;
  published: boolean;
};

export function AdminHotelsClient() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
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

  async function remove(id: string) {
    if (!confirm("Delete this hotel?")) return;
    await adminFetch(`/api/admin/hotels/${id}`, { method: "DELETE" });
    await load();
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
      <div className="admin-enter admin-enter-delay-1 mb-3 flex justify-end">
        <AdminLoadingLink href="/admin/hotels/new" pendingLabel="Opening…">
          Add hotel
        </AdminLoadingLink>
      </div>
      <AdminCard className="admin-enter admin-enter-delay-2">
        {loading ? (
          <AdminTableSkeleton rows={6} cols={5} />
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
                {hotels.map((hotel) => (
                  <tr key={hotel.id} className="border-b border-border/60">
                    <td className="px-2 py-3 font-medium text-charcoal">{hotel.name}</td>
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
