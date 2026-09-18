import {
  pgTable,
  serial,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  numeric,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ENUMS
 * ─────────────────────────────────────────────────────────────────────────
 */
export const adminRoleEnum = pgEnum("admin_role", ["owner", "staff"]);

export const propertyTypeEnum = pgEnum("property_type", [
  "house",
  "land",
  "apartment",
  "duplex",
  "commercial",
]);

// Who actually owns the property. This is the core of the "middleman" model:
// Esema either owns the property outright, or is acting as a verified agent
// for a third-party owner elsewhere in Nigeria.
export const listingSourceEnum = pgEnum("listing_source", [
  "esema_owned",
  "partner_verified",
]);

export const propertyStatusEnum = pgEnum("property_status", [
  "available",
  "under_offer",
  "sold",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "verified",
  "in_review",
  "unverified",
]);

export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "ongoing",
  "completed",
]);

export const leadTypeEnum = pgEnum("lead_type", [
  "general",
  "property_inquiry",
  "consultation",
  "verification_request",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "closed",
]);

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ADMIN USERS  — the only people who can log into /admin
 * ─────────────────────────────────────────────────────────────────────────
 */
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: adminRoleEnum("role").notNull().default("staff"),
  // Which admin sections a "staff" user can access — ignored for "owner",
  // who always has full access. See lib/permissions.ts for the valid keys.
  permissions: jsonb("permissions").$type<string[]>().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  // Simple brute-force protection: after too many wrong passwords in a row,
  // the account is locked until this timestamp passes.
  failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PASSWORD RESETS — one table per account type, each with its own FK, so
 *  a reset token for a staff account can never be replayed against a
 *  customer account or vice versa. Tokens are stored as a hash, never in
 *  plain text, and are single-use (usedAt) and time-limited (expiresAt).
 * ─────────────────────────────────────────────────────────────────────────
 */
