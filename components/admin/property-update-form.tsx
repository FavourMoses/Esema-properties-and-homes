"use client";

import { useActionState } from "react";
import { Field, TextInput, TextArea, CheckboxField } from "@/components/admin/form-fields";
import { GalleryUploadField } from "@/components/admin/gallery-upload-field";
import { Button } from "@/components/ui/button";
import type { PropertyUpdateFormState } from "@/lib/actions/property-updates";

export function PropertyUpdateForm({
  action,
}: {
  action: (state: PropertyUpdateFormState, formData: FormData) => Promise<PropertyUpdateFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-[var(--color-border)] bg-white p-5">
      <Field label="Title" htmlFor="title" hint="e.g. 'Land survey completed' or 'Foundation poured'">
        <TextInput id="title" name="title" required />
      </Field>
      <Field label="Details" htmlFor="message">
        <TextArea id="message" name="message" rows={3} required />
      </Field>
      <GalleryUploadField name="images" label="Photos (optional)" folder="properties" />
      <CheckboxField name="isVisibleToCustomer" label="Show this to the customer" defaultChecked />

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Posting..." : "Post update"}
      </Button>
    </form>
  );
}
