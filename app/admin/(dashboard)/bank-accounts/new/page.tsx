import { BankAccountForm } from "@/components/admin/bank-account-form";
import { createBankAccount } from "@/lib/actions/bank-accounts";

export default function NewBankAccountPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Add bank account</h1>
      <div className="mt-6">
        <BankAccountForm action={createBankAccount} />
      </div>
    </div>
  );
}
