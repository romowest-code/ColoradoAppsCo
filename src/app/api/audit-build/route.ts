import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { NextResponse } from "next/server";

import { cleanAnswers, isComplete } from "@/lib/audit/questions";
import { AuditSchema } from "@/lib/audit/schema";
import { SYSTEM, buildUserMessage } from "@/lib/audit/prompt";
import { allow, clientKey } from "@/lib/audit/limit";
import { sign } from "@/lib/audit/sign";

// Built lazily: constructing the client at module scope throws when the key
// is absent, which breaks `next build` anywhere the secret isn't set.
function client() {
  return new Anthropic();
}

export async function POST(request: Request) {
  const gate = allow(clientKey(request));
  if (!gate.ok) {
    return NextResponse.json(
      {
        error:
          "That's a few audits in a row from this connection. Give it an hour and try again.",
      },
      { status: 429, headers: { "Retry-After": String(gate.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Couldn't read that." }, { status: 400 });
  }

  const answers = cleanAnswers((body as { answers?: unknown })?.answers);
  if (!isComplete(answers)) {
    return NextResponse.json(
      { error: "Some answers didn't come through. Go back and check." },
      { status: 400 },
    );
  }

  // After validation, so bad input is rejected the same way whether or not
  // the service happens to be configured.
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "The audit isn't switched on yet. Try again shortly." },
      { status: 503 },
    );
  }

  try {
    const response = await client().messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 8000,
      system: SYSTEM,
      output_config: {
        effort: "medium",
        format: zodOutputFormat(AuditSchema),
      },
      messages: [{ role: "user", content: buildUserMessage(answers) }],
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        {
          error:
            "I couldn't write an audit from those answers. Try describing the work itself.",
        },
        { status: 422 },
      );
    }

    const audit = response.parsed_output;
    if (!audit) {
      return NextResponse.json(
        { error: "The audit came back malformed. Try once more." },
        { status: 502 },
      );
    }

    // Signed so /api/audit-send will only ever mail something we wrote.
    let signature: string | null = null;
    try {
      signature = sign(audit);
    } catch {
      // No secret configured — the page hides the email option.
    }

    return NextResponse.json({ audit, signature });
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Busy right now. Try again in a minute." },
        { status: 429 },
      );
    }
    console.error("audit-build failed", error);
    return NextResponse.json(
      { error: "Something broke on my end. Try again in a minute." },
      { status: 500 },
    );
  }
}
