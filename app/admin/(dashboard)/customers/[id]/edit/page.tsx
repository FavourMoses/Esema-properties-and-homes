import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { CustomerForm } from "@/components/admin/customer-form";
import { updateCustomer, getLinkedPropertyIds } from "@/lib/actions/customers";

export const dynamic = "force-dynamic";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [customer] = await db.select().from(schema.customerUsers).where(eq(schema.customerUsers.id, id)).limit(1);
  if (!customer) notFound();

  const [properties, linkedPropertyIds] = await Promise.all([
    db.select({ id: schema.properties.id, title: schema.properties.title }).from(schema.properties).orderBy(asc(schema.properties.title)),
    getLinkedPropertyIds(id),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Edit customer</h1>
      <div className="mt-6">
        <CustomerForm
          action={updateCustomer.bind(null, id)}
          initial={customer}
          allProperties={properties}
          linkedPropertyIds={linkedPropertyIds}
        />
      </div>
    </div>
  );
}
