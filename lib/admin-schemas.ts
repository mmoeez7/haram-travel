import { z } from "zod";
import { SLUG_PATH_REGEX } from "@/lib/slugify";
import { extractYoutubeId } from "@/lib/youtube";

const slugField = (max: number) =>
  z
    .string()
    .min(2)
    .max(max)
    .regex(
      SLUG_PATH_REGEX,
      "Slug must be lowercase kebab-case (optional / path segments allowed)"
    );

export const blogPostSchema = z.object({
  title: z.string().min(2).max(200),
  slug: slugField(220),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  content: z.string().max(200_000).optional().or(z.literal("")),
  coverImageUrl: z.string().optional().or(z.literal("")),
  coverImageAlt: z.string().max(200).optional().or(z.literal("")),
  metaTitle: z.string().max(160).optional().or(z.literal("")),
  metaDescription: z.string().max(320).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.coerce.boolean().default(false),
});

export const videoReviewSchema = z
  .object({
    videoUrl: z.string().min(5).max(500),
    description: z.string().min(2).max(500),
    title: z.string().max(160).optional().or(z.literal("")),
    cta: z.string().max(40).optional().or(z.literal("")),
    sortOrder: z.coerce.number().int().min(0).default(0),
    published: z.coerce.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!extractYoutubeId(data.videoUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid YouTube video link",
        path: ["videoUrl"],
      });
    }
  });

export const categorySchema = z.object({
  name: z.string().min(2).max(120),
  slug: slugField(160),
  kind: z.enum(["STAR", "SEASON", "JOURNEY", "CUSTOM"]).default("CUSTOM"),
  parentId: z.string().min(1).optional().nullable().or(z.literal("")),
  description: z.string().max(2000).optional().or(z.literal("")),
  seoContent: z.string().max(200_000).optional().or(z.literal("")),
  coverImageUrl: z.string().optional().or(z.literal("")),
  coverImageAlt: z.string().max(200).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.coerce.boolean().default(false),
});

export const hotelSchema = z.object({
  name: z.string().min(2).max(160),
  slug: slugField(160),
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
  imageUrls: z.array(z.string().min(1)).default([]),
  sortOrder: z.coerce.number().int().min(0).default(0),
  published: z.coerce.boolean().default(false),
});

export const packageSchema = z.object({
  title: z.string().min(2).max(160),
  subtitle: z.string().min(2).max(160),
  slug: slugField(200),
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
  imageUrls: z.array(z.string().min(1)).optional().default([]),
  featured: z.coerce.boolean().default(false),
  published: z.coerce.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
  categoryId: z.string().optional().or(z.literal("")),
  makkahHotelId: z.string().optional().or(z.literal("")),
  madinahHotelId: z.string().optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.journeyType === "UMRAH" && !data.categoryId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select a category for Umrah packages",
      path: ["categoryId"],
    });
  }
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

export const packageInquirySchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a UK WhatsApp number")
    .max(24),
  season: z.enum(["winter", "ramadan", "spring", "flexible"]),
  departure: z.enum(["london", "manchester", "birmingham"]),
  nights: z.coerce.number().int().refine((n) => [7, 10, 12, 14].includes(n), {
    message: "Select nights",
  }),
  hotelTier: z.enum(["clock_tower_5", "footsteps_4", "shuttle_3"]),
  passengers: z.enum(["1", "2", "3", "4_plus"]),
});

export const contactInquirySchema = z.object({
  type: z.literal("contact"),
  name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email").max(160),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a contact number")
    .max(24),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
});

export const packageInquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CLOSED"]),
});
