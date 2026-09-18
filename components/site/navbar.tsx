"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { Logo } from "./logo";
import { LinkButton } from "@/components/ui/button";
import { InstallAppButton } from "@/components/site/install-app-button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export function Navbar({
  siteName,
  logoUrl,
  phone,
}: {
  siteName: string;
  logoUrl?: string | null;
  phone?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-paper)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" aria-label="Go to homepage">
          <Logo
            siteName={siteName}
            logoUrl={logoUrl}
            iconClassName="h-19 w-19"
          />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-[var(--color-forest)]"
                    : "text-[var(--color-ink)] hover:text-[var(--color-forest)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-8 md:flex">
          <InstallAppButton />
          <LinkButton href="/contact" variant="primary">
            <Phone className="h-4 w-4" /> Book a Consultation
          </LinkButton>
        </div>

        <button
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-[var(--color-border)] bg-[var(--color-paper)] px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-base font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <LinkButton
                href="/contact"
                variant="primary"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Book a Consultation
              </LinkButton>
            </li>
            <li>
              <InstallAppButton />
            </li>
            {phone ? (
              <li className="pt-2 text-sm text-[var(--color-ink-soft)]">
                Call us: {phone}
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
