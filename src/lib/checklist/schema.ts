import { z } from "zod";

/**
 * The shape the model must return. It is rendered by our own components,
 * so the model never writes layout or headings — only the facts that go
 * in them. That keeps the page on-brand and stops it writing copy in a
 * voice this site doesn't use.
 */
export const FindingSchema = z.object({
  task: z
    .string()
    .describe("The repeating task, named in the owner's own words. Under 60 characters."),
  hours_per_week: z
    .number()
    .describe(
      "Hours a week this task costs them, derived only from the numbers they gave. Use 0 if they gave nothing to work from.",
    ),
  why_it_repeats: z
    .string()
    .describe(
      "One or two plain sentences on why this happens over and over — usually the same information being written down more than once.",
    ),
  what_to_hand_over: z
    .string()
    .describe(
      "The specific part a machine should take, and the part they keep. Two or three sentences, no product names unless they named the tool themselves.",
    ),
  first_step: z
    .string()
    .describe(
      "One concrete thing they could do this week. Must be doable in under an hour by someone who is not technical.",
    ),
  difficulty: z
    .enum(["easy", "medium", "involved"])
    .describe("How hard the handover is for a non-technical person."),
});

export const ChecklistSchema = z.object({
  headline: z
    .string()
    .describe(
      "One plain sentence naming the single biggest drain on their week. No hype, no exclamation marks, under 120 characters.",
    ),
  hours_low: z
    .number()
    .describe("Low end of hours a week that could come back, from their own numbers."),
  hours_high: z
    .number()
    .describe("High end of hours a week that could come back, from their own numbers."),
  hours_basis: z
    .string()
    .describe(
      "One sentence showing the arithmetic, quoting the figures they gave. If they gave no usable numbers, say so plainly here instead of guessing.",
    ),
  findings: z
    .array(FindingSchema)
    .describe("Three to five findings, most costly first."),
  keep_by_hand: z
    .object({
      task: z.string().describe("Something from their week that should stay human."),
      why: z
        .string()
        .describe("One or two sentences on why handing this one over would be a mistake."),
    })
    .describe(
      "One thing they should NOT automate. This is required — there is always something.",
    ),
  closing: z
    .string()
    .describe(
      "Two or three sentences to end on. If they said what they'd do with the time back, refer to it. Warm, level, no selling.",
    ),
});

export type Finding = z.infer<typeof FindingSchema>;
export type Checklist = z.infer<typeof ChecklistSchema>;

/**
 * The schema in the shape OpenAI's strict structured outputs want.
 *
 * zod 4's toJSONSchema with io:"output" already emits
 * `additionalProperties: false` and lists every property in `required`,
 * which is exactly what strict mode demands — so there is nothing to
 * patch up by hand. `$schema` comes off because the API rejects unknown
 * top-level keywords.
 */
export function checklistJsonSchema(): Record<string, unknown> {
  const schema = z.toJSONSchema(ChecklistSchema, {
    target: "draft-2020-12",
    io: "output",
  }) as Record<string, unknown>;
  delete schema.$schema;
  return schema;
}
