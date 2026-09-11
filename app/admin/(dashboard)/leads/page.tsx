import { db, schema } from "@/lib/db";
import { desc } from "drizzle-orm";
import { format } from "date-fns";
import { updateLeadStatus, deleteLead } from "@/lib/actions/leads-admin";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit-button";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  general: "General",
  property_inquiry: "Property inquiry",
  consultation: "Consultation",
  verification_request: "Verification request",
};

export default async function AdminLeadsPage() {
  const leads = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[var(--color-navy)]">Leads / Inquiries</h1>
      <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
        Everyone who has contacted you through the website, newest first.
      </p>

      <div className="mt-6 space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="rounded-lg border border-[var(--color-border)] bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[var(--color-navy)]">{lead.name}</p>
                <p className="text-xs text-[var(--color-ink-soft)]">
                  {[lead.email, lead.phone].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[var(--color-paper-tint)] px-2.5 py-1 text-xs font-medium text-[var(--color-navy)]">
                  {TYPE_LABEL[lead.type] ?? lead.type}
                </span>
                <form action={updateLeadStatus.bind(null, lead.id)}>
                  <LeadStatusSelect defaultValue={lead.status} />
                </form>
                <form action={deleteLead.bind(null, lead.id)}>
                  <ConfirmSubmitButton confirmMessage="Delete this inquiry?" className="text-xs font-semibold text-[var(--color-danger)] hover:underline">
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm text-[var(--color-ink-soft)]">{lead.message}</p>
            <p className="mt-2 text-xs text-[var(--color-ink-soft)]">
              {format(lead.createdAt, "d MMM yyyy, HH:mm")}
            </p>
          </div>
        ))}
        {leads.length === 0 ? (
          <p className="rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center text-sm text-[var(--color-ink-soft)]">
            No inquiries yet.
          </p>
        ) : null}
      </div>
    </div>
  );
}
