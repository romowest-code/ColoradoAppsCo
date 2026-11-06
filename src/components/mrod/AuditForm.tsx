export type AuditState = "idle" | "sent" | "invalid" | "error";

const MESSAGE: Record<Exclude<AuditState, "idle">, string> = {
  sent: "Got it. I read these myself and reply within a day.",
  invalid: "I need at least a name, an email and one line about your week.",
  error: "Something broke on my end. Try again, or just email me directly.",
};

const FIELD =
  "w-full box-border font-label text-[15px] text-panel-text bg-panel-field border-2 border-panel-line px-3.5 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-lit";

const LABEL =
  "block font-label text-[11px] tracking-[0.12em] text-[#b5ada1] mb-2";

/**
 * The booking enquiry. Plain POST, no JavaScript required — the people
 * this is aimed at are often on old browsers with blockers.
 */
export function AuditForm({ state = "idle" }: { state?: AuditState }) {
  return (
    <div>
      <form action="/api/audit" method="post" className="flex flex-col gap-4">
        <input type="hidden" name="next" value="/audit?sent=1#book" />
        <p className="hidden" aria-hidden="true">
          <label htmlFor="audit-honey">Leave this empty</label>
          <input id="audit-honey" name="_honey" type="text" tabIndex={-1} />
        </p>

        <div className="flex flex-wrap gap-4">
          <div className="grow min-w-0 basis-[200px]">
            <label htmlFor="audit-name" className={LABEL}>
              YOUR NAME
            </label>
            <input
              id="audit-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className={FIELD}
            />
          </div>
          <div className="grow min-w-0 basis-[200px]">
            <label htmlFor="audit-email" className={LABEL}>
              EMAIL
            </label>
            <input
              id="audit-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={FIELD}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="grow min-w-0 basis-[200px]">
            <label htmlFor="audit-business" className={LABEL}>
              WHAT DOES YOUR BUSINESS DO?
            </label>
            <input
              id="audit-business"
              name="business"
              type="text"
              placeholder="Plumbing, bookkeeping, a dental office…"
              className={FIELD}
            />
          </div>
          <div className="grow min-w-0 basis-[200px]">
            <label htmlFor="audit-phone" className={LABEL}>
              PHONE (OPTIONAL)
            </label>
            <input
              id="audit-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className={FIELD}
            />
          </div>
        </div>

        <div>
          <label htmlFor="audit-week" className={LABEL}>
            WHAT EATS THE MOST TIME IN YOUR WEEK?
          </label>
          <textarea
            id="audit-week"
            name="week"
            required
            rows={4}
            placeholder="One or two sentences is plenty. The messier the better."
            className={`${FIELD} resize-y`}
          />
        </div>

        <button
          type="submit"
          className="self-start font-label text-sm font-semibold tracking-[0.05em] text-white bg-orange border-2 border-panel-text px-[22px] py-3.5 cursor-pointer transition-transform duration-75 active:translate-x-[2px] active:translate-y-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-lit"
        >
          BOOK THE THREE HOURS
        </button>
      </form>

      {state !== "idle" ? (
        <p
          role="status"
          className={`mt-4 font-label text-xs leading-[1.6] ${
            state === "sent" ? "text-orange-lit" : "text-[#f0b4a0]"
          }`}
        >
          {MESSAGE[state]}
        </p>
      ) : null}
    </div>
  );
}

/** Narrows the raw query value to a state the form knows. */
export function readAuditState(value: string | undefined): AuditState {
  if (value === "1") return "sent";
  if (value === "invalid" || value === "error") return value;
  return "idle";
}
