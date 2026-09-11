"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextArea, CheckboxField } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Icon } from "@/components/ui/icon";
import { ICON_NAMES } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import type { ServiceFormState } from "@/lib/actions/services";

type ServiceRecord = {
  slug: string;
  icon: string;
  title: string;
  shortDescription: string;
  fullDescription: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function ServiceForm({
  action,
  initial,
}: {
  action: (state: ServiceFormState, formData: FormData) => Promise<ServiceFormState>;
  initial?: ServiceRecord;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [icon, setIcon] = useState(initial?.icon ?? "ShieldCheck");
  const router = useRouter();

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="title">
          <TextInput
            id="title"
            name="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="URL slug" htmlFor="slug">
          <TextInput
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
        </Field>
      </div>

      <Field label="Short description" htmlFor="shortDescription" hint="Shown on cards — keep it to one or two sentences">
        <TextArea id="shortDescription" name="shortDescription" rows={2} required defaultValue={initial?.shortDescription} />
      </Field>

      <Field label="Full description" htmlFor="fullDescription" hint="Shown on the service's own page">
        <TextArea id="fullDescription" name="fullDescription" rows={6} defaultValue={initial?.fullDescription ?? ""} />
      </Field>

      <div>
        <label className="text-sm font-medium text-[var(--color-navy)]">Icon</label>
        <input type="hidden" name="icon" value={icon} />
        <div className="mt-2 flex flex-wrap gap-2">
          {ICON_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setIcon(name)}
              aria-label={name}
              className={`flex h-10 w-10 items-center justify-center rounded-md border ${
                icon === name
                  ? "border-[var(--color-forest)] bg-[var(--color-sage)]"
                  : "border-[var(--color-border)] hover:bg-[var(--color-paper-tint)]"
              }`}
            >
              <Icon name={name} className="h-5 w-5 text-[var(--color-navy)]" />
            </button>
          ))}
        </div>
      </div>

      <ImageUploadField name="imageUrl" label="Illustration photo (optional)" folder="services" defaultValue={initial?.imageUrl} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sort order" htmlFor="sortOrder" hint="Lower numbers appear first">
          <TextInput id="sortOrder" name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} />
        </Field>
        <div className="flex items-end pb-2">
          <CheckboxField name="isActive" label="Visible on the site" defaultChecked={initial?.isActive ?? true} />
        </div>
      </div>

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving..." : initial ? "Save changes" : "Create service"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/services")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
