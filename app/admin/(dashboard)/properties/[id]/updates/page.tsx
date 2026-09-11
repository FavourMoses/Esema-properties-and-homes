import { notFound } from "next/navigation";
import Image from "next/image";
import { eq, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PropertyUpdateForm } from "@/components/admin/property-update-form";
import { AutoSubmitCheckbox } from "@/components/admin/auto-submit-checkbox";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";
import { createPropertyUpdate, deletePropertyUpdate, togglePropertyUpdateVisibility } from "@/lib/actions/property-updates";

export const dynamic = "force-dynamic";

export default async function PropertyUpdatesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property] = await db.select({ title: schema.properties.title }).from(schema.properties).where(eq(schema.properties.id, id)).limit(1);
  if (!property) notFound();

  const updates = await db
    .select()
    .from(schema.propertyUpdates)
    .where(eq(schema.propertyUpdates.propertyId, id))
    .orderBy(desc(schema.propertyUpdates.createdAt));

  const boundCreate = createPropertyUpdate.bind(null, id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">
        Progress updates — {property.title}
      </h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Anything posted here with &ldquo;Show this to the customer&rdquo; checked appears in this buyer&apos;s portal immediately.
      </p>

      <div className="mt-6">
        <PropertyUpdateForm action={boundCreate} />
      </div>

      <div className="mt-8 space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-[var(--color-ink-soft)]">
                  {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(update.createdAt)}
                </p>
                <h3 className="mt-1 font-display text-sm font-semibold text-[var(--color-navy)]">{update.title}</h3>
              </div>
              <form action={deletePropertyUpdate.bind(null, update.id, id)}>
                <ConfirmSubmitButton confirmMessage="Delete this update?" className="text-xs font-semibold text-[var(--color-danger)] hover:underline">
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
            <p className="mt-2 whitespace-pre-line text-sm text-[var(--color-ink-soft)]">{update.message}</p>
            {update.images.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {update.images.map((url, i) => (
                  <div key={url + i} className="relative h-16 w-20 overflow-hidden rounded-md">
                    <Image src={url} alt="" fill className="object-cover" sizes="80px" />
                  </div>
                ))}
              </div>
            ) : null}
            <form action={togglePropertyUpdateVisibility.bind(null, update.id, id)} className="mt-3">
              <AutoSubmitCheckbox name="isVisibleToCustomer" label="Visible to customer" defaultChecked={update.isVisibleToCustomer} />
            </form>
          </div>
        ))}
        {updates.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--color-border)] p-6 text-center text-sm text-[var(--color-ink-soft)]">
            No updates posted yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
