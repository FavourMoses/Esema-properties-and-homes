import { TestimonialForm } from "@/components/admin/testimonial-form";
import { createTestimonial } from "@/lib/actions/testimonials";

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Add testimonial</h1>
      <div className="mt-6">
        <TestimonialForm action={createTestimonial} />
      </div>
    </div>
  );
}
