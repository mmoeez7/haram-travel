"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
  AdminFormSkeleton,
  AdminPageHeader,
  adminCancelButtonClass,
  adminInputClass,
  adminLabelClass,
  adminSelectClass,
  adminPageClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "@/components/admin/admin-ui";
import {
  AdminCoverUpload,
  uploadAdminCover,
  type CoverUploadState,
} from "@/components/admin/AdminCoverUpload";

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

export function PackageFormClient({ packageId }: { packageId?: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [pkg, setPkg] = useState<PackageDetail | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [cover, setCover] = useState<CoverUploadState>({
    file: null,
    previewUrl: null,
    removed: false,
  });

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
          setCover({
            file: null,
            previewUrl: detail.package.coverImageUrl,
            removed: false,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load form");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [packageId]);

  async function save(published: boolean) {
    const form = formRef.current;
    if (!form) return;
    if (!form.reportValidity()) return;

    setSaving(published ? "publish" : "draft");
    setError("");
    const data = new FormData(form);

    try {
      let coverImageUrl = cover.removed ? "" : (pkg?.coverImageUrl ?? "");
      if (cover.file) {
        coverImageUrl = await uploadAdminCover(cover.file, "packages");
      }

      const title = String(data.get("title") || "");
      const payload = {
        title,
        subtitle: String(data.get("subtitle") || ""),
        journeyType: String(data.get("journeyType") || "UMRAH"),
        stars: Number(data.get("stars") || 3),
        nights: Number(data.get("nights") || 7),
        makkahNights: Number(data.get("makkahNights") || 0),
        madinahNights: Number(data.get("madinahNights") || 0),
        priceFrom: Number(data.get("priceFrom") || 0),
        deposit: Number(data.get("deposit") || 0),
        badge: String(data.get("badge") || ""),
        season: String(data.get("season") || "ALL"),
        features: String(data.get("features") || ""),
        shortDescription: String(data.get("shortDescription") || ""),
        description: String(data.get("description") || ""),
        coverImageUrl,
        coverImageAlt: String(data.get("coverImageAlt") || title),
        featured: data.get("featured") === "on",
        published,
        sortOrder: Number(data.get("sortOrder") || 0),
        categoryIds: data.getAll("categoryIds").map(String),
        makkahHotelId: String(data.get("makkahHotelId") || ""),
        madinahHotelId: String(data.get("madinahHotelId") || ""),
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
      setSaving(null);
    }
  }

  const busy = saving !== null;

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
        {loading ? <AdminFormSkeleton fields={8} /> : null}
        {error ? (
          <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
            {error}
          </p>
        ) : null}
        {!loading ? (
          <form
            ref={formRef}
            onSubmit={(event) => event.preventDefault()}
            className="grid gap-4 md:grid-cols-2"
          >
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
              Journey type
              <select
                name="journeyType"
                defaultValue={pkg?.journeyType ?? "UMRAH"}
                className={adminSelectClass}
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
              <select name="season" defaultValue={pkg?.season ?? "ALL"} className={adminSelectClass}>
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
                className={adminSelectClass}
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
                className={adminSelectClass}
              >
                <option value="">None</option>
                {madinahHotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name} ({hotel.stars}★)
                  </option>
                ))}
              </select>
            </label>

            <AdminCoverUpload
              key={pkg?.id ?? "new-package"}
              className="md:col-span-2"
              initialUrl={pkg?.coverImageUrl}
              disabled={busy}
              onChange={setCover}
              onError={setError}
            />
            <label className={`${adminLabelClass} md:col-span-2`}>
              Cover alt text
              <input
                name="coverImageAlt"
                defaultValue={pkg?.coverImageAlt ?? ""}
                className={adminInputClass}
              />
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-charcoal md:col-span-2">
              <input name="featured" type="checkbox" defaultChecked={pkg?.featured ?? false} />
              Featured
            </label>

            <div className="flex flex-wrap gap-2 md:col-span-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => void save(false)}
                className={adminSecondaryButtonClass}
              >
                {saving === "draft" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Saving…
                  </>
                ) : (
                  "Draft"
                )}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void save(true)}
                className={adminPrimaryButtonClass}
              >
                {saving === "publish" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Publishing…
                  </>
                ) : (
                  "Publish"
                )}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => router.push("/admin/packages")}
                className={adminCancelButtonClass}
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
