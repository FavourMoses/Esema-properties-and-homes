"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/require-admin";
import { deleteImageByUrl } from "@/lib/storage";

const projectSchema = z.object({
  title: z.string().trim().min(3).max(220),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().trim().min(10).max(8000),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  status: z.enum(["planning", "ongoing", "completed"]),
  progressPercent: z.coerce.number().int().min(0).max(100).default(0),
  expectedCompletion: z.string().trim().max(60).optional().or(z.literal("")),
  isFeatured: z.coerce.boolean().default(false),
});

export type ProjectFormState = { error: string | null };

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return projectSchema.safeParse({ ...raw, isFeatured: formData.get("isFeatured") === "on" });
}

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin("projects");
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const galleryRaw = formData.get("gallery")?.toString();
  const gallery: string[] = galleryRaw ? JSON.parse(galleryRaw) : [];
  const d = parsed.data;

  try {
    const [project] = await db
      .insert(schema.projects)
      .values({
        title: d.title,
        slug: d.slug,
        description: d.description,
        location: d.location || null,
        status: d.status,
        progressPercent: d.progressPercent,
        expectedCompletion: d.expectedCompletion || null,
        coverImageUrl: gallery[0] || null,
        isFeatured: d.isFeatured,
      })
      .returning({ id: schema.projects.id });

    if (gallery.length > 0) {
      await db.insert(schema.projectImages).values(gallery.map((url, i) => ({ projectId: project.id, url, sortOrder: i })));
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "A project with this slug already exists." };
    }
    return { error: "Something went wrong saving this project." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function updateProject(
  id: string,
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  await requireAdmin("projects");
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  const galleryRaw = formData.get("gallery")?.toString();
  const gallery: string[] = galleryRaw ? JSON.parse(galleryRaw) : [];
  const d = parsed.data;

  try {
    await db
      .update(schema.projects)
      .set({
        title: d.title,
        slug: d.slug,
        description: d.description,
        location: d.location || null,
        status: d.status,
        progressPercent: d.progressPercent,
        expectedCompletion: d.expectedCompletion || null,
        coverImageUrl: gallery[0] || null,
        isFeatured: d.isFeatured,
      })
      .where(eq(schema.projects.id, id));

    await db.delete(schema.projectImages).where(eq(schema.projectImages.projectId, id));
    if (gallery.length > 0) {
      await db.insert(schema.projectImages).values(gallery.map((url, i) => ({ projectId: id, url, sortOrder: i })));
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "A project with this slug already exists." };
    }
    return { error: "Something went wrong saving this project." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  redirect("/admin/projects");
}

export async function deleteProject(id: string, imageUrls: string[]) {
  await requireAdmin("projects");
  await db.delete(schema.projects).where(eq(schema.projects.id, id));
  await Promise.all(imageUrls.map((url) => deleteImageByUrl(url).catch(() => undefined)));
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}
