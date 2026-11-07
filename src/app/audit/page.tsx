import type { Metadata } from "next";
import {
  Shell,
  SiteFooter,
  SiteHeader,
  Wrap,
} from "@/components/mrod/SiteChrome";
import { AuditForm, readAuditState } from "@/components/mrod/AuditForm";
import { Btn, Eyebrow, PanelBar, Square, Stat } from "@/components/mrod/ui";

export const metadata: Metadata = {
  title: "Three hours, or it's free — MRod",
  description:
    "Give me one afternoon. I find the work that repeats in your week and build the fix while you watch. Any business, any industry. If you don't leave with time back every week, you don't pay.",
};

const INCLUDED = [
  "A walk through your actual week, recorded",
  "Every repeat task, timed and priced",
  "One of them built and running before I leave",
  "A one-page handover your staff can follow",
  "Two weeks of questions, answered",
];

const HOURS = [
  {
    when: "HOUR 1",
    title: "The walk-through",
    body: "You show me a normal week. I ask annoying questions and write down every time you say “and then I just…”.",
  },
  {
    when: "HOUR 2",
    title: "The hour count",
    body: "Every repeat task gets a time and a dollar figure. We pick the one costing you the most and leave the rest on the list.",
  },
  {
    when: "HOUR 3",
    title: "Build it",
    body: "Not a recommendation. One working automation, in your tools, with your data, that somebody can run tomorrow without me.",
  },
];

const CASES = [
  {
    tag: "EXAMPLE 01 · FIELD SERVICE",
    title: "[COMPANY TYPE], [N] trucks",
    before:
      "[The owner's evening routine — quotes typed twice, scheduling by text, invoices on Sunday night.]",
    after: "[What runs by itself now, and who touches it.]",
  },
  {
    tag: "EXAMPLE 02 · SHORT-TERM RENTALS",
    title: "[N] properties, one operator",
    before:
      "[Guest messages answered by hand at 11pm, cleaner scheduling in a group chat, owner statements rebuilt every month.]",
    after: "[What the system handles now, and what still gets a human.]",
  },
];

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;
  const state = readAuditState(sent);

  return (
    <Shell>
      <SiteHeader
        active="audit"
        cta={{ href: "/audit#book", label: "BOOK THE THREE HOURS" }}
      />

      {/* ------------------------------------------------------ hero */}
      <section className="pt-12 pb-10">
        <Wrap className="flex flex-wrap gap-11 items-start">
          <div className="grow min-w-0 basis-[460px]">
            <div className="mb-4.5">
              <Eyebrow tone="idea">03 / HIRE</Eyebrow>
            </div>
            <h1 className="font-head text-[clamp(40px,7vw,60px)] leading-[0.98] font-extrabold tracking-[-0.035em] mb-5">
              Three hours.
              <br />
              <span className="inline-block bg-orange text-white px-3.5 pt-0.5 pb-1.5 mt-2">
                Or it&apos;s free.
              </span>
            </h1>
            <p className="text-xl leading-[1.5] text-ink-5 max-w-[32em] mb-5.5">
              Give me one afternoon. I sit with your actual week — the quotes,
              the scheduling, the invoices, the three spreadsheets nobody will
              admit to — find the work that repeats, and build the fix while
              you watch. You leave with something running, not a report.
            </p>
            <p className="text-lg leading-[1.55] text-ink-5 max-w-[32em] mb-5.5">
              Any business, any industry. I don&apos;t need to know your trade
              — you do, and that&apos;s the half that matters. If you
              don&apos;t walk away with time back every week, you don&apos;t
              pay.
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
                ONE AFTERNOON
              </span>
            </div>
            <div className="p-6">
              <div className="font-head text-[40px] font-extrabold tracking-[-0.03em] leading-none">
                $750
              </div>
              <div className="font-label text-[11px] tracking-[0.1em] text-ink-3 mt-2 mb-5">
                FLAT FEE · 3 HOURS · 4 SEATS A MONTH
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
                  BOOK THE THREE HOURS
                </Btn>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ----------------------------------------------- the three hours */}
      <section className="pb-14">
        <Wrap>
          <div className="border-t-2 border-ink pt-7">
            <h2 className="font-head text-[32px] font-extrabold tracking-[-0.03em] mb-6">
              How the three hours go
            </h2>
            <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
              {HOURS.map((step) => (
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
            Two businesses with nothing in common
          </h2>
          <p className="text-[17px] text-ink-3 mb-6.5">
            Different trades, different tools, same three hours.
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
            <PanelBar name="BOOK-THE-AUDIT" right="4 SEATS A MONTH" />
            <div className="p-6 sm:p-10 flex flex-wrap gap-10 items-start">
              <div className="grow min-w-0 basis-[440px]">
                <h2 className="font-head text-[clamp(30px,5vw,38px)] leading-[1.04] font-extrabold tracking-[-0.03em] text-panel-text mb-3.5">
                  Tell me what eats your week
                </h2>
                <p className="text-lg leading-[1.55] text-panel-text-2 max-w-[32em] mb-6">
                  No form letter back. I read these myself, and if three hours
                  with me won&apos;t help you, I&apos;ll say so and tell you
                  what would.
                </p>
                <AuditForm state={state} />
              </div>

              <div className="grow-0 shrink basis-[250px] min-w-0 w-full border-2 border-panel-line p-5.5">
                <div className="font-label text-[11px] tracking-[0.12em] text-panel-text-3 mb-3.5">
                  NOT READY YET?
                </div>
                <p className="text-[15px] leading-[1.6] text-[#d8d1c5] mb-4.5">
                  Do the 15-Hour Audit yourself first. It&apos;s the same
                  opening question, on a printable page, and it costs nothing.
                </p>
                <Btn href="/#newsletter" variant="paper" block>
                  GET THE CHECKLIST
                </Btn>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      <SiteFooter />
    </Shell>
  );
}
