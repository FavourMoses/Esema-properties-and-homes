"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "@/lib/actions/auth-signout";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-danger)]"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </form>
  );
}
