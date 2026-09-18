import Link from "next/link";
import { Plus, ShieldCheck, Lock } from "lucide-react";
import { db, schema } from "@/lib/db";
import { asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { PERMISSION_LABELS, type PermissionKey } from "@/lib/permissions";
import { deleteAdminUser, unlockAdminUser } from "@/lib/actions/admin-users";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

function isLocked(lockedUntil: Date | null): boolean {
  return !!lockedUntil && lockedUntil.getTime() > Date.now();
}

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await db
    .select()
    .from(schema.adminUsers)
    .orderBy(asc(schema.adminUsers.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">
            Admin Users
          </h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Add staff logins and control exactly what each one can see and edit.
          </p>
        </div>
        <Link
          href="/admin/admin-users/new"
          className="flex items-center gap-2 rounded-md bg-[var(--color-forest)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-forest-deep)]"
        >
          <Plus className="h-4 w-4" /> Add sub-admin
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {users.map((u) => {
          const isSelf = u.id === session?.user?.id;
          const locked = isLocked(u.lockedUntil);
          return (
            <div
              key={u.id}
              className="rounded-lg border border-[var(--color-border)] bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 font-semibold text-[var(--color-navy)]">
                    {u.name}
                    {u.role === "owner" ? (
                      <span className="flex items-center gap-1 rounded-full bg-[var(--color-sage)] px-2 py-0.5 text-xs font-medium text-[var(--color-forest-deep)]">
                        <ShieldCheck className="h-3 w-3" /> Owner
                      </span>
                    ) : null}
                    {!u.isActive ? (
                      <span className="rounded-full bg-[var(--color-paper-tint)] px-2 py-0.5 text-xs font-medium text-[var(--color-ink-soft)]">
                        Deactivated
                      </span>
                    ) : null}
                    {locked ? (
                      <span className="flex items-center gap-1 rounded-full bg-[var(--color-danger)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-danger)]">
                        <Lock className="h-3 w-3" /> Locked
                      </span>
                    ) : null}
                    {isSelf ? (
                      <span className="text-xs font-normal text-[var(--color-ink-soft)]">
                        (you)
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-[var(--color-ink-soft)]">
                    {u.email}
                  </p>
                  {u.role === "staff" ? (
                    <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
                      {u.permissions.length > 0
                        ? u.permissions
                            .map(
                              (p) => PERMISSION_LABELS[p as PermissionKey] ?? p,
                            )
                            .join(" · ")
                        : "No sections assigned yet"}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
                      Full access to everything
                    </p>
                  )}
                </div>

                {u.role === "owner" ? null : (
                  <div className="flex gap-4">
                    {locked ? (
                      <form action={unlockAdminUser.bind(null, u.id)}>
                        <button
                          type="submit"
                          className="text-xs font-semibold text-[var(--color-forest)] hover:underline"
                        >
                          Unlock
                        </button>
                      </form>
                    ) : null}
                    <Link
                      href={`/admin/admin-users/${u.id}/edit`}
                      className="text-xs font-semibold text-[var(--color-forest)] hover:underline"
                    >
                      Edit
                    </Link>
                    <form action={deleteAdminUser.bind(null, u.id)}>
                      <ConfirmSubmitButton
                        confirmMessage={`Remove ${u.name}'s account?`}
                        className="text-xs font-semibold text-[var(--color-danger)] hover:underline"
                      >
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
