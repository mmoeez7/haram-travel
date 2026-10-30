import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2).max(120),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  kind: z.enum(["STAR", "SEASON", "JOURNEY", "CUSTOM"]),
  description: z.string().max(2000).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.coerce.boolean().default(false),
});

export const hotelSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z
    .string()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  city: z.enum(["MAKKAH", "MADINAH"]),
  stars: z.coerce.number().int().min(1).max(5),
  walkingMinutes: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().int().min(0).optional()
  ),
  distanceToHaramM: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.coerce.number().int().min(0).optional()
  ),
  address: z.string().max(300).optional().or(z.literal("")),
  shortDescription: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(10000).optional().or(z.literal("")),
  amenities: z.string().optional().or(z.literal("")),
  coverImageUrl: z.string().optional().or(z.literal("")),
  coverImageAlt: z.string().max(200).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.coerce.boolean().default(false),
});

export const packageSchema = z.object({
  title: z.string().min(2).max(160),
  subtitle: z.string().min(2).max(160),
  slug: z
    .string()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  journeyType: z.enum(["UMRAH", "HAJJ"]),
  stars: z.coerce.number().int().min(3).max(5),
  nights: z.coerce.number().int().min(1).max(60),
  makkahNights: z.coerce.number().int().min(0).max(60),
  madinahNights: z.coerce.number().int().min(0).max(60),
  priceFrom: z.coerce.number().min(0),
  deposit: z.coerce.number().min(0),
  badge: z.string().max(80).optional().or(z.literal("")),
  season: z.enum([
    "ALL",
    "JANUARY",
    "FEBRUARY",
    "EASTER",
    "RAMADAN",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ]),
  features: z.string().optional().or(z.literal("")),
  shortDescription: z.string().max(500).optional().or(z.literal("")),
  description: z.string().max(20000).optional().or(z.literal("")),
  coverImageUrl: z.string().optional().or(z.literal("")),
  coverImageAlt: z.string().max(200).optional().or(z.literal("")),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  categoryIds: z.array(z.string()).default([]),
  makkahHotelId: z.string().optional().or(z.literal("")),
  madinahHotelId: z.string().optional().or(z.literal("")),
});

export function linesToArray(value?: string | null) {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function csvToArray(value?: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
