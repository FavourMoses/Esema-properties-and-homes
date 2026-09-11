"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, schema } from "@/lib/db";
import { loginSchema } from "@/lib/validations";
import { createCustomerSession, clearCustomerSession } from "@/lib/customer-auth";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

export type CustomerLoginState = { error: string | null };

export async function customerLoginAction(
  _prevState: CustomerLoginState,
  formData: FormData
): Promise<CustomerLoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Please enter a valid email and password." };
  }
  const { email, password } = parsed.data;

  const [customer] = await db
    .select()
    .from(schema.customerUsers)
    .where(eq(schema.customerUsers.email, email.toLowerCase().trim()))
    .limit(1);

  if (!customer || !customer.isActive) {
    return { error: "Incorrect email or password, or the account is temporarily locked." };
  }

  if (customer.lockedUntil && customer.lockedUntil.getTime() > Date.now()) {
    return { error: "Incorrect email or password, or the account is temporarily locked." };
  }

  const passwordOk = await bcrypt.compare(password, customer.passwordHash);

  if (!passwordOk) {
    const attempts = customer.failedLoginAttempts + 1;
    const shouldLock = attempts >= MAX_FAILED_ATTEMPTS;
    await db
      .update(schema.customerUsers)
      .set({
        failedLoginAttempts: shouldLock ? 0 : attempts,
        lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000) : customer.lockedUntil,
      })
      .where(eq(schema.customerUsers.id, customer.id));
    return { error: "Incorrect email or password, or the account is temporarily locked." };
  }

  await db
    .update(schema.customerUsers)
    .set({ failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() })
    .where(eq(schema.customerUsers.id, customer.id));

  await createCustomerSession(customer.id);
  redirect("/portal");
}

export async function customerLogoutAction() {
  await clearCustomerSession();
  redirect("/portal/login");
}
