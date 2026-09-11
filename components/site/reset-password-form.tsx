"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";

type ResetPasswordState = { error: string | null };

export function ResetPasswordForm({
  action,
  token,
}: {
  action: (state: ResetPasswordState, formData: FormData) => Promise<ResetPasswordState>;
  token: string;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="token" value={token} />

      <div>
        <label htmlFor="password" className="text-sm font-medium text-[var(--color-navy)]">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--color-navy)]">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? "Saving..." : "Reset password"}
      </Button>
    </form>
  );
}
