import Image from "next/image";
import type { ReactNode } from "react";
import { Check, MapPin, Pencil, Star } from "lucide-react";
import {
  AdminPageHeader,
  adminEditLinkClass,
  adminPageClass,
  adminStatusDraftClass,
  adminStatusPublishedClass,
} from "@/components/admin/admin-ui";
import { AdminLoadingLink } from "@/components/admin/AdminLoadingLink";

export function AdminViewStatus({ published }: { published: boolean }) {
  return (
    <span className={published ? adminStatusPublishedClass : adminStatusDraftClass}>
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function AdminEntityView({
  title,
  description,
  editHref,
  children,
}: {
  title: string;
  description?: string;
  editHref: string;
  children: ReactNode;
}) {
  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={title}
        description={description}
        showBack
        actions={
          <AdminLoadingLink
            href={editHref}
            className={adminEditLinkClass}
            pendingLabel="Opening…"
            showPlus={false}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </AdminLoadingLink>
        }
      />
      <div className="admin-enter admin-enter-delay-1 space-y-8">{children}</div>
    </div>
  );
}

export function AdminPreviewHero({
  imageUrl,
  imageAlt,
  badge,
  eyebrow,
  title,
  intro,
  status,
  meta,
}: {
  imageUrl?: string | null;
  imageAlt?: string | null;
  badge?: string | null;
  eyebrow: string;
  title: string;
  intro?: string | null;
  status?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:gap-8">
      <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-border bg-white shadow-sm sm:min-h-[280px] md:min-h-[340px]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 70vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-cream" />
        )}
        {badge ? (
          <span className="absolute left-3 top-3 rounded-md bg-gold px-2.5 py-1 text-xs font-semibold text-charcoal md:left-4 md:top-4">
            {badge}
          </span>
        ) : null}
        {status ? <div className="absolute right-3 top-3 md:right-4 md:top-4">{status}</div> : null}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold uppercase tracking-wide text-charcoal md:text-4xl">
          {title}
        </h2>
        {intro ? (
          <p className="mt-3 max-w-3xl text-muted md:text-lg">{intro}</p>
        ) : null}
        {meta ? <div className="mt-4">{meta}</div> : null}
      </div>
    </div>
  );
}

export function AdminPreviewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="font-display text-2xl font-semibold uppercase tracking-wide text-charcoal md:text-3xl">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AdminFeatureList({ features }: { features: string[] }) {
  if (!features.length) {
    return <p className="text-sm text-muted">No includes listed.</p>;
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {features.map((feature) => (
        <li
          key={feature}
          className="flex items-start gap-2 rounded-xl border border-border/70 bg-white/70 px-3.5 py-3 text-sm text-ink"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
          {feature}
        </li>
      ))}
    </ul>
  );
}

export function AdminHotelPreviewCard({
  roleLabel,
  name,
  stars,
  walkingMinutes,
  distanceToHaramM,
  nights,
  description,
  amenities,
  imageUrl,
  imageAlt,
}: {
  roleLabel: string;
  name: string;
  stars: number;
  walkingMinutes?: number | null;
  distanceToHaramM?: number | null;
  nights?: number | null;
  description?: string | null;
  amenities?: string[];
  imageUrl?: string | null;
  imageAlt?: string | null;
}) {
  const distance =
    walkingMinutes != null
      ? `${walkingMinutes} min walk to Haram`
      : distanceToHaramM != null
        ? `${distanceToHaramM}m from Haram`
        : null;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="relative h-44 overflow-hidden bg-cream sm:h-52">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt || name}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : null}
      </div>
      <div className="p-4 md:p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-dark">
          {roleLabel}
        </p>
        <h4 className="mt-1 font-display text-xl font-semibold uppercase tracking-wide text-charcoal">
          {name}
        </h4>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1 font-medium text-ink">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" />
            {stars} Star
          </span>
          {distance ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-forest" />
              {distance}
            </span>
          ) : null}
          {nights != null ? <span>{nights} nights</span> : null}
        </div>
        {description ? (
          <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
        ) : null}
        {amenities?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {amenities.slice(0, 6).map((item) => (
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

export function AdminPriceCard({
  priceFrom,
  deposit,
}: {
  priceFrom: number;
  deposit: number;
}) {
  return (
    <aside className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-muted">Price from</p>
      <p className="mt-1 font-display text-4xl font-semibold text-charcoal">
        £{priceFrom.toLocaleString()}
        <span className="text-base font-sans font-medium text-muted"> /pp</span>
      </p>
      <span className="mt-3 inline-flex rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
        Deposit: £{deposit}pp
      </span>
    </aside>
  );
}

export function AdminImageGallery({
  images,
  emptyLabel = "No images uploaded yet.",
}: {
  images: Array<{ id?: string; url: string; alt?: string | null }>;
  emptyLabel?: string;
}) {
  if (!images.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-cream/60 px-4 py-10 text-center text-sm text-muted">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {images.map((image, index) => (
        <div
          key={image.id ?? `${image.url}-${index}`}
          className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-cream shadow-sm"
        >
          <Image
            src={image.url}
            alt={image.alt || "Image"}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
