import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { db, schema } from "@/lib/db";
import { asc } from "drizzle-orm";
import { deleteTeamMember } from "@/lib/actions/team";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const team = await db.select().from(schema.teamMembers).orderBy(asc(schema.teamMembers.sortOrder));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Team</h1>
        <Link
          href="/admin/team/new"
          className="flex items-center gap-2 rounded-md bg-[var(--color-forest)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-forest-deep)]"
        >
          <Plus className="h-4 w-4" /> Add team member
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <div key={member.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--color-paper-tint)]">
                {member.photoUrl ? <Image src={member.photoUrl} alt={member.name} fill className="object-cover" sizes="48px" /> : null}
              </div>
              <div>
                <p className="font-semibold text-[var(--color-navy)]">{member.name}</p>
                <p className="text-xs text-[var(--color-ink-soft)]">{member.role}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-4">
              <Link href={`/admin/team/${member.id}/edit`} className="text-xs font-semibold text-[var(--color-forest)] hover:underline">
                Edit
              </Link>
              <form action={deleteTeamMember.bind(null, member.id, member.photoUrl)}>
                <ConfirmSubmitButton confirmMessage={`Remove ${member.name}?`} className="text-xs font-semibold text-[var(--color-danger)] hover:underline">
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {team.length === 0 ? (
          <p className="col-span-full rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-ink-soft)]">
            No team members added yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
