import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { ProjectForm } from "@/components/admin/project-form";
import { updateProject } from "@/lib/actions/projects";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project] = await db.select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1);
  if (!project) notFound();

  const images = await db
    .select()
    .from(schema.projectImages)
    .where(eq(schema.projectImages.projectId, id))
    .orderBy(asc(schema.projectImages.sortOrder));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Edit project</h1>
      <div className="mt-6">
        <ProjectForm action={updateProject.bind(null, id)} initial={{ ...project, images }} />
      </div>
    </div>
  );
}
