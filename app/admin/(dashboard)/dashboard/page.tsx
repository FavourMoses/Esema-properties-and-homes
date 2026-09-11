import Link from "next/link";
import { Building2, Inbox, Star, Wrench } from "lucide-react";
import { getDashboardCounts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const counts = await getDashboardCounts();

  const cards = [
    { label: "Properties listed", value: counts.properties, href: "/admin/properties", icon: Building2 },
    { label: "New inquiries", value: counts.newLeads, href: "/admin/leads", icon: Inbox },
    { label: "Services published", value: counts.services, href: "/admin/services", icon: Wrench },
    { label: "Testimonials", value: counts.testimonials, href: "/admin/testimonials", icon: Star },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Dashboard</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">A quick look at the site.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="rounded-lg border border-[var(--color-border)] bg-white p-5 transition-colors hover:border-[var(--color-forest)]"
          >
            <Icon className="h-6 w-6 text-[var(--color-forest)]" />
            <p className="mt-3 font-display text-2xl font-bold text-[var(--color-navy)]">{value}</p>
            <p className="text-sm text-[var(--color-ink-soft)]">{label}</p>
          </Link>
        ))}
      </div>

      {counts.newLeads > 0 ? (
        <div className="mt-8 rounded-lg border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/5 p-5">
          <p className="text-sm text-[var(--color-navy)]">
            You have <strong>{counts.newLeads}</strong> new inquir{counts.newLeads === 1 ? "y" : "ies"} waiting.{" "}
            <Link href="/admin/leads" className="font-semibold text-[var(--color-forest)] hover:underline">
              View leads →
            </Link>
          </p>
        </div>
      ) : null}
    </div>
  );
}
