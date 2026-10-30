import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, slugify } from "@/lib/admin";
import { linesToArray, packageSchema } from "@/lib/admin-schemas";
import { revalidatePath } from "next/cache";

function normalizeFeatures(value: unknown) {
  if (Array.isArray(value)) return value.join("\n");
  return String(value ?? "");
}

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim();

  const packages = await prisma.package.findMany({
    where: {
      deletedAt: null,
      ...(status === "draft" ? { published: false } : {}),
      ...(status === "published" ? { published: true } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { slug: { contains: q, mode: "insensitive" } },
              { badge: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({ packages });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;

  const body = await request.json();
  const parsed = packageSchema.safeParse({
    ...body,
    slug: body.slug || slugify(String(body.title || "")),
    features: normalizeFeatures(body.features),
    categoryIds: body.categoryIds ?? [],
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid package");
  }
  if (parsed.data.makkahNights + parsed.data.madinahNights > parsed.data.nights) {
    return jsonError("Makkah + Madinah nights cannot exceed total nights.");
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
    createdById: session.user.id,
    updatedById: session.user.id,
  };

  const pkg = await prisma.$transaction(async (tx) => {
    const saved = await tx.package.create({ data });

    if (parsed.data.categoryIds.length) {
      await tx.packageCategory.createMany({
        data: parsed.data.categoryIds.map((categoryId) => ({
          packageId: saved.id,
          categoryId,
        })),
      });
    }
    if (parsed.data.makkahHotelId) {
      await tx.packageHotel.create({
        data: {
          packageId: saved.id,
          hotelId: parsed.data.makkahHotelId,
          role: "MAKKAH",
          nights: parsed.data.makkahNights,
        },
      });
    }
    if (parsed.data.madinahHotelId) {
      await tx.packageHotel.create({
        data: {
          packageId: saved.id,
          hotelId: parsed.data.madinahHotelId,
          role: "MADINAH",
          nights: parsed.data.madinahNights,
        },
      });
    }
    if (coverImageUrl) {
      await tx.packageImage.create({
        data: {
          packageId: saved.id,
          url: coverImageUrl,
          alt: data.coverImageAlt,
          isCover: true,
          sortOrder: 0,
        },
      });
    }
    return saved;
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "PACKAGE_CREATE",
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
  revalidatePath(`/packages/${pkg.slug}`);
  return NextResponse.json({ package: pkg }, { status: 201 });
}
