import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { ServiceForm } from "@/components/admin/service-form";
import { updateService } from "@/lib/actions/services";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  const [service] = await db.select().from(schema.services).where(eq(schema.services.id, numericId)).limit(1);
  if (!service) notFound();

  const boundAction = updateService.bind(null, numericId);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Edit service</h1>
      <div className="mt-6">
        <ServiceForm action={boundAction} initial={service} />
      </div>
    </div>
  );
}
