"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/require-admin";

const baseSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  isActive: z.coerce.boolean().default(true),
  propertyIds: z.array(z.string().uuid()).default([]),
});

const createSchema = baseSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters").max(200),
});

const updateSchema = baseSchema.extend({
  password: z.string().min(8).max(200).optional().or(z.literal("")),
});

export type CustomerFormState = { error: string | null };

function readPropertyIds(formData: FormData): string[] {
  return formData.getAll("propertyIds").map((v) => v.toString());
}

async function syncPropertyLinks(customerUserId: string, propertyIds: string[]) {
  await db.delete(schema.propertyCustomers).where(eq(schema.propertyCustomers.customerUserId, customerUserId));
  if (propertyIds.length > 0) {
    await db.insert(schema.propertyCustomers).values(propertyIds.map((propertyId) => ({ propertyId, customerUserId })));
  }
}

export async function createCustomer(
  _prevState: CustomerFormState,
  formData: FormData
): Promise<CustomerFormState> {
  await requireAdmin("customers");

  const parsed = createSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    isActive: formData.get("isActive") === "on",
    propertyIds: readPropertyIds(formData),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const d = parsed.data;
  const passwordHash = await bcrypt.hash(d.password, 12);

  try {
    const [customer] = await db
      .insert(schema.customerUsers)
      .values({
        name: d.name,
        email: d.email.toLowerCase().trim(),
        phone: d.phone || null,
        passwordHash,
        isActive: d.isActive,
      })
      .returning({ id: schema.customerUsers.id });

    await syncPropertyLinks(customer.id, d.propertyIds);
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "A customer account with this email already exists." };
    }
    return { error: "Something went wrong creating this account." };
  }

  revalidatePath("/admin/customers");
  redirect("/admin/customers");
}

export async function updateCustomer(
  id: string,
  _prevState: CustomerFormState,
  formData: FormData
): Promise<CustomerFormState> {
  await requireAdmin("customers");

  const parsed = updateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password") || undefined,
    isActive: formData.get("isActive") === "on",
    propertyIds: readPropertyIds(formData),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const d = parsed.data;

  const values: Partial<typeof schema.customerUsers.$inferInsert> = {
    name: d.name,
    email: d.email.toLowerCase().trim(),
    phone: d.phone || null,
    isActive: d.isActive,
  };
  if (d.password) {
    values.passwordHash = await bcrypt.hash(d.password, 12);
    values.failedLoginAttempts = 0;
    values.lockedUntil = null;
  }

  try {
    await db.update(schema.customerUsers).set(values).where(eq(schema.customerUsers.id, id));
    await syncPropertyLinks(id, d.propertyIds);
  } catch (err) {
    if (err instanceof Error && err.message.includes("unique")) {
      return { error: "A customer account with this email already exists." };
    }
    return { error: "Something went wrong saving this account." };
  }

  revalidatePath("/admin/customers");
  redirect("/admin/customers");
}

export async function deleteCustomer(id: string) {
  await requireAdmin("customers");
  await db.delete(schema.customerUsers).where(eq(schema.customerUsers.id, id));
  revalidatePath("/admin/customers");
}

export async function unlockCustomer(id: string) {
  await requireAdmin("customers");
  await db
    .update(schema.customerUsers)
    .set({ failedLoginAttempts: 0, lockedUntil: null })
    .where(eq(schema.customerUsers.id, id));
  revalidatePath("/admin/customers");
}

export async function getLinkedPropertyIds(customerUserId: string): Promise<string[]> {
  const rows = await db
    .select({ propertyId: schema.propertyCustomers.propertyId })
    .from(schema.propertyCustomers)
    .where(eq(schema.propertyCustomers.customerUserId, customerUserId));
  return rows.map((r) => r.propertyId);
}
