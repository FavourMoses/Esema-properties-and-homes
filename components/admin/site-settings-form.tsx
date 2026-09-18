"use client";

import { useActionState } from "react";
import { Field, TextInput, TextArea } from "@/components/admin/form-fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { updateSiteSettings, type SettingsFormState } from "@/lib/actions/settings";

type Settings = {
  siteName: string;
  tagline: string;
  logoUrl: string | null;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string | null;
  heroCtaPrimaryLabel: string | null;
  heroCtaPrimaryHref: string | null;
  heroCtaSecondaryLabel: string | null;
  heroCtaSecondaryHref: string | null;
  aboutHeading: string | null;
  aboutBody: string | null;
  aboutImageUrl: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  footerNote: string | null;
};

const initialState: SettingsFormState = { error: null };

export function SiteSettingsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, initialState);

  return (
    <form action={formAction} className="max-w-3xl space-y-10">
      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-navy)]">
          Brand
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Site name (optional)" htmlFor="siteName">
            <TextInput
              id="siteName"
              name="siteName"
              defaultValue={settings.siteName}
            />
          </Field>
          <Field label="Tagline" htmlFor="tagline">
            <TextInput
              id="tagline"
              name="tagline"
              required
              defaultValue={settings.tagline}
            />
          </Field>
        </div>
        <div className="mt-4">
          <ImageUploadField
            name="logoUrl"
            label="Logo (optional — replaces the default mark)"
            folder="branding"
            defaultValue={settings.logoUrl}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-navy)]">
          Homepage hero
        </h2>
        <div className="mt-4 space-y-4">
          <Field
            label="Headline (optional)"
            htmlFor="heroTitle"
            hint="Leave blank if you'd rather the hero show just a photo"
          >
            <TextInput
              id="heroTitle"
              name="heroTitle"
              defaultValue={settings.heroTitle}
            />
          </Field>
          <Field label="Subheading (optional)" htmlFor="heroSubtitle">
            <TextArea
              id="heroSubtitle"
              name="heroSubtitle"
              rows={3}
              defaultValue={settings.heroSubtitle}
            />
          </Field>
          <ImageUploadField
            name="heroImageUrl"
            label="Hero photo"
            folder="branding"
            defaultValue={settings.heroImageUrl}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Primary button label" htmlFor="heroCtaPrimaryLabel">
              <TextInput
                id="heroCtaPrimaryLabel"
                name="heroCtaPrimaryLabel"
                defaultValue={settings.heroCtaPrimaryLabel ?? ""}
              />
            </Field>
            <Field label="Primary button link" htmlFor="heroCtaPrimaryHref">
              <TextInput
                id="heroCtaPrimaryHref"
                name="heroCtaPrimaryHref"
                defaultValue={settings.heroCtaPrimaryHref ?? ""}
              />
            </Field>
            <Field
              label="Secondary button label"
              htmlFor="heroCtaSecondaryLabel"
            >
              <TextInput
                id="heroCtaSecondaryLabel"
                name="heroCtaSecondaryLabel"
                defaultValue={settings.heroCtaSecondaryLabel ?? ""}
              />
            </Field>
            <Field label="Secondary button link" htmlFor="heroCtaSecondaryHref">
              <TextInput
                id="heroCtaSecondaryHref"
                name="heroCtaSecondaryHref"
                defaultValue={settings.heroCtaSecondaryHref ?? ""}
              />
            </Field>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-navy)]">
          About page
        </h2>
        <div className="mt-4 space-y-4">
          <Field label="Heading" htmlFor="aboutHeading">
            <TextInput
              id="aboutHeading"
              name="aboutHeading"
              defaultValue={settings.aboutHeading ?? ""}
            />
          </Field>
          <Field label="Body" htmlFor="aboutBody">
            <TextArea
              id="aboutBody"
              name="aboutBody"
              rows={6}
              defaultValue={settings.aboutBody ?? ""}
            />
          </Field>
          <ImageUploadField
            name="aboutImageUrl"
            label="About photo"
            folder="branding"
            defaultValue={settings.aboutImageUrl}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-navy)]">
          Contact details
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Phone" htmlFor="phone">
            <TextInput
              id="phone"
              name="phone"
              defaultValue={settings.phone ?? ""}
            />
          </Field>
          <Field label="WhatsApp" htmlFor="whatsapp">
            <TextInput
              id="whatsapp"
              name="whatsapp"
              defaultValue={settings.whatsapp ?? ""}
            />
          </Field>
          <Field label="Email" htmlFor="email">
            <TextInput
              id="email"
              name="email"
              type="email"
              defaultValue={settings.email ?? ""}
            />
          </Field>
          <Field label="Address" htmlFor="address">
            <TextInput
              id="address"
              name="address"
              defaultValue={settings.address ?? ""}
            />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-[var(--color-navy)]">
          Social links
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Facebook URL" htmlFor="facebookUrl">
            <TextInput
              id="facebookUrl"
              name="facebookUrl"
              defaultValue={settings.facebookUrl ?? ""}
            />
          </Field>
          <Field label="Instagram URL" htmlFor="instagramUrl">
            <TextInput
              id="instagramUrl"
              name="instagramUrl"
              defaultValue={settings.instagramUrl ?? ""}
            />
          </Field>
          <Field label="Twitter / X URL" htmlFor="twitterUrl">
            <TextInput
              id="twitterUrl"
              name="twitterUrl"
              defaultValue={settings.twitterUrl ?? ""}
            />
          </Field>
          <Field label="LinkedIn URL" htmlFor="linkedinUrl">
            <TextInput
              id="linkedinUrl"
              name="linkedinUrl"
              defaultValue={settings.linkedinUrl ?? ""}
            />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Footer note" htmlFor="footerNote">
            <TextInput
              id="footerNote"
              name="footerNote"
              defaultValue={settings.footerNote ?? ""}
            />
          </Field>
        </div>
      </section>

      {state.error ? (
        <p className="text-sm text-[var(--color-danger)]">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-[var(--color-forest)]">Settings saved.</p>
      ) : null}

      <Button type="submit" variant="primary" disabled={pending}>
        {pending ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
