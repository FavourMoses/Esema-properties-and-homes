/**
 * Every togglable admin section lives here. Add a new key + label when you
 * add a new admin section, and it automatically shows up as a checkbox on
 * the "Add sub-admin" form and gets enforced by middleware.
 *
 * "owner" accounts always have full access and are not affected by this —
 * only "staff" accounts are restricted to the permissions listed here.
 * Managing other admin accounts is deliberately NOT a togglable permission:
 * only "owner" accounts can create/edit/remove admin users, to prevent a
 * staff member from ever granting themselves more access.
 */
export const PERMISSION_KEYS = [
  "properties",
  "services",
  "projects",
  "testimonials",
  "team",
  "bank_accounts",
  "leads",
  "settings",
  "customers",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  properties: "Manage Properties",
  services: "Manage Services",
  projects: "Manage Projects",
  testimonials: "Manage Testimonials",
  team: "Manage Team",
  bank_accounts: "Manage Bank Accounts",
  leads: "View & Manage Leads",
  settings: "Edit Site Settings",
  customers: "Manage Customer Accounts",
};

export function isValidPermissionKey(value: string): value is PermissionKey {
  return (PERMISSION_KEYS as readonly string[]).includes(value);
}

/**
 * True if this user can access the given section. Owners can access
 * everything; staff need the key explicitly in their permissions list.
 */
export function hasPermission(
  user: { role: string; permissions: string[] } | null | undefined,
  key: PermissionKey
): boolean {
  if (!user) return false;
  if (user.role === "owner") return true;
  return user.permissions.includes(key);
}

/**
 * Maps an /admin/* URL to the permission section it belongs to. Returns
 * null for pages every logged-in admin can see (dashboard, their own
 * account) — used by middleware to decide what to guard.
 */
export function permissionForPath(pathname: string): PermissionKey | null {
  const map: [string, PermissionKey][] = [
    ["/admin/properties", "properties"],
    ["/admin/services", "services"],
    ["/admin/projects", "projects"],
    ["/admin/testimonials", "testimonials"],
    ["/admin/team", "team"],
    ["/admin/bank-accounts", "bank_accounts"],
    ["/admin/leads", "leads"],
    ["/admin/settings", "settings"],
    ["/admin/customers", "customers"],
  ];
  const match = map.find(([prefix]) => pathname.startsWith(prefix));
  return match ? match[1] : null;
}
