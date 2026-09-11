import "server-only";
import { Resend } from "resend";

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set — password reset emails can't be sent.");
  }
  return new Resend(apiKey);
}

function getFromAddress() {
  return process.env.EMAIL_FROM || "Esema Properties & Homes <onboarding@resend.dev>";
}

export async function sendPasswordResetEmail({
  to,
  name,
  resetUrl,
  audience,
}: {
  to: string;
  name: string;
  resetUrl: string;
  audience: "admin" | "customer";
}) {
  const resend = getClient();
  const context = audience === "admin" ? "Esema Admin" : "Esema Client Portal";

  await resend.emails.send({
    from: getFromAddress(),
    to,
    subject: `Reset your ${context} password`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #142e54;">Reset your password</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your ${context} password. Click the button below to choose a new one — this link expires in 1 hour and can only be used once.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #4f7a26; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Reset password
          </a>
        </p>
        <p style="color: #666; font-size: 13px;">
          If you didn't request this, you can safely ignore this email — your password won't be changed.
        </p>
      </div>
    `,
  });
}
