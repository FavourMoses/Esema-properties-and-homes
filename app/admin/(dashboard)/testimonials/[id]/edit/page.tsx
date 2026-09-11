import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { updateTestimonial } from "@/lib/actions/testimonials";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const [testimonial] = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, numericId)).limit(1);
  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Edit testimonial</h1>
      <div className="mt-6">
        <TestimonialForm action={updateTestimonial.bind(null, numericId)} initial={testimonial} />
      </div>
    </div>
  );
}
