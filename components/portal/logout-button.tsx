"use client";

import { LogOut } from "lucide-react";
import { customerLogoutAction } from "@/lib/actions/customer-portal-auth";

export function CustomerLogoutButton() {
  return (
    <form action={customerLogoutAction}>
      <button
        type="submit"
        className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-danger)]"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </form>
  );
}
