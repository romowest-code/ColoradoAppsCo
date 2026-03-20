import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") || "all";
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50", 10), 100);

  const results: Record<string, unknown> = {};

  if (type === "all" || type === "voicemails") {
    const { data, error } = await supabase
      .from("voicemails")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    results.voicemails = data;
  }

  if (type === "all" || type === "sms") {
    const { data, error } = await supabase
      .from("sms_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    results.sms_messages = data;
  }

  return NextResponse.json(results);
}
