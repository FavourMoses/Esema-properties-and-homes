"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextArea, Select, CheckboxField } from "@/components/admin/form-fields";
import { GalleryUploadField } from "@/components/admin/gallery-upload-field";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import type { ProjectFormState } from "@/lib/actions/projects";

type ProjectRecord = {
  title: string;
  slug: string;
  description: string;
  location: string | null;
  status: string;
  progressPercent: number;
  expectedCompletion: string | null;
  isFeatured: boolean;
  images?: { url: string }[];
};

export function ProjectForm({
  action,
  initial,
}: {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>;
  initial?: ProjectRecord;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
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
          <TextInput id="slug" name="slug" required value={slug} onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }} />
        </Field>
      </div>

      <Field label="Description" htmlFor="description">
        <TextArea id="description" name="description" rows={5} required defaultValue={initial?.description} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location" htmlFor="location">
          <TextInput id="location" name="location" defaultValue={initial?.location ?? ""} />
        </Field>
        <Field label="Expected completion" htmlFor="expectedCompletion" hint="e.g. 'Q4 2026'">
          <TextInput id="expectedCompletion" name="expectedCompletion" defaultValue={initial?.expectedCompletion ?? ""} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={initial?.status ?? "ongoing"}>
            <option value="planning">Planning</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </Select>
        </Field>
        <Field label="Progress (%)" htmlFor="progressPercent">
          <TextInput id="progressPercent" name="progressPercent" type="number" min={0} max={100} defaultValue={initial?.progressPercent ?? 0} />
        </Field>
      </div>

      <GalleryUploadField
        name="gallery"
        label="Photos (first photo becomes the cover image)"
        folder="projects"
        defaultValue={initial?.images?.map((i) => i.url)}
      />

      <CheckboxField name="isFeatured" label="Feature this project" defaultChecked={initial?.isFeatured} />

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving..." : initial ? "Save changes" : "Create project"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/projects")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
