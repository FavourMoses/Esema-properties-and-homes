"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export type LoginFormState = {
  error: string | null;
};

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin/dashboard",
    });
    return { error: null };
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Incorrect email or password, or the account is temporarily locked." };
    }
    // NextAuth throws a special redirect "error" on success — rethrow it
    // so Next.js can actually perform the redirect.
    throw err;
  }
}
