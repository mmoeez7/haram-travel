"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

type Hotel = {
  id: string;
  name: string;
  slug: string;
  city: string;
  stars: number;
  walkingMinutes: number | null;
  distanceToHaramM: number | null;
  address: string | null;
  shortDescription: string | null;
  description: string | null;
  amenities: string[];
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  sortOrder: number;
  published: boolean;
};

async function uploadCover(file: File) {
  const form = new FormData();
  form.set("file", file);
  form.set("folder", "hotels");
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: form,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Upload failed");
  return payload.url as string;
}

export function HotelFormClient({ hotel }: { hotel?: Hotel }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
        name: String(form.get("name") || ""),
        slug: String(form.get("slug") || ""),
        city: String(form.get("city") || "MAKKAH"),
        stars: Number(form.get("stars") || 4),
        walkingMinutes: form.get("walkingMinutes") || undefined,
        distanceToHaramM: form.get("distanceToHaramM") || undefined,
        address: String(form.get("address") || ""),
        shortDescription: String(form.get("shortDescription") || ""),
        description: String(form.get("description") || ""),
        amenities: String(form.get("amenities") || ""),
        coverImageUrl,
        coverImageAlt: String(form.get("coverImageAlt") || ""),
        sortOrder: Number(form.get("sortOrder") || 0),
        published: form.get("published") === "on",
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
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={hotel ? "Edit hotel" : "New hotel"}
        description="Hotel details appear on packages and walking-distance guides."
      />
      <AdminCard className="max-w-3xl">
        {error ? (
          <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
            {error}
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <label className={adminLabelClass}>
            Name
            <input name="name" required defaultValue={hotel?.name} className={adminInputClass} />
          </label>
          <label className={adminLabelClass}>
            Slug
            <input name="slug" required defaultValue={hotel?.slug} className={adminInputClass} />
          </label>
          <label className={adminLabelClass}>
            City
            <select name="city" defaultValue={hotel?.city ?? "MAKKAH"} className={adminInputClass}>
              <option value="MAKKAH">Makkah</option>
              <option value="MADINAH">Madinah</option>
            </select>
          </label>
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
          <label className={`${adminLabelClass} md:col-span-2`}>
            Address
            <input name="address" defaultValue={hotel?.address ?? ""} className={adminInputClass} />
          </label>
          <label className={`${adminLabelClass} md:col-span-2`}>
            Short description
            <textarea
              name="shortDescription"
              rows={2}
              defaultValue={hotel?.shortDescription ?? ""}
              className={adminInputClass}
            />
          </label>
          <label className={`${adminLabelClass} md:col-span-2`}>
            Description
            <textarea
              name="description"
              rows={4}
              defaultValue={hotel?.description ?? ""}
              className={adminInputClass}
            />
          </label>
          <label className={`${adminLabelClass} md:col-span-2`}>
            Amenities (comma separated)
            <input
              name="amenities"
              defaultValue={hotel?.amenities?.join(", ") ?? ""}
              className={adminInputClass}
            />
          </label>
          <label className={`${adminLabelClass} md:col-span-2`}>
            Cover image URL
            <input
              name="coverImageUrl"
              defaultValue={hotel?.coverImageUrl ?? ""}
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
          <label className={adminLabelClass}>
            Cover alt text
            <input
              name="coverImageAlt"
              defaultValue={hotel?.coverImageAlt ?? ""}
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
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal md:col-span-2">
            <input name="published" type="checkbox" defaultChecked={hotel?.published ?? false} />
            Published
          </label>
          <div className="flex gap-2 md:col-span-2">
            <button type="submit" disabled={saving} className={adminPrimaryButtonClass}>
              {saving ? "Saving…" : "Save hotel"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/hotels")}
              className={adminSecondaryButtonClass}
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
