import "server-only";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "esema-media";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB per image

/**
 * Service-role Supabase client. This key bypasses Row Level Security, so it
 * must NEVER be imported into client components — `server-only` above
 * throws a build error if anything tries to bundle this into client JS.
 */
function getAdminClient() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export async function uploadImage(file: File, folder: string): Promise<string> {
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP or AVIF images are allowed.");
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Images must be smaller than 8MB.");
  }

  const extension = file.type.split("/")[1];
  const path = `${folder}/${randomUUID()}.${extension}`;

  const supabase = getAdminClient();
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteImageByUrl(url: string): Promise<void> {
  if (!SUPABASE_URL) return;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return; // not a Supabase-hosted image, nothing to clean up

  const path = url.slice(idx + marker.length);
  const supabase = getAdminClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
