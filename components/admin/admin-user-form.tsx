"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, CheckboxField } from "@/components/admin/form-fields";
import { Button } from "@/components/ui/button";
import { PERMISSION_KEYS, PERMISSION_LABELS } from "@/lib/permissions";
import type { AdminUserFormState } from "@/lib/actions/admin-users";

type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  isActive: boolean;
};

export function AdminUserForm({
  action,
  initial,
  isSelf,
}: {
  action: (state: AdminUserFormState, formData: FormData) => Promise<AdminUserFormState>;
  initial?: AdminUserRecord;
  isSelf?: boolean;
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

      <Field
        label={initial ? "New password" : "Password"}
        htmlFor="password"
        hint={initial ? "Leave blank to keep their current password" : "At least 8 characters"}
      >
        <TextInput id="password" name="password" type="password" minLength={8} required={!initial} />
      </Field>

      <div>
        <label className="text-sm font-medium text-[var(--color-navy)]">Access</label>
        <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
          Choose which parts of the dashboard this person can use.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {PERMISSION_KEYS.map((key) => (
            <label key={key} className="flex items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm">
              <input
                type="checkbox"
                name="permissions"
                value={key}
                defaultChecked={initial?.permissions.includes(key)}
                className="h-4 w-4 rounded border-[var(--color-border)]"
              />
              {PERMISSION_LABELS[key]}
            </label>
          ))}
        </div>
      </div>

      <CheckboxField
        name="isActive"
        label="Account active (can log in)"
        defaultChecked={initial?.isActive ?? true}
      />
      {isSelf ? (
        <p className="text-xs text-[var(--color-ink-soft)]">
          This is your own account — it can&apos;t be deactivated from here.
        </p>
      ) : null}

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving..." : initial ? "Save changes" : "Create account"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/admin-users")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
