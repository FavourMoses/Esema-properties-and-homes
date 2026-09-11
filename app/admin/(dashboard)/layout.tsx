import Link from "next/link";
import { auth } from "@/lib/auth";
import { getSiteSettings } from "@/lib/data";
import { Logo } from "@/components/site/logo";
import { AdminSidebarNav } from "@/components/admin/sidebar-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { InstallAppButton } from "@/components/site/install-app-button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, settings] = await Promise.all([auth(), getSiteSettings()]);

  return (
    <div className="min-h-screen bg-[var(--color-paper-tint)]">
      <div className="flex">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-white md:flex">
          <Link href="/admin/dashboard" className="border-b border-[var(--color-border)] p-5">
            <Logo logoUrl={settings.logoUrl} siteName="Esema Admin" iconClassName="h-12 w-12" gapClassName="gap-1.5" textClassName="text-sm" />
          </Link>
          <AdminSidebarNav role={session?.user?.role ?? "staff"} permissions={session?.user?.permissions ?? []} />
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-white px-6 py-3">
            <p className="text-sm text-[var(--color-ink-soft)] md:hidden">Esema Admin</p>
            <div className="ml-auto flex items-center gap-4">
              <InstallAppButton />
              <span className="text-sm text-[var(--color-ink-soft)]">
                {session?.user?.name ?? session?.user?.email}
              </span>
              <SignOutButton />
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
