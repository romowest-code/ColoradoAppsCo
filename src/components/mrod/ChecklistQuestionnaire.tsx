"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { QUESTIONS, type Question } from "@/lib/checklist/questions";
import type { Checklist } from "@/lib/checklist/schema";

type Answers = Record<string, string | string[]>;
type Phase = "asking" | "working" | "done";

const DIFFICULTY: Record<string, string> = {
  easy: "EASY",
  medium: "A WEEKEND",
  involved: "GET HELP",
};

const FIELD =
  "w-full box-border font-body text-[17px] text-ink bg-paper-2 border-2 border-ink px-4 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange";

const PRESS =
  "transition-transform duration-75 active:translate-x-[2px] active:translate-y-[2px]";

function hrs(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  return String(Math.round(n * 10) / 10);
}

/** One answer is "given" if it has any content. */
function filled(value: string | string[] | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return !!value && value.trim().length > 0;
}

export function ChecklistQuestionnaire() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("asking");
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const question = QUESTIONS[step];
  const last = step === QUESTIONS.length - 1;
  const value = answers[question?.id ?? ""];
  const canAdvance = !question?.required || filled(value);

  function set(id: string, v: string | string[]) {
    setAnswers((prev) => ({ ...prev, [id]: v }));
  }

  function toggle(id: string, option: string) {
    const current = Array.isArray(answers[id]) ? (answers[id] as string[]) : [];
    set(
      id,
      current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option],
    );
  }

  async function submit() {
    setPhase("working");
    setError(null);
    try {
      const response = await fetch("/api/checklist-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data?.error ?? "Something broke. Try again in a minute.");
        setPhase("asking");
        return;
      }
      setChecklist(data.checklist);
      setSignature(data.signature ?? null);
      setPhase("done");
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setPhase("asking");
    }
  }

  if (phase === "done" && checklist) {
    return (
      <div ref={resultRef}>
        <ChecklistResult checklist={checklist} signature={signature} />
      </div>
    );
  }

  return (
    <div className="border-2 border-ink shadow-[10px_10px_0_#a33e17] bg-paper-2 print:hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-ink bg-panel-bar">
        <span className="w-2.5 h-2.5 bg-orange-lit" aria-hidden="true" />
        <span className="font-label text-[11px] tracking-[0.12em] text-panel-text-2">
          15-HOUR-CHECKLIST
        </span>
        <span className="grow" />
        <span className="font-label text-[11px] tracking-[0.12em] text-panel-text-3">
          {phase === "working"
            ? "WORKING"
            : `QUESTION ${step + 1} OF ${QUESTIONS.length}`}
        </span>
      </div>

      {/* progress */}
      <div
        className="h-1.5 bg-rule"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={QUESTIONS.length}
        aria-label="Progress through the checklist"
      >
        <div
          className="h-full bg-orange transition-[width] duration-200"
          style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <div className="p-6 sm:p-10">
        {phase === "working" ? (
          <Working />
        ) : (
          <>
            <QuestionBody
              question={question}
              value={value}
              onText={(v) => set(question.id, v)}
              onToggle={(o) => toggle(question.id, o)}
              onEnter={() => {
                if (canAdvance && !last) setStep(step + 1);
              }}
            />

            {error ? (
              <p
                role="status"
                className="mt-6 font-label text-[13px] leading-[1.6] text-orange"
              >
                {error}
              </p>
            ) : null}

            <div className="mt-9 flex flex-wrap gap-3 items-center">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className={`font-label text-[13px] font-semibold tracking-[0.06em] text-ink bg-transparent border-2 border-ink px-5 py-3.5 cursor-pointer ${PRESS}`}
                >
                  BACK
                </button>
              ) : null}

              <button
                type="button"
                disabled={!canAdvance}
                onClick={() => (last ? submit() : setStep(step + 1))}
                className={`font-label text-sm font-semibold tracking-[0.05em] text-white bg-orange border-2 border-ink shadow-[5px_5px_0_#1a1a17] px-[22px] py-[15px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none ${PRESS}`}
              >
                {last ? "BUILD MY CHECKLIST" : "NEXT"}
              </button>

              {!question.required ? (
                <button
                  type="button"
                  onClick={() => (last ? submit() : setStep(step + 1))}
                  className="font-label text-[13px] text-ink-3 underline underline-offset-4 bg-transparent border-0 cursor-pointer px-1 py-2"
                >
                  skip this one
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------ one question */

function QuestionBody({
  question,
  value,
  onText,
  onToggle,
  onEnter,
}: {
  question: Question;
  value: string | string[] | undefined;
  onText: (v: string) => void;
  onToggle: (option: string) => void;
  onEnter: () => void;
}) {
  const labelId = `${question.id}-label`;
  const text = typeof value === "string" ? value : "";
  const chosen = Array.isArray(value) ? value : [];

  const heading = (
    <>
      <h2
        id={labelId}
        className="font-head text-[clamp(24px,4vw,32px)] leading-[1.12] font-extrabold tracking-[-0.02em] text-ink"
      >
        {question.prompt}
      </h2>
      {question.help ? (
        <p className="mt-3 text-[17px] leading-[1.55] text-ink-3 max-w-[34em]">
          {question.help}
        </p>
      ) : null}
    </>
  );

  if (question.kind === "one" || question.kind === "many") {
    const many = question.kind === "many";
    return (
      <fieldset className="border-0 p-0 m-0">
        <legend className="p-0 mb-0">{heading}</legend>
        <div className="mt-7 flex flex-col gap-2.5 max-w-[38em]">
          {question.options.map((option) => {
            const on = many ? chosen.includes(option) : text === option;
            return (
              <label
                key={option}
                className={`flex items-center gap-3.5 border-2 px-4 py-3.5 cursor-pointer min-h-[52px] ${
                  on
                    ? "border-ink bg-ink text-paper"
                    : "border-rule bg-paper-2 text-ink hover:border-ink"
                }`}
              >
                <input
                  type={many ? "checkbox" : "radio"}
                  name={question.id}
                  value={option}
                  checked={on}
                  onChange={() => (many ? onToggle(option) : onText(option))}
                  className="w-5 h-5 accent-[#a33e17] shrink-0"
                />
                <span className="text-[17px] leading-[1.35]">{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  }

  // Pin the narrowed type to a const: the early return above rules out the
  // choice variants, but TypeScript loses that inside the JSX closures.
  const field = question;

  return (
    <div>
      {heading}
      <div className="mt-7 max-w-[38em]">
        <label htmlFor={field.id} className="sr-only">
          {field.prompt}
        </label>
        {field.kind === "long" ? (
          <textarea
            id={field.id}
            rows={6}
            value={text}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            onChange={(e) => onText(e.target.value)}
            className={`${FIELD} resize-y leading-[1.5]`}
          />
        ) : (
          <input
            id={field.id}
            type="text"
            value={text}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            onChange={(e) => onText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onEnter();
              }
            }}
            className={FIELD}
          />
        )}
      </div>
    </div>
  );
}

function Working() {
  return (
    <div className="py-10 text-center">
      <p className="font-head text-[clamp(22px,3.5vw,28px)] font-extrabold tracking-[-0.02em] text-ink">
        Reading your week.
      </p>
      <p className="mt-3 text-[17px] leading-[1.55] text-ink-3 max-w-[30em] mx-auto">
        Twenty seconds or so. It&apos;s counting the hours from the numbers you
        gave and working out which parts repeat.
      </p>
      <div
        className="mt-8 h-1.5 w-full max-w-[320px] mx-auto bg-rule overflow-hidden"
        role="status"
        aria-label="Building your checklist"
      >
        <div className="h-full w-1/3 bg-orange animate-[checklist-sweep_1.4s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

/* --------------------------------------------------------- the result */

export function ChecklistResult({
  checklist,
  signature,
}: {
  checklist: Checklist;
  signature: string | null;
}) {
  const showHours = checklist.hours_high > 0;

  return (
    <div className="flex flex-col gap-7">
      <div className="border-2 border-ink shadow-[10px_10px_0_#a33e17] bg-paper-2 print:shadow-none print:border-ink">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-ink bg-panel-bar print:bg-transparent print:text-ink">
          <span className="w-2.5 h-2.5 bg-orange-lit" aria-hidden="true" />
          <span className="font-label text-[11px] tracking-[0.12em] text-panel-text-2 print:text-ink">
            YOUR 15-HOUR CHECKLIST
          </span>
        </div>

        <div className="p-6 sm:p-10">
          <h2 className="font-head text-[clamp(26px,4.4vw,38px)] leading-[1.1] font-extrabold tracking-[-0.025em] text-ink max-w-[20em]">
            {checklist.headline}
          </h2>

          <div className="mt-7 border-2 border-ink bg-paper-3 p-5 sm:p-6 max-w-[34em]">
            {showHours ? (
              <>
                <div className="font-label text-[11px] tracking-[0.12em] text-ink-3">
                  HOURS IN PLAY
                </div>
                <div className="font-head text-[clamp(34px,6vw,52px)] leading-none font-extrabold tracking-[-0.03em] text-orange mt-2">
                  {hrs(checklist.hours_low)}–{hrs(checklist.hours_high)}
                  <span className="font-body text-[16px] font-normal tracking-normal text-ink-3 ml-2.5">
                    hours a week
                  </span>
                </div>
              </>
            ) : (
              <div className="font-label text-[11px] tracking-[0.12em] text-ink-3">
                NOT ENOUGH TO COUNT WITH YET
              </div>
            )}
            <p className="mt-3.5 text-[16px] leading-[1.55] text-ink-4">
              {checklist.hours_basis}
            </p>
          </div>
        </div>
      </div>

      {/* findings */}
      <div className="flex flex-col gap-5">
        <h3 className="font-head text-[clamp(20px,3vw,26px)] font-extrabold tracking-[-0.02em] text-ink">
          What repeats
        </h3>

        {checklist.findings.map((f, i) => (
          <article
            key={`${f.task}-${i}`}
            className="border-2 border-ink bg-paper-2 break-inside-avoid"
          >
            <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b-2 border-rule bg-paper-3">
              <span className="font-head text-[20px] font-extrabold text-orange">
                {i + 1}
              </span>
              <h4 className="font-head text-[18px] leading-[1.25] font-extrabold tracking-[-0.01em] text-ink grow min-w-0">
                {f.task}
              </h4>
              {f.hours_per_week > 0 ? (
                <span className="font-label text-[11px] tracking-[0.1em] text-ink-3 whitespace-nowrap">
                  {hrs(f.hours_per_week)} HRS/WK
                </span>
              ) : null}
              <span className="font-label text-[10px] tracking-[0.1em] text-paper bg-ink px-2 py-1 whitespace-nowrap">
                {DIFFICULTY[f.difficulty] ?? f.difficulty.toUpperCase()}
              </span>
            </div>

            <dl className="p-5 sm:p-6 m-0 flex flex-col gap-4">
              <Row term="Why it keeps happening" detail={f.why_it_repeats} />
              <Row term="What to hand over" detail={f.what_to_hand_over} />
              <Row term="Start here this week" detail={f.first_step} accent />
            </dl>
          </article>
        ))}
      </div>

      {/* the one to keep */}
      <div className="border-2 border-ink bg-paper-3 p-6 sm:p-8 break-inside-avoid">
        <div className="font-label text-[11px] tracking-[0.12em] text-live">
          KEEP DOING THIS ONE YOURSELF
        </div>
        <h3 className="mt-2.5 font-head text-[clamp(19px,2.8vw,24px)] leading-[1.2] font-extrabold tracking-[-0.02em] text-ink">
          {checklist.keep_by_hand.task}
        </h3>
        <p className="mt-3 text-[17px] leading-[1.55] text-ink-4 max-w-[36em]">
          {checklist.keep_by_hand.why}
        </p>
      </div>

      <p className="text-[18px] leading-[1.6] text-ink-2 max-w-[34em]">
        {checklist.closing}
      </p>

      <Actions checklist={checklist} signature={signature} />
    </div>
  );
}

function Row({
  term,
  detail,
  accent = false,
}: {
  term: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div>
      <dt
        className={`font-label text-[11px] tracking-[0.12em] mb-1.5 ${
          accent ? "text-orange" : "text-ink-3"
        }`}
      >
        {term.toUpperCase()}
      </dt>
      <dd className="m-0 text-[16px] leading-[1.55] text-ink-4">{detail}</dd>
    </div>
  );
}

/* ------------------------------------------------------- what next */

function Actions({
  checklist,
  signature,
}: {
  checklist: Checklist;
  signature: string | null;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setMessage(null);
    try {
      const response = await fetch("/api/checklist-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, checklist, signature }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data?.error ?? "Couldn't send it. Try again in a minute.");
        setState("error");
        return;
      }
      setState("sent");
    } catch {
      setMessage("Couldn't reach the server. Try again in a minute.");
      setState("error");
    }
  }

  return (
    <div className="print:hidden flex flex-col gap-5">
      <div className="border-2 border-ink shadow-[10px_10px_0_#1a1a17] bg-panel">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-ink bg-panel-bar">
          <span className="w-2.5 h-2.5 bg-orange-lit" aria-hidden="true" />
          <span className="font-label text-[11px] tracking-[0.12em] text-panel-text-2">
            KEEP-A-COPY
          </span>
        </div>

        <div className="p-6 sm:p-8 flex flex-wrap gap-8 items-start">
          <div className="grow min-w-0 basis-[300px]">
            <h3 className="font-head text-[22px] font-extrabold tracking-[-0.02em] text-panel-text">
              Print it
            </h3>
            <p className="mt-2.5 text-[15px] leading-[1.55] text-panel-text-2 max-w-[26em]">
              Nothing to sign up for. It prints on two pages, and the buttons
              don&apos;t come with it.
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className={`mt-4 font-label text-sm font-semibold tracking-[0.05em] text-ink bg-paper-2 border-2 border-panel-text px-[22px] py-3.5 cursor-pointer ${PRESS}`}
            >
              PRINT THIS CHECKLIST
            </button>
          </div>

          {signature ? (
            <div className="grow min-w-0 basis-[300px]">
              <h3 className="font-head text-[22px] font-extrabold tracking-[-0.02em] text-panel-text">
                Or have it emailed
              </h3>
              <p className="mt-2.5 text-[15px] leading-[1.55] text-panel-text-2 max-w-[26em]">
                I&apos;ll send this to you and add you to the list — one email most
                weeks, unsubscribe in a click.
              </p>

              {state === "sent" ? (
                <p
                  role="status"
                  className="mt-4 font-label text-[13px] leading-[1.6] text-orange-lit"
                >
                  Sent. It comes from noreply@coloradoappsco.com — check spam
                  if it&apos;s slow.
                </p>
              ) : (
                <form onSubmit={send} className="mt-4 flex flex-col gap-3">
                  <label
                    htmlFor="checklist-email"
                    className="font-label text-[11px] tracking-[0.12em] text-[#b5ada1]"
                  >
                    YOUR EMAIL
                  </label>
                  <input
                    id="checklist-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full box-border font-label text-[15px] text-panel-text bg-panel-field border-2 border-panel-line px-3.5 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-lit"
                  />
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className={`font-label text-sm font-semibold tracking-[0.05em] text-white bg-orange border-2 border-panel-text px-[22px] py-3.5 cursor-pointer disabled:opacity-50 ${PRESS}`}
                  >
                    {state === "sending" ? "SENDING…" : "SEND IT TO ME"}
                  </button>
                  {message ? (
                    <p
                      role="status"
                      className="font-label text-xs leading-[1.6] text-[#f0b4a0]"
                    >
                      {message}
                    </p>
                  ) : null}
                </form>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-2 border-ink bg-paper-2 p-6 sm:p-8">
        <div className="font-label text-[11px] tracking-[0.12em] text-ink-3">
          IF YOU&apos;D RATHER NOT DO IT ALONE
        </div>
        <h3 className="mt-2.5 font-head text-[clamp(20px,3vw,26px)] leading-[1.15] font-extrabold tracking-[-0.025em] text-ink">
          Three hours. Or it&apos;s free.
        </h3>
        <p className="mt-3 text-[17px] leading-[1.55] text-ink-4 max-w-[34em]">
          That list above is yours to work through. If you&apos;d rather I sat down
          with your actual quotes and invoices and built the first one while
          you watched, that&apos;s the one afternoon.
        </p>
        <Link
          href="/audit"
          className={`mt-5 inline-block font-label text-sm font-semibold tracking-[0.05em] text-paper bg-ink border-2 border-ink shadow-[5px_5px_0_#a33e17] px-[22px] py-[15px] no-underline ${PRESS}`}
        >
          SEE WHAT THAT INVOLVES
        </Link>
      </div>
    </div>
  );
}
