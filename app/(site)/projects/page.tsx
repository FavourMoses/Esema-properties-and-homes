import Image from "next/image";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/layout";
import { getProjects } from "@/lib/data";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  ongoing: "Ongoing",
  completed: "Completed",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="py-14 md:py-16">
      <Container>
        <SectionHeading
          title="Projects"
          subtitle="Construction we're building or monitoring directly — with visible progress, not vague promises."
        />

        {projects.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group block overflow-hidden rounded-lg border border-[var(--color-border)] bg-white"
              >
                <div className="relative aspect-[4/3] w-full bg-[var(--color-paper-tint)]">
                  {project.coverImageUrl ? (
                    <Image
                      src={project.coverImageUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-[1.03]"
                    />
                  ) : null}
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--color-navy)] px-3 py-1 text-xs font-semibold text-white">
                    {STATUS_LABEL[project.status]}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-semibold text-[var(--color-navy)]">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{project.location}</p>

                  <div className="mt-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-paper-tint)]">
                      <div
                        className="h-full rounded-full bg-[var(--color-forest)]"
                        style={{ width: `${project.progressPercent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
                      {project.progressPercent}% complete
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-lg border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-ink-soft)]">
            No projects listed yet.
          </p>
        )}
      </Container>
    </div>
  );
}
