import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { currencyFormat } from "@/components/site/property-card";
import { deleteProperty } from "@/lib/actions/properties";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const properties = await db.select().from(schema.properties).orderBy(desc(schema.properties.createdAt));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Properties</h1>
        <Link
          href="/admin/properties/new"
          className="flex items-center gap-2 rounded-md bg-[var(--color-forest)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-forest-deep)]"
        >
          <Plus className="h-4 w-4" /> Add property
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-[var(--color-border)] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--color-border)] bg-[var(--color-paper-tint)] text-xs uppercase text-[var(--color-ink-soft)]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {properties.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 font-medium text-[var(--color-navy)]">
                  <div className="flex items-center gap-1.5">
                    {p.isFeatured ? <Star className="h-3.5 w-3.5 fill-[var(--color-gold)] text-[var(--color-gold)]" /> : null}
                    {p.title}
                  </div>
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-soft)]">{p.city}, {p.state}</td>
                <td className="px-4 py-3">{currencyFormat(p.price, p.currency)}</td>
                <td className="px-4 py-3 text-xs">
                  {p.listingSource === "esema_owned" ? "Esema-owned" : "Partner (verified)"}
                </td>
                <td className="px-4 py-3 text-xs capitalize">{p.status.replace("_", " ")}</td>
                <td className="px-4 py-3 text-xs capitalize">{p.verificationStatus.replace("_", " ")}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/properties/${p.id}/edit`} className="text-xs font-semibold text-[var(--color-forest)] hover:underline">
                      Edit
                    </Link>
                    <Link href={`/admin/properties/${p.id}/updates`} className="text-xs font-semibold text-[var(--color-forest)] hover:underline">
                      Updates
                    </Link>
                    <form action={deleteProperty.bind(null, p.id, [p.coverImageUrl].filter((u): u is string => !!u))}>
                      <ConfirmSubmitButton
                        confirmMessage={`Delete "${p.title}"? This cannot be undone.`}
                        className="text-xs font-semibold text-[var(--color-danger)] hover:underline"
                      >
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--color-ink-soft)]">
                  No properties yet — add your first one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
