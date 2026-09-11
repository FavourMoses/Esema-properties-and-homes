"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { serviceSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/actions/require-admin";
import { deleteImageByUrl } from "@/lib/storage";

export type ServiceFormState = { error: string | null };

function parseServiceForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return serviceSchema.safeParse({
    ...raw,
    isActive: formData.get("isActive") === "on",
  });
}

export async function createService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdmin("services");
  const parsed = parseServiceForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const d = parsed.data;
  try {
    await db.insert(schema.services).values({
      slug: d.slug,
      icon: d.icon,
      title: d.title,
      shortDescription: d.shortDescription,
      fullDescription: d.fullDescription || null,
      imageUrl: d.imageUrl || null,
      sortOrder: d.sortOrder,
      isActive: d.isActive,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "A service with this slug already exists." };
    }
    return { error: "Something went wrong saving this service." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function updateService(
  id: number,
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireAdmin("services");
  const parsed = parseServiceForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const d = parsed.data;
  try {
    await db
      .update(schema.services)
      .set({
        slug: d.slug,
        icon: d.icon,
        title: d.title,
        shortDescription: d.shortDescription,
        fullDescription: d.fullDescription || null,
        imageUrl: d.imageUrl || null,
        sortOrder: d.sortOrder,
        isActive: d.isActive,
      })
      .where(eq(schema.services.id, id));
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "A service with this slug already exists." };
    }
    return { error: "Something went wrong saving this service." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  redirect("/admin/services");
}

export async function deleteService(id: number, imageUrl: string | null) {
  await requireAdmin("services");
  await db.delete(schema.services).where(eq(schema.services.id, id));
  if (imageUrl) await deleteImageByUrl(imageUrl).catch(() => undefined);
  revalidatePath("/admin/services");
  revalidatePath("/services");
}
