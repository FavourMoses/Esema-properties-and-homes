CREATE TYPE "public"."admin_role" AS ENUM('owner', 'staff');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."lead_type" AS ENUM('general', 'property_inquiry', 'consultation', 'verification_request');--> statement-breakpoint
CREATE TYPE "public"."listing_source" AS ENUM('esema_owned', 'partner_verified');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('planning', 'ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('available', 'under_offer', 'sold');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('house', 'land', 'apartment', 'duplex', 'commercial');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('verified', 'in_review', 'unverified');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" "admin_role" DEFAULT 'staff' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"failed_login_attempts" integer DEFAULT 0 NOT NULL,
	"locked_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"bank_name" varchar(120) NOT NULL,
	"account_name" varchar(160) NOT NULL,
	"account_number" varchar(40) NOT NULL,
	"currency" varchar(10) DEFAULT 'NGN' NOT NULL,
	"note" varchar(200),
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(255),
	"phone" varchar(40),
	"message" text NOT NULL,
	"type" "lead_type" DEFAULT 'general' NOT NULL,
	"property_id" uuid,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" uuid NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(220) NOT NULL,
	"title" varchar(220) NOT NULL,
	"description" text NOT NULL,
	"location" varchar(200),
	"status" "project_status" DEFAULT 'ongoing' NOT NULL,
	"progress_percent" integer DEFAULT 0 NOT NULL,
	"cover_image_url" text,
	"expected_completion" varchar(60),
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(220) NOT NULL,
	"title" varchar(220) NOT NULL,
	"description" text NOT NULL,
	"property_type" "property_type" DEFAULT 'house' NOT NULL,
	"listing_source" "listing_source" DEFAULT 'esema_owned' NOT NULL,
	"status" "property_status" DEFAULT 'available' NOT NULL,
	"verification_status" "verification_status" DEFAULT 'verified' NOT NULL,
	"price" numeric(14, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'NGN' NOT NULL,
	"price_period" varchar(40),
	"state" varchar(80) NOT NULL,
	"city" varchar(120) NOT NULL,
	"address_line" text,
	"bedrooms" integer,
	"bathrooms" integer,
	"size_sqm" integer,
	"cover_image_url" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"owner_contact_name" varchar(160),
	"owner_contact_phone" varchar(40),
	"internal_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "property_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" uuid NOT NULL,
	"url" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"icon" varchar(60) DEFAULT 'FileCheck2' NOT NULL,
	"title" varchar(160) NOT NULL,
	"short_description" text NOT NULL,
	"full_description" text,
	"image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"site_name" varchar(120) DEFAULT 'Esema Properties & Homes' NOT NULL,
	"tagline" varchar(200) DEFAULT 'Building Dreams. Creating Value.' NOT NULL,
	"logo_url" text,
	"hero_title" text DEFAULT 'Esema Properties & Homes' NOT NULL,
	"hero_subtitle" text DEFAULT 'We deliver quality, affordable, and verified properties across Nigeria — and stand beside you at every step, from land verification to handover.' NOT NULL,
	"hero_image_url" text,
	"hero_cta_primary_label" varchar(60) DEFAULT 'Explore Properties',
	"hero_cta_primary_href" varchar(200) DEFAULT '/properties',
	"hero_cta_secondary_label" varchar(60) DEFAULT 'How Verification Works',
	"hero_cta_secondary_href" varchar(200) DEFAULT '/services',
	"about_heading" varchar(200) DEFAULT 'About Esema Properties & Homes',
	"about_body" text,
	"about_image_url" text,
	"phone" varchar(40),
	"whatsapp" varchar(40),
	"email" varchar(255),
	"address" text,
	"facebook_url" text,
	"instagram_url" text,
	"twitter_url" text,
	"linkedin_url" text,
	"footer_note" text DEFAULT '© Esema Properties & Homes. All rights reserved.',
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"role" varchar(160) NOT NULL,
	"bio" text,
	"photo_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_name" varchar(160) NOT NULL,
	"client_role" varchar(160),
	"message" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"avatar_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "trust_features" (
	"id" serial PRIMARY KEY NOT NULL,
	"icon" varchar(60) DEFAULT 'ShieldCheck' NOT NULL,
	"title" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"step_number" integer NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;