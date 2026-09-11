import { db, schema } from "@/lib/db";
import { asc } from "drizzle-orm";
import { CustomerForm } from "@/components/admin/customer-form";
import { createCustomer } from "@/lib/actions/customers";

export default async function NewCustomerPage() {
  const properties = await db
    .select({ id: schema.properties.id, title: schema.properties.title })
    .from(schema.properties)
    .orderBy(asc(schema.properties.title));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Add customer</h1>
      <div className="mt-6">
        <CustomerForm action={createCustomer} allProperties={properties} linkedPropertyIds={[]} />
      </div>
    </div>
  );
}
