import { getSiteSettings } from "@/lib/data";
import { Logo } from "@/components/site/logo";
import { AdminLoginForm } from "@/components/admin/login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>;
}) {
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-navy)] px-6">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
        <Logo logoUrl={settings.logoUrl} siteName="Esema Admin" iconClassName="h-14 w-14" textClassName="text-base" />

        <h1 className="mt-6 font-display text-xl font-bold text-[var(--color-navy)]">Sign in</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Staff access only. Contact the site owner if you need an account.
        </p>

        {params.reset === "success" ? (
          <p className="mt-4 rounded-md border border-[var(--color-forest)] bg-[var(--color-sage)] p-3 text-sm text-[var(--color-navy)]">
            Your password has been reset — sign in below.
          </p>
        ) : null}

        <AdminLoginForm />
      </div>
    </div>
  );
}
