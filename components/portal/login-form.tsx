"use client";

import Link from "next/link";
import { useActionState } from "react";
import { customerLoginAction, type CustomerLoginState } from "@/lib/actions/customer-portal-auth";
import { Button } from "@/components/ui/button";

const initialState: CustomerLoginState = { error: null };

export function PortalLoginForm() {
  const [state, formAction, pending] = useActionState(customerLoginAction, initialState);

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
          autoComplete="username"
          required
          className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-[var(--color-navy)]">
            Password
          </label>
          <Link href="/portal/forgot-password" className="text-xs font-medium text-[var(--color-forest)] hover:underline">
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <Button type="submit" variant="primary" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
