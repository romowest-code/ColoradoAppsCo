/**
 * A speed bump, not a lock.
 *
 * The audit endpoint costs real money per call and sits on the public
 * internet with no login in front of it. This keeps one person — or one
 * bored script — from running up a bill.
 *
 * In-memory, so on serverless each instance counts separately and a cold
 * start forgets everything. That is accepted: it stops the obvious abuse
 * cheaply. If this ever needs to be airtight, move the counter to a shared
 * store (Upstash, Vercel KV) and keep this interface.
 */

type Hit = { count: number; resetAt: number };

const HITS = new Map<string, Hit>();
const WINDOW_MS = 60 * 60 * 1000; // one hour
const MAX_PER_WINDOW = 4;
const MAX_KEYS = 5000;

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();
  return ip || request.headers.get("x-real-ip") || "unknown";
}

export function allow(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Opportunistic sweep so the map can't grow without bound.
  if (HITS.size > MAX_KEYS) {
    for (const [k, v] of HITS) if (v.resetAt <= now) HITS.delete(k);
  }

  const hit = HITS.get(key);
  if (!hit || hit.resetAt <= now) {
    HITS.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }
  if (hit.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfter: Math.ceil((hit.resetAt - now) / 1000) };
  }
  hit.count += 1;
  return { ok: true, retryAfter: 0 };
}