export const adminPasswordResets = pgTable("admin_password_resets", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminUserId: uuid("admin_user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SITE SETTINGS — single row. Every word of the public homepage/contact
 *  block that isn't a listing or service comes from here, so the client can
 *  rewrite the site without touching code.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),

  siteName: varchar("site_name", { length: 120 })
    .notNull()
    .default("Esema Properties & Homes"),
  tagline: varchar("tagline", { length: 200 })
    .notNull()
    .default("Building Dreams. Creating Value."),
  logoUrl: text("logo_url"),

  heroTitle: text("hero_title").notNull().default("Esema Properties & Homes"),
  heroSubtitle: text("hero_subtitle")
    .notNull()
    .default(
      "We deliver quality, affordable, and verified properties across Nigeria — and stand beside you at every step, from land verification to handover.",
    ),
  heroImageUrl: text("hero_image_url"),
  heroCtaPrimaryLabel: varchar("hero_cta_primary_label", {
    length: 60,
  }).default("Explore Properties"),
  heroCtaPrimaryHref: varchar("hero_cta_primary_href", { length: 200 }).default(
    "/properties",
  ),
  heroCtaSecondaryLabel: varchar("hero_cta_secondary_label", {
    length: 60,
  }).default("How Verification Works"),
  heroCtaSecondaryHref: varchar("hero_cta_secondary_href", {
    length: 200,
  }).default("/services"),

  aboutHeading: varchar("about_heading", { length: 200 }).default(
    "About Esema Properties & Homes",
  ),
  aboutBody: text("about_body"),
  aboutImageUrl: text("about_image_url"),

  phone: varchar("phone", { length: 40 }),
  whatsapp: varchar("whatsapp", { length: 40 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),

  facebookUrl: text("facebook_url"),
  instagramUrl: text("instagram_url"),
  twitterUrl: text("twitter_url"),
  linkedinUrl: text("linkedin_url"),

  footerNote: text("footer_note").default(
    "© Esema Properties & Homes. All rights reserved.",
  ),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  BANK ACCOUNTS — displayed to a buyer once they're ready to pay.
 *  No payment gateway: this is intentionally just editable text.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const bankAccounts = pgTable("bank_accounts", {
  id: serial("id").primaryKey(),
  bankName: varchar("bank_name", { length: 120 }).notNull(),
  accountName: varchar("account_name", { length: 160 }).notNull(),
  accountNumber: varchar("account_number", { length: 40 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("NGN"),
  note: varchar("note", { length: 200 }),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
}).enableRLS();

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  TRUST FEATURES — the small "Quality Homes / Trusted & Reliable / ..."
 *  badge row under the hero.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const trustFeatures = pgTable("trust_features", {
  id: serial("id").primaryKey(),
  icon: varchar("icon", { length: 60 }).notNull().default("ShieldCheck"),
  title: varchar("title", { length: 120 }).notNull().unique(),
  description: text("description").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
}).enableRLS();

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SERVICES — Land Verification, Site Inspection Reports, Construction
 *  Monitoring, Vetted Builders Network, and anything the client adds later.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  icon: varchar("icon", { length: 60 }).notNull().default("FileCheck2"),
  title: varchar("title", { length: 160 }).notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
}).enableRLS();

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  VERIFICATION STEPS — the numbered "how buying through us works" process.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const verificationSteps = pgTable("verification_steps", {
  id: serial("id").primaryKey(),
  stepNumber: integer("step_number").notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").notNull().default(true),
}).enableRLS();

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PROPERTIES
 * ─────────────────────────────────────────────────────────────────────────
 */
export const properties = pgTable("properties", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),

  propertyType: propertyTypeEnum("property_type").notNull().default("house"),
  listingSource: listingSourceEnum("listing_source")
    .notNull()
    .default("esema_owned"),
  status: propertyStatusEnum("status").notNull().default("available"),
  verificationStatus: verificationStatusEnum("verification_status")
    .notNull()
    .default("verified"),

  price: numeric("price", { precision: 14, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("NGN"),
  pricePeriod: varchar("price_period", { length: 40 }), // e.g. "per year" for rentals, null for sale

  state: varchar("state", { length: 80 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  addressLine: text("address_line"),

  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  sizeSqm: integer("size_sqm"),

  coverImageUrl: text("cover_image_url"),
  isFeatured: boolean("is_featured").notNull().default(false),

  // Internal-only — never rendered on the public site. Used when the
  // property belongs to a third party and Esema is verifying/brokering it.
  ownerContactName: varchar("owner_contact_name", { length: 160 }),
  ownerContactPhone: varchar("owner_contact_phone", { length: 40 }),
  internalNotes: text("internal_notes"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export const propertyImages = pgTable("property_images", {
  id: serial("id").primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
}).enableRLS();

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  CUSTOMER USERS — property buyers who can sign in to /portal to see
 *  progress on the property they bought. Completely separate login system
 *  from admin_users — never mixed with staff access.
 * ─────────────────────────────────────────────────────────────────────────
 */
export const customerUsers = pgTable("customer_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 40 }),
  passwordHash: text("password_hash").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export const customerPasswordResets = pgTable("customer_password_resets", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerUserId: uuid("customer_user_id")
    .notNull()
    .references(() => customerUsers.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

/**
 * Which customer(s) can see which propert(ies). A property can have more
 * than one linked buyer (e.g. a couple), and — in principle — a customer
 * could be linked to more than one property.
 */
export const propertyCustomers = pgTable("property_customers", {
  id: serial("id").primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  customerUserId: uuid("customer_user_id")
    .notNull()
    .references(() => customerUsers.id, { onDelete: "cascade" }),
}).enableRLS();

/**
 * The progress feed a customer sees for their property — land verification
 * notes, inspection reports, construction updates, all in one timeline.
 * isVisibleToCustomer is the admin's on/off switch for each entry.
 */
export const propertyUpdates = pgTable("property_updates", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 220 }).notNull(),
  message: text("message").notNull(),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  isVisibleToCustomer: boolean("is_visible_to_customer")
    .notNull()
    .default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PROJECTS — ongoing construction / development projects
 * ─────────────────────────────────────────────────────────────────────────
 */
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  description: text("description").notNull(),
  location: varchar("location", { length: 200 }),
  status: projectStatusEnum("status").notNull().default("ongoing"),
  progressPercent: integer("progress_percent").notNull().default(0),
  coverImageUrl: text("cover_image_url"),
  expectedCompletion: varchar("expected_completion", { length: 60 }),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();

export const projectImages = pgTable("project_images", {
  id: serial("id").primaryKey(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
}).enableRLS();

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  TESTIMONIALS & TEAM
 * ─────────────────────────────────────────────────────────────────────────
 */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  clientName: varchar("client_name", { length: 160 }).notNull(),
  clientRole: varchar("client_role", { length: 160 }),
  message: text("message").notNull(),
  rating: integer("rating").notNull().default(5),
  avatarUrl: text("avatar_url"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
}).enableRLS();

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  role: varchar("role", { length: 160 }).notNull(),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
}).enableRLS();

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  LEADS — every contact form / property inquiry / consultation request
 * ─────────────────────────────────────────────────────────────────────────
 */
export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 40 }),
  message: text("message").notNull(),
  type: leadTypeEnum("type").notNull().default("general"),
  propertyId: uuid("property_id").references(() => properties.id, {
    onDelete: "set null",
  }),
  status: leadStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}).enableRLS();
