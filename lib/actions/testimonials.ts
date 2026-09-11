"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/require-admin";
import { deleteImageByUrl } from "@/lib/storage";
import { imagePathSchema } from "@/lib/validations";

const testimonialSchema = z.object({
  clientName: z.string().trim().min(2).max(160),
  clientRole: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(5).max(2000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  avatarUrl: imagePathSchema,
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export type TestimonialFormState = { error: string | null };

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return testimonialSchema.safeParse({ ...raw, isActive: formData.get("isActive") === "on" });
}

export async function createTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdmin("testimonials");
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const d = parsed.data;
  await db.insert(schema.testimonials).values({
    clientName: d.clientName,
    clientRole: d.clientRole || null,
    message: d.message,
    rating: d.rating,
    avatarUrl: d.avatarUrl || null,
    sortOrder: d.sortOrder,
    isActive: d.isActive,
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(
  id: number,
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  await requireAdmin("testimonials");
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const d = parsed.data;
  await db
    .update(schema.testimonials)
    .set({
      clientName: d.clientName,
      clientRole: d.clientRole || null,
      message: d.message,
      rating: d.rating,
      avatarUrl: d.avatarUrl || null,
      sortOrder: d.sortOrder,
      isActive: d.isActive,
    })
    .where(eq(schema.testimonials.id, id));

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: number, avatarUrl: string | null) {
  await requireAdmin("testimonials");
  await db.delete(schema.testimonials).where(eq(schema.testimonials.id, id));
  if (avatarUrl) await deleteImageByUrl(avatarUrl).catch(() => undefined);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
