import { ProjectForm } from "@/components/admin/project-form";
import { createProject } from "@/lib/actions/projects";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Add project</h1>
      <div className="mt-6">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
