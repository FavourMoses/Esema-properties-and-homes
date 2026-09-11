import Image from "next/image";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/layout";
import { LinkButton } from "@/components/ui/button";
import { getServiceBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <div className="py-14 md:py-16">
      <Container className="max-w-3xl">
        <Icon name={service.icon} className="h-10 w-10 text-[var(--color-forest)]" />
        <h1 className="mt-4 font-display text-3xl font-bold text-[var(--color-navy)]">
          {service.title}
        </h1>
        <p className="mt-3 text-base text-[var(--color-ink-soft)]">{service.shortDescription}</p>

        {service.imageUrl ? (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-lg">
          <Image src={service.imageUrl} alt={service.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
        ) : null}

        {service.fullDescription ? (
          <div className="mt-8 whitespace-pre-line text-sm leading-relaxed text-[var(--color-ink-soft)]">
            {service.fullDescription}
          </div>
        ) : null}

        <div className="mt-10">
          <LinkButton href="/contact" variant="primary">
            Request this service
          </LinkButton>
        </div>
      </Container>
    </div>
  );
}
