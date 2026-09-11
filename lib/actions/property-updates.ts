"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/require-admin";
import { imagePathItemSchema } from "@/lib/validations";

const updateSchema = z.object({
  title: z.string().trim().min(2).max(220),
  message: z.string().trim().min(2).max(4000),
  images: z.array(imagePathItemSchema).default([]),
  isVisibleToCustomer: z.coerce.boolean().default(true),
});

export type PropertyUpdateFormState = { error: string | null };

export async function createPropertyUpdate(
  propertyId: string,
  _prevState: PropertyUpdateFormState,
  formData: FormData
): Promise<PropertyUpdateFormState> {
  await requireAdmin("properties");

  const imagesRaw = formData.get("images")?.toString();
  const parsed = updateSchema.safeParse({
    title: formData.get("title"),
    message: formData.get("message"),
    images: imagesRaw ? JSON.parse(imagesRaw) : [],
    isVisibleToCustomer: formData.get("isVisibleToCustomer") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const d = parsed.data;

  await db.insert(schema.propertyUpdates).values({
    propertyId,
    title: d.title,
    message: d.message,
    images: d.images,
    isVisibleToCustomer: d.isVisibleToCustomer,
  });

  revalidatePath(`/admin/properties/${propertyId}/updates`);
  revalidatePath("/portal");
  return { error: null };
}

export async function deletePropertyUpdate(updateId: string, propertyId: string) {
  await requireAdmin("properties");
  await db.delete(schema.propertyUpdates).where(eq(schema.propertyUpdates.id, updateId));
  revalidatePath(`/admin/properties/${propertyId}/updates`);
  revalidatePath("/portal");
}

export async function togglePropertyUpdateVisibility(updateId: string, propertyId: string, formData: FormData) {
  await requireAdmin("properties");
  const isVisibleToCustomer = formData.get("isVisibleToCustomer") === "on";
  await db.update(schema.propertyUpdates).set({ isVisibleToCustomer }).where(eq(schema.propertyUpdates.id, updateId));
  revalidatePath(`/admin/properties/${propertyId}/updates`);
  revalidatePath("/portal");
}
