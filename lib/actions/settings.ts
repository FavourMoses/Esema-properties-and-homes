"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { siteSettingsSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/actions/require-admin";

export type SettingsFormState = { error: string | null; success?: boolean };

export async function updateSiteSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  await requireAdmin("settings");

  const raw = Object.fromEntries(formData.entries());
  const parsed = siteSettingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const d = parsed.data;

  const values = {
    siteName: d.siteName,
    tagline: d.tagline,
    logoUrl: d.logoUrl || null,
    heroTitle: d.heroTitle || "",
    heroSubtitle: d.heroSubtitle || "",
    heroImageUrl: d.heroImageUrl || null,
    heroCtaPrimaryLabel: d.heroCtaPrimaryLabel || null,
    heroCtaPrimaryHref: d.heroCtaPrimaryHref || null,
    heroCtaSecondaryLabel: d.heroCtaSecondaryLabel || null,
    heroCtaSecondaryHref: d.heroCtaSecondaryHref || null,
    aboutHeading: d.aboutHeading || null,
    aboutBody: d.aboutBody || null,
    aboutImageUrl: d.aboutImageUrl || null,
    phone: d.phone || null,
    whatsapp: d.whatsapp || null,
    email: d.email || null,
    address: d.address || null,
    facebookUrl: d.facebookUrl || null,
    instagramUrl: d.instagramUrl || null,
    twitterUrl: d.twitterUrl || null,
    linkedinUrl: d.linkedinUrl || null,
    footerNote: d.footerNote || null,
    updatedAt: new Date(),
  };

  try {
    const existing = await db.select({ id: schema.siteSettings.id }).from(schema.siteSettings).where(eq(schema.siteSettings.id, 1)).limit(1);
    if (existing.length > 0) {
      await db.update(schema.siteSettings).set(values).where(eq(schema.siteSettings.id, 1));
    } else {
      await db.insert(schema.siteSettings).values({ id: 1, ...values });
    }
  } catch {
    return { error: "Something went wrong saving your settings." };
  }

  revalidatePath("/", "layout");
  return { error: null, success: true };
}
