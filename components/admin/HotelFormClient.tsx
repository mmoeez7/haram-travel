"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
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
  AdminMultiImageUpload,
  type ExistingHotelImage,
  type MultiImageUploadHandle,
} from "@/components/admin/AdminMultiImageUpload";
import { AdminSlugField } from "@/components/admin/AdminSlugField";

type Hotel = {
  id: string;
  name: string;
  slug: string;
  city: string;
  stars: number;
  walkingMinutes: number | null;
  distanceToHaramM: number | null;
  description: string | null;
  amenities: string[];
  sortOrder: number;
  published: boolean;
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  images?: ExistingHotelImage[];
};

function initialHotelImages(hotel?: Hotel): ExistingHotelImage[] {
  if (!hotel) return [];
  if (hotel.images?.length) return hotel.images;
  if (hotel.coverImageUrl) {
    return [{ url: hotel.coverImageUrl, alt: hotel.coverImageAlt }];
  }
  return [];
}

export function HotelFormClient({ hotel }: { hotel?: Hotel }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const imagesRef = useRef<MultiImageUploadHandle | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [name, setName] = useState(hotel?.name ?? "");
  const [slug, setSlug] = useState(hotel?.slug ?? "");

  async function save(published: boolean) {
    const form = formRef.current;
    if (!form) return;
    if (!form.reportValidity()) return;

    setSaving(published ? "publish" : "draft");
    setError("");
    const data = new FormData(form);

    try {
      const imageUrls = (await imagesRef.current?.collectUrls()) ?? [];
      const nextName = String(data.get("name") || name || "");
      if (!slug.trim()) {
        setError("URL slug is required.");
        setSaving(null);
        return;
      }
      const payload = {
        name: nextName,
        slug: slug.trim(),
        city: String(data.get("city") || "MAKKAH"),
        stars: Number(data.get("stars") || 4),
        walkingMinutes: data.get("walkingMinutes") || undefined,
        distanceToHaramM: data.get("distanceToHaramM") || undefined,
        description: String(data.get("description") || ""),
        amenities: String(data.get("amenities") || ""),
        imageUrls,
        sortOrder: Number(data.get("sortOrder") || 0),
        published,
      };

      if (hotel) {
        await adminFetch(`/api/admin/hotels/${hotel.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/admin/hotels", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/admin/hotels");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(null);
    }
  }

  const busy = saving !== null;

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={hotel ? "Edit hotel" : "New hotel"}
        description="Hotel details appear on packages and walking-distance guides."
        showBack
      />
      <AdminCard>
        {error ? (
          <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
            {error}
          </p>
        ) : null}
        <form
          ref={formRef}
          onSubmit={(event) => event.preventDefault()}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <label className={adminLabelClass}>
            Name
            <input
              name="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={adminInputClass}
            />
          </label>
          <label className={adminLabelClass}>
            City
            <select name="city" defaultValue={hotel?.city ?? "MAKKAH"} className={adminSelectClass}>
              <option value="MAKKAH">Makkah</option>
              <option value="MADINAH">Madinah</option>
            </select>
          </label>
          <div className="sm:col-span-2 xl:col-span-3">
            <AdminSlugField
              value={slug}
              source={name}
              disabled={busy}
              initiallyLocked={Boolean(hotel)}
              resetLabel="Reset from name"
              previewPath={(value) => `URL slug: ${value}`}
              hint="Lowercase letters, numbers, hyphens, and / for path segments."
              onChange={setSlug}
            />
          </div>
          <label className={adminLabelClass}>
            Stars
            <input
              name="stars"
              type="number"
              min={1}
              max={5}
              required
              defaultValue={hotel?.stars ?? 4}
              className={adminInputClass}
            />
          </label>
          <label className={adminLabelClass}>
            Walking minutes
            <input
              name="walkingMinutes"
              type="number"
              min={0}
              defaultValue={hotel?.walkingMinutes ?? ""}
              className={adminInputClass}
            />
          </label>
          <label className={adminLabelClass}>
            Distance to Haram (m)
            <input
              name="distanceToHaramM"
              type="number"
              min={0}
              defaultValue={hotel?.distanceToHaramM ?? ""}
              className={adminInputClass}
            />
          </label>
          <label className={adminLabelClass}>
            Sort order
            <input
              name="sortOrder"
              type="number"
              defaultValue={hotel?.sortOrder ?? 0}
              className={adminInputClass}
            />
          </label>
          <label className={`${adminLabelClass} sm:col-span-2 xl:col-span-3`}>
            Description
            <textarea
              name="description"
              rows={4}
              defaultValue={hotel?.description ?? ""}
              className={adminInputClass}
            />
          </label>
          <label className={`${adminLabelClass} sm:col-span-2 xl:col-span-3`}>
            Amenities (comma separated)
            <input
              name="amenities"
              defaultValue={hotel?.amenities?.join(", ") ?? ""}
              className={adminInputClass}
            />
          </label>

          <AdminMultiImageUpload
            className="sm:col-span-2 xl:col-span-3"
            initialImages={initialHotelImages(hotel)}
            disabled={busy}
            onError={setError}
            uploadRef={imagesRef}
          />

          <div className="flex flex-wrap gap-2 sm:col-span-2 xl:col-span-3">
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
              onClick={() => router.push("/admin/hotels")}
              className={adminCancelButtonClass}
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
