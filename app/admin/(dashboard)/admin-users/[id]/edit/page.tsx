import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { auth } from "@/lib/auth";
import { AdminUserForm } from "@/components/admin/admin-user-form";
import { updateAdminUser } from "@/lib/actions/admin-users";

export const dynamic = "force-dynamic";

export default async function EditAdminUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const [user] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, id)).limit(1);
  if (!user || user.role === "owner") notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Edit sub-admin</h1>
      <div className="mt-6">
        <AdminUserForm action={updateAdminUser.bind(null, id)} initial={user} isSelf={id === session?.user?.id} />
      </div>
    </div>
  );
}
