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

export async function requestAdminPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { message: null, error: "Please enter a valid email address." };
  }
  const email = parsed.data.email.toLowerCase().trim();

  const [user] = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email)).limit(1);

  // Same response whether or not the account exists — never reveal which
  // emails are registered.
  if (user && user.isActive) {
    const { raw, hash } = generateResetToken();
    await db.insert(schema.adminPasswordResets).values({
      adminUserId: user.id,
      tokenHash: hash,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/admin/reset-password?token=${raw}`;

    try {
      await sendPasswordResetEmail({ to: user.email, name: user.name, resetUrl, audience: "admin" });
    } catch {
      // Don't leak email-delivery failures to the requester — same
      // generic response either way.
    }
  }

  return { message: GENERIC_MESSAGE, error: null };
}

export async function resetAdminPassword(
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
    .from(schema.adminPasswordResets)
    .where(
      and(
        eq(schema.adminPasswordResets.tokenHash, tokenHash),
        isNull(schema.adminPasswordResets.usedAt),
        gt(schema.adminPasswordResets.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!record) {
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await db
    .update(schema.adminUsers)
    .set({ passwordHash, failedLoginAttempts: 0, lockedUntil: null })
    .where(eq(schema.adminUsers.id, record.adminUserId));

  await db
    .update(schema.adminPasswordResets)
    .set({ usedAt: new Date() })
    .where(eq(schema.adminPasswordResets.id, record.id));

  redirect("/admin/login?reset=success");
}
