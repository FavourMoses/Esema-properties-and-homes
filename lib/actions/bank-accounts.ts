"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { bankAccountSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/actions/require-admin";

export type BankAccountFormState = { error: string | null };

function parseForm(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return bankAccountSchema.safeParse({ ...raw, isActive: formData.get("isActive") === "on" });
}

export async function createBankAccount(
  _prevState: BankAccountFormState,
  formData: FormData
): Promise<BankAccountFormState> {
  await requireAdmin("bank_accounts");
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  await db.insert(schema.bankAccounts).values(parsed.data);
  revalidatePath("/admin/bank-accounts");
  revalidatePath("/properties");
  redirect("/admin/bank-accounts");
}

export async function updateBankAccount(
  id: number,
  _prevState: BankAccountFormState,
  formData: FormData
): Promise<BankAccountFormState> {
  await requireAdmin("bank_accounts");
  const parsed = parseForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Please check the form." };

  await db.update(schema.bankAccounts).set(parsed.data).where(eq(schema.bankAccounts.id, id));
  revalidatePath("/admin/bank-accounts");
  revalidatePath("/properties");
  redirect("/admin/bank-accounts");
}

export async function deleteBankAccount(id: number) {
  await requireAdmin("bank_accounts");
  await db.delete(schema.bankAccounts).where(eq(schema.bankAccounts.id, id));
  revalidatePath("/admin/bank-accounts");
  revalidatePath("/properties");
}
