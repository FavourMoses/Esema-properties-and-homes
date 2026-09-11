import "server-only";
import { cookies } from "next/headers";
import { CUSTOMER_COOKIE_NAME, CUSTOMER_SESSION_HOURS, signCustomerToken, verifyCustomerToken } from "@/lib/customer-jwt";

export async function createCustomerSession(customerId: string) {
  const token = await signCustomerToken(customerId);
  const store = await cookies();
  store.set(CUSTOMER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/portal",
    maxAge: CUSTOMER_SESSION_HOURS * 60 * 60,
  });
}

export async function clearCustomerSession() {
  const store = await cookies();
  store.delete({ name: CUSTOMER_COOKIE_NAME, path: "/portal" });
}

/** Returns the logged-in customer's id, or null if not signed in. */
export async function getCustomerSession(): Promise<{ id: string } | null> {
  const store = await cookies();
  const token = store.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyCustomerToken(token);
}
