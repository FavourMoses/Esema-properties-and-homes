"use client";

import { useState } from "react";
import Image from "next/image";

export function PropertyGallery({
  images,
  title,
}: {
  images: { url: string }[];
  title: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-[var(--color-paper-tint)] text-sm text-[var(--color-ink-soft)]">
        No photos uploaded yet
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[var(--color-paper-tint)]">
        <Image
          src={images[active].url}
          alt={`${title} — photo ${active + 1}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 ${
                active === i ? "border-[var(--color-forest)]" : "border-transparent"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
