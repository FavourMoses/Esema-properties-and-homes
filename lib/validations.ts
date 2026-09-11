import { z } from "zod";

// Accepts a full URL (https://...) OR a local path under /public (starting
// with "/") — the seed script and some default content use local paths,
// so image fields need to accept both, not just externally-hosted URLs.
export const imagePathSchema = z
  .string()
  .trim()
  .refine((val) => val === "" || /^https?:\/\//.test(val) || val.startsWith("/"), {
    message: "Enter a valid image URL, or leave blank",
  })
  .optional()
  .or(z.literal(""));

// Same rule as imagePathSchema, but for required (non-optional) fields —
// used as the item type inside arrays of image URLs.
export const imagePathItemSchema = z
  .string()
  .trim()
  .refine((val) => /^https?:\/\//.test(val) || val.startsWith("/"), {
    message: "Enter a valid image URL",
  });

export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(200),
});

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(160),
  email: z.string().trim().email("Please enter a valid email").max(255).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Please add a short message").max(4000),
  type: z.enum(["general", "property_inquiry", "consultation", "verification_request"]).default("general"),
  propertyId: z.string().uuid().optional().nullable(),
}).refine((data) => data.email || data.phone, {
  message: "Please provide an email or phone number so we can reach you",
  path: ["email"],
});

export const propertySchema = z.object({
  title: z.string().trim().min(3).max(220),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().trim().min(10).max(8000),
  propertyType: z.enum(["house", "land", "apartment", "duplex", "commercial"]),
  listingSource: z.enum(["esema_owned", "partner_verified"]),
  status: z.enum(["available", "under_offer", "sold"]),
  verificationStatus: z.enum(["verified", "in_review", "unverified"]),
  price: z.coerce.number().positive().max(999_999_999_999),
  currency: z.string().trim().max(10).default("NGN"),
  pricePeriod: z.string().trim().max(40).optional().or(z.literal("")),
  state: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(120),
  addressLine: z.string().trim().max(500).optional().or(z.literal("")),
  bedrooms: z.coerce.number().int().min(0).max(50).optional().nullable(),
  bathrooms: z.coerce.number().int().min(0).max(50).optional().nullable(),
  sizeSqm: z.coerce.number().int().min(0).max(1_000_000).optional().nullable(),
  coverImageUrl: imagePathSchema,
  isFeatured: z.coerce.boolean().default(false),
  ownerContactName: z.string().trim().max(160).optional().or(z.literal("")),
  ownerContactPhone: z.string().trim().max(40).optional().or(z.literal("")),
  internalNotes: z.string().trim().max(4000).optional().or(z.literal("")),
});

export const serviceSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  icon: z.string().trim().min(1).max(60),
  title: z.string().trim().min(2).max(160),
  shortDescription: z.string().trim().min(5).max(400),
  fullDescription: z.string().trim().max(8000).optional().or(z.literal("")),
  imageUrl: imagePathSchema,
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(2).max(200),
  logoUrl: imagePathSchema,
  heroTitle: z.string().trim().max(300).optional().or(z.literal("")),
  heroSubtitle: z.string().trim().max(600).optional().or(z.literal("")),
  heroImageUrl: imagePathSchema,
  heroCtaPrimaryLabel: z.string().trim().max(60).optional().or(z.literal("")),
  heroCtaPrimaryHref: z.string().trim().max(200).optional().or(z.literal("")),
  heroCtaSecondaryLabel: z.string().trim().max(60).optional().or(z.literal("")),
  heroCtaSecondaryHref: z.string().trim().max(200).optional().or(z.literal("")),
  aboutHeading: z.string().trim().max(200).optional().or(z.literal("")),
  aboutBody: z.string().trim().max(8000).optional().or(z.literal("")),
  aboutImageUrl: imagePathSchema,
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  whatsapp: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().max(400).optional().or(z.literal("")),
  facebookUrl: z.string().trim().url().optional().or(z.literal("")),
  instagramUrl: z.string().trim().url().optional().or(z.literal("")),
  twitterUrl: z.string().trim().url().optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url().optional().or(z.literal("")),
  footerNote: z.string().trim().max(300).optional().or(z.literal("")),
});

export const bankAccountSchema = z.object({
  bankName: z.string().trim().min(2).max(120),
  accountName: z.string().trim().min(2).max(160),
  accountNumber: z.string().trim().min(4).max(40),
  currency: z.string().trim().max(10).default("NGN"),
  note: z.string().trim().max(200).optional().or(z.literal("")),
  isActive: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(255),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(10),
    password: z.string().min(8, "Password must be at least 8 characters").max(200),
    confirmPassword: z.string().min(8).max(200),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
