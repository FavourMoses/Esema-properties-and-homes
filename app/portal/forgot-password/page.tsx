import { getSiteSettings } from "@/lib/data";
import { Logo } from "@/components/site/logo";
import { ForgotPasswordForm } from "@/components/site/forgot-password-form";
import { requestCustomerPasswordReset } from "@/lib/actions/customer-password-reset";

export const dynamic = "force-dynamic";

export default async function PortalForgotPasswordPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-navy)] px-6">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg">
        <Logo logoUrl={settings.logoUrl} siteName="Esema Client Portal" iconClassName="h-14 w-14" textClassName="text-base" />

        <h1 className="mt-6 font-display text-xl font-bold text-[var(--color-navy)]">Reset your password</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Enter your email and we&apos;ll send you a link to set a new password.
        </p>

        <ForgotPasswordForm action={requestCustomerPasswordReset} backHref="/portal/login" />
      </div>
    </div>
  );
}
