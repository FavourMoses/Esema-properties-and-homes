"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { propertySchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/actions/require-admin";
import { deleteImageByUrl } from "@/lib/storage";

export type PropertyFormState = { error: string | null };

function parsePropertyForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return propertySchema.safeParse({
    ...raw,
    isFeatured: formData.get("isFeatured") === "on",
    bedrooms: raw.bedrooms || undefined,
    bathrooms: raw.bathrooms || undefined,
    sizeSqm: raw.sizeSqm || undefined,
  });
}

export async function createProperty(
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  await requireAdmin("properties");

  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const galleryRaw = formData.get("gallery")?.toString();
  const gallery: string[] = galleryRaw ? JSON.parse(galleryRaw) : [];

  const data = parsed.data;

  try {
    const [property] = await db
      .insert(schema.properties)
      .values({
        title: data.title,
        slug: data.slug,
        description: data.description,
        propertyType: data.propertyType,
        listingSource: data.listingSource,
        status: data.status,
        verificationStatus: data.verificationStatus,
        price: String(data.price),
        currency: data.currency,
        pricePeriod: data.pricePeriod || null,
        state: data.state,
        city: data.city,
        addressLine: data.addressLine || null,
        bedrooms: data.bedrooms ?? null,
        bathrooms: data.bathrooms ?? null,
        sizeSqm: data.sizeSqm ?? null,
        coverImageUrl: gallery[0] || null,
        isFeatured: data.isFeatured,
        ownerContactName: data.ownerContactName || null,
        ownerContactPhone: data.ownerContactPhone || null,
        internalNotes: data.internalNotes || null,
      })
      .returning({ id: schema.properties.id });

    if (gallery.length > 0) {
      await db.insert(schema.propertyImages).values(
        gallery.map((url, i) => ({ propertyId: property.id, url, sortOrder: i }))
      );
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "A property with this URL slug already exists — please change it." };
    }
    return { error: "Something went wrong saving this property." };
  }

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  redirect("/admin/properties");
}

export async function updateProperty(
  id: string,
  _prevState: PropertyFormState,
  formData: FormData
): Promise<PropertyFormState> {
  await requireAdmin("properties");

  const parsed = parsePropertyForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const galleryRaw = formData.get("gallery")?.toString();
  const gallery: string[] = galleryRaw ? JSON.parse(galleryRaw) : [];
  const data = parsed.data;

  try {
    await db
      .update(schema.properties)
      .set({
        title: data.title,
        slug: data.slug,
        description: data.description,
        propertyType: data.propertyType,
        listingSource: data.listingSource,
        status: data.status,
        verificationStatus: data.verificationStatus,
        price: String(data.price),
        currency: data.currency,
        pricePeriod: data.pricePeriod || null,
        state: data.state,
        city: data.city,
        addressLine: data.addressLine || null,
        bedrooms: data.bedrooms ?? null,
        bathrooms: data.bathrooms ?? null,
        sizeSqm: data.sizeSqm ?? null,
        coverImageUrl: gallery[0] || null,
        isFeatured: data.isFeatured,
        ownerContactName: data.ownerContactName || null,
        ownerContactPhone: data.ownerContactPhone || null,
        internalNotes: data.internalNotes || null,
        updatedAt: new Date(),
      })
      .where(eq(schema.properties.id, id));

    // Replace the gallery wholesale — simplest correct approach for a
    // small admin tool like this.
    await db.delete(schema.propertyImages).where(eq(schema.propertyImages.propertyId, id));
    if (gallery.length > 0) {
      await db.insert(schema.propertyImages).values(
        gallery.map((url, i) => ({ propertyId: id, url, sortOrder: i }))
      );
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "A property with this URL slug already exists — please change it." };
    }
    return { error: "Something went wrong saving this property." };
  }

  revalidatePath("/admin/properties");
  revalidatePath("/properties");
  revalidatePath(`/properties/${data.slug}`);
  redirect("/admin/properties");
}

export async function deleteProperty(id: string, imageUrls: string[]) {
  await requireAdmin("properties");
  await db.delete(schema.properties).where(eq(schema.properties.id, id));
  await Promise.all(imageUrls.map((url) => deleteImageByUrl(url).catch(() => undefined)));
  revalidatePath("/admin/properties");
  revalidatePath("/properties");
}
