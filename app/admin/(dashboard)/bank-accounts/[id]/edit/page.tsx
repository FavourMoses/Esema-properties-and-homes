import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { BankAccountForm } from "@/components/admin/bank-account-form";
import { updateBankAccount } from "@/lib/actions/bank-accounts";

export const dynamic = "force-dynamic";

export default async function EditBankAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const [account] = await db.select().from(schema.bankAccounts).where(eq(schema.bankAccounts.id, numericId)).limit(1);
  if (!account) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Edit bank account</h1>
      <div className="mt-6">
        <BankAccountForm action={updateBankAccount.bind(null, numericId)} initial={account} />
      </div>
    </div>
  );
}
