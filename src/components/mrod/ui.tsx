import Link from "next/link";

/**
 * Shared parts for the MRod marketing site.
 *
 * The look: tan paper, ink rules, hard offset shadows, no radius.
 * Mono carries every label; Archivo does the shouting; Inter is for
 * anything you actually read. Orange is the brand — green and purple
 * only ever appear as small status markers.
 */

const FOCUS =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange";

const PRESS =
  "transition-transform duration-75 active:translate-x-[2px] active:translate-y-[2px]";

/* ---------------------------------------------------- square marker */

type Marker = "orange" | "live" | "idea" | "lit";

const MARKER_BG: Record<Marker, string> = {
  orange: "bg-orange",
  live: "bg-live",
  idea: "bg-idea",
  lit: "bg-orange-lit",
};

export function Square({
  tone = "orange",
  size = 9,
}: {
  tone?: Marker;
  size?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${MARKER_BG[tone]}`}
      style={{ width: size, height: size }}
    />
  );
}

/* --------------------------------------------------------- eyebrow */

export function Eyebrow({
  tone = "orange",
  boxed = true,
  children,
}: {
  tone?: Marker;
  boxed?: boolean;
  children: React.ReactNode;
}) {
  if (!boxed) {
    return (
      <p className="font-label text-xs tracking-[0.14em] text-ink-3 flex items-center gap-[9px]">
        <Square tone={tone} /> {children}
      </p>
    );
  }
  return (
    <p className="inline-flex items-center gap-[9px] font-label text-xs font-medium tracking-[0.14em] text-ink-2 border-2 border-ink bg-paper-2 px-3 py-2">
      <Square tone={tone} />
      {children}
    </p>
  );
}

/* ------------------------------------------------------ status chip */

const CHIP_BG = {
  LIVE: "bg-live",
  BETA: "bg-orange",
  IDEA: "bg-idea",
} as const;

export function Chip({ status }: { status: keyof typeof CHIP_BG }) {
  return (
    <span
      className={`font-label text-[11px] font-semibold tracking-[0.1em] text-white px-2 py-1 ${CHIP_BG[status]}`}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------ stat */

export function Stat({
  value,
  suffix,
  label,
  size = "lg",
}: {
  value: string;
  suffix?: string;
  label: string;
  size?: "lg" | "md";
}) {
  return (
    <div>
      <div
        className={`font-head font-extrabold tracking-[-0.03em] leading-none ${
          size === "lg" ? "text-[44px]" : "text-[28px]"
        }`}
      >
        {value}
        {suffix ? (
          <span className={size === "lg" ? "text-2xl" : "text-[17px]"}>
            {suffix}
          </span>
        ) : null}
      </div>
      <div className="font-label text-xs tracking-[0.12em] text-ink-3 mt-1.5">
        {label}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- panel */

/** The dark panel's title bar. Used about twice a page, on purpose. */
export function PanelBar({
  name,
  right,
  tone = "lit",
}: {
  name: string;
  right?: string;
  tone?: Marker;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 border-b-2 border-ink bg-panel-bar">
      <Square tone={tone} />
      <span className="font-label text-[11px] tracking-[0.12em] text-panel-text-2">
        {name}
      </span>
      {right ? (
        <>
          <span className="grow" />
          <span className="font-label text-[11px] tracking-[0.12em] text-panel-text-3">
            {right}
          </span>
        </>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------- buttons */

type Variant = "ink" | "paper" | "orange";

const VARIANT: Record<Variant, string> = {
  ink: "text-paper bg-ink border-ink shadow-[5px_5px_0_#a33e17]",
  paper: "text-ink bg-paper-2 border-ink shadow-[5px_5px_0_#1a1a17]",
  orange: "text-white bg-orange border-ink shadow-[5px_5px_0_#1a1a17]",
};

export function Btn({
  href,
  variant = "ink",
  block = false,
  children,
}: {
  href: string;
  variant?: Variant;
  block?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`font-label text-sm font-semibold tracking-[0.05em] border-2 px-[22px] py-[15px] no-underline ${
        block ? "block text-center" : "inline-block"
      } ${VARIANT[variant]} ${PRESS} ${FOCUS}`}
    >
      {children}
    </Link>
  );
}

/** Small button for the header. */
export function BtnSm({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`font-label text-[13px] font-semibold tracking-[0.06em] text-white bg-orange border-2 border-ink shadow-[4px_4px_0_#1a1a17] px-[18px] py-3 no-underline inline-block ${PRESS} ${FOCUS}`}
    >
      {children}
    </Link>
  );
}

const UNDERLINE: Record<Marker, string> = {
  orange: "border-orange",
  live: "border-live",
  idea: "border-idea",
  lit: "border-orange-lit",
};

export function TextLink({
  href,
  tone = "orange",
  children,
}: {
  href: string;
  tone?: Marker;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-block self-start font-label text-[13px] font-semibold tracking-[0.06em] text-ink no-underline border-b-[3px] py-2.5 ${UNDERLINE[tone]} ${FOCUS}`}
    >
      {children}
    </Link>
  );
}

/* ------------------------------------------------- placeholder box */

/**
 * Stands in for art we don't have yet. Deliberately labelled rather
 * than a grey rectangle, so nobody ships it by accident.
 */
export function Placeholder({
  label,
  note,
  dark = false,
  minHeight = 230,
}: {
  label: string;
  note?: React.ReactNode;
  dark?: boolean;
  minHeight?: number;
}) {
  return (
    <div
      style={{ minHeight }}
      className={`h-full flex flex-col items-center justify-center gap-2 p-5 text-center border-2 ${
        dark ? "border-panel-line bg-[#262320]" : "border-ink bg-paper"
      }`}
    >
      <span
        className={`font-label text-[11px] tracking-[0.12em] ${
          dark ? "text-orange-lit" : "text-orange"
        }`}
      >
        {label}
      </span>
      {note ? (
        <span
          className={`font-label text-[11px] leading-[1.7] max-w-[24em] ${
            dark ? "text-[#b5ada1]" : "text-ink-3"
          }`}
        >
          {note}
        </span>
      ) : null}
    </div>
  );
}
