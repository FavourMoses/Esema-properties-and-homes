"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { uploadImageAction } from "@/lib/actions/upload";

export function ImageUploadField({
  name,
  label,
  folder,
  defaultValue,
}: {
  name: string;
  label: string;
  folder: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleFile(file: File | null) {
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    startTransition(async () => {
      const result = await uploadImageAction(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setUrl(result.url);
      }
    });
  }

  return (
    <div>
      <label className="text-sm font-medium text-[var(--color-navy)]">{label}</label>
      <input type="hidden" name={name} value={url} />

      <div className="mt-1 flex items-center gap-4">
        {url ? (
          <div className="relative h-20 w-28 overflow-hidden rounded-md border border-[var(--color-border)]">
            <Image src={url} alt="" fill className="object-cover" sizes="112px" />
            <button
              type="button"
              onClick={() => setUrl("")}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex h-20 w-28 items-center justify-center rounded-md border border-dashed border-[var(--color-border)] text-[var(--color-ink-soft)]">
            {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          </div>
        )}

        <label className="cursor-pointer rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-navy)] hover:bg-[var(--color-paper-tint)]">
          {url ? "Replace" : "Upload"} image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            disabled={pending}
          />
        </label>
      </div>
      {error ? <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p> : null}
    </div>
  );
}
