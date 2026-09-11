import { getProperties } from "@/lib/data";
import { Container, SectionHeading } from "@/components/ui/layout";
import { PropertyCard } from "@/components/site/property-card";

export const dynamic = "force-dynamic";

const PROPERTY_TYPES = ["house", "land", "apartment", "duplex", "commercial"] as const;

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; type?: string }>;
}) {
  const params = await searchParams;
  const propertyType = PROPERTY_TYPES.find((t) => t === params.type);

  const properties = await getProperties({
    state: params.state,
    propertyType,
  });

  return (
    <div className="py-14 md:py-16">
      <Container>
        <SectionHeading
          title="Properties"
          subtitle="Every listing here — whether owned by Esema or by a partner — has been through our verification process."
        />

        <form className="mt-8 flex flex-wrap gap-3 rounded-lg border border-[var(--color-border)] bg-white p-4" method="get">
          <input
            type="text"
            name="state"
            defaultValue={params.state}
            placeholder="State (e.g. Lagos)"
            className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm sm:w-48"
          />
          <select
            name="type"
            defaultValue={params.type ?? ""}
            className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm sm:w-48"
          >
            <option value="">All property types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-[var(--color-forest)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-forest-deep)]"
          >
            Filter
          </button>
        </form>

        {properties.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <p className="mt-10 rounded-lg border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-ink-soft)]">
            No properties match that search yet. Try clearing the filters, or check back soon —
            new verified listings are added regularly.
          </p>
        )}
      </Container>
    </div>
  );
}
