import Link from "next/link";
import { Plus } from "lucide-react";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { deleteProject } from "@/lib/actions/projects";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await db.select().from(schema.projects).orderBy(desc(schema.projects.createdAt));
  const imagesByProject = await db.select().from(schema.projectImages);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-md bg-[var(--color-forest)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-forest-deep)]"
        >
          <Plus className="h-4 w-4" /> Add project
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {projects.map((p) => {
          const imageUrls = imagesByProject.filter((i) => i.projectId === p.id).map((i) => i.url);
          return (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-white p-4">
              <div>
                <p className="font-semibold text-[var(--color-navy)]">{p.title}</p>
                <p className="text-xs text-[var(--color-ink-soft)] capitalize">
                  {p.status} · {p.progressPercent}% complete · {p.location}
                </p>
              </div>
              <div className="flex gap-4">
                <Link href={`/admin/projects/${p.id}/edit`} className="text-xs font-semibold text-[var(--color-forest)] hover:underline">
                  Edit
                </Link>
                <form action={deleteProject.bind(null, p.id, imageUrls)}>
                  <ConfirmSubmitButton confirmMessage={`Delete "${p.title}"?`} className="text-xs font-semibold text-[var(--color-danger)] hover:underline">
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          );
        })}
        {projects.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-ink-soft)]">
            No projects yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
