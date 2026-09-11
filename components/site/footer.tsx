import Link from "next/link";
import { ExternalLink, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./logo";
import { Container } from "@/components/ui/layout";

type Settings = {
  siteName: string;
  tagline: string;
  logoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  twitterUrl?: string | null;
  linkedinUrl?: string | null;
  footerNote?: string | null;
};

export function Footer({ settings }: { settings: Settings }) {
  const socials = [
    { href: settings.facebookUrl, label: "Facebook" },
    { href: settings.instagramUrl, label: "Instagram" },
    { href: settings.twitterUrl, label: "Twitter / X" },
    { href: settings.linkedinUrl, label: "LinkedIn" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-navy)] text-white/90">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo siteName={settings.siteName} logoUrl={settings.logoUrl} className="[&_span]:text-white" iconClassName="h-14 w-14" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{settings.tagline}</p>
          {socials.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {socials.map(({ href, label }) => (
                <a
                  key={label}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-white/70 transition-colors hover:text-white"
                >
                  {label} <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Quick links
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link href="/properties" className="hover:text-white">Properties</Link></li>
            <li><Link href="/services" className="hover:text-white">Services</Link></li>
            <li><Link href="/projects" className="hover:text-white">Projects</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Get in touch
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {settings.phone ? (
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" /> {settings.phone}
              </li>
            ) : null}
            {settings.email ? (
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" /> {settings.email}
              </li>
            ) : null}
            {settings.address ? (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {settings.address}
              </li>
            ) : null}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-5">
        <Container>
          <p className="text-center text-xs text-white/60">
            {settings.footerNote || `© ${new Date().getFullYear()} ${settings.siteName}. All rights reserved.`}
          </p>
        </Container>
      </div>
    </footer>
  );
}
