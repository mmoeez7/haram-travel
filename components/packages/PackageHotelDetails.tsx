"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Loader2, MapPin, Star } from "lucide-react";
import type { PackageHotelRef } from "@/lib/packages";
import type { PublicHotel } from "@/lib/hotels";

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
  const distance = distanceLabel(hotel);
  const copy =
    hotel.shortDescription?.trim() ||
    hotel.description?.trim() ||
    `${hotel.stars}-star stay in ${hotel.city === "MAKKAH" ? "Makkah" : "Madinah"} for your pilgrimage.`;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="relative h-44 bg-cream sm:h-52">
        {active ? (
          <Image
            src={active.url}
            alt={active.alt || hotel.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : null}
      </div>
      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto border-b border-border bg-cream/40 px-3 py-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md border transition ${
                index === activeIndex
                  ? "border-gold ring-1 ring-gold"
                  : "border-border opacity-80 hover:opacity-100"
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${hotel.name} ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      ) : null}
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

type PackageHotelDetailsProps = {
  makkahHotelRef: PackageHotelRef | null;
  madinahHotelRef: PackageHotelRef | null;
};

export function PackageHotelDetails({
  makkahHotelRef,
  madinahHotelRef,
}: PackageHotelDetailsProps) {
  const [makkah, setMakkah] = useState<HotelCardData | null>(null);
  const [madinah, setMadinah] = useState<HotelCardData | null>(null);
  const [loading, setLoading] = useState(
    Boolean(makkahHotelRef || madinahHotelRef)
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!makkahHotelRef && !madinahHotelRef) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [makkahHotel, madinahHotel] = await Promise.all([
          makkahHotelRef ? fetchHotel(makkahHotelRef) : Promise.resolve(null),
          madinahHotelRef ? fetchHotel(madinahHotelRef) : Promise.resolve(null),
        ]);
        if (cancelled) return;
        setMakkah(makkahHotel);
        setMadinah(madinahHotel);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [makkahHotelRef?.hotelId, madinahHotelRef?.hotelId, makkahHotelRef, madinahHotelRef]);

  if (!makkahHotelRef && !madinahHotelRef) return null;

  return (
    <section>
      <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal md:text-3xl">
        Hotel Details
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Verified stays selected for comfort and practical access to the Haram.
      </p>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {makkahHotelRef ? (
          loading && !makkah ? (
            <HotelCardSkeleton roleLabel="Makkah Hotel" />
          ) : makkah ? (
            <HotelCard roleLabel="Makkah Hotel" hotel={makkah} />
          ) : null
        ) : null}
        {madinahHotelRef ? (
          loading && !madinah ? (
            <HotelCardSkeleton roleLabel="Madinah Hotel" />
          ) : madinah ? (
            <HotelCard roleLabel="Madinah Hotel" hotel={madinah} />
          ) : null
        ) : null}
      </div>
    </section>
  );
}
