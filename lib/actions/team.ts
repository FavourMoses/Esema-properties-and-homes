"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/require-admin";
import { deleteImageByUrl } from "@/lib/storage";
import { imagePathSchema } from "@/lib/validations";

const teamMemberSchema = z.object({
  name: z.string().trim().min(2).max(160),
  role: z.string().trim().min(2).max(160),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  photoUrl: imagePathSchema,
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

export type TeamMemberFormState = { error: string | null };

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return teamMemberSchema.safeParse({ ...raw, isActive: formData.get("isActive") === "on" });
}

export async function createTeamMember(
  _prevState: TeamMemberFormState,
  formData: FormData
): Promise<TeamMemberFormState> {
  await requireAdmin("team");
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const d = parsed.data;
  await db.insert(schema.teamMembers).values({
    name: d.name,
    role: d.role,
    bio: d.bio || null,
    photoUrl: d.photoUrl || null,
    sortOrder: d.sortOrder,
    isActive: d.isActive,
  });

  revalidatePath("/admin/team");
  revalidatePath("/about");
  redirect("/admin/team");
}

export async function updateTeamMember(
  id: number,
  _prevState: TeamMemberFormState,
  formData: FormData
): Promise<TeamMemberFormState> {
  await requireAdmin("team");
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const d = parsed.data;
  await db
    .update(schema.teamMembers)
    .set({
      name: d.name,
      role: d.role,
      bio: d.bio || null,
      photoUrl: d.photoUrl || null,
      sortOrder: d.sortOrder,
      isActive: d.isActive,
    })
    .where(eq(schema.teamMembers.id, id));

  revalidatePath("/admin/team");
  revalidatePath("/about");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: number, photoUrl: string | null) {
  await requireAdmin("team");
  await db.delete(schema.teamMembers).where(eq(schema.teamMembers.id, id));
  if (photoUrl) await deleteImageByUrl(photoUrl).catch(() => undefined);
  revalidatePath("/admin/team");
  revalidatePath("/about");
}
