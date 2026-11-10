/**
 * The 15-Hour Audit question set.
 *
 * Fixed, not adaptive: eight questions, asked one at a time. The same
 * array drives the form on the client and validates the payload on the
 * server, so the two can never drift apart.
 *
 * Keep the wording plain. The people answering this run small businesses
 * and are not in a hurry to learn vocabulary.
 */

export type Question =
  | {
      id: string;
      kind: "short" | "long";
      prompt: string;
      help?: string;
      placeholder?: string;
      maxLength: number;
      required: boolean;
    }
  | {
      id: string;
      kind: "one" | "many";
      prompt: string;
      help?: string;
      options: readonly string[];
      // Declared (as never) rather than omitted: the renderer reaches for
      // these inside JSX, where TypeScript drops the narrowing it had.
      maxLength?: never;
      placeholder?: never;
      required: boolean;
    };

export const QUESTIONS: readonly Question[] = [
  {
    id: "business",
    kind: "short",
    prompt: "What do you do, in a sentence?",
    help: "However you'd say it to someone at a barbecue.",
    placeholder: "I run a two-truck handyman business in Denver.",
    maxLength: 200,
    required: true,
  },
  {
    id: "size",
    kind: "one",
    prompt: "How many people, counting you?",
    options: ["Just me", "2 to 5", "6 to 15", "More than 15"],
    required: true,
  },
  {
    id: "drains",
    kind: "many",
    prompt: "Which of these eats the most of your week?",
    help: "Pick as many as are true. There's no wrong answer here.",
    options: [
      "Quotes and estimates",
      "Invoicing and chasing payment",
      "Scheduling and dispatch",
      "Ordering materials",
      "Answering customer messages",
      "Paperwork and compliance",
      "Bookkeeping and receipts",
      "Payroll and hiring",
      "Reporting and figuring out where I stand",
    ],
    required: true,
  },
  {
    id: "steps",
    kind: "long",
    prompt: "Take the one you do most often. What are the actual steps?",
    help: "Walk me through it like I'm standing next to you. Every click, every bit of retyping.",
    placeholder:
      "Customer texts me. I write it on a pad. That night I open the spreadsheet, type it in again, work out the price, then retype the whole thing into an email…",
    maxLength: 2000,
    required: true,
  },
  {
    id: "frequency",
    kind: "short",
    prompt: "How often does that happen, and roughly how long does it take?",
    help: "A guess is fine. \"About ten a week, twenty minutes each.\"",
    placeholder: "About 10 a week, 20 minutes each",
    maxLength: 200,
    required: true,
  },
  {
    id: "tools",
    kind: "short",
    prompt: "What are you using to do it today?",
    help: "Including paper, texts, and the spreadsheet you're embarrassed about.",
    placeholder: "QuickBooks, Excel, a legal pad, my phone",
    maxLength: 300,
    required: true,
  },
  {
    id: "hate",
    kind: "long",
    prompt: "Which part of it do you actually hate?",
    help: "The bit you put off until Sunday night.",
    placeholder: "Typing the same address into three different places.",
    maxLength: 1000,
    required: false,
  },
  {
    id: "freedom",
    kind: "short",
    prompt: "If you got one morning a week back, what would you do with it?",
    help: "Last one.",
    placeholder: "Take my daughter to school",
    maxLength: 200,
    required: false,
  },
] as const;

/** Server-side guard: caps every field and drops anything we didn't ask for. */
export function cleanAnswers(raw: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof raw !== "object" || raw === null) return out;
  const input = raw as Record<string, unknown>;

  for (const q of QUESTIONS) {
    const value = input[q.id];
    if (Array.isArray(value)) {
      // Multi-select: keep only options we offered.
      if (q.kind !== "many") continue;
      const allowed = value
        .filter((v): v is string => typeof v === "string")
        .filter((v) => (q.options as readonly string[]).includes(v));
      if (allowed.length) out[q.id] = allowed.join(", ");
      continue;
    }
    if (typeof value !== "string") continue;
    const text = value.trim();
    if (!text) continue;

    if (q.kind === "one") {
      if ((q.options as readonly string[]).includes(text)) out[q.id] = text;
      continue;
    }
    if (q.kind === "short" || q.kind === "long") {
      out[q.id] = text.slice(0, q.maxLength);
    }
  }
  return out;
}

/** Every required question answered? */
export function isComplete(answers: Record<string, string>): boolean {
  return QUESTIONS.filter((q) => q.required).every((q) => !!answers[q.id]);
}
