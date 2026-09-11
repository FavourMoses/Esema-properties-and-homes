"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, CheckboxField } from "@/components/admin/form-fields";
import { Button } from "@/components/ui/button";
import type { CustomerFormState } from "@/lib/actions/customers";

type CustomerRecord = {
  name: string;
  email: string;
  phone: string | null;
  isActive: boolean;
};

export function CustomerForm({
  action,
  initial,
  allProperties,
  linkedPropertyIds,
}: {
  action: (state: CustomerFormState, formData: FormData) => Promise<CustomerFormState>;
  initial?: CustomerRecord;
  allProperties: { id: string; title: string }[];
  linkedPropertyIds: string[];
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const router = useRouter();

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="name">
          <TextInput id="name" name="name" required defaultValue={initial?.name} />
        </Field>
        <Field label="Email" htmlFor="email">
          <TextInput id="email" name="email" type="email" required defaultValue={initial?.email} />
        </Field>
      </div>

      <Field label="Phone (optional)" htmlFor="phone">
        <TextInput id="phone" name="phone" defaultValue={initial?.phone ?? ""} />
      </Field>

      <Field
        label={initial ? "New password" : "Password"}
        htmlFor="password"
        hint={initial ? "Leave blank to keep their current password" : "At least 8 characters"}
      >
        <TextInput id="password" name="password" type="password" minLength={8} required={!initial} />
      </Field>

      <div>
        <label className="text-sm font-medium text-[var(--color-navy)]">Properties they can see</label>
        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
          Only the properties checked here will show up in this person&apos;s portal.
        </p>
        <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-md border border-[var(--color-border)] p-3">
          {allProperties.length === 0 ? (
            <p className="text-sm text-[var(--color-ink-soft)]">No properties yet — add one first.</p>
          ) : (
            allProperties.map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="propertyIds"
                  value={p.id}
                  defaultChecked={linkedPropertyIds.includes(p.id)}
                  className="h-4 w-4 rounded border-[var(--color-border)]"
                />
                {p.title}
              </label>
            ))
          )}
        </div>
      </div>

      <CheckboxField name="isActive" label="Account active (can log in)" defaultChecked={initial?.isActive ?? true} />

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving..." : initial ? "Save changes" : "Create account"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/customers")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
