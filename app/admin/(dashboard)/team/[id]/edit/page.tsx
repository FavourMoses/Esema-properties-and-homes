import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { TeamMemberForm } from "@/components/admin/team-member-form";
import { updateTeamMember } from "@/lib/actions/team";

export const dynamic = "force-dynamic";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const [member] = await db.select().from(schema.teamMembers).where(eq(schema.teamMembers.id, numericId)).limit(1);
  if (!member) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Edit team member</h1>
      <div className="mt-6">
        <TeamMemberForm action={updateTeamMember.bind(null, numericId)} initial={member} />
      </div>
    </div>
  );
}
