import { Phone, Mail, MapPin } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/layout";
import { LeadForm } from "@/components/site/lead-form";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-14 md:py-16">
      <Container className="grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            title="Contact Us"
            subtitle="Have a property in mind, or want us to verify one before you commit? Send us a message."
          />

          <ul className="mt-8 space-y-4 text-sm text-[var(--color-ink-soft)]">
            {settings.phone ? (
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[var(--color-forest)]" /> {settings.phone}
              </li>
            ) : null}
            {settings.email ? (
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[var(--color-forest)]" /> {settings.email}
              </li>
            ) : null}
            {settings.address ? (
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-[var(--color-forest)]" /> {settings.address}
              </li>
            ) : null}
          </ul>
        </div>

        <div className="rounded-lg border border-[var(--color-border)] bg-white p-6">
          <LeadForm type="general" submitLabel="Send message" />
        </div>
      </Container>
    </div>
  );
}
