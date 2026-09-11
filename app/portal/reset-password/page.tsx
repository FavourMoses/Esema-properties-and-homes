import Link from "next/link";
import { getSiteSettings } from "@/lib/data";
import { Logo } from "@/components/site/logo";
import { ResetPasswordForm } from "@/components/site/reset-password-form";
import { resetCustomerPassword } from "@/lib/actions/customer-password-reset";

export const dynamic = "force-dynamic";

export default async function PortalResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const [settings, params] = await Promise.all([getSiteSettings(), searchParams]);
  const token = params.token ?? "";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-navy)] px-6">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
        <Logo logoUrl={settings.logoUrl} siteName="Esema Client Portal" iconClassName="h-14 w-14" textClassName="text-base" />

        <h1 className="mt-6 font-display text-xl font-bold text-[var(--color-navy)]">Choose a new password</h1>

        {token ? (
          <ResetPasswordForm action={resetCustomerPassword} token={token} />
        ) : (
          <p className="mt-4 text-sm text-[var(--color-danger)]">
            This link is missing its reset code.{" "}
            <Link href="/portal/forgot-password" className="underline">
              Request a new one
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
