import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { db, schema } from "@/lib/db";
import { asc } from "drizzle-orm";
import { deleteTestimonial } from "@/lib/actions/testimonials";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.sortOrder));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Testimonials</h1>
        <Link
          href="/admin/testimonials/new"
          className="flex items-center gap-2 rounded-md bg-[var(--color-forest)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-forest-deep)]"
        >
          <Plus className="h-4 w-4" /> Add testimonial
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {testimonials.map((t) => (
          <div key={t.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-[var(--color-navy)]">{t.clientName}</p>
                {t.clientRole ? <p className="text-xs text-[var(--color-ink-soft)]">{t.clientRole}</p> : null}
              </div>
              <div className="flex items-center gap-1 text-[var(--color-gold)]">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)] line-clamp-2">{t.message}</p>
            <div className="mt-3 flex gap-4">
              <Link href={`/admin/testimonials/${t.id}/edit`} className="text-xs font-semibold text-[var(--color-forest)] hover:underline">
                Edit
              </Link>
              <form action={deleteTestimonial.bind(null, t.id, t.avatarUrl)}>
                <ConfirmSubmitButton confirmMessage="Delete this testimonial?" className="text-xs font-semibold text-[var(--color-danger)] hover:underline">
                  Delete
                </ConfirmSubmitButton>
              </form>
            </div>
          </div>
        ))}
        {testimonials.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-ink-soft)]">
            No testimonials yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
