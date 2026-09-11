import Link from "next/link";
import { Plus } from "lucide-react";
import { db, schema } from "@/lib/db";
import { asc } from "drizzle-orm";
import { Icon } from "@/components/ui/icon";
import { deleteService } from "@/lib/actions/services";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await db.select().from(schema.services).orderBy(asc(schema.services.sortOrder));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Services</h1>
        <Link
          href="/admin/services/new"
          className="flex items-center gap-2 rounded-md bg-[var(--color-forest)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-forest-deep)]"
        >
          <Plus className="h-4 w-4" /> Add service
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <div key={s.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--color-sage)] text-[var(--color-forest)]">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-sm font-semibold text-[var(--color-navy)]">{s.title}</h2>
                  <p className="text-xs text-[var(--color-ink-soft)]">{s.isActive ? "Visible" : "Hidden"} · order {s.sortOrder}</p>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm text-[var(--color-ink-soft)] line-clamp-2">{s.shortDescription}</p>
            <div className="mt-4 flex gap-4">
              <Link href={`/admin/services/${s.id}/edit`} className="text-xs font-semibold text-[var(--color-forest)] hover:underline">
                Edit
              </Link>
              <form action={deleteService.bind(null, s.id, s.imageUrl)}>
                <ConfirmSubmitButton confirmMessage={`Delete "${s.title}"?`} className="text-xs font-semibold text-[var(--color-danger)] hover:underline">
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {services.length === 0 ? (
          <p className="col-span-2 rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-ink-soft)]">
            No services yet — add Land Verification, Site Inspection, Construction Monitoring, and Vetted Builders Network to get started.
          </p>
        ) : null}
      </div>
    </div>
  );
}
