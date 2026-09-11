import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { PropertyForm } from "@/components/admin/property-form";
import { updateProperty } from "@/lib/actions/properties";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [property] = await db.select().from(schema.properties).where(eq(schema.properties.id, id)).limit(1);
  if (!property) notFound();

  const images = await db
    .select()
    .from(schema.propertyImages)
    .where(eq(schema.propertyImages.propertyId, id))
    .orderBy(asc(schema.propertyImages.sortOrder));

  const boundAction = updateProperty.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Edit property</h1>
      <div className="mt-6">
        <PropertyForm action={boundAction} initial={{ ...property, images }} />
      </div>
    </div>
  );
}
