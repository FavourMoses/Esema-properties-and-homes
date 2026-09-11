"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput, TextArea, Select, CheckboxField } from "@/components/admin/form-fields";
import { GalleryUploadField } from "@/components/admin/gallery-upload-field";
import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import type { PropertyFormState } from "@/lib/actions/properties";

type PropertyRecord = {
  id: string;
  title: string;
  slug: string;
  description: string;
  propertyType: string;
  listingSource: string;
  status: string;
  verificationStatus: string;
  price: string;
  currency: string;
  pricePeriod: string | null;
  state: string;
  city: string;
  addressLine: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sizeSqm: number | null;
  isFeatured: boolean;
  ownerContactName: string | null;
  ownerContactPhone: string | null;
  internalNotes: string | null;
  images?: { url: string }[];
};

export function PropertyForm({
  action,
  initial,
}: {
  action: (state: PropertyFormState, formData: FormData) => Promise<PropertyFormState>;
  initial?: PropertyRecord;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [listingSource, setListingSource] = useState(initial?.listingSource ?? "esema_owned");
  const router = useRouter();

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
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
        <Field label="URL slug" htmlFor="slug" hint="Used in the property's web address">
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

      <Field label="Description" htmlFor="description">
        <TextArea id="description" name="description" rows={5} required defaultValue={initial?.description} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Property type" htmlFor="propertyType">
          <Select id="propertyType" name="propertyType" defaultValue={initial?.propertyType ?? "house"}>
            <option value="house">House</option>
            <option value="land">Land</option>
            <option value="apartment">Apartment</option>
            <option value="duplex">Duplex</option>
            <option value="commercial">Commercial</option>
          </Select>
        </Field>
        <Field label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={initial?.status ?? "available"}>
            <option value="available">Available</option>
            <option value="under_offer">Under offer</option>
            <option value="sold">Sold</option>
          </Select>
        </Field>
        <Field label="Verification status" htmlFor="verificationStatus">
          <Select id="verificationStatus" name="verificationStatus" defaultValue={initial?.verificationStatus ?? "in_review"}>
            <option value="verified">Verified</option>
            <option value="in_review">In review</option>
            <option value="unverified">Unverified</option>
          </Select>
        </Field>
      </div>

      <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-paper-tint)] p-4">
        <Field label="Who owns this property?" htmlFor="listingSource">
          <Select
            id="listingSource"
            name="listingSource"
            value={listingSource}
            onChange={(e) => setListingSource(e.target.value)}
          >
            <option value="esema_owned">Esema owns this property</option>
            <option value="partner_verified">Third party — Esema is verifying/brokering it</option>
          </Select>
        </Field>

        {listingSource === "partner_verified" ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Owner's name (internal only)" htmlFor="ownerContactName">
              <TextInput id="ownerContactName" name="ownerContactName" defaultValue={initial?.ownerContactName ?? ""} />
            </Field>
            <Field label="Owner's phone (internal only)" htmlFor="ownerContactPhone">
              <TextInput id="ownerContactPhone" name="ownerContactPhone" defaultValue={initial?.ownerContactPhone ?? ""} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Internal notes (never shown publicly)" htmlFor="internalNotes">
                <TextArea id="internalNotes" name="internalNotes" rows={2} defaultValue={initial?.internalNotes ?? ""} />
              </Field>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price" htmlFor="price">
          <TextInput id="price" name="price" type="number" min={0} step="1" required defaultValue={initial?.price} />
        </Field>
        <Field label="Currency" htmlFor="currency">
          <TextInput id="currency" name="currency" defaultValue={initial?.currency ?? "NGN"} />
        </Field>
        <Field label="Price period (optional)" htmlFor="pricePeriod" hint="e.g. 'per year' for a rental">
          <TextInput id="pricePeriod" name="pricePeriod" defaultValue={initial?.pricePeriod ?? ""} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="State" htmlFor="state">
          <TextInput id="state" name="state" required defaultValue={initial?.state} />
        </Field>
        <Field label="City" htmlFor="city">
          <TextInput id="city" name="city" required defaultValue={initial?.city} />
        </Field>
      </div>
      <Field label="Address (optional, shown publicly)" htmlFor="addressLine">
        <TextInput id="addressLine" name="addressLine" defaultValue={initial?.addressLine ?? ""} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Bedrooms" htmlFor="bedrooms">
          <TextInput id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={initial?.bedrooms ?? ""} />
        </Field>
        <Field label="Bathrooms" htmlFor="bathrooms">
          <TextInput id="bathrooms" name="bathrooms" type="number" min={0} defaultValue={initial?.bathrooms ?? ""} />
        </Field>
        <Field label="Size (sqm)" htmlFor="sizeSqm">
          <TextInput id="sizeSqm" name="sizeSqm" type="number" min={0} defaultValue={initial?.sizeSqm ?? ""} />
        </Field>
      </div>

      <GalleryUploadField
        name="gallery"
        label="Photos (first photo becomes the cover image)"
        folder="properties"
        defaultValue={initial?.images?.map((i) => i.url)}
      />

      <CheckboxField name="isFeatured" label="Feature this property on the homepage" defaultChecked={initial?.isFeatured} />

      {state.error ? <p className="text-sm text-[var(--color-danger)]">{state.error}</p> : null}

      <div className="flex gap-3">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? "Saving..." : initial ? "Save changes" : "Create property"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/properties")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
