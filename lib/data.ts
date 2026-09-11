import { db, schema } from "@/lib/db";
import { and, asc, count, desc, eq } from "drizzle-orm";

/**
 * Every function here reads from the database — nothing on the public site
 * is hardcoded. If a table is empty (e.g. right after first deploy, before
 * the client has added content), pages fall back to a minimal safe default
 * so the site never shows a broken empty page.
 */

export async function getSiteSettings() {
  const [settings] = await db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, 1)).limit(1);
  return (
    settings ?? {
      id: 1,
      siteName: "Esema Properties & Homes",
      tagline: "Building Dreams. Creating Value.",
      logoUrl: null,
      heroTitle: "Esema Properties & Homes",
      heroSubtitle:
        "We deliver quality, affordable, and verified properties across Nigeria — and stand beside you at every step, from land verification to handover.",
      heroImageUrl: null,
      heroCtaPrimaryLabel: "Explore Properties",
      heroCtaPrimaryHref: "/properties",
      heroCtaSecondaryLabel: "How Verification Works",
      heroCtaSecondaryHref: "/services",
      aboutHeading: "About Esema Properties & Homes",
      aboutBody: null,
      aboutImageUrl: null,
      phone: null,
      whatsapp: null,
      email: null,
      address: null,
      facebookUrl: null,
      instagramUrl: null,
      twitterUrl: null,
      linkedinUrl: null,
      footerNote: "© Esema Properties & Homes. All rights reserved.",
      updatedAt: new Date(),
    }
  );
}

export async function getActiveBankAccounts() {
  return db
    .select()
    .from(schema.bankAccounts)
    .where(eq(schema.bankAccounts.isActive, true))
    .orderBy(asc(schema.bankAccounts.sortOrder));
}

export async function getTrustFeatures() {
  return db
    .select()
    .from(schema.trustFeatures)
    .where(eq(schema.trustFeatures.isActive, true))
    .orderBy(asc(schema.trustFeatures.sortOrder));
}

export async function getActiveServices() {
  return db
    .select()
    .from(schema.services)
    .where(eq(schema.services.isActive, true))
    .orderBy(asc(schema.services.sortOrder));
}

export async function getServiceBySlug(slug: string) {
  const [service] = await db
    .select()
    .from(schema.services)
    .where(and(eq(schema.services.slug, slug), eq(schema.services.isActive, true)))
    .limit(1);
  return service ?? null;
}

export async function getVerificationSteps() {
  return db
    .select()
    .from(schema.verificationSteps)
    .where(eq(schema.verificationSteps.isActive, true))
    .orderBy(asc(schema.verificationSteps.stepNumber));
}

export async function getFeaturedProperties(limit = 4) {
  const rows = await db
    .select()
    .from(schema.properties)
    .where(and(eq(schema.properties.isFeatured, true), eq(schema.properties.status, "available")))
    .orderBy(desc(schema.properties.createdAt))
    .limit(limit);
  return rows;
}

export async function getProperties(filters?: {
  state?: string;
  propertyType?: (typeof schema.propertyTypeEnum.enumValues)[number];
  status?: (typeof schema.propertyStatusEnum.enumValues)[number];
}) {
  const conditions = [];
  if (filters?.state) conditions.push(eq(schema.properties.state, filters.state));
  if (filters?.propertyType) conditions.push(eq(schema.properties.propertyType, filters.propertyType));
  conditions.push(eq(schema.properties.status, filters?.status ?? "available"));

  return db
    .select()
    .from(schema.properties)
    .where(and(...conditions))
    .orderBy(desc(schema.properties.createdAt));
}

export async function getPropertyBySlug(slug: string) {
  const [property] = await db.select().from(schema.properties).where(eq(schema.properties.slug, slug)).limit(1);
  if (!property) return null;

  const images = await db
    .select()
    .from(schema.propertyImages)
    .where(eq(schema.propertyImages.propertyId, property.id))
    .orderBy(asc(schema.propertyImages.sortOrder));

  return { ...property, images };
}

export async function getProjects() {
  return db.select().from(schema.projects).orderBy(desc(schema.projects.createdAt));
}

export async function getProjectBySlug(slug: string) {
  const [project] = await db.select().from(schema.projects).where(eq(schema.projects.slug, slug)).limit(1);
  if (!project) return null;
  const images = await db
    .select()
    .from(schema.projectImages)
    .where(eq(schema.projectImages.projectId, project.id))
    .orderBy(asc(schema.projectImages.sortOrder));
  return { ...project, images };
}

export async function getActiveTestimonials() {
  return db
    .select()
    .from(schema.testimonials)
    .where(eq(schema.testimonials.isActive, true))
    .orderBy(asc(schema.testimonials.sortOrder));
}

export async function getActiveTeamMembers() {
  return db
    .select()
    .from(schema.teamMembers)
    .where(eq(schema.teamMembers.isActive, true))
    .orderBy(asc(schema.teamMembers.sortOrder));
}

export async function getPropertiesForCustomer(customerId: string) {
  const rows = await db
    .select({ property: schema.properties })
    .from(schema.propertyCustomers)
    .innerJoin(schema.properties, eq(schema.propertyCustomers.propertyId, schema.properties.id))
    .where(eq(schema.propertyCustomers.customerUserId, customerId))
    .orderBy(desc(schema.properties.createdAt));

  return rows.map((r) => r.property);
}

export async function getVisibleUpdatesForProperty(propertyId: string) {
  return db
    .select()
    .from(schema.propertyUpdates)
    .where(and(eq(schema.propertyUpdates.propertyId, propertyId), eq(schema.propertyUpdates.isVisibleToCustomer, true)))
    .orderBy(desc(schema.propertyUpdates.createdAt));
}

export async function getDashboardCounts() {
  const [[properties], [leadsNew], [testimonialCount], [servicesCount]] = await Promise.all([
    db.select({ value: count() }).from(schema.properties),
    db.select({ value: count() }).from(schema.leads).where(eq(schema.leads.status, "new")),
    db.select({ value: count() }).from(schema.testimonials),
    db.select({ value: count() }).from(schema.services),
  ]);
  return {
    properties: properties.value,
    newLeads: leadsNew.value,
    testimonials: testimonialCount.value,
    services: servicesCount.value,
  };
}
