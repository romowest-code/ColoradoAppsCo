import { Resend } from "resend";
import { NextResponse } from "next/server";

// Built lazily: constructing Resend at module scope throws when the key is
// absent, which breaks `next build` anywhere the secret isn't set.
function client() {
  return new Resend(process.env.RESEND_API_KEY);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Only ever redirect back into this site. */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/?subscribed=1#newsletter";
  }
  return value;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const next = safeNext(formData.get("next") as string | null);

  // Honeypot — bots fill every field they can see.
  if (formData.get("_honey")) {
    return NextResponse.redirect(new URL(next, request.url), 303);
  }

  const email = ((formData.get("email") as string) || "").trim();
  const source = ((formData.get("source") as string) || "homepage").trim();

  if (!EMAIL.test(email)) {
    return NextResponse.redirect(
      new URL(safeNext(`${next.split("?")[0]}?subscribed=invalid`), request.url),
      303
    );
  }

  try {
    await client().emails.send({
      from: "MRod <noreply@coloradoappsco.com>",
      to: ["support@coloradoappsco.com"],
      replyTo: email,
      subject: `15-Hour Audit request — ${email}`,
      text: [
        "Someone asked for the 15-Hour Audit checklist.",
        "",
        `Email:  ${email}`,
        `Source: ${source}`,
        `Time:   ${new Date().toISOString()}`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.redirect(
      new URL(safeNext(`${next.split("?")[0]}?subscribed=error`), request.url),
      303
    );
  }

  return NextResponse.redirect(new URL(next, request.url), 303);
}
