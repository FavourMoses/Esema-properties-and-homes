import Image from "next/image";
import { Container, SectionHeading } from "@/components/ui/layout";
import { getSiteSettings, getActiveTeamMembers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [settings, team] = await Promise.all([getSiteSettings(), getActiveTeamMembers()]);

  return (
    <div className="py-14 md:py-16">
      <Container className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold text-[var(--color-navy)] sm:text-4xl">
            {settings.aboutHeading}
          </h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[var(--color-ink-soft)]">
            {settings.aboutBody ||
              "Add your company story from the admin dashboard under Site Settings → About."}
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[var(--color-paper-tint)]">
          {settings.aboutImageUrl ? (
            <Image src={settings.aboutImageUrl} alt={settings.aboutHeading || ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--color-ink-soft)]">
              Add an about photo from Site Settings
            </div>
          )}
        </div>
      </Container>

      {team.length > 0 ? (
        <Container className="mt-16">
          <SectionHeading title="Meet the team" align="center" />
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.id} className="text-center">
                <div className="relative mx-auto aspect-square w-28 overflow-hidden rounded-full bg-[var(--color-paper-tint)]">
                  {member.photoUrl ? (
                    <Image src={member.photoUrl} alt={member.name} fill className="object-cover" sizes="112px" />
                  ) : null}
                </div>
                <h3 className="mt-3 font-display text-sm font-semibold text-[var(--color-navy)]">
                  {member.name}
                </h3>
                <p className="text-xs text-[var(--color-ink-soft)]">{member.role}</p>
                {member.bio ? (
                  <p className="mt-2 text-xs leading-relaxed text-[var(--color-ink-soft)]">{member.bio}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Container>
      ) : null}
    </div>
  );
}
