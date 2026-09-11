import { AdminUserForm } from "@/components/admin/admin-user-form";
import { createAdminUser } from "@/lib/actions/admin-users";

export default function NewAdminUserPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Add sub-admin</h1>
      <div className="mt-6">
        <AdminUserForm action={createAdminUser} />
      </div>
    </div>
  );
}
