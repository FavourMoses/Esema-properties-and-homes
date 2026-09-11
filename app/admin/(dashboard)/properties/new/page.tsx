import { PropertyForm } from "@/components/admin/property-form";
import { createProperty } from "@/lib/actions/properties";

export default function NewPropertyPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Add property</h1>
      <div className="mt-6">
        <PropertyForm action={createProperty} />
      </div>
    </div>
  );
}
