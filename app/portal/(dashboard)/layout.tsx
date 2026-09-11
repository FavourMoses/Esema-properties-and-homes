import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";
import { getSiteSettings } from "@/lib/data";
import { Logo } from "@/components/site/logo";
import { CustomerLogoutButton } from "@/components/portal/logout-button";
import { InstallAppButton } from "@/components/site/install-app-button";

export default async function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCustomerSession();
  if (!session) redirect("/portal/login");

  const [customer, settings] = await Promise.all([
    db
      .select({ name: schema.customerUsers.name })
      .from(schema.customerUsers)
      .where(eq(schema.customerUsers.id, session.id))
      .limit(1)
      .then((rows) => rows[0]),
    getSiteSettings(),
  ]);

  if (!customer) redirect("/portal/login");

  return (
    <div className="min-h-screen bg-[var(--color-paper-tint)]">
      <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-white px-6 py-4">
        <Logo logoUrl={settings.logoUrl} siteName="Esema Client Portal" iconClassName="h-12 w-12" gapClassName="gap-1.5" textClassName="text-sm" />
        <div className="flex items-center gap-4">
          <InstallAppButton />
          <span className="text-sm text-[var(--color-ink-soft)]">{customer.name}</span>
          <CustomerLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
