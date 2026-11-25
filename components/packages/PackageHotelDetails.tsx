"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import type { PackageHotelCard, PublicHotel } from "@/lib/public-hotel";
import { makkahFirstRank } from "@/lib/hotel-rank";

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
  priority = false,
}: {
  roleLabel: string;
  hotel: PackageHotelCard;
  priority?: boolean;
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
      <div className="relative h-44 overflow-hidden bg-cream sm:h-52">
        {active ? (
          <Image
            key={active.id}
            src={active.url}
            alt={active.alt || hotel.name}
            fill
            priority={priority && activeIndex === 0}
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
          <span
            className="inline-flex items-center gap-0.5 font-medium text-ink"
            aria-label={`${hotel.stars} star`}
          >
            {Array.from({ length: hotel.stars }, (_, i) => (
              <Star
                key={i}
                className="h-3.5 w-3.5 fill-gold text-gold"
                aria-hidden
              />
            ))}
          </span>
          {distance ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-forest" />
              {distance}
            </span>
          ) : null}
          {hotel.nights != null ? <span>{hotel.nights} nights</span> : null}
        </div>
        <p className="mt-3 h-28 overflow-y-auto pr-1 text-sm leading-relaxed text-muted">
          {copy}
        </p>
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

function hotelRoleLabel(role: PackageHotelCard["role"] | PublicHotel["city"]) {
  return role === "MADINAH" ? "Madinah Hotel" : "Makkah Hotel";
}

export function PackageHotelDetails({ hotels }: { hotels: PackageHotelCard[] }) {
  const orderedHotels = [...hotels].sort(
    (a, b) => makkahFirstRank(a.city) - makkahFirstRank(b.city)
  );

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
        {orderedHotels.map((hotel, index) => (
          <HotelCard
            key={`${hotel.city}-${hotel.id}`}
            roleLabel={hotelRoleLabel(hotel.city)}
            hotel={hotel}
            priority={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
