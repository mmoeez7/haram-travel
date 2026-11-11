import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, isSlugTaken } from "@/lib/admin";
import { linesToArray, packageSchema } from "@/lib/admin-schemas";
import { assertAssignableUmrahCategory } from "@/lib/package-category";

type Params = { params: Promise<{ id: string }> };

function normalizeFeatures(value: unknown) {
  if (Array.isArray(value)) return value.join("\n");
  return String(value ?? "");
}

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { id } = await params;

  const pkg = await prisma.package.findFirst({
    where: { id, deletedAt: null },
    include: { categories: true, hotels: true, images: true },
  });
  if (!pkg) return jsonError("Package not found", 404);
  return NextResponse.json({ package: pkg });
}

export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.package.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Package not found", 404);

  const parsed = packageSchema.safeParse({
    ...body,
    slug: body.slug || existing.slug,
    features: normalizeFeatures(body.features),
    categoryId: body.categoryId ?? "",
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid package");
  }
  if (parsed.data.makkahNights + parsed.data.madinahNights > parsed.data.nights) {
    return jsonError("Makkah + Madinah nights cannot exceed total nights.");
  }
  if (await isSlugTaken("package", parsed.data.slug, id)) {
    return jsonError("Slug is already in use");
  }

  const categoryId =
    parsed.data.journeyType === "UMRAH" ? parsed.data.categoryId || "" : "";
  if (categoryId) {
    const check = await assertAssignableUmrahCategory(prisma, categoryId);
    if (!check.ok) return jsonError(check.message);
  }

  const coverImageUrl = parsed.data.coverImageUrl || null;
  const data = {
    title: parsed.data.title,
    subtitle: parsed.data.subtitle,
    slug: parsed.data.slug,
    journeyType: parsed.data.journeyType,
    stars: parsed.data.stars,
    nights: parsed.data.nights,
    makkahNights: parsed.data.makkahNights,
    madinahNights: parsed.data.madinahNights,
    priceFrom: parsed.data.priceFrom,
    deposit: parsed.data.deposit,
    badge: parsed.data.badge || null,
    season: parsed.data.season,
    features: linesToArray(parsed.data.features),
    shortDescription: parsed.data.shortDescription || null,
    description: parsed.data.description || null,
    coverImageUrl,
    coverImageAlt: parsed.data.coverImageAlt || parsed.data.title,
    featured: parsed.data.featured,
    published: parsed.data.published,
    sortOrder: parsed.data.sortOrder,
    publishedAt: parsed.data.published ? new Date() : null,
    updatedById: session.user.id,
  };

  // Sequential writes (Neon HTTP adapter — no interactive transactions / ws).
  const pkg = await prisma.package.update({ where: { id }, data });

  await prisma.packageCategory.deleteMany({ where: { packageId: pkg.id } });
  if (categoryId) {
    await prisma.packageCategory.create({
      data: { packageId: pkg.id, categoryId },
    });
  }

  await prisma.packageHotel.deleteMany({ where: { packageId: pkg.id } });
  if (parsed.data.makkahHotelId) {
    await prisma.packageHotel.create({
      data: {
        packageId: pkg.id,
        hotelId: parsed.data.makkahHotelId,
        role: "MAKKAH",
        nights: parsed.data.makkahNights,
      },
    });
  }
  if (parsed.data.madinahHotelId) {
    await prisma.packageHotel.create({
      data: {
        packageId: pkg.id,
        hotelId: parsed.data.madinahHotelId,
        role: "MADINAH",
        nights: parsed.data.madinahNights,
      },
    });
  }

  if (coverImageUrl) {
    await prisma.packageImage.deleteMany({
      where: { packageId: pkg.id, isCover: true },
    });
    await prisma.packageImage.create({
      data: {
        packageId: pkg.id,
        url: coverImageUrl,
        alt: data.coverImageAlt,
        isCover: true,
        sortOrder: 0,
      },
    });
  }

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "PACKAGE_UPDATE",
    entityType: "package",
    entityId: pkg.id,
    metadata: { slug: pkg.slug, published: pkg.published },
  });

  revalidatePath("/", "layout");
  revalidatePath("/umrah-packages");
  revalidatePath("/3-star-umrah-packages");
  revalidatePath("/4-star-umrah-packages");
  revalidatePath("/5-star-umrah-packages");
  revalidatePath("/hajj-packages");
  revalidatePath("/categories", "layout");
  revalidatePath(`/${pkg.slug}`);
  return NextResponse.json({ package: pkg });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const existing = await prisma.package.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Package not found", 404);

  await prisma.package.update({
    where: { id },
    data: { deletedAt: new Date(), published: false },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "PACKAGE_DELETE",
    entityType: "package",
    entityId: id,
  });

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
