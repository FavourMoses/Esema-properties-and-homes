"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireOwner } from "@/lib/actions/require-admin";
import { PERMISSION_KEYS } from "@/lib/permissions";

const baseSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(255),
  permissions: z.array(z.enum(PERMISSION_KEYS)).default([]),
  isActive: z.coerce.boolean().default(true),
});

const createSchema = baseSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

const updateSchema = baseSchema.extend({
  // Blank on edit means "don't change the password".
  password: z.string().min(8).max(200).optional().or(z.literal("")),
});

export type AdminUserFormState = { error: string | null };

function readPermissions(formData: FormData): string[] {
  return formData.getAll("permissions").map((v) => v.toString());
}

export async function createAdminUser(
  _prevState: AdminUserFormState,
  formData: FormData
): Promise<AdminUserFormState> {
  await requireOwner();

  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    permissions: readPermissions(formData),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const d = parsed.data;

  const passwordHash = await bcrypt.hash(d.password, 12);

  try {
    await db.insert(schema.adminUsers).values({
      name: d.name,
      email: d.email.toLowerCase().trim(),
      passwordHash,
      role: "staff",
      permissions: d.permissions,
      isActive: d.isActive,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "An admin account with this email already exists." };
    }
    return { error: "Something went wrong creating this account." };
  }

  revalidatePath("/admin/admin-users");
  redirect("/admin/admin-users");
}

export async function updateAdminUser(
  id: string,
  _prevState: AdminUserFormState,
  formData: FormData
): Promise<AdminUserFormState> {
  const currentOwner = await requireOwner();

  const parsed = updateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") || undefined,
    permissions: readPermissions(formData),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const d = parsed.data;

  // Never let an owner deactivate their own account by mistake and get
  // locked out.
  if (id === currentOwner.id && !d.isActive) {
    return { error: "You can't deactivate your own account." };
  }

  const values: Partial<typeof schema.adminUsers.$inferInsert> = {
    name: d.name,
    email: d.email.toLowerCase().trim(),
    permissions: d.permissions,
    isActive: d.isActive,
  };
  if (d.password) {
    values.passwordHash = await bcrypt.hash(d.password, 12);
    values.failedLoginAttempts = 0;
    values.lockedUntil = null;
  }

  try {
    await db.update(schema.adminUsers).set(values).where(eq(schema.adminUsers.id, id));
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "An admin account with this email already exists." };
    }
    return { error: "Something went wrong saving this account." };
  }

  revalidatePath("/admin/admin-users");
  redirect("/admin/admin-users");
}

export async function deleteAdminUser(id: string) {
  const currentOwner = await requireOwner();
  if (id === currentOwner.id) {
    throw new Error("You can't delete your own account.");
  }

  const [target] = await db
    .select({ role: schema.adminUsers.role })
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.id, id))
    .limit(1);
  if (target?.role === "owner") {
    throw new Error("Owner accounts can't be deleted from the dashboard.");
  }

  await db.delete(schema.adminUsers).where(eq(schema.adminUsers.id, id));
  revalidatePath("/admin/admin-users");
}

export async function unlockAdminUser(id: string) {
  await requireOwner();
  await db
    .update(schema.adminUsers)
    .set({ failedLoginAttempts: 0, lockedUntil: null })
    .where(eq(schema.adminUsers.id, id));
  revalidatePath("/admin/admin-users");
}
