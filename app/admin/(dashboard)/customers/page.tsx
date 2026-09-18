import Link from "next/link";
import { Plus, Lock } from "lucide-react";
import { db, schema } from "@/lib/db";
import { asc } from "drizzle-orm";
import { deleteCustomer, unlockCustomer } from "@/lib/actions/customers";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

function isLocked(lockedUntil: Date | null): boolean {
  return !!lockedUntil && lockedUntil.getTime() > Date.now();
}

export default async function AdminCustomersPage() {
  const customers = await db
    .select()
    .from(schema.customerUsers)
    .orderBy(asc(schema.customerUsers.createdAt));
  const now = Date.now();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">
            Customers
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Give a buyer a login so they can track progress on their property at
            /portal.
          </p>
        </div>
        <Link
          href="/admin/customers/new"
          className="flex items-center gap-2 rounded-md bg-[var(--color-forest)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-forest-deep)]"
        >
          <Plus className="h-4 w-4" /> Add customer
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {customers.map((c) => {
          const locked = isLocked(c.lockedUntil);
          return (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-white p-4"
            >
              <div>
                <p className="flex items-center gap-2 font-semibold text-[var(--color-navy)]">
                  {c.name}
                  {locked ? (
                    <span className="flex items-center gap-1 rounded-full bg-[var(--color-danger)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-danger)]">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-[var(--color-ink-soft)]">
                  {c.email}
                  {c.phone ? ` · ${c.phone}` : ""}
                </p>
                <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                  {c.isActive ? "Active" : "Deactivated"}
                </p>
              </div>
              <div className="flex gap-4">
                {locked ? (
                  <form action={unlockCustomer.bind(null, c.id)}>
                    <button
                      type="submit"
                      className="text-xs font-semibold text-[var(--color-forest)] hover:underline"
                    >
                      Unlock
                    </button>
                  </form>
                ) : null}
                <Link
                  href={`/admin/customers/${c.id}/edit`}
                  className="text-xs font-semibold text-[var(--color-forest)] hover:underline"
                >
                  Edit
                </Link>
                <form action={deleteCustomer.bind(null, c.id)}>
                  <ConfirmSubmitButton
                    confirmMessage={`Remove ${c.name}'s portal account?`}
                    className="text-xs font-semibold text-[var(--color-danger)] hover:underline"
                  >
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          );
        })}
        {customers.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-ink-soft)]">
            No customer accounts yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
