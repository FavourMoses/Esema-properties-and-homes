import { ServiceForm } from "@/components/admin/service-form";
import { createService } from "@/lib/actions/services";

export default function NewServicePage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Add service</h1>
      <div className="mt-6">
        <ServiceForm action={createService} />
      </div>
    </div>
  );
}
