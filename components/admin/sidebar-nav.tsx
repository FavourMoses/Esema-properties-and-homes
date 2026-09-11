"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Wrench,
  FolderKanban,
  Star,
  Users,
  Inbox,
  Landmark,
  Settings,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { hasPermission, type PermissionKey } from "@/lib/permissions";

const LINKS: { href: string; label: string; icon: typeof LayoutDashboard; permission?: PermissionKey }[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Building2, permission: "properties" },
  { href: "/admin/services", label: "Services", icon: Wrench, permission: "services" },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, permission: "projects" },
  { href: "/admin/leads", label: "Leads / Inquiries", icon: Inbox, permission: "leads" },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star, permission: "testimonials" },
  { href: "/admin/team", label: "Team", icon: Users, permission: "team" },
  { href: "/admin/bank-accounts", label: "Bank Accounts", icon: Landmark, permission: "bank_accounts" },
  { href: "/admin/customers", label: "Customers", icon: UserCircle, permission: "customers" },
  { href: "/admin/settings", label: "Site Settings", icon: Settings, permission: "settings" },
];

export function AdminSidebarNav({
  role,
  permissions,
}: {
  role: string;
  permissions: string[];
}) {
  const pathname = usePathname();
  const user = { role, permissions };

  const visibleLinks = LINKS.filter((link) => !link.permission || hasPermission(user, link.permission));

  return (
    <nav className="flex-1 space-y-1 p-3">
      {visibleLinks.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-[var(--color-sage)] text-[var(--color-forest-deep)]"
                : "text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-tint)]"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        );
      })}

      {role === "owner" ? (
        <>
          <div className="my-2 border-t border-[var(--color-border)]" />
          <Link
            href="/admin/admin-users"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              pathname.startsWith("/admin/admin-users")
                ? "bg-[var(--color-sage)] text-[var(--color-forest-deep)]"
                : "text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-tint)]"
            }`}
          >
            <ShieldCheck className="h-4 w-4" /> Admin Users
          </Link>
        </>
      ) : null}
    </nav>
  );
}
