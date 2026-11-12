import crypto from "node:crypto";

/**
 * Stops /api/checklist-send being used to mail arbitrary text to arbitrary
 * people. The build route signs the checklist it generated; the send route
 * refuses anything without a matching signature. So the only thing this
 * endpoint can ever send is something we wrote ourselves.
 *
 * Set CHECKLIST_SIGNING_SECRET in the environment. Without it we fall back to
 * the Resend key, which is already present wherever mail works and never
 * leaves the server — not elegant, but it means sending works out of the
 * box rather than failing in a way nobody notices until a customer does.
 */
function secret(): string {
  const key = process.env.CHECKLIST_SIGNING_SECRET || process.env.RESEND_API_KEY;
  if (!key) throw new Error("No signing secret available");
  return key;
}

export function sign(payload: unknown): string {
  return crypto
    .createHmac("sha256", secret())
    .update(JSON.stringify(payload))
    .digest("hex");
}

export function verify(payload: unknown, signature: unknown): boolean {
  if (typeof signature !== "string" || signature.length !== 64) return false;
  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
