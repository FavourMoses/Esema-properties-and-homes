import { TeamMemberForm } from "@/components/admin/team-member-form";
import { createTeamMember } from "@/lib/actions/team";

export default function NewTeamMemberPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Add team member</h1>
      <div className="mt-6">
        <TeamMemberForm action={createTeamMember} />
      </div>
    </div>
  );
}
