import { NextRequest } from "next/server";
import { twimlResponse, validateTwilioRequest } from "@/lib/twilio";

const GREETING =
  process.env.TWILIO_VOICEMAIL_GREETING ||
  "Hello, you've reached Colorado Apps Co. We're unable to take your call right now. Please leave a message after the beep and we'll get back to you as soon as possible.";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = value.toString();
  });

  const signature = req.headers.get("x-twilio-signature") || "";
  const url = `${process.env.TWILIO_WEBHOOK_BASE_URL || req.nextUrl.origin}/api/twilio/voice`;

  if (!validateTwilioRequest(url, params, signature)) {
    return new Response("Forbidden", { status: 403 });
  }

  const callbackUrl = `${process.env.TWILIO_WEBHOOK_BASE_URL || req.nextUrl.origin}/api/twilio/voice/recording`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${escapeXml(GREETING)}</Say>
  <Record
    maxLength="120"
    action="${escapeXml(callbackUrl)}"
    recordingStatusCallback="${escapeXml(callbackUrl)}"
    recordingStatusCallbackMethod="POST"
    transcribe="true"
    transcribeCallback="${escapeXml(callbackUrl)}"
    playBeep="true"
  />
  <Say voice="alice">We did not receive a recording. Goodbye.</Say>
</Response>`;

  return twimlResponse(twiml);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
