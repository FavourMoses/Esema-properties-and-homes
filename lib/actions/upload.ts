"use server";

import { requireAdmin } from "@/lib/actions/require-admin";
import { uploadImage } from "@/lib/storage";
import { isValidPermissionKey, type PermissionKey } from "@/lib/permissions";

// Uploads happen from many different admin forms, so the permission this
// checks depends on which folder the upload is going into — a "team" photo
// requires the "team" permission, a "branding" photo (logo/hero) requires
// "settings", and so on.
const FOLDER_PERMISSION: Record<string, PermissionKey> = {
  properties: "properties",
  services: "services",
  projects: "projects",
  testimonials: "testimonials",
  team: "team",
  branding: "settings",
};

export async function uploadImageAction(
  formData: FormData
): Promise<{ url?: string; error?: string }> {
  const folder = formData.get("folder")?.toString() || "misc";
  const permission = FOLDER_PERMISSION[folder];
  await requireAdmin(permission && isValidPermissionKey(permission) ? permission : undefined);

  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected." };
  }

  try {
    const url = await uploadImage(file, folder);
    return { url };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}
