"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";

type ForgotPasswordState = { message: string | null; error: string | null };

export function ForgotPasswordForm({
  action,
  backHref,
}: {
  action: (state: ForgotPasswordState, formData: FormData) => Promise<ForgotPasswordState>;
  backHref: string;
}) {
  const [state, formAction, pending] = useActionState(action, { message: null, error: null });

  if (state.message) {
    return (
      <div className="mt-6 rounded-md border border-[var(--color-forest)] bg-[var(--color-sage)] p-4 text-sm text-[var(--color-navy)]">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-[var(--color-navy)]">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Send reset link"}
      </Button>

      <Link href={backHref} className="block text-center text-sm text-[var(--color-ink-soft)] hover:underline">
        Back to sign in
      </Link>
    </form>
  );
}
