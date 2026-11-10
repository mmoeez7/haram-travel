"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  UMRAH_DEALS_ROOT_SLUG,
  UMRAH_PACKAGES_ROOT_SLUG,
  type UmrahRootSlug,
} from "@/lib/category-roots";
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
import { AdminIncludesInput } from "@/components/admin/AdminIncludesInput";
import { AdminSlugField } from "@/components/admin/AdminSlugField";
import { SITE } from "@/lib/constants";
type Category = {
  id: string;
  name: string;
  parentId: string | null;
  parent: { id: string; name: string; slug: string } | null;
};
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [journeyType, setJourneyType] = useState("UMRAH");
  const [umrahGroup, setUmrahGroup] = useState<UmrahRootSlug>(UMRAH_PACKAGES_ROOT_SLUG);
  const [categoryId, setCategoryId] = useState("");
  const [includes, setIncludes] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
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
          setJourneyType(detail.package.journeyType);
          setIncludes(detail.package.features ?? []);
          setTitle(detail.package.title);
          setSlug(detail.package.slug);
          setCover({
            file: null,
            previewUrl: detail.package.coverImageUrl,
            removed: false,
          });

          const linkedId = detail.package.categories[0]?.categoryId ?? "";
          if (linkedId) {
            const linked = cats.categories.find((c) => c.id === linkedId);
            if (linked?.parent?.slug === UMRAH_DEALS_ROOT_SLUG) {
              setUmrahGroup(UMRAH_DEALS_ROOT_SLUG);
            } else {
              setUmrahGroup(UMRAH_PACKAGES_ROOT_SLUG);
            }
            setCategoryId(linkedId);
          }
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load form");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [packageId]);

  const filteredCategories = useMemo(
    () =>
      categories.filter(
        (c) => c.parentId && c.parent?.slug === umrahGroup
      ),
    [categories, umrahGroup]
  );

  function changeUmrahGroup(next: UmrahRootSlug) {
    setUmrahGroup(next);
    setCategoryId((current) => {
      const stillValid = categories.some(
        (c) => c.id === current && c.parent?.slug === next
      );
      return stillValid ? current : "";
    });
  }

  async function save(published: boolean) {
    const form = formRef.current;
    if (!form) return;
    if (!form.reportValidity()) return;

    if (journeyType === "UMRAH" && !categoryId) {
      toast.error("Select a category for this Umrah package.");
      return;
    }

    setSaving(published ? "publish" : "draft");
    const data = new FormData(form);

    try {
      let coverImageUrl = cover.removed ? "" : (pkg?.coverImageUrl ?? "");
      if (cover.file) {
        setUploadingCover(true);
        try {
          coverImageUrl = await uploadAdminCover(cover.file, "packages");
        } finally {
          setUploadingCover(false);
        }
      }

      const nextTitle = String(data.get("title") || title || "");
      if (!slug.trim()) {
        toast.error("URL slug is required.");
        setSaving(null);
        return;
      }
      const payload = {
        title: nextTitle,
        subtitle: String(data.get("subtitle") || ""),
        slug: slug.trim(),
        journeyType,
        stars: Number(data.get("stars") || 3),
        nights: Number(data.get("nights") || 7),
        makkahNights: Number(data.get("makkahNights") || 0),
        madinahNights: Number(data.get("madinahNights") || 0),
        priceFrom: Number(data.get("priceFrom") || 0),
        deposit: Number(data.get("deposit") || 0),
        badge: String(data.get("badge") || ""),
        season: String(data.get("season") || "ALL"),
        features: includes.join("\n"),
        shortDescription: String(data.get("shortDescription") || ""),
        description: String(data.get("description") || ""),
        coverImageUrl,
        coverImageAlt: String(data.get("coverImageAlt") || nextTitle),
        featured: data.get("featured") === "on",
        published,
        sortOrder: pkg?.sortOrder ?? 0,
        categoryId: journeyType === "UMRAH" ? categoryId : "",
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
      toast.success(published ? "Package published" : "Package saved as draft");
      router.push("/admin/packages");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
      setSaving(null);
    }
  }

  const busy = saving !== null;
  const makkahHotelId = pkg?.hotels.find((h) => h.role === "MAKKAH")?.hotelId ?? "";
  const madinahHotelId = pkg?.hotels.find((h) => h.role === "MADINAH")?.hotelId ?? "";
  const makkahHotels = hotels.filter((h) => h.city === "MAKKAH");
  const madinahHotels = hotels.filter((h) => h.city === "MADINAH");

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={packageId ? "Edit package" : "New package"}
        description="Packages sync to the public site when published."
        showBack
      />
      <AdminCard>
        {loading ? <AdminFormSkeleton fields={8} /> : null}
        {!loading ? (
          <form
            ref={formRef}
            onSubmit={(event) => event.preventDefault()}
            className="grid gap-4 md:grid-cols-2"
          >
            <label className={adminLabelClass}>
              Title
              <input
                name="title"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={adminInputClass}
              />
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
            <div className="md:col-span-2">
              <AdminSlugField
                value={slug}
                source={title}
                disabled={busy}
                initiallyLocked={Boolean(packageId)}
                previewPath={(value) => {
                  // Keep every "/" from the slug; always show WP-style trailing "/"
                  const path = value.replace(/^\/+/, "").replace(/\/+$/, "");
                  return path ? `${SITE.url}/${path}/` : `${SITE.url}/`;
                }}
                onChange={setSlug}
              />
            </div>
            <label className={adminLabelClass}>
              Journey type
              <select
                name="journeyType"
                value={journeyType}
                onChange={(event) => {
                  setJourneyType(event.target.value);
                  if (event.target.value === "HAJJ") setCategoryId("");
                }}
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
            <AdminIncludesInput
              className="md:col-span-2"
              value={includes}
              disabled={busy}
              onChange={setIncludes}
            />
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

            {journeyType === "UMRAH" ? (
              <fieldset className="rounded-xl border border-border p-4 md:col-span-2">
                <legend className="px-1 text-sm font-semibold text-charcoal">
                  Umrah category
                </legend>
                <div className="mb-4 inline-flex rounded-xl border border-border bg-cream/50 p-1">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => changeUmrahGroup(UMRAH_PACKAGES_ROOT_SLUG)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                      umrahGroup === UMRAH_PACKAGES_ROOT_SLUG
                        ? "bg-forest text-white"
                        : "text-ink hover:bg-white"
                    }`}
                  >
                    Umrah Packages
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => changeUmrahGroup(UMRAH_DEALS_ROOT_SLUG)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                      umrahGroup === UMRAH_DEALS_ROOT_SLUG
                        ? "bg-forest text-white"
                        : "text-ink hover:bg-white"
                    }`}
                  >
                    Umrah Deals
                  </button>
                </div>
                <label className={adminLabelClass}>
                  Category
                  <select
                    name="categoryId"
                    required
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                    className={adminSelectClass}
                  >
                    <option value="">Select category</option>
                    {filteredCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                {filteredCategories.length === 0 ? (
                  <p className="mt-2 text-xs text-muted">
                    No subcategories under this group yet. Create one in Categories first.
                  </p>
                ) : null}
              </fieldset>
            ) : null}

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
              uploading={uploadingCover}
              onChange={setCover}
              onError={(msg) => toast.error(msg)}
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
