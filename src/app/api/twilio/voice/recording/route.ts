import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { twimlResponse, validateTwilioRequest } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = value.toString();
  });

  const signature = req.headers.get("x-twilio-signature") || "";
  const url = `${process.env.TWILIO_WEBHOOK_BASE_URL || req.nextUrl.origin}/api/twilio/voice/recording`;

  if (!validateTwilioRequest(url, params, signature)) {
    return new Response("Forbidden", { status: 403 });
  }

  // Handle transcription callback
  if (params.TranscriptionText && params.CallSid) {
    await supabase
      .from("voicemails")
      .update({ transcription: params.TranscriptionText })
      .eq("call_sid", params.CallSid);

    return new Response("OK", { status: 200 });
  }

  // Handle recording status callback
  if (params.RecordingUrl && params.RecordingSid) {
    const { error } = await supabase.from("voicemails").upsert(
      {
        call_sid: params.CallSid,
        from_number: params.From || "unknown",
        to_number: params.To || "unknown",
        recording_url: params.RecordingUrl,
        recording_sid: params.RecordingSid,
        duration_seconds: parseInt(params.RecordingDuration || "0", 10),
        status: "new",
      },
      { onConflict: "call_sid" }
    );

    if (error) {
      console.error("Failed to store voicemail:", error);
    }

    // If this is the <Record> action callback, return TwiML to hang up
    if (params.RecordingUrl && !params.RecordingStatus) {
      return twimlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Thank you for your message. Goodbye.</Say>
  <Hangup/>
</Response>`);
    }

    return new Response("OK", { status: 200 });
  }

  // Fallback for action callback without recording (caller hung up before beep)
  return twimlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Hangup/>
</Response>`);
}
