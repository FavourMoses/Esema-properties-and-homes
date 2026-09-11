"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextArea, CheckboxField } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import type { TeamMemberFormState } from "@/lib/actions/team";

type TeamMemberRecord = {
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function TeamMemberForm({
  action,
  initial,
}: {
  action: (state: TeamMemberFormState, formData: FormData) => Promise<TeamMemberFormState>;
  initial?: TeamMemberRecord;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const router = useRouter();

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <TextInput id="name" name="name" required defaultValue={initial?.name} />
        </Field>
        <Field label="Role" htmlFor="role">
          <TextInput id="role" name="role" required defaultValue={initial?.role} />
        </Field>
      </div>
      <Field label="Bio (optional)" htmlFor="bio">
        <TextArea id="bio" name="bio" rows={3} defaultValue={initial?.bio ?? ""} />
      </Field>
      <ImageUploadField name="photoUrl" label="Photo" folder="team" defaultValue={initial?.photoUrl} />
      <Field label="Sort order" htmlFor="sortOrder">
        <TextInput id="sortOrder" name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} />
      </Field>
      <CheckboxField name="isActive" label="Show on the website" defaultChecked={initial?.isActive ?? true} />

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving..." : initial ? "Save changes" : "Add team member"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/team")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
