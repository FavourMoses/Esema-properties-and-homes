"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { uploadImageAction } from "@/lib/actions/upload";

export function GalleryUploadField({
  name,
  label,
  folder,
  defaultValue,
}: {
  name: string;
  label: string;
  folder: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue ?? []);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);

    Array.from(files).forEach((file) => {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", folder);
      startTransition(async () => {
        const result = await uploadImageAction(formData);
        if (result.error) setError(result.error);
        else if (result.url) setUrls((prev) => [...prev, result.url!]);
      });
    });
  }

  function remove(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    setUrls((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div>
      <label className="text-sm font-medium text-[var(--color-navy)]">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />

      <div className="mt-2 flex flex-wrap gap-3">
        {urls.map((url, i) => (
          <div key={url + i} className="relative h-20 w-28 overflow-hidden rounded-md border border-[var(--color-border)]">
            <Image src={url} alt="" fill className="object-cover" sizes="112px" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="absolute bottom-1 left-1 flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="rounded bg-black/60 p-0.5 text-white" aria-label="Move earlier">
                <ArrowLeft className="h-3 w-3" />
              </button>
              <button type="button" onClick={() => move(i, 1)} className="rounded bg-black/60 p-0.5 text-white" aria-label="Move later">
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-[var(--color-border)] text-xs text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-tint)]">
          {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          Add photo
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={pending}
          />
        </label>
      </div>
      {error ? <p className="mt-1 text-xs text-[var(--color-danger)]">{error}</p> : null}
    </div>
  );
}
