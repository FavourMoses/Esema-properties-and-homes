"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/require-admin";

export async function updateLeadStatus(id: string, formData: FormData) {
  await requireAdmin("leads");
  const status = formData.get("status")?.toString();
  if (status !== "new" && status !== "contacted" && status !== "closed") return;

  await db.update(schema.leads).set({ status }).where(eq(schema.leads.id, id));
  revalidatePath("/admin/leads");
}

export async function deleteLead(id: string) {
  await requireAdmin("leads");
  await db.delete(schema.leads).where(eq(schema.leads.id, id));
  revalidatePath("/admin/leads");
}
