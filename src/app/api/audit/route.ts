import { Resend } from "resend";
import { NextResponse } from "next/server";

// Where booking enquiries land. Change this one line to point them at a
// different inbox.
const INBOX = process.env.AUDIT_INBOX || "support@coloradoappsco.com";

// The sender domain must be verified in Resend; coloradoappsco.com already is.
const FROM = "MRod — coloradoappsai.com <noreply@coloradoappsco.com>";

// Built lazily: constructing Resend at module scope throws when the key is
// absent, which breaks `next build` anywhere the secret isn't set.
function client() {
  return new Resend(process.env.RESEND_API_KEY);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Only ever redirect back into this site. */
function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/audit?sent=1#book";
  }
  return value;
}

function back(request: Request, next: string, status: string) {
  const base = next.split("?")[0];
  return NextResponse.redirect(
    new URL(`${base}?sent=${status}#book`, request.url),
    303
  );
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const next = safeNext(formData.get("next") as string | null);

  // Honeypot — bots fill every field they can see.
  if (formData.get("_honey")) {
    return NextResponse.redirect(new URL(next, request.url), 303);
  }

  const str = (key: string) =>
    ((formData.get(key) as string) || "").trim().slice(0, 5000);

  const name = str("name");
  const email = str("email");
  const week = str("week");
  const business = str("business") || "Not given";
  const phone = str("phone") || "Not given";

  if (!name || !week || !EMAIL.test(email)) {
    return back(request, next, "invalid");
  }

  try {
    await client().emails.send({
      from: FROM,
      to: [INBOX],
      replyTo: email,
      subject: `Audit enquiry — ${name}${business !== "Not given" ? ` (${business})` : ""}`,
      text: [
        "Someone asked to book the three-hour audit.",
        "",
        `Name:     ${name}`,
        `Email:    ${email}`,
        `Phone:    ${phone}`,
        `Business: ${business}`,
        "",
        "What eats the most time in their week:",
        week,
        "",
        `Sent from the /audit page at ${new Date().toISOString()}`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Audit enquiry error:", error);
    return back(request, next, "error");
  }

  return NextResponse.redirect(new URL(next, request.url), 303);
}
