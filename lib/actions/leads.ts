"use server";

import { db, schema } from "@/lib/db";
import { leadSchema } from "@/lib/validations";

export type LeadFormState = {
  ok: boolean;
  message: string;
};

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    phone: formData.get("phone")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    type: (formData.get("type")?.toString() as never) ?? "general",
    propertyId: formData.get("propertyId")?.toString() || null,
  };

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  try {
    await db.insert(schema.leads).values({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
      type: parsed.data.type,
      propertyId: parsed.data.propertyId || null,
    });
  } catch {
    return { ok: false, message: "Something went wrong on our end. Please try again shortly." };
  }

  return { ok: true, message: "Thanks — we've received your message and will be in touch soon." };
}
