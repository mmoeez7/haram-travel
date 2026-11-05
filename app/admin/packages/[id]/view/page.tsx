import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import {
  AdminEntityView,
  AdminFeatureList,
  AdminHotelPreviewCard,
  AdminImageGallery,
  AdminPreviewHero,
  AdminPreviewSection,
  AdminPriceCard,
  AdminViewStatus,
} from "@/components/admin/AdminEntityView";

export default async function ViewPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const pkg = await prisma.package.findFirst({
    where: { id, deletedAt: null },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              parent: { select: { name: true } },
            },
          },
        },
      },
      hotels: {
        include: {
          hotel: {
            select: {
              id: true,
              name: true,
              city: true,
              stars: true,
              walkingMinutes: true,
              distanceToHaramM: true,
              shortDescription: true,
              description: true,
              amenities: true,
              coverImageUrl: true,
              coverImageAlt: true,
              images: {
                orderBy: { sortOrder: "asc" },
                take: 1,
                select: { url: true, alt: true },
              },
            },
          },
        },
        orderBy: { role: "asc" },
      },
    },
  });
  if (!pkg) notFound();

  const images =
    pkg.images.length > 0
      ? pkg.images
      : pkg.coverImageUrl
        ? [{ id: "cover", url: pkg.coverImageUrl, alt: pkg.coverImageAlt }]
        : [];
  const cover = images[0];

  const categoryLabel =
    pkg.categories
      .map((link) => {
        const parent = link.category.parent?.name;
        return parent ? `${parent} › ${link.category.name}` : link.category.name;
      })
      .filter(Boolean)
      .join(", ") || "Uncategorised";

  const overview =
    pkg.description?.trim() ||
    pkg.shortDescription?.trim() ||
    `${pkg.subtitle}. A carefully arranged ${pkg.nights}-night journey with ${pkg.makkahNights} nights in Makkah and ${pkg.madinahNights} nights in Madinah.`;

  const hotels = [...pkg.hotels].sort((a, b) =>
    a.role === "MAKKAH" && b.role !== "MAKKAH"
      ? -1
      : a.role !== "MAKKAH" && b.role === "MAKKAH"
        ? 1
        : 0
  );

  return (
    <AdminEntityView
      title="Package preview"
      description="How this package appears on the website."
      editHref={`/admin/packages/${pkg.id}`}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-10">
        <div className="space-y-10">
          <AdminPreviewHero
            imageUrl={cover?.url}
            imageAlt={cover?.alt || pkg.coverImageAlt}
            badge={pkg.badge}
            eyebrow={`${pkg.stars}★ · ${pkg.nights} nights`}
            title={pkg.title}
            intro={pkg.shortDescription?.trim() || pkg.subtitle}
            status={<AdminViewStatus published={pkg.published} />}
            meta={
              <div className="flex flex-wrap gap-2 text-xs text-muted">
                <span className="rounded-full bg-cream px-2.5 py-1 font-medium text-ink">
                  {pkg.journeyType}
                </span>
                <span className="rounded-full bg-cream px-2.5 py-1 font-medium text-ink">
                  {pkg.season}
                </span>
                {pkg.featured ? (
                  <span className="rounded-full bg-gold/15 px-2.5 py-1 font-semibold text-gold-dark">
                    Featured
                  </span>
                ) : null}
                <span className="rounded-full bg-cream px-2.5 py-1 font-medium text-ink">
                  {categoryLabel}
                </span>
              </div>
            }
          />

          <AdminPreviewSection title="Package Overview">
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted md:text-base">
              {overview}
            </p>
          </AdminPreviewSection>

          <AdminPreviewSection title="Package Summary">
            <div className="grid grid-cols-2 gap-2 sm:max-w-md">
              <div className="rounded-xl border border-border bg-white px-3 py-3 text-center text-sm font-medium text-ink">
                {String(pkg.makkahNights).padStart(2, "0")} Nights in Makkah
              </div>
              <div className="rounded-xl border border-border bg-white px-3 py-3 text-center text-sm font-medium text-ink">
                {String(pkg.madinahNights).padStart(2, "0")} Nights in Madinah
              </div>
            </div>
            <div className="mt-6">
              <AdminFeatureList features={pkg.features} />
            </div>
          </AdminPreviewSection>
        </div>

        <AdminPriceCard
          priceFrom={Number(pkg.priceFrom)}
          deposit={Number(pkg.deposit)}
        />
      </div>

      <AdminPreviewSection title="Hotel Details">
        {hotels.length ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {hotels.map((link) => {
              const hotel = link.hotel;
              const image = hotel.images[0];
              const cityLabel = hotel.city === "MAKKAH" ? "Makkah" : "Madinah";
              return (
                <AdminHotelPreviewCard
                  key={`${link.role}-${hotel.id}`}
                  roleLabel={`${cityLabel} Hotel`}
                  name={hotel.name}
                  stars={hotel.stars}
                  walkingMinutes={hotel.walkingMinutes}
                  distanceToHaramM={hotel.distanceToHaramM}
                  nights={link.nights}
                  description={
                    hotel.shortDescription?.trim() ||
                    hotel.description?.trim() ||
                    `${hotel.stars}-star stay in ${cityLabel}.`
                  }
                  amenities={hotel.amenities}
                  imageUrl={image?.url ?? hotel.coverImageUrl}
                  imageAlt={image?.alt ?? hotel.coverImageAlt}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted">No hotels linked to this package.</p>
        )}
      </AdminPreviewSection>

      <AdminPreviewSection title="Gallery">
        <AdminImageGallery images={images} />
      </AdminPreviewSection>
    </AdminEntityView>
  );
}
