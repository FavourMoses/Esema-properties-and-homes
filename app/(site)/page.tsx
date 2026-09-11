import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Container, SectionHeading } from "@/components/ui/layout";
import { Icon } from "@/components/ui/icon";
import { PropertyCard } from "@/components/site/property-card";
import {
  getSiteSettings,
  getTrustFeatures,
  getFeaturedProperties,
  getActiveServices,
  getVerificationSteps,
  getActiveTestimonials,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, trustFeatures, featuredProperties, activeServices, steps, testimonials] =
    await Promise.all([
      getSiteSettings(),
      getTrustFeatures(),
      getFeaturedProperties(),
      getActiveServices(),
      getVerificationSteps(),
      getActiveTestimonials(),
    ]);

  return (
    <>
      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--color-paper)]">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            {settings.heroTitle ? (
              <h1 className="font-display text-4xl font-bold leading-[1.1] text-[var(--color-navy)] sm:text-5xl">
                {settings.heroTitle}
              </h1>
            ) : null}
            {settings.heroSubtitle ? (
              <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--color-ink-soft)]">
                {settings.heroSubtitle}
              </p>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-4">
              <LinkButton href={settings.heroCtaPrimaryHref || "/properties"} variant="primary">
                {settings.heroCtaPrimaryLabel || "Explore Properties"} <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href={settings.heroCtaSecondaryHref || "/services"} variant="secondary">
                {settings.heroCtaSecondaryLabel || "How Verification Works"}
              </LinkButton>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full diagonal-edge-b overflow-hidden rounded-lg bg-[var(--color-sage)] md:aspect-square">
            {settings.heroImageUrl ? (
              <Image
                src={settings.heroImageUrl}
                alt={settings.heroTitle || settings.siteName}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-8 text-center text-sm text-[var(--color-ink-soft)]">
                Add a hero photo from the admin dashboard → Site Settings
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── TRUST FEATURES ─────────────────────────────────────────── */}
      {trustFeatures.length > 0 ? (
        <section className="border-y border-[var(--color-border)] bg-[var(--color-paper-tint)]">
          <Container className="grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
            {trustFeatures.map((feature) => (
              <div key={feature.id} className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-forest)]">
                  <Icon name={feature.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-sm font-semibold text-[var(--color-navy)]">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{feature.description}</p>
                </div>
              </div>
            ))}
          </Container>
        </section>
      ) : null}

      {/* ── FEATURED PROPERTIES ────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              title="Featured Properties"
              subtitle="A selection of verified, ready-to-view properties — owned by Esema and by trusted partners we've personally verified."
            />
            <Link href="/properties" className="text-sm font-semibold text-[var(--color-forest)] hover:underline">
              View all properties →
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-ink-soft)]">
              No featured properties yet — mark a property as &ldquo;Featured&rdquo; in the admin dashboard to show it here.
            </p>
          )}
        </Container>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────── */}
      {activeServices.length > 0 ? (
        <section className="bg-[var(--color-navy)] py-16 text-white md:py-20">
          <Container>
            <SectionHeading title="How we protect every buyer" />
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">
              Buying a property from a distance is risky. We remove that risk — whether the property
              is ours or a verified partner&apos;s, anywhere in Nigeria.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {activeServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group rounded-lg border border-white/15 p-6 transition-colors hover:border-[var(--color-forest)] hover:bg-white/5"
                >
                  <Icon name={service.icon} className="h-7 w-7 text-[var(--color-forest)]" />
                  <h3 className="mt-4 font-display text-base font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{service.shortDescription}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-forest)]">
                    Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ── VERIFICATION STEPS (genuine sequence → numbered) ──────────── */}
      {steps.length > 0 ? (
        <section className="py-16 md:py-20">
          <Container>
            <SectionHeading
              title="Buying through us, step by step"
              subtitle="The same process whether the property is ours or a partner's, anywhere in Nigeria."
            />
            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <li key={step.id} className="relative border-t-2 border-[var(--color-forest)] pt-4">
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
          </Container>
        </section>
      ) : null}

      {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
      {testimonials.length > 0 ? (
        <section className="bg-[var(--color-sage)] py-16 md:py-20">
          <Container>
            <SectionHeading title="What our clients say" align="center" />
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <figure key={t.id} className="rounded-lg bg-white p-6">
                  <Quote className="h-6 w-6 text-[var(--color-forest)]" />
                  <blockquote className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]">
                    {t.message}
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-[var(--color-navy)]">
                    {t.clientName}
                    {t.clientRole ? (
                      <span className="block font-normal text-[var(--color-ink-soft)]">{t.clientRole}</span>
                    ) : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="py-16 text-center md:py-20">
        <Container>
          <h2 className="font-display text-3xl font-bold text-[var(--color-navy)] sm:text-4xl">
            Ready to find your next property?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-[var(--color-ink-soft)]">
            Tell us what you&apos;re looking for and where — we&apos;ll verify it before you pay a naira.
          </p>
          <div className="mt-7">
            <LinkButton href="/contact" variant="primary">
              Book a Consultation <ArrowRight className="h-4 w-4" />
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
