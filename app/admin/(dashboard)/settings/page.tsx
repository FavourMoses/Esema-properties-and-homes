import { getSiteSettings } from "@/lib/data";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Site Settings</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Everything here controls the public website — change any of it and it goes live immediately.
      </p>
      <div className="mt-6">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  );
}
