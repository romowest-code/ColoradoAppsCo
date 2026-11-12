import { notFound } from "next/navigation";
import { Shell, Wrap } from "@/components/mrod/SiteChrome";
import { ChecklistResult } from "@/components/mrod/ChecklistQuestionnaire";
import type { Checklist } from "@/lib/checklist/schema";

/**
 * Development only — 404s in production.
 *
 * Renders a finished checklist from canned data so the result layout and the
 * print stylesheet can be worked on without spending an API call each
 * time. The sample is deliberately a believable answer set, not a tidy
 * one: a real person's numbers are uneven.
 */
const SAMPLE: Checklist = {
  headline:
    "Writing the same job details down three times is costing you most of a working day every week.",
  hours_low: 5.5,
  hours_high: 7,
  hours_basis:
    "You said about 10 quotes a week at 20 minutes each, which is 3.3 hours, plus the invoicing you described taking a couple of hours on Sundays. Call it 5.5 to 7 hours depending on the week.",
  findings: [
    {
      task: "Retyping job details into the quote",
      hours_per_week: 3.3,
      why_it_repeats:
        "The customer's details arrive by text, go onto a pad, then get typed into a spreadsheet and typed again into the email. The same twelve facts, written four times.",
      what_to_hand_over:
        "The retyping. You decide the price — that is judgment and it stays yours. A machine can take the text, pull out the name, address and job, and fill the quote so you are checking a draft rather than starting a blank one.",
      first_step:
        "For one week, forward every job text to one email address instead of writing it on the pad. That gives you the pile to work from.",
      difficulty: "easy",
    },
    {
      task: "Chasing unpaid invoices",
      hours_per_week: 1.5,
      why_it_repeats:
        "Nothing tells you an invoice is late, so you go looking. The looking takes longer than the chasing.",
      what_to_hand_over:
        "The noticing. The first polite reminder can go out on its own. The second one, and anything that turns into a conversation, should still come from you.",
      first_step:
        "Turn on the automatic reminder your invoicing tool already has. It is usually one checkbox.",
      difficulty: "easy",
    },
    {
      task: "Working out where the month stands",
      hours_per_week: 1,
      why_it_repeats:
        "The numbers live in three places that do not talk to each other, so answering one simple question means opening all three.",
      what_to_hand_over:
        "The gathering, not the judging. Something can assemble the figures in one place each Monday. Reading them and deciding what to do is the part worth your time.",
      first_step:
        "Write down the three questions you actually ask at month end. That list is the whole spec.",
      difficulty: "medium",
    },
  ],
  keep_by_hand: {
    task: "The first phone call with a new customer",
    why: "That call is where you work out whether the job is worth taking and whether you want to work with this person. No machine is going to hear hesitation in somebody's voice. Keep it.",
  },
  closing:
    "None of this needs new software this week. The first step on each one is something you can do between jobs. Start with the quotes — it is the biggest number on the list and the easiest to change. If that gets you the Friday morning back, you will know whether the rest is worth doing.",
};

export default function ChecklistPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Shell>
      <section className="py-12">
        <Wrap>
          <p className="print:hidden mb-8 font-label text-[11px] tracking-[0.12em] text-orange border-2 border-orange bg-paper-2 inline-block px-3 py-2">
            DEV PREVIEW · CANNED DATA · 404s IN PRODUCTION
          </p>
          <ChecklistResult checklist={SAMPLE} signature="preview" />
        </Wrap>
      </section>
    </Shell>
  );
}
