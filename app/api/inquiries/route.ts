import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { jsonError } from "@/lib/admin-api-auth";
import {
  contactInquirySchema,
  heroInquirySchema,
  packageInquirySchema,
} from "@/lib/admin-schemas";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body");
  }

  const bodyType =
    typeof body === "object" && body !== null && "type" in body
      ? (body as { type?: string }).type
      : undefined;

  const isContact = bodyType === "contact";

  if (isContact) {
    const parsed = contactInquirySchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid inquiry");
    }

    const data = parsed.data;
    const inquiry = await prisma.packageInquiry.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        message: data.message?.trim() || null,
        status: "NEW",
        source: "CONTACT",
      },
    });

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  }

  if (bodyType === "hero") {
    const parsed = heroInquirySchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid inquiry");
    }

    const data = parsed.data;
    const inquiry = await prisma.packageInquiry.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passengers: String(data.passengers),
        status: "NEW",
        source: "HERO",
      },
    });

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  }

  const parsed = packageInquirySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid inquiry");
  }

  const data = parsed.data;
  const inquiry = await prisma.packageInquiry.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
      season: data.season,
      departure: data.departure,
      nights: data.nights,
      hotelTier: data.hotelTier,
      passengers: data.passengers,
      status: "NEW",
      source: "HOME_MATCHER",
    },
  });

  return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
}
