import { SignJWT, jwtVerify } from "jose";

export const CUSTOMER_COOKIE_NAME = "customer_session";
export const CUSTOMER_SESSION_HOURS = 8;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set.");
  return new TextEncoder().encode(secret);
}

export async function signCustomerToken(customerId: string) {
  return new SignJWT({ sub: customerId, type: "customer" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${CUSTOMER_SESSION_HOURS}h`)
    .sign(getSecret());
}

export async function verifyCustomerToken(token: string): Promise<{ id: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "customer" || typeof payload.sub !== "string") return null;
    return { id: payload.sub };
  } catch {
    return null;
  }
}
