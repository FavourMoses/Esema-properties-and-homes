"use server";

import { eq, and, isNull, gt } from "drizzle-orm";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { db, schema } from "@/lib/db";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations";
import { generateResetToken, hashResetToken, RESET_TOKEN_TTL_MS } from "@/lib/reset-token";
import { sendPasswordResetEmail } from "@/lib/email";

export type ForgotPasswordState = { message: string | null; error: string | null };
export type ResetPasswordState = { error: string | null };

const GENERIC_MESSAGE = "If that email is registered, we've sent a link to reset your password.";

export async function requestCustomerPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { message: null, error: "Please enter a valid email address." };
  }
  const email = parsed.data.email.toLowerCase().trim();

  const [user] = await db.select().from(schema.customerUsers).where(eq(schema.customerUsers.email, email)).limit(1);

  if (user && user.isActive) {
    const { raw, hash } = generateResetToken();
    await db.insert(schema.customerPasswordResets).values({
      customerUserId: user.id,
      tokenHash: hash,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/portal/reset-password?token=${raw}`;

    try {
      await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl, audience: "customer" });
    } catch {
      // Same generic response either way — don't leak delivery failures.
    }
  }

  return { message: GENERIC_MESSAGE, error: null };
}

export async function resetCustomerPassword(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const tokenHash = hashResetToken(parsed.data.token);
  const [record] = await db
    .select()
    .from(schema.customerPasswordResets)
    .where(
      and(
        eq(schema.customerPasswordResets.tokenHash, tokenHash),
        isNull(schema.customerPasswordResets.usedAt),
        gt(schema.customerPasswordResets.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!record) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await db
    .update(schema.customerUsers)
    .set({ passwordHash, failedLoginAttempts: 0, lockedUntil: null })
    .where(eq(schema.customerUsers.id, record.customerUserId));

  await db
    .update(schema.customerPasswordResets)
    .set({ usedAt: new Date() })
    .where(eq(schema.customerPasswordResets.id, record.id));

  redirect("/portal/login?reset=success");
}
