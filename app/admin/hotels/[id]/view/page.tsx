import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import {
  AdminEntityView,
  AdminHotelPreviewCard,
  AdminImageGallery,
  AdminPreviewSection,
  AdminViewStatus,
} from "@/components/admin/AdminEntityView";

export default async function ViewHotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const hotel = await prisma.hotel.findFirst({
    where: { id, deletedAt: null },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!hotel) notFound();

  const images =
    hotel.images.length > 0
      ? hotel.images
      : hotel.coverImageUrl
        ? [{ id: "cover", url: hotel.coverImageUrl, alt: hotel.coverImageAlt }]
        : [];
  const cover = images[0];
  const cityLabel = hotel.city === "MAKKAH" ? "Makkah" : "Madinah";
  const copy =
    hotel.description?.trim() ||
    hotel.shortDescription?.trim() ||
    `${hotel.stars}-star stay in ${cityLabel} for your pilgrimage.`;

  return (
    <AdminEntityView
      title="Hotel preview"
      description="How this hotel appears on the website."
      editHref={`/admin/hotels/${hotel.id}`}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <AdminHotelPreviewCard
          roleLabel={`${cityLabel} Hotel`}
          name={hotel.name}
          stars={hotel.stars}
          walkingMinutes={hotel.walkingMinutes}
          distanceToHaramM={hotel.distanceToHaramM}
          description={copy}
          amenities={hotel.amenities}
          imageUrl={cover?.url}
          imageAlt={cover?.alt}
        />

        <aside className="space-y-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-wide text-muted">Status</p>
            <AdminViewStatus published={hotel.published} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Slug</p>
            <p className="mt-1 text-sm font-medium text-charcoal">{hotel.slug}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Sort order</p>
            <p className="mt-1 text-sm font-medium text-charcoal">{hotel.sortOrder}</p>
          </div>
        </aside>
      </div>

      <AdminPreviewSection title="All photos">
        <AdminImageGallery images={images} />
      </AdminPreviewSection>
    </AdminEntityView>
  );
}
