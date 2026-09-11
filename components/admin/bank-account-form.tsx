"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, CheckboxField } from "@/components/admin/form-fields";
import { Button } from "@/components/ui/button";
import type { BankAccountFormState } from "@/lib/actions/bank-accounts";

type BankAccountRecord = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  currency: string;
  note: string | null;
  isActive: boolean;
  sortOrder: number;
};

export function BankAccountForm({
  action,
  initial,
}: {
  action: (state: BankAccountFormState, formData: FormData) => Promise<BankAccountFormState>;
  initial?: BankAccountRecord;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const router = useRouter();

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <Field label="Bank name" htmlFor="bankName">
        <TextInput id="bankName" name="bankName" required defaultValue={initial?.bankName} />
      </Field>
      <Field label="Account name" htmlFor="accountName">
        <TextInput id="accountName" name="accountName" required defaultValue={initial?.accountName} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Account number" htmlFor="accountNumber">
          <TextInput id="accountNumber" name="accountNumber" required defaultValue={initial?.accountNumber} />
        </Field>
        <Field label="Currency" htmlFor="currency">
          <TextInput id="currency" name="currency" defaultValue={initial?.currency ?? "NGN"} />
        </Field>
      </div>
      <Field label="Note (optional)" htmlFor="note" hint="e.g. 'For land purchases only'">
        <TextInput id="note" name="note" defaultValue={initial?.note ?? ""} />
      </Field>
      <Field label="Sort order" htmlFor="sortOrder">
        <TextInput id="sortOrder" name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} />
      </Field>
      <CheckboxField name="isActive" label="Show on the website" defaultChecked={initial?.isActive ?? true} />

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving..." : initial ? "Save changes" : "Add account"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/bank-accounts")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
