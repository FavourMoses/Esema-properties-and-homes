import "server-only";
import { auth } from "@/lib/auth";
import { hasPermission, type PermissionKey } from "@/lib/permissions";

/**
 * Every admin server action calls this first. Middleware already blocks
 * unauthenticated requests and most permission mismatches at the page
 * level, but server actions are invoked by ID rather than by URL, so each
 * mutation re-checks both the session and the specific permission it needs
 * — independent of whatever page happened to render the form.
 */
export async function requireAdmin(permission?: PermissionKey) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (permission && !hasPermission(session.user, permission)) {
    throw new Error("Forbidden — your account doesn't have access to this section.");
  }
  return session.user;
}

/** Owner-only actions (managing other admin accounts). */
export async function requireOwner() {
  const session = await auth();
  if (!session?.user || session.user.role !== "owner") {
    throw new Error("Forbidden — only the site owner can do this.");
  }
  return session.user;
}
