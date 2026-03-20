import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { twimlResponse, validateTwilioRequest } from "@/lib/twilio";

const AUTO_REPLY =
  process.env.TWILIO_SMS_AUTO_REPLY ||
  "Thanks for your message! We've received it and will get back to you soon. - Colorado Apps Co.";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = value.toString();
  });

  const signature = req.headers.get("x-twilio-signature") || "";
  const url = `${process.env.TWILIO_WEBHOOK_BASE_URL || req.nextUrl.origin}/api/twilio/sms`;

  if (!validateTwilioRequest(url, params, signature)) {
    return new Response("Forbidden", { status: 403 });
  }

  // Collect media URLs if any MMS attachments
  const numMedia = parseInt(params.NumMedia || "0", 10);
  const mediaUrls: string[] = [];
  for (let i = 0; i < numMedia; i++) {
    const mediaUrl = params[`MediaUrl${i}`];
    if (mediaUrl) mediaUrls.push(mediaUrl);
  }

  const { error } = await supabase.from("sms_messages").insert({
    message_sid: params.MessageSid,
    from_number: params.From || "unknown",
    to_number: params.To || "unknown",
    body: params.Body || "",
    num_media: numMedia,
    media_urls: mediaUrls,
    status: "unread",
  });

  if (error) {
    console.error("Failed to store SMS:", error);
  }

  // Send auto-reply
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(AUTO_REPLY)}</Message>
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
