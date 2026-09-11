import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Icon } from "@/components/ui/icon";
import { getActiveServices, getVerificationSteps } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [services, steps] = await Promise.all([getActiveServices(), getVerificationSteps()]);

  return (
    <div className="py-14 md:py-16">
      <Container>
        <SectionHeading
          title="Our Services"
          subtitle="Buying property from a distance — especially somewhere you've never visited — is where most people get burned. This is how we make sure it doesn't happen to you."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group rounded-lg border border-[var(--color-border)] bg-white p-6 transition-colors hover:border-[var(--color-forest)]"
            >
              <Icon name={service.icon} className="h-8 w-8 text-[var(--color-forest)]" />
              <h2 className="mt-4 font-display text-lg font-semibold text-[var(--color-navy)]">
                {service.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-soft)]">
                {service.shortDescription}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-forest)]">
                Learn more{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        {steps.length > 0 ? (
          <div className="mt-16">
            <SectionHeading title="How the process works" />
            <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <li key={step.id} className="border-t-2 border-[var(--color-forest)] pt-4">
                  <span className="font-display text-3xl font-bold text-[var(--color-forest)]">
                    {String(step.stepNumber).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-base font-semibold text-[var(--color-navy)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </Container>
    </div>
  );
}
