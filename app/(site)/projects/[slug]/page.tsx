import { notFound } from "next/navigation";
import { Container } from "@/components/ui/layout";
import { PropertyGallery } from "@/components/site/property-gallery";
import { getProjectBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  planning: "Planning",
  ongoing: "Ongoing",
  completed: "Completed",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <div className="py-10 md:py-14">
      <Container className="max-w-3xl">
        <PropertyGallery images={project.images} title={project.title} />

        <span className="mt-6 inline-block rounded-full bg-[var(--color-navy)] px-3 py-1 text-xs font-semibold text-white">
          {STATUS_LABEL[project.status]}
        </span>
        <h1 className="mt-3 font-display text-2xl font-bold text-[var(--color-navy)] sm:text-3xl">
          {project.title}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{project.location}</p>

        <div className="mt-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-paper-tint)]">
            <div
              className="h-full rounded-full bg-[var(--color-forest)]"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-[var(--color-ink-soft)]">
            {project.progressPercent}% complete
            {project.expectedCompletion ? ` · Expected completion: ${project.expectedCompletion}` : ""}
          </p>
        </div>

        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-[var(--color-ink-soft)]">
          {project.description}
        </p>
      </Container>
    </div>
  );
}
