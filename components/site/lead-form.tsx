"use client";

import { useActionState } from "react";
import { submitLead, type LeadFormState } from "@/lib/actions/leads";
import { Button } from "@/components/ui/button";

const initialState: LeadFormState = { ok: false, message: "" };

export function LeadForm({
  type = "general",
  propertyId,
  submitLabel = "Send message",
}: {
  type?: "general" | "property_inquiry" | "consultation" | "verification_request";
  propertyId?: string;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  if (state.ok) {
    return (
      <div className="rounded-lg border border-[var(--color-forest)] bg-[var(--color-sage)] p-5 text-sm text-[var(--color-navy)]">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="type" value={type} />
      {propertyId ? <input type="hidden" name="propertyId" value={propertyId} /> : null}

      <div>
        <label htmlFor="name" className="text-sm font-medium text-[var(--color-navy)]">
          Full name
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="text-sm font-medium text-[var(--color-navy)]">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-[var(--color-navy)]">
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-[var(--color-navy)]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="mt-1 w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-sm"
        />
      </div>

      {!state.ok && state.message ? (
        <p className="text-sm text-[var(--color-danger)]">{state.message}</p>
      ) : null}

      <Button type="submit" variant="primary" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending..." : submitLabel}
      </Button>
    </form>
  );
}
