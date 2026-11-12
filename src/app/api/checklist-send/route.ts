import { Resend } from "resend";
import { NextResponse } from "next/server";

import { ChecklistSchema, type Checklist } from "@/lib/checklist/schema";
import { verify } from "@/lib/checklist/sign";
import { allow, clientKey } from "@/lib/checklist/limit";

const INBOX = process.env.CHECKLIST_INBOX || "support@coloradoappsco.com";
const FROM = "MRod — coloradoappsai.com <noreply@coloradoappsco.com>";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function client() {
  return new Resend(process.env.RESEND_API_KEY);
}

const DIFFICULTY: Record<Checklist["findings"][number]["difficulty"], string> = {
  easy: "Easy",
  medium: "Takes a weekend",
  involved: "Worth getting help with",
};

function hours(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  return `${Math.round(n * 10) / 10} hrs/week`;
}

function asText(checklist: Checklist): string {
  const lines: string[] = [
    "YOUR 15-HOUR CHECKLIST",
    "",
    checklist.headline,
    "",
  ];

  if (checklist.hours_high > 0) {
    lines.push(
      `Hours in play: ${checklist.hours_low}–${checklist.hours_high} a week`,
      checklist.hours_basis,
      "",
    );
  } else {
    lines.push(checklist.hours_basis, "");
  }

  lines.push("WHAT REPEATS", "");
  checklist.findings.forEach((f, i) => {
    lines.push(
      `${i + 1}. ${f.task}  (${hours(f.hours_per_week)} · ${DIFFICULTY[f.difficulty]})`,
      "",
      `   Why it repeats: ${f.why_it_repeats}`,
      `   Hand over:      ${f.what_to_hand_over}`,
      `   First step:     ${f.first_step}`,
      "",
    );
  });

  lines.push(
    "KEEP DOING THIS ONE YOURSELF",
    "",
    checklist.keep_by_hand.task,
    checklist.keep_by_hand.why,
    "",
    "---",
    "",
    checklist.closing,
    "",
    "---",
    "",
    "This was put together from the eight answers you gave at",
    "coloradoappsai.com. The hours come from your own numbers.",
    "",
    "If you'd rather someone did this with you: three hours, $750 flat,",
    "and if you don't leave with time back every week you don't pay.",
    "coloradoappsai.com/audit",
    "",
    "— Mike",
  );
  return lines.join("\n");
}

export async function POST(request: Request) {
  const gate = allow(`send:${clientKey(request)}`);
  if (!gate.ok) {
    return NextResponse.json(
      { error: "That's a few already. Give it an hour." },
      { status: 429, headers: { "Retry-After": String(gate.retryAfter) } },
    );
  }

  let body: { email?: unknown; checklist?: unknown; signature?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Couldn't read that." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL.test(email) || email.length > 200) {
    return NextResponse.json(
      { error: "That email address didn't look right." },
      { status: 400 },
    );
  }

  // The checklist must be one we generated and signed — otherwise this endpoint
  // would happily mail anything to anyone.
  if (!verify(body.checklist, body.signature)) {
    return NextResponse.json(
      { error: "That checklist couldn't be verified. Run it again." },
      { status: 400 },
    );
  }

  const parsed = ChecklistSchema.safeParse(body.checklist);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "That checklist couldn't be read. Run it again." },
      { status: 400 },
    );
  }
  const checklist = parsed.data;

  try {
    await client().emails.send({
      from: FROM,
      to: [email],
      replyTo: INBOX,
      subject: "Your 15-Hour Checklist",
      text: asText(checklist),
    });

    // The list join. Same shape as /api/subscribe so both land together.
    await client().emails.send({
      from: FROM,
      to: [INBOX],
      replyTo: email,
      subject: `15-Hour Checklist completed — ${email}`,
      text: [
        "Someone finished the interactive 15-Hour Checklist and had it emailed.",
        "",
        `Email: ${email}`,
        `Time:  ${new Date().toISOString()}`,
        "",
        "Their checklist:",
        "",
        asText(checklist),
      ].join("\n"),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("checklist-send failed", error);
    return NextResponse.json(
      { error: "Couldn't send it. Try again in a minute." },
      { status: 500 },
    );
  }
}
