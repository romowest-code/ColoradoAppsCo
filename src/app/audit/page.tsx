import type { Metadata } from "next";
import Link from "next/link";
import {
  Shell,
  SiteFooter,
  SiteHeader,
  Wrap,
} from "@/components/mrod/SiteChrome";
import {
  readSubscribeState,
  SignupForm,
} from "@/components/mrod/SignupForm";
import { Btn, Eyebrow, PanelBar, Square, Stat } from "@/components/mrod/ui";

export const metadata: Metadata = {
  title: "The AI automation audit — MRod",
  description:
    "Two weeks, fixed fee. I find the repeat work in your business and hand back three jobs AI should be doing — built and running, not written up in a deck.",
};

const INCLUDED = [
  "A 90-minute walk through your week, recorded",
  "Every repeat task, timed and priced",
  "Three of them built and running",
  "A one-page handover your staff can follow",
  "30 days of questions, answered",
];

const TIMELINE = [
  {
    when: "DAY 1",
    title: "The walk-through",
    body: "You show me a normal week. I ask annoying questions and write down every time you say “and then I just…”.",
  },
  {
    when: "DAYS 2–4",
    title: "The hour count",
    body: "Every repeat task gets a time and a dollar figure. You see the list sorted by what it costs you.",
  },
  {
    when: "DAYS 5–9",
    title: "Build the top three",
    body: "Not a recommendation. Working automations, in your tools, with your data, that your staff can run on Monday.",
  },
  {
    when: "DAY 10",
    title: "Handover",
    body: "One page, plain English, and a short video for whoever has to keep it running after I leave.",
  },
];

