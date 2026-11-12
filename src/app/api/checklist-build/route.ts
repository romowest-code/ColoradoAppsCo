import OpenAI from "openai";
import { NextResponse } from "next/server";

import { cleanAnswers, isComplete } from "@/lib/checklist/questions";
import { ChecklistSchema, checklistJsonSchema } from "@/lib/checklist/schema";
import { SYSTEM, buildUserMessage } from "@/lib/checklist/prompt";
import { allow, clientKey } from "@/lib/checklist/limit";
import { MODEL, openai } from "@/lib/checklist/openai";
import { sign } from "@/lib/checklist/sign";

export async function POST(request: Request) {
  const gate = allow(clientKey(request));
  if (!gate.ok) {
    return NextResponse.json(
      {
        error:
          "That's a few checklists in a row from this connection. Give it an hour and try again.",
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
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "The checklist isn't switched on yet. Try again shortly." },
      { status: 503 },
    );
  }

  try {
    const completion = await openai().chat.completions.create({
      model: MODEL,
      max_completion_tokens: 4000,
      messages: [
        { role: "system", content: SYSTEM },
        { role: "user", content: buildUserMessage(answers) },
      ],
      // Strict mode: the model cannot return a shape this doesn't allow, so
      // the page never has to render around a missing field.
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "fifteen_hour_checklist",
          strict: true,
          schema: checklistJsonSchema(),
        },
      },
    });

    const choice = completion.choices[0];

    if (choice?.message.refusal) {
      return NextResponse.json(
        {
          error:
            "I couldn't write a checklist from those answers. Try describing the work itself.",
        },
        { status: 422 },
      );
    }

    // Truncated output is invalid JSON, so catch it before parsing and say
    // something truthful rather than "malformed".
    if (choice?.finish_reason === "length") {
      return NextResponse.json(
        { error: "That ran long and got cut off. Try once more." },
        { status: 502 },
      );
    }

    const content = choice?.message.content;
    if (!content) {
      return NextResponse.json(
        { error: "The checklist came back empty. Try once more." },
        { status: 502 },
      );
    }

    // Strict mode makes this near-certain to pass, but the page renders
    // whatever comes out of here, so it gets checked anyway.
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "The checklist came back malformed. Try once more." },
        { status: 502 },
      );
    }

    const result = ChecklistSchema.safeParse(parsed);
    if (!result.success) {
      console.error("checklist-build schema mismatch", result.error.issues);
      return NextResponse.json(
        { error: "The checklist came back malformed. Try once more." },
        { status: 502 },
      );
    }

    const checklist = result.data;

    // Signed so /api/checklist-send will only ever mail something we wrote.
    let signature: string | null = null;
    try {
      signature = sign(checklist);
    } catch {
      // No secret configured — the page hides the email option.
    }

    return NextResponse.json({ checklist, signature });
  } catch (error) {
    if (error instanceof OpenAI.RateLimitError) {
      return NextResponse.json(
        { error: "Busy right now. Try again in a minute." },
        { status: 429 },
      );
    }
    console.error("checklist-build failed", error);
    return NextResponse.json(
      { error: "Something broke on my end. Try again in a minute." },
      { status: 500 },
    );
  }
}
