import type { Metadata } from "next";
import Image from "next/image";
import {
  DoorTag,
  Shell,
  SiteFooter,
  SiteHeader,
  Wrap,
} from "@/components/mrod/SiteChrome";
import {
  readSubscribeState,
  SignupForm,
} from "@/components/mrod/SignupForm";
import {
  Btn,
  Chip,
  Eyebrow,
  PanelBar,
  Square,
  Stat,
  TextLink,
} from "@/components/mrod/ui";

export const metadata: Metadata = {
  title: "MRod — AI for the Rest of Us",
  description:
    "I find the busywork in your week and hand it to AI. 165 people use my apps, 15 hours a week saved each. Apps, audits and a weekly video — no jargon, no hype.",
};

const PROOF = [
  { value: "165", label: "PEOPLE USING MY APPS" },
  { value: "15 ", suffix: "hrs", label: "SAVED PER USER, PER WEEK" },
  { value: "$3K", label: "MONTHLY RECURRING REVENUE" },
  { value: "20", suffix: "+ yrs", label: "ENTERPRISE TECH, SHIPPING" },
];

// Two columns on a phone, four on a wide screen. The rules between the
// cells have to move from left to top as the grid rewraps, or stacked
// stats pick up stray indents.
const PROOF_CELL = [
  "lg:pr-6",
  "border-l-2 border-rule pl-5 lg:px-6",
  "border-t-2 border-rule pt-6 lg:border-t-0 lg:border-l-2 lg:px-6 lg:pt-6",
  "border-t-2 border-l-2 border-rule pt-6 pl-5 lg:border-t-0 lg:pl-6 lg:pt-6",
];

