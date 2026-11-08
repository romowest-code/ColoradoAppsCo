import type { Metadata } from "next";
import Image from "next/image";
import {
  Shell,
  SiteFooter,
  SiteHeader,
  Wrap,
} from "@/components/mrod/SiteChrome";
import {
  Btn,
  Chip,
  Eyebrow,
  Stat,
  TextLink,
} from "@/components/mrod/ui";

export const metadata: Metadata = {
  title: "The App Lab — MRod",
  description:
    "Everything I build, in public. Contractor Money, The Income Stack, and the experiments that haven't earned a name yet — with what each one saves printed on the box.",
};

const FILTERS = [
  { label: "ALL", dot: null },
  { label: "LIVE", dot: "bg-live" },
  { label: "BETA", dot: "bg-orange" },
  { label: "IDEA", dot: "bg-idea" },
] as const;

export default function AppLabPage() {
  return (
    <Shell>
      <SiteHeader active="lab" />

      {/* ------------------------------------------------------ hero */}
      <section className="pt-12 pb-9">
        <Wrap className="flex flex-wrap gap-10 items-end">
          <div className="grow min-w-0 basis-[460px]">
            <div className="mb-4.5">
              <Eyebrow>02 / USE</Eyebrow>
            </div>
            <h1 className="font-head text-[clamp(40px,7vw,62px)] leading-[0.98] font-extrabold tracking-[-0.035em] mb-4.5">
              The App Lab
            </h1>
            <p className="text-xl leading-[1.5] text-ink-5 max-w-[32em]">
              Everything I build, in public. What it cost, what it does, and
              what it saves — in dollars or hours, printed on the box. Some of
              it works. Some of it is an idea with a date on it.
            </p>
          </div>

          <div className="grow-0 shrink basis-[260px] min-w-0 w-full border-2 border-ink bg-paper-2 p-5">
            <div className="font-label text-[11px] tracking-[0.12em] text-ink-3 mb-3">
              THE LAB, TODAY
            </div>
            <div className="flex flex-col gap-2.5 font-label text-[13px] text-ink-2">
              {[
                { n: "165", rest: "people using something I made" },
                { n: "$3K", rest: "monthly recurring" },
                { n: "15", rest: "hrs saved, per user, per week" },
              ].map((row) => (
                <div key={row.n} className="flex items-baseline gap-2.5">
                  <span className="font-head text-[26px] font-extrabold tracking-[-0.02em]">
                    {row.n}
                  </span>
                  {row.rest}
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* ---------------------------------------------------- filters */}
      <section className="pb-6">
        <Wrap>
          <div className="flex flex-wrap gap-2.5 items-center border-t-2 border-ink pt-5">
            <span className="font-label text-xs tracking-[0.12em] text-ink-3 mr-1.5">
              FILTER
            </span>
            {FILTERS.map((f, i) => (
              <button
                key={f.label}
                type="button"
                aria-pressed={i === 0}
                className={`inline-flex items-center gap-2 font-label text-xs font-semibold tracking-[0.08em] border-2 border-ink px-3.5 py-2.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                  i === 0 ? "text-paper bg-ink" : "text-ink bg-paper-2"
                }`}
              >
                {f.dot ? (
                  <span
                    aria-hidden="true"
                    className={`inline-block w-[9px] h-[9px] ${f.dot}`}
                  />
                ) : null}
                {f.label}
              </button>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ------------------------------------------------------ cards */}
      <section className="pb-12">
        <Wrap className="flex flex-col gap-6">
          {/* Contractor Money */}
          <article className="border-2 border-ink shadow-[7px_7px_0_#1a1a17] bg-paper-2">
            <div className="px-5 py-3 border-b-2 border-ink flex flex-wrap gap-3 items-center">
              <Chip status="LIVE" />
              <span className="font-label text-xs tracking-[0.1em] text-ink-2 grow">
                CONTRACTOR-MONEY
              </span>
              <span className="font-label text-xs tracking-[0.1em] text-ink-3">
                NOW LIVE — ALL TRADES
              </span>
            </div>
            <div className="p-7 flex flex-wrap gap-8">
              <div className="grow min-w-0 basis-[420px]">
                <h2 className="font-head text-[32px] font-extrabold tracking-[-0.03em] mb-3">
                  Contractor Money
                </h2>
                <p className="text-[17px] leading-[1.6] text-ink-5 max-w-[34em] mb-5">
                  Job costing and cash flow for people who run the crew and the
                  books out of the same truck. Photograph the receipt, say what
                  job it was for, and the numbers land where they belong.
                </p>
                <div className="flex flex-wrap gap-6 border-t-2 border-rule pt-4.5">
                  <Stat size="md" value="165" label="USERS" />
                  <Stat
                    size="md"
                    value="15 "
                    suffix="hrs"
                    label="SAVED / WEEK / USER"
                  />
                  <Stat size="md" value="$3K" label="MRR" />
                  <Stat size="md" value="$19.99" label="A MONTH TO USE IT" />
                </div>
                <div className="border-2 border-ink bg-paper px-4.5 py-4 mt-5">
                  <div className="font-label text-[11px] tracking-[0.12em] text-ink-3 mb-3">
                    WHAT&apos;S IN IT
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <Stat size="md" value="8" label="FEATURES, NO TIERS" />
                    <Stat size="md" value="80+" label="TRADE PRICE BOOKS" />
                    <Stat size="md" value="0%" label="PLATFORM FEES" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3.5 items-center mt-5">
                  <Btn href="https://c-money.app" external>
                    OPEN THE APP
                  </Btn>
                  <TextLink href="/#learn" tone="live">
                    HOW I BUILT IT →
                  </TextLink>
                </div>
              </div>
              <div className="grow-0 shrink basis-[240px] min-w-0 w-full">
                <a
                  href="https://c-money.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-2 border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  <Image
                    src="/contractor-money.jpg"
                    alt="Contractor Money on c-money.app: AI estimates, invoicing and scheduling for solo contractors"
                    width={778}
                    height={523}
                    sizes="(max-width: 900px) 100vw, 400px"
                    className="w-full h-auto"
                  />
                </a>
              </div>
            </div>
          </article>

          {/* The Income Stack */}
          <article className="border-2 border-ink shadow-[7px_7px_0_#1a1a17] bg-paper-2">
            <div className="px-5 py-3 border-b-2 border-ink flex flex-wrap gap-3 items-center">
              <Chip status="BETA" />
              <span className="font-label text-xs tracking-[0.1em] text-ink-2 grow">
                THE-INCOME-STACK
              </span>
              <span className="font-label text-xs tracking-[0.1em] text-ink-3">
                FREE WHILE IT&apos;S IN THE OPEN
              </span>
            </div>
            <div className="p-7 flex flex-wrap gap-8">
              <div className="grow min-w-0 basis-[420px]">
                <h2 className="font-head text-[32px] font-extrabold tracking-[-0.03em] mb-3">
                  The Income Stack
                </h2>
                <p className="text-[17px] leading-[1.6] text-ink-5 max-w-[34em] mb-5">
                  Find out what year your money taps out. Flip a switch —
                  retire at 55, claim Social Security early, three years of
                  long-term care at 80 — and watch the year your plan breaks
                  slide across the screen.
                </p>
                <div className="border-2 border-ink bg-paper px-4.5 py-4 mb-5">
                  <div className="font-label text-[11px] tracking-[0.12em] text-ink-3 mb-3">
                    WHAT&apos;S IN IT
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <Stat size="md" value="7" label="INCOME STREAMS" />
                    <Stat size="md" value="8" label="WHAT-IF SWITCHES" />
                    <Stat size="md" value="867" label="CAREERS TRACKED" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3.5 items-center">
                  <Btn href="https://instack.app" external>
                    OPEN THE APP
                  </Btn>
                  <TextLink href="/#learn">BUILD LOG →</TextLink>
                </div>
              </div>
              <div className="grow-0 shrink basis-[240px] min-w-0 w-full">
                <a
                  href="https://instack.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-2 border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  <Image
                    src="/income-stack.jpg"
                    alt="The Income Stack on instack.app: the what-if simulator and career picker"
                    width={800}
                    height={540}
                    sizes="(max-width: 900px) 100vw, 400px"
                    className="w-full h-auto"
                  />
                </a>
              </div>
            </div>
          </article>

          {/* Ideas */}
          <div className="flex flex-wrap gap-6">
            {[
              {
                title: "[NEXT EXPERIMENT]",
                body: "One line on the problem. One line on who has it. If enough of you want it, it gets built on camera.",
                cta: "VOTE FOR THIS ONE →",
              },
              {
                title: "[YOUR IDEA HERE]",
                body: "Tell me the thing that eats your Tuesday. The best one each month becomes a build video.",
                cta: "SEND ME ONE →",
              },
            ].map((idea) => (
              <article
                key={idea.title}
                className="grow basis-[320px] min-w-0 border-2 border-dashed border-rule-dashed bg-paper-3"
              >
                <div className="px-5 py-3 border-b-2 border-dashed border-rule-dashed flex gap-3 items-center">
                  <Chip status="IDEA" />
                  <span className="font-label text-xs tracking-[0.1em] text-ink-3">
                    VOTING OPEN
                  </span>
                </div>
                <div className="p-5.5">
                  <h3 className="font-head text-2xl font-bold tracking-[-0.02em] mb-2.5">
                    {idea.title}
                  </h3>
                  <p className="text-[15px] leading-[1.6] text-ink-4 mb-4.5">
                    {idea.body}
                  </p>
                  <TextLink href="/#newsletter" tone="idea">
                    {idea.cta}
                  </TextLink>
                </div>
              </article>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ------------------------------------------------------- band */}
      <section className="pb-16">
        <Wrap>
          <div className="border-2 border-ink shadow-[8px_8px_0_#a33e17] bg-panel px-6 py-9 sm:px-10 flex flex-wrap gap-7 items-center">
            <div className="grow min-w-0 basis-[400px]">
              <h2 className="font-head text-[32px] font-extrabold tracking-[-0.03em] text-panel-text mb-2.5">
                Watch the next one get built
              </h2>
              <p className="text-[17px] leading-[1.55] text-panel-text-2 max-w-[34em]">
                Every app in here started as a video. Cost, mistakes, revenue —
                all of it on camera.
              </p>
            </div>
            <Btn href="/#newsletter" variant="orange">
              ▶ SUBSCRIBE
            </Btn>
          </div>
        </Wrap>
      </section>

      <SiteFooter />
    </Shell>
  );
}
