export type SubscribeState = "idle" | "1" | "invalid" | "error";

const MESSAGE: Record<Exclude<SubscribeState, "idle">, string> = {
  "1": "Sent. Check your inbox — it comes from support@coloradoappsco.com.",
  invalid: "That email address didn't look right. Try it once more?",
  error: "Something broke on my end. Try again in a minute.",
};

/**
 * Plain POST form — no JavaScript needed, which matters for the
 * audience this site is for. Posts to /api/subscribe, which emails
 * the request and redirects back here.
 */
export function SignupForm({
  id,
  source,
  next,
  state = "idle",
  label = "SEND IT TO ME",
  stacked = false,
}: {
  id: string;
  source: string;
  next: string;
  state?: SubscribeState;
  label?: string;
  stacked?: boolean;
}) {
  return (
    <div>
      <form
        action="/api/subscribe"
        method="post"
        className={
          stacked
            ? "flex flex-col gap-3"
            : "flex flex-wrap gap-3 items-end"
        }
      >
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="next" value={next} />
        <p className="hidden" aria-hidden="true">
          <label htmlFor={`${id}-honey`}>Leave this empty</label>
          <input id={`${id}-honey`} name="_honey" type="text" tabIndex={-1} />
        </p>

        <div className={stacked ? "" : "grow min-w-0 basis-[260px]"}>
          <label
            htmlFor={id}
            className="block font-label text-[11px] tracking-[0.12em] text-[#b5ada1] mb-2"
          >
            YOUR EMAIL
          </label>
          <input
            id={id}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full box-border font-label text-[15px] text-panel-text bg-panel-field border-2 border-panel-line px-3.5 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-lit"
          />
        </div>

        <button
          type="submit"
          className={`font-label text-sm font-semibold tracking-[0.05em] text-white bg-orange border-2 border-panel-text px-[22px] py-3.5 cursor-pointer transition-transform duration-75 active:translate-x-[2px] active:translate-y-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-lit ${
            stacked ? "w-full" : ""
          }`}
        >
          {label}
        </button>
      </form>

      {state !== "idle" ? (
        <p
          role="status"
          className={`mt-3.5 font-label text-xs leading-[1.6] ${
            state === "1" ? "text-orange-lit" : "text-[#f0b4a0]"
          }`}
        >
          {MESSAGE[state]}
        </p>
      ) : null}
    </div>
  );
}

/** Narrows the raw query value to a state the form knows. */
export function readSubscribeState(value: string | undefined): SubscribeState {
  if (value === "1" || value === "invalid" || value === "error") return value;
  return "idle";
}
