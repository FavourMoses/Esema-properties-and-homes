"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextArea, CheckboxField } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import type { TestimonialFormState } from "@/lib/actions/testimonials";

type TestimonialRecord = {
  clientName: string;
  clientRole: string | null;
  message: string;
  rating: number;
  avatarUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function TestimonialForm({
  action,
  initial,
}: {
  action: (state: TestimonialFormState, formData: FormData) => Promise<TestimonialFormState>;
  initial?: TestimonialRecord;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const router = useRouter();

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Client name" htmlFor="clientName">
          <TextInput id="clientName" name="clientName" required defaultValue={initial?.clientName} />
        </Field>
        <Field label="Role / location (optional)" htmlFor="clientRole">
          <TextInput id="clientRole" name="clientRole" defaultValue={initial?.clientRole ?? ""} />
        </Field>
      </div>
      <Field label="Testimonial" htmlFor="message">
        <TextArea id="message" name="message" rows={4} required defaultValue={initial?.message} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Rating (1-5)" htmlFor="rating">
          <TextInput id="rating" name="rating" type="number" min={1} max={5} defaultValue={initial?.rating ?? 5} />
        </Field>
        <Field label="Sort order" htmlFor="sortOrder">
          <TextInput id="sortOrder" name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} />
        </Field>
      </div>
      <ImageUploadField name="avatarUrl" label="Photo (optional)" folder="testimonials" defaultValue={initial?.avatarUrl} />
      <CheckboxField name="isActive" label="Show on the website" defaultChecked={initial?.isActive ?? true} />

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving..." : initial ? "Save changes" : "Add testimonial"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/testimonials")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
