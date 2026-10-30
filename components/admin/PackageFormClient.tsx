"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
  AdminPageHeader,
  adminInputClass,
  adminLabelClass,
  adminPageClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "@/components/admin/admin-ui";

type Category = { id: string; name: string };
type Hotel = { id: string; name: string; city: string; stars: number };
type PackageDetail = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  journeyType: string;
  stars: number;
  nights: number;
  makkahNights: number;
  madinahNights: number;
  priceFrom: string | number;
  deposit: string | number;
  badge: string | null;
  season: string;
  features: string[];
  shortDescription: string | null;
  description: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  categories: { categoryId: string }[];
  hotels: { hotelId: string; role: string }[];
};

async function uploadCover(file: File) {
  const form = new FormData();
  form.set("file", file);
  form.set("folder", "packages");
  const response = await fetch("/api/admin/upload", { method: "POST", body: form });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Upload failed");
  return payload.url as string;
}

export function PackageFormClient({ packageId }: { packageId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(packageId));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [cats, hotelsRes] = await Promise.all([
          adminFetch<{ categories: Category[] }>("/api/admin/categories"),
          adminFetch<{ hotels: Hotel[] }>("/api/admin/hotels"),
        ]);
        setCategories(cats.categories);
        setHotels(hotelsRes.hotels);
        if (packageId) {
          const detail = await adminFetch<{ package: PackageDetail }>(
            `/api/admin/packages/${packageId}`
          );
          setPkg(detail.package);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load form");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [packageId]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    let coverImageUrl = String(form.get("coverImageUrl") || "");
    const coverFile = form.get("coverFile");

    try {
      if (coverFile instanceof File && coverFile.size > 0) {
        coverImageUrl = await uploadCover(coverFile);
      }

      const payload = {
        title: String(form.get("title") || ""),
        subtitle: String(form.get("subtitle") || ""),
        slug: String(form.get("slug") || ""),
        journeyType: String(form.get("journeyType") || "UMRAH"),
        stars: Number(form.get("stars") || 3),
        nights: Number(form.get("nights") || 7),
        makkahNights: Number(form.get("makkahNights") || 0),
        madinahNights: Number(form.get("madinahNights") || 0),
        priceFrom: Number(form.get("priceFrom") || 0),
        deposit: Number(form.get("deposit") || 0),
        badge: String(form.get("badge") || ""),
        season: String(form.get("season") || "ALL"),
        features: String(form.get("features") || ""),
        shortDescription: String(form.get("shortDescription") || ""),
        description: String(form.get("description") || ""),
        coverImageUrl,
        coverImageAlt: String(form.get("coverImageAlt") || ""),
        featured: form.get("featured") === "on",
        published: form.get("published") === "on",
        sortOrder: Number(form.get("sortOrder") || 0),
        categoryIds: form.getAll("categoryIds").map(String),
        makkahHotelId: String(form.get("makkahHotelId") || ""),
        madinahHotelId: String(form.get("madinahHotelId") || ""),
      };

      if (packageId) {
        await adminFetch(`/api/admin/packages/${packageId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/admin/packages", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/admin/packages");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const selectedCategoryIds = new Set(pkg?.categories.map((c) => c.categoryId) ?? []);
  const makkahHotelId = pkg?.hotels.find((h) => h.role === "MAKKAH")?.hotelId ?? "";
  const madinahHotelId = pkg?.hotels.find((h) => h.role === "MADINAH")?.hotelId ?? "";
  const makkahHotels = hotels.filter((h) => h.city === "MAKKAH");
  const madinahHotels = hotels.filter((h) => h.city === "MADINAH");

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={packageId ? "Edit package" : "New package"}
        description="Packages sync to the public site when published."
      />
      <AdminCard>
        {loading ? <p className="text-sm text-muted">Loading…</p> : null}
        {error ? (
          <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
            {error}
          </p>
        ) : null}
        {!loading ? (
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <label className={adminLabelClass}>
              Title
              <input name="title" required defaultValue={pkg?.title} className={adminInputClass} />
            </label>
            <label className={adminLabelClass}>
              Subtitle
              <input
                name="subtitle"
                required
                defaultValue={pkg?.subtitle}
                className={adminInputClass}
              />
            </label>
            <label className={adminLabelClass}>
              Slug
              <input name="slug" required defaultValue={pkg?.slug} className={adminInputClass} />
            </label>
            <label className={adminLabelClass}>
              Journey type
              <select
                name="journeyType"
                defaultValue={pkg?.journeyType ?? "UMRAH"}
                className={adminInputClass}
              >
                <option value="UMRAH">Umrah</option>
                <option value="HAJJ">Hajj</option>
              </select>
            </label>
            <label className={adminLabelClass}>
              Stars
              <input
                name="stars"
                type="number"
                min={3}
                max={5}
                required
                defaultValue={pkg?.stars ?? 3}
                className={adminInputClass}
              />
            </label>
            <label className={adminLabelClass}>
              Season
              <select name="season" defaultValue={pkg?.season ?? "ALL"} className={adminInputClass}>
                {[
                  "ALL",
                  "JANUARY",
                  "FEBRUARY",
                  "EASTER",
                  "RAMADAN",
                  "SEPTEMBER",
                  "OCTOBER",
                  "NOVEMBER",
                  "DECEMBER",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className={adminLabelClass}>
              Nights
              <input
                name="nights"
                type="number"
                min={1}
                required
                defaultValue={pkg?.nights ?? 7}
                className={adminInputClass}
              />
            </label>
            <label className={adminLabelClass}>
              Makkah nights
              <input
                name="makkahNights"
                type="number"
                min={0}
                required
                defaultValue={pkg?.makkahNights ?? 4}
                className={adminInputClass}
              />
            </label>
            <label className={adminLabelClass}>
              Madinah nights
              <input
                name="madinahNights"
                type="number"
                min={0}
                required
                defaultValue={pkg?.madinahNights ?? 3}
                className={adminInputClass}
              />
            </label>
            <label className={adminLabelClass}>
              Price from (£)
              <input
                name="priceFrom"
                type="number"
                min={0}
                step="0.01"
                required
                defaultValue={pkg ? Number(pkg.priceFrom) : 745}
                className={adminInputClass}
              />
            </label>
            <label className={adminLabelClass}>
              Deposit (£)
              <input
                name="deposit"
                type="number"
                min={0}
                step="0.01"
                required
                defaultValue={pkg ? Number(pkg.deposit) : 99}
                className={adminInputClass}
              />
            </label>
            <label className={adminLabelClass}>
              Badge
              <input name="badge" defaultValue={pkg?.badge ?? ""} className={adminInputClass} />
            </label>
            <label className={adminLabelClass}>
              Sort order
              <input
                name="sortOrder"
                type="number"
                defaultValue={pkg?.sortOrder ?? 0}
                className={adminInputClass}
              />
            </label>
            <label className={`${adminLabelClass} md:col-span-2`}>
              Features (one per line)
              <textarea
                name="features"
                rows={5}
                defaultValue={pkg?.features.join("\n") ?? ""}
                className={adminInputClass}
              />
            </label>
            <label className={`${adminLabelClass} md:col-span-2`}>
              Short description
              <textarea
                name="shortDescription"
                rows={2}
                defaultValue={pkg?.shortDescription ?? ""}
                className={adminInputClass}
              />
            </label>
            <label className={`${adminLabelClass} md:col-span-2`}>
              Description
              <textarea
                name="description"
                rows={4}
                defaultValue={pkg?.description ?? ""}
                className={adminInputClass}
              />
            </label>

            <fieldset className="rounded-xl border border-border p-4 md:col-span-2">
              <legend className="px-1 text-sm font-semibold text-charcoal">Categories</legend>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="categoryIds"
                      value={category.id}
                      defaultChecked={selectedCategoryIds.has(category.id)}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className={adminLabelClass}>
              Makkah hotel
              <select
                name="makkahHotelId"
                defaultValue={makkahHotelId}
                className={adminInputClass}
              >
                <option value="">None</option>
                {makkahHotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} ({hotel.stars}★)
                  </option>
                ))}
              </select>
            </label>
            <label className={adminLabelClass}>
              Madinah hotel
              <select
                name="madinahHotelId"
                defaultValue={madinahHotelId}
                className={adminInputClass}
              >
                <option value="">None</option>
                {madinahHotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} ({hotel.stars}★)
                  </option>
                ))}
              </select>
            </label>

            <label className={`${adminLabelClass} md:col-span-2`}>
              Cover image URL
              <input
                name="coverImageUrl"
                defaultValue={pkg?.coverImageUrl ?? ""}
                className={adminInputClass}
              />
            </label>
            <label className={`${adminLabelClass} md:col-span-2`}>
              Or upload cover image
              <input
                name="coverFile"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="mt-1 w-full text-sm"
              />
            </label>
            <label className={`${adminLabelClass} md:col-span-2`}>
              Cover alt text
              <input
                name="coverImageAlt"
                defaultValue={pkg?.coverImageAlt ?? ""}
                className={adminInputClass}
              />
            </label>

            <div className="flex flex-wrap gap-4 md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
                <input name="published" type="checkbox" defaultChecked={pkg?.published ?? false} />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
                <input name="featured" type="checkbox" defaultChecked={pkg?.featured ?? false} />
                Featured
              </label>
            </div>

            <div className="flex gap-2 md:col-span-2">
              <button type="submit" disabled={saving} className={adminPrimaryButtonClass}>
                {saving ? "Saving…" : "Save package"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/packages")}
                className={adminSecondaryButtonClass}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </AdminCard>
    </div>
  );
}