const CASES = [
  {
    tag: "CASE 01 · FIELD SERVICE",
    title: "[COMPANY TYPE], [N] trucks",
    before:
      "[The owner's evening routine — quotes typed twice, scheduling by text, invoices on Sunday night.]",
    after: "[What runs by itself now, and who touches it.]",
  },
  {
    tag: "CASE 02 · SHORT-TERM RENTALS",
    title: "[N] properties, one operator",
    before:
      "[Guest messages answered by hand at 11pm, cleaner scheduling in a group chat, owner statements rebuilt every month.]",
    after: "[What the system handles now, and what still gets a human.]",
  },
];

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string }>;
}) {
  const { subscribed } = await searchParams;
  const state = readSubscribeState(subscribed);

  return (
    <Shell>
      <SiteHeader
        active="audit"
        cta={{ href: "/audit#book", label: "BOOK A CALL" }}
      />

      {/* ------------------------------------------------------ hero */}
      <section className="pt-12 pb-10">
        <Wrap className="flex flex-wrap gap-11 items-start">
          <div className="grow min-w-0 basis-[460px]">
            <div className="mb-4.5">
              <Eyebrow tone="idea">03 / HIRE</Eyebrow>
            </div>
            <h1 className="font-head text-[clamp(40px,7vw,60px)] leading-[0.98] font-extrabold tracking-[-0.035em] mb-5">
              Two weeks.
              <br />
              <span className="inline-block bg-orange text-white px-3.5 pt-0.5 pb-1.5 mt-2">
                Three jobs gone.
              </span>
            </h1>
            <p className="text-xl leading-[1.5] text-ink-5 max-w-[32em] mb-5.5">
              I sit with your actual week — the quotes, the scheduling, the
              invoices, the three spreadsheets nobody will admit to — find the
              repeat work, and hand back the three jobs AI should be doing.
              Built and running, not written up in a deck.
            </p>
            <p className="text-base leading-[1.65] text-ink-3 max-w-[34em] border-l-[3px] border-idea pl-4">
              Twenty years of this at Oracle, Barclays and Amgen, where the
              spreadsheets were bigger and the meetings were longer. Same job,
              smaller company, much faster.
            </p>
          </div>

          <div className="grow-0 shrink basis-[300px] min-w-0 w-full border-2 border-ink shadow-[8px_8px_0_#1a1a17] bg-paper-2">
            <div className="px-4.5 py-3 border-b-2 border-ink flex items-center gap-[9px]">
              <Square tone="idea" />
              <span className="font-label text-[11px] tracking-[0.12em] text-ink-2">
                THE AUDIT
              </span>
            </div>
            <div className="p-6">
              <div className="font-head text-[40px] font-extrabold tracking-[-0.03em] leading-none">
                [$ PRICE]
              </div>
              <div className="font-label text-[11px] tracking-[0.1em] text-ink-3 mt-2 mb-5">
                FIXED FEE · 2 WEEKS · 4 SEATS A MONTH
              </div>
              <ul className="flex flex-col gap-3 text-sm leading-[1.5] text-ink-2 list-none p-0 m-0">
                {INCLUDED.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span className="mt-1.5">
                      <Square tone="idea" />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Btn href="/audit#book" block>
                  BOOK A CALL
                </Btn>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* -------------------------------------------------- timeline */}
      <section className="pb-14">
        <Wrap>
          <div className="border-t-2 border-ink pt-7">
            <h2 className="font-head text-[32px] font-extrabold tracking-[-0.03em] mb-6">
              How the two weeks go
            </h2>
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {TIMELINE.map((step) => (
                <div
                  key={step.when}
                  className="border-2 border-ink bg-paper-2 p-5"
                >
                  <div className="font-label text-[11px] tracking-[0.12em] text-ink-3 mb-2.5">
                    {step.when}
                  </div>
                  <h3 className="font-head text-xl font-bold tracking-[-0.02em] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-[1.6] text-ink-4">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* ----------------------------------------------- case studies */}
      <section className="pb-14">
        <Wrap>
          <h2 className="font-head text-[32px] font-extrabold tracking-[-0.03em] mb-2">
            Two I&apos;ve already done
          </h2>
          <p className="text-[17px] text-ink-3 mb-6.5">
            Same method, different trucks.
          </p>
          <div className="flex flex-wrap gap-6">
            {CASES.map((c) => (
              <article
                key={c.tag}
                className="grow basis-[400px] min-w-0 border-2 border-ink shadow-[7px_7px_0_#1a1a17] bg-paper-2"
              >
                <div className="px-5 py-3 border-b-2 border-ink flex gap-3 items-center">
                  <Square tone="idea" size={10} />
                  <span className="font-label text-xs tracking-[0.1em] text-ink-2 grow">
                    {c.tag}
                  </span>
                </div>
                <div className="p-6.5">
                  <h3 className="font-head text-[26px] font-bold tracking-[-0.025em] mb-3.5">
                    {c.title}
                  </h3>
                  <div className="flex flex-col gap-3.5 mb-5">
                    <div>
                      <div className="font-label text-[11px] tracking-[0.12em] text-ink-3 mb-1.5">
                        BEFORE
                      </div>
                      <p className="text-[15px] leading-[1.6] text-ink-4">
                        {c.before}
                      </p>
                    </div>
                    <div>
                      <div className="font-label text-[11px] tracking-[0.12em] text-ink-3 mb-1.5">
                        AFTER
                      </div>
                      <p className="text-[15px] leading-[1.6] text-ink-4">
                        {c.after}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6.5 border-t-2 border-rule pt-4.5">
                    <Stat size="md" value="[N] hrs" label="BACK PER WEEK" />
                    <Stat size="md" value="[$N]" label="A MONTH" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ------------------------------------------------------- book */}
      <section id="book" className="pb-16 scroll-mt-8">
        <Wrap>
          <div className="border-2 border-ink shadow-[10px_10px_0_#a33e17] bg-panel">
            <PanelBar name="START-HERE.TXT" right="[N] SEATS LEFT THIS MONTH" />
            <div className="p-6 sm:p-10 flex flex-wrap gap-10 items-start">
              <div className="grow min-w-0 basis-[420px]">
                <h2 className="font-head text-[clamp(30px,5vw,38px)] leading-[1.04] font-extrabold tracking-[-0.03em] text-panel-text mb-3.5">
                  Not ready to hire anyone? Start free.
                </h2>
                <p className="text-lg leading-[1.55] text-panel-text-2 max-w-[32em] mb-6">
                  Do the 15-Hour Audit yourself. It&apos;s the same first
                  question I&apos;d ask you, on a printable page. If the answer
                  scares you, book the call.
                </p>
                <SignupForm
                  id="audit-email"
                  source="audit"
                  next="/audit?subscribed=1#book"
                  state={state}
                  label="SEND THE CHECKLIST"
                />
              </div>

              <div className="grow-0 shrink basis-[250px] min-w-0 w-full border-2 border-panel-line p-5.5">
                <div className="font-label text-[11px] tracking-[0.12em] text-panel-text-3 mb-3.5">
                  OR SKIP AHEAD
                </div>
                <p className="text-[15px] leading-[1.6] text-[#d8d1c5] mb-4.5">
                  A 20-minute call. I&apos;ll tell you straight whether an audit
                  is worth it for your business.
                </p>
                <Link
                  href="/#newsletter"
                  className="block text-center font-label text-[13px] font-semibold tracking-[0.05em] text-ink bg-paper border-2 border-panel-text px-3.5 py-3.5 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-lit"
                >
                  PICK A TIME
                </Link>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      <SiteFooter />
    </Shell>
  );
}
