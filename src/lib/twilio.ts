import twilio from "twilio";

export function validateTwilioRequest(
  url: string,
  params: Record<string, string>,
  signature: string
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!authToken) {
    console.warn("TWILIO_AUTH_TOKEN not set — skipping request validation");
    return true;
  }
  return twilio.validateRequest(authToken, signature, url, params);
}

export function twimlResponse(xml: string): Response {
  return new Response(xml, {
    headers: { "Content-Type": "text/xml" },
  });
}
