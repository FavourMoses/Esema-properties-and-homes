import "server-only";
import { headers } from "next/headers";

/**
 * A basic, good-enough rate limiter for a small site. It lives in memory,
 * so two caveats worth knowing: it resets whenever the server restarts or
 * redeploys, and on serverless hosting (Vercel) it isn't shared across every
 * instance handling traffic. That means a genuinely distributed attacker
 * could still get more requests through than the limit suggests — but it
 * stops the common case (one person or script hammering the form) cold,
 * which is what actually happens to small sites in practice. If this ever
 * needs to be airtight, the upgrade path is a shared store like Upstash
 * Redis instead of this in-memory map.
 */
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export async function checkRateLimit(
  action: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const store = await headers();
  const ip = store.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = `${action}:${ip}`;
  const now = Date.now();

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) {
    return false;
  }
  bucket.count += 1;
  return true;
}