const COMPANIES = [
  "Oracle / FatWire",
  "Sun Microsystems",
  "IBM",
  "Hallmark Channel",
  "Barclays",
  "Amgen",
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string }>;
}) {
  const { subscribed } = await searchParams;
  const state = readSubscribeState(subscribed);

  return (
    <Shell>
      <SiteHeader />

      {/* ------------------------------------------------------ hero */}
      <section className="pt-14 pb-10">
        <Wrap className="flex flex-wrap gap-12 items-start">
          <div className="grow min-w-0 basis-[460px]">
            <div className="mb-5">
              <Eyebrow>MICHAEL RODRIGUEZ · DENVER, CO</Eyebrow>
            </div>

            <h1 className="font-head text-[clamp(44px,8vw,72px)] leading-[0.96] font-extrabold tracking-[-0.035em] mb-6">
              AI for the
              <br />
              <span className="inline-block bg-orange text-white px-3.5 pt-0.5 pb-1.5 mt-2">
                Rest of Us
              </span>
            </h1>

            <p className="text-[21px] leading-[1.5] text-ink-5 max-w-[30em] mb-7">
              I find the busywork in your week and hand it to AI. No jargon, no
              hype — just the tools that actually give you your Thursday back.
            </p>

            <p className="text-base leading-[1.65] text-ink-3 max-w-[34em] border-l-[3px] border-orange pl-4 mb-8">
              In 1998 I was building content management systems for Sun and IBM.
              I watched the internet change everything. Now AI is doing it
              again, and I&apos;m figuring it out in public so you don&apos;t get
              left behind.
            </p>

            <div className="flex flex-wrap gap-3.5 items-center">
              <Btn href="/#newsletter">▶ START WITH THE FREE AUDIT</Btn>
              <Btn href="/#learn" variant="paper">
                WATCH THIS WEEK&apos;S VIDEO
              </Btn>
            </div>
          </div>

          <div className="grow-0 shrink basis-[330px] min-w-0 w-full">
            <div className="border-2 border-ink shadow-[8px_8px_0_#1a1a17] bg-panel">
              <PanelBar name="MROD.JPG" right="GEN X · DENVER" />
              <div className="relative w-full h-[420px]">
                <Image
                  src="/mrod-hero.jpg"
                  alt="Michael Rodriguez at his desk in Denver, coffee in hand"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 400px"
                  className="object-cover object-top scale-x-[-1]"
                />
              </div>
            </div>
            <p className="mt-4.5 font-label text-xs leading-[1.8] tracking-[0.04em] text-ink-3">
              Colorado Apps Co. builds the apps.
              <br />
              I&apos;m the one on camera.
            </p>
          </div>
        </Wrap>
      </section>

      {/* ------------------------------------------------ proof strip */}
      <section className="pb-16">
        <Wrap>
          <div className="border-y-2 border-ink grid grid-cols-2 lg:grid-cols-4">
            {PROOF.map((stat, i) => (
              <div key={stat.label} className={`py-6 ${PROOF_CELL[i]}`}>
                <Stat
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                />
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ----------------------------------------------- three doors */}
      <section id="learn" className="pb-[72px] scroll-mt-8">
        <Wrap>
          <h2 className="font-head text-[34px] font-extrabold tracking-[-0.025em] mb-2">
            Pick a door.
          </h2>
          <p className="text-[17px] text-ink-3 max-w-[44em] mb-8">
            Learn it, use what I&apos;ve built, or hand me your week and
            I&apos;ll find the hours.
          </p>

          <div className="flex flex-wrap gap-6 items-stretch">
            {/* 01 — learn */}
            <article className="grow basis-[320px] min-w-0 border-2 border-ink shadow-[6px_6px_0_#1a1a17] bg-paper-2 flex flex-col">
              <DoorTag n="01" name="LEARN" tone="live" />
              <div className="p-6 flex flex-col gap-4 grow">
                <h3 className="font-head text-[26px] font-bold tracking-[-0.02em]">
                  Catch up in ten minutes a week
                </h3>
                <div className="border-2 border-ink bg-panel px-4 py-3.5">
                  <div className="font-label text-[11px] tracking-[0.12em] text-panel-text-3 mb-2">
                    LATEST VIDEO
                  </div>
                  <div className="font-label text-sm leading-[1.55] text-paper">
                    Have AI write your HOA letter
                    <br />
                    <span className="text-panel-text-3">
                      — 9:41 · no jargon
                    </span>
                  </div>
                </div>
                <p className="text-[15px] leading-[1.6] text-ink-4">
                  One tool, one task, ten minutes. Plus the Friday email with
                  the one thing worth your attention.
                </p>
                <span className="grow" />
                <TextLink href="/#newsletter" tone="live">
                  WATCH + SUBSCRIBE →
                </TextLink>
              </div>
            </article>

            {/* 02 — use */}
            <article className="grow basis-[320px] min-w-0 border-2 border-ink shadow-[6px_6px_0_#1a1a17] bg-paper-2 flex flex-col">
              <DoorTag n="02" name="USE" tone="orange" />
              <div className="p-6 flex flex-col gap-4 grow">
                <h3 className="font-head text-[26px] font-bold tracking-[-0.02em]">
                  The App Lab
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5 border-2 border-ink bg-paper px-3 py-2.5">
                    <Chip status="LIVE" />
                    <span className="text-sm font-medium grow">
                      Contractor Money
                    </span>
                    <span className="font-label text-xs text-ink-3">
                      165 users
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 border-2 border-ink bg-paper px-3 py-2.5">
                    <Chip status="BETA" />
                    <span className="text-sm font-medium grow">
                      The Income Stack
                    </span>
                    <span className="font-label text-xs text-ink-3">
                      retirement
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 border-2 border-dashed border-rule-dashed bg-paper px-3 py-2.5">
                    <Chip status="IDEA" />
                    <span className="text-sm font-medium grow">
                      [NEXT EXPERIMENT]
                    </span>
                    <span className="font-label text-xs text-ink-3">
                      voting open
                    </span>
                  </div>
                </div>
                <p className="text-[15px] leading-[1.6] text-ink-4">
                  Everything I build, in public, with what it saves in dollars
                  or hours printed on the box.
                </p>
                <span className="grow" />
                <TextLink href="/app-lab">OPEN THE LAB →</TextLink>
              </div>
            </article>

            {/* 03 — hire */}
            <article className="grow basis-[320px] min-w-0 border-2 border-ink shadow-[6px_6px_0_#1a1a17] bg-paper-2 flex flex-col">
              <DoorTag n="03" name="HIRE" tone="idea" />
              <div className="p-6 flex flex-col gap-4 grow">
                <h3 className="font-head text-[26px] font-bold tracking-[-0.02em]">
                  Three hours, or it&apos;s free
                </h3>
                <p className="text-[15px] leading-[1.6] text-ink-4">
                  Give me one afternoon. I sit with your actual week, find the
                  work that repeats, and build the fix while you watch. You
                  leave with something running — not a report.
                </p>
                <div className="flex flex-col gap-2 font-label text-[13px] text-ink-2">
                  <div className="flex items-center gap-[9px]">
                    <Square tone="idea" size={8} />
                    The quoting and the invoicing
                  </div>
                  <div className="flex items-center gap-[9px]">
                    <Square tone="idea" size={8} />
                    The follow-up nobody gets to
                  </div>
                  <div className="flex items-center gap-[9px]">
                    <Square tone="idea" size={8} />
                    The report you rebuild every month
                  </div>
                </div>
                <p className="text-[15px] leading-[1.6] text-ink-4">
                  Any business, any industry. If you don&apos;t walk away with
                  time back every week, you don&apos;t pay.
                </p>
                <span className="grow" />
                <TextLink href="/audit" tone="idea">
                  SEE HOW IT WORKS →
                </TextLink>
              </div>
            </article>
          </div>
        </Wrap>
      </section>

      {/* ------------------------------------------------ credibility */}
      <section className="pb-[72px]">
        <Wrap>
          <div className="border-2 border-ink bg-paper-2 px-8 py-7">
            <div className="font-label text-xs tracking-[0.14em] text-ink-3 mb-5">
              TWENTY YEARS BEFORE THE CAMERA — 1998 TO TODAY
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-3.5 items-baseline">
              {COMPANIES.map((name) => (
                <span
                  key={name}
                  className="font-head text-[22px] font-bold tracking-[-0.01em] text-ink-2"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* ------------------------------------------------ lead magnet */}
      <section id="newsletter" className="pb-[72px] scroll-mt-8">
        <Wrap>
          <div className="border-2 border-ink shadow-[10px_10px_0_#a33e17] bg-panel">
            <PanelBar
              name="15-HOUR-AUDIT.PDF"
              right="FREE · PRINTABLE · 2 PAGES"
            />
            <div className="p-6 sm:p-10 flex flex-wrap gap-10 items-start">
              <div className="grow min-w-0 basis-[420px]">
                <h2 className="font-head text-[clamp(32px,5vw,42px)] leading-[1.04] font-extrabold tracking-[-0.03em] text-panel-text mb-4">
                  The 15-Hour Audit
                </h2>
                <p className="text-lg leading-[1.55] text-panel-text-2 max-w-[30em] mb-6">
                  A printable checklist that walks your own week, hour by hour,
                  and marks the work a machine should be doing. Print it, fill
                  it in at the kitchen table, bring it back.
                </p>
                <SignupForm
                  id="home-email"
                  source="homepage"
                  next="/?subscribed=1#newsletter"
                  state={state}
                />
                <p className="mt-3.5 font-label text-xs text-panel-text-3">
                  One email a week. Unsubscribe whenever. No sales call.
                </p>
              </div>

              <div className="grow-0 shrink basis-[240px] min-w-0 w-full border-2 border-panel-line p-5">
                <div className="font-label text-[11px] tracking-[0.12em] text-panel-text-3 mb-3.5">
                  INSIDE
                </div>
                <div className="flex flex-col gap-2.5 font-label text-[13px] leading-[1.5] text-[#d8d1c5]">
                  {[
                    "The 7 tasks that eat most weeks",
                    "What to hand over first",
                    "The exact words to type",
                    "What to never hand over",
                  ].map((line) => (
                    <div key={line} className="flex gap-2.5">
                      <span className="mt-1">
                        <Square tone="lit" />
                      </span>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      <SiteFooter home />
    </Shell>
  );
}
