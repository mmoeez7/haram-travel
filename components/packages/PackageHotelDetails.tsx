"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, MapPin, Star } from "lucide-react";
import type { PackageHotelRef } from "@/lib/packages";
import type { PublicHotel } from "@/lib/public-hotel";
import { makkahFirstRank } from "@/lib/hotel-rank";

type HotelCardData = PublicHotel & {
  nights: number | null;
  notes: string | null;
};

function distanceLabel(hotel: PublicHotel) {
  if (hotel.walkingMinutes != null) {
    return `${hotel.walkingMinutes} min walk to Haram`;
  }
  if (hotel.distanceToHaramM != null) {
    return `${hotel.distanceToHaramM}m from Haram`;
  }
  return null;
}

function HotelCard({
  roleLabel,
  hotel,
}: {
  roleLabel: string;
  hotel: HotelCardData;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = hotel.images.length
    ? hotel.images
    : hotel.coverImageUrl
      ? [
          {
            id: "cover",
            url: hotel.coverImageUrl,
            alt: hotel.coverImageAlt,
            sortOrder: 0,
          },
        ]
      : [];
  const active = images[activeIndex] ?? images[0];

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [activeIndex, images.length]);
  const distance = distanceLabel(hotel);
  const copy =
    hotel.shortDescription?.trim() ||
    hotel.description?.trim() ||
    `${hotel.stars}-star stay in ${hotel.city === "MAKKAH" ? "Makkah" : "Madinah"} for your pilgrimage.`;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="relative h-44 overflow-hidden bg-cream sm:h-52">
        {active ? (
          <Image
            key={active.id}
            src={active.url}
            alt={active.alt || hotel.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (current) => (current - 1 + images.length) % images.length
                )
              }
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-forest bg-white text-forest shadow-sm transition hover:bg-cream"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((current) => (current + 1) % images.length)
              }
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border-2 border-forest bg-white text-forest shadow-sm transition hover:bg-cream"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.25} aria-hidden />
            </button>
          </>
        ) : null}
      </div>
      <div className="p-4 md:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-dark">
          {roleLabel}
        </p>
        <h3 className="mt-1 font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
          {hotel.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1 font-medium text-ink">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            {hotel.stars} Star
          </span>
          {distance ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-forest" />
              {distance}
            </span>
          ) : null}
          {hotel.nights != null ? <span>{hotel.nights} nights</span> : null}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{copy}</p>
        {hotel.amenities.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 6).map((item) => (
              <span
                key={item}
                className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-medium text-ink"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

function HotelCardSkeleton({ roleLabel }: { roleLabel: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex h-44 items-center justify-center bg-cream sm:h-52">
        <Loader2 className="h-5 w-5 animate-spin text-gold-dark" aria-hidden />
      </div>
      <div className="space-y-2 p-4 md:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-dark">
          {roleLabel}
        </p>
        <div className="h-5 w-2/3 rounded bg-cream" />
        <div className="h-3 w-full rounded bg-cream" />
        <div className="h-3 w-5/6 rounded bg-cream" />
      </div>
    </div>
  );
}

async function fetchHotel(ref: PackageHotelRef): Promise<HotelCardData | null> {
  const res = await fetch(`/api/hotels/${ref.hotelId}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = (await res.json()) as { hotel: PublicHotel };
  return {
    ...data.hotel,
    nights: ref.nights,
    notes: ref.notes,
  };
}

function hotelRoleLabel(role: PackageHotelRef["role"]) {
  return role === "MADINAH" ? "Madinah Hotel" : "Makkah Hotel";
}

function makkahHotelsFirst<T extends { role: PackageHotelRef["role"]; city?: PublicHotel["city"] }>(
  hotels: T[]
) {
  return [...hotels].sort(
    (a, b) => makkahFirstRank(a.city ?? a.role) - makkahFirstRank(b.city ?? b.role)
  );
}

export function PackageHotelDetails({ hotels }: { hotels: PackageHotelRef[] }) {
  const orderedHotels = useMemo(() => makkahHotelsFirst(hotels), [hotels]);
  const [cards, setCards] = useState<Array<HotelCardData & { role: PackageHotelRef["role"] }> | null>(
    null
  );
  const [loading, setLoading] = useState(orderedHotels.length > 0);
  const hotelKey = orderedHotels
    .map((hotel) => `${hotel.role}:${hotel.hotelId}:${hotel.nights ?? ""}`)
    .join("|");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!orderedHotels.length) {
        setCards([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const loaded = await Promise.all(
          orderedHotels.map(async (hotel) => {
            const detail = await fetchHotel(hotel);
            return detail ? { ...detail, role: hotel.role } : null;
          })
        );
        if (cancelled) return;
        setCards(
          makkahHotelsFirst(
            loaded.filter(
              (hotel): hotel is HotelCardData & { role: PackageHotelRef["role"] } =>
                hotel !== null
            )
          )
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [hotelKey, orderedHotels]);

  if (!orderedHotels.length) return null;

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal md:text-3xl">
        Hotel Details
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Verified stays selected for comfort and practical access to the Haram.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {loading && !cards
          ? orderedHotels.map((hotel) => (
              <HotelCardSkeleton
                key={`${hotel.role}-${hotel.hotelId}`}
                roleLabel={hotelRoleLabel(hotel.role)}
              />
            ))
          : makkahHotelsFirst(cards ?? []).map((hotel) => (
              <HotelCard
                key={`${hotel.city}-${hotel.id}`}
                roleLabel={hotelRoleLabel(hotel.city)}
                hotel={hotel}
              />
            ))}
      </div>
    </section>
  );
}
