"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
  AdminPageHeader,
  adminDangerButtonClass,
  adminGoldButtonClass,
  adminPageClass,
} from "@/components/admin/admin-ui";

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
        actions={
          <Link href="/admin/hotels/new" className={adminGoldButtonClass}>
            Add hotel
          </Link>
        }
      />
      {error ? (
        <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
          {error}
        </p>
      ) : null}
      <AdminCard>
        {loading ? (
          <p className="text-sm text-muted">Loading hotels…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">City</th>
                  <th className="px-2 py-2">Stars</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Actions</th>
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
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          hotel.published
                            ? "bg-forest/10 text-forest"
                            : "bg-cream-dark text-muted"
                        }`}
                      >
                        {hotel.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/hotels/${hotel.id}`}
                          className="text-sm font-semibold text-gold-dark hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => void remove(hotel.id)}
                          className={adminDangerButtonClass}
                        >
                          Delete
                        </button>
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
