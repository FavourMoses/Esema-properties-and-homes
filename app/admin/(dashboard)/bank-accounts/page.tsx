import Link from "next/link";
import { Plus, AlertTriangle } from "lucide-react";
import { db, schema } from "@/lib/db";
import { asc } from "drizzle-orm";
import { deleteBankAccount } from "@/lib/actions/bank-accounts";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

export default async function AdminBankAccountsPage() {
  const accounts = await db.select().from(schema.bankAccounts).orderBy(asc(schema.bankAccounts.sortOrder));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Bank Accounts</h1>
        <Link
          href="/admin/bank-accounts/new"
          className="flex items-center gap-2 rounded-md bg-[var(--color-forest)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-forest-deep)]"
        >
          <Plus className="h-4 w-4" /> Add account
        </Link>
      </div>

      <div className="mt-4 flex gap-2 rounded-md border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5 p-3 text-xs text-[var(--color-ink-soft)]">
        <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--color-gold)]" />
        These account details are shown directly on verified property pages. There is no payment
        gateway — buyers pay by bank transfer and are told to confirm with your team first.
      </div>

      <div className="mt-6 space-y-3">
        {accounts.map((acc) => (
          <div key={acc.id} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-white p-4">
            <div>
              <p className="font-semibold text-[var(--color-navy)]">{acc.bankName} ({acc.currency})</p>
              <p className="text-sm text-[var(--color-ink-soft)]">{acc.accountName} — {acc.accountNumber}</p>
              <p className="text-xs text-[var(--color-ink-soft)]">{acc.isActive ? "Visible" : "Hidden"}</p>
            </div>
            <div className="flex gap-4">
              <Link href={`/admin/bank-accounts/${acc.id}/edit`} className="text-xs font-semibold text-[var(--color-forest)] hover:underline">
                Edit
              </Link>
              <form action={deleteBankAccount.bind(null, acc.id)}>
                <ConfirmSubmitButton confirmMessage="Delete this bank account?" className="text-xs font-semibold text-[var(--color-danger)] hover:underline">
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {accounts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-ink-soft)]">
            No bank accounts added yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
