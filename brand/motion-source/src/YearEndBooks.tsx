import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";

/* ------------------------------------------------------------------ *
 *  "AI does my year-end books"  ·  1080x1080 @ 60fps  ·  ~92.8s
 *  Starts at 00:00:00:00 of the episode, on "If you're a small business
 *  owner like me". Drop it at the very start of the timeline.
 *  Nudge a beat by editing I.* / B.* — everything in a scene keys off it.
 * ------------------------------------------------------------------ */

export const FPS = 60;

// v3: new 23.4s opening, then the original story ("Change these transactions in bulk..." = 00:00:23:25)
const OPEN = 1405;
// v2 edit: everything after the first "Let's go" moved 234 frames later
const SHIFT = 234;

// opening beats (absolute frames)
const I = {
  hook: 6, // "If you're a"
  small: 74, // "small business"
  owner: 100, // "owner"
  likeMe: 142, // "like me"
  today: 276, // "I'm going to show you today"
  howAI: 348, // "how I use AI"
  idea: 432, // "to consolidate"
  banking: 505, // "all my banking information"
  expenses: 576, // "my expenses"
  income: 618, // "my income"
  invoices: 642, // "invoices"
  iface: 732, // "all through the AI interface"
  copy: 822, // "copying and pasting"
  paste: 858,
  pnl: 984, // "getting a PNL"
  lookAt: 1110, // "that I can look at"
  wrong: 1260, // "that looks wrong"
  right: 1326, // "this looks right"
  bulk: OPEN + 5, // "Change these transactions in bulk"
};

const B = {
  ask: OPEN, // "Change these transactions in bulk..."
  envelope: OPEN + 156, // "...and give me the P&L"
  pile: OPEN + 240,
  accountingSystem: OPEN + 314, // "put it into the accounting system"
  shortcut: OPEN + 592, // "With TurboTax and other tools"
  pileShrink: OPEN + 831, // "...quickly get through my tax by using AI"
  lockup: OPEN + 998, // "I'm going to show you... AI for the Rest of Us"
  letsGo: OPEN + 1274, // "Let's go." (00:00:44:39)
  grind: OPEN + 1080 + SHIFT, // "eliminate the need to constantly be in QuickBooks"
  stamp: OPEN + 1385 + SHIFT,
  income: OPEN + 1518 + SHIFT, // "income"
  expenses: OPEN + 1548 + SHIFT, // "expenses"
  balance: OPEN + 1698 + SHIFT, // "balance sheets"
  pnl: OPEN + 1740 + SHIFT, // "PNL"
  hours: OPEN + 1860 + SHIFT, // "work that takes hours"
  calendar: OPEN + 1900 + SHIFT, // "I wait ... until November"
  firstFlip: OPEN + 2000 + SHIFT,
  rightNow: OPEN + 2215 + SHIFT, // "which is right now"
  months: OPEN + 2418 + SHIFT, // "this data from the year past"
  data: OPEN + 2568 + SHIFT, // "have these three accounts"
  rowsStart: OPEN + 2760 + SHIFT, // "pull in all the transactions"
  copyPaste: OPEN + 3000 + SHIFT, // "copy and paste"
  amex: OPEN + 3300 + SHIFT, // "transactions from my Amex card"
  fix: OPEN + 3582 + SHIFT, // "use AI to reconcile all the stuff"
  outro: OPEN + 3868 + SHIFT, // "Let's go."
};

export const DURATION = OPEN + 3930 + SHIFT;

/* palette — coloradoappsai.com */
export const INK = "#222222";
export const CREAM = "#EAE4D9";
export const RUST = "#B4432A";
export const PAPER = "#F8F4EC";
export const GREEN = "#2E6B57";
const SKIN = "#C99470";
const FLEECE = "#3B5446";
const MUG = "#4C7BB5";

export const HEAD = "Archivo, sans-serif";
export const MONO = "Plex, monospace";

export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const outBack = Easing.bezier(0.34, 1.56, 0.64, 1);
export const inOut = Easing.inOut(Easing.cubic);
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ---------------------------- motion kit ---------------------------- */

export const pop = (f: number, at: number) =>
  spring({ frame: f - at, fps: FPS, config: { damping: 12, stiffness: 160, mass: 0.8 } });

// leaves faster than it came: 12 frames, ease-in
export const gone = (f: number, out?: number) =>
  out === undefined ? 0 : interpolate(f, [out, out + 12], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });

type Mode = "scale" | "up" | "down" | "left" | "right";

export const Pop: React.FC<{
  f: number;
  at: number;
  out?: number;
  mode?: Mode;
  dist?: number;
  origin?: string;
  idle?: number;
  children: React.ReactNode;
}> = ({ f, at, out, mode = "scale", dist = 90, origin = "center", idle = 3, children }) => {
  if (f < at || (out !== undefined && f > out + 12)) return null;
  const sp = pop(f, at);
  const ex = gone(f, out);
  const op = interpolate(f - at, [0, 7], [0, 1], CL) * (1 - ex);
  const d = (1 - sp) * dist;
  const e = ex * dist * 0.7;
  const tr = {
    scale: `scale(${(0.4 + 0.6 * sp) * (1 - 0.25 * ex)})`,
    up: `translateY(${d - e}px)`,
    down: `translateY(${-d + e}px)`,
    left: `translateX(${d - e}px)`,
    right: `translateX(${-d + e}px)`,
  }[mode];
  // golden rule: nothing ever fully stops
  const bob = Math.sin((f + at * 0.37) / 38) * idle;
  return (
    <div style={{ transform: `${tr} translateY(${bob}px)`, opacity: op, transformOrigin: origin }}>{children}</div>
  );
};

export const At: React.FC<{ x: number; y: number; z?: number; children: React.ReactNode }> = ({ x, y, z, children }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", zIndex: z }}>{children}</div>
);

export const card = (shadow = 8): React.CSSProperties => ({
  background: PAPER,
  border: `4px solid ${INK}`,
  boxShadow: `${shadow}px ${shadow}px 0 ${INK}`,
});

export const Mono: React.FC<{ size?: number; color?: string; children: React.ReactNode; track?: number }> = ({
  size = 22,
  color = INK,
  track = 0.14,
  children,
}) => (
  <span
    style={{ fontFamily: MONO, fontWeight: 600, fontSize: size, letterSpacing: `${track}em`, color, whiteSpace: "nowrap" }}
  >
    {children}
  </span>
);

export const Head: React.FC<{ size: number; color?: string; children: React.ReactNode }> = ({ size, color = INK, children }) => (
  <span
    style={{
      fontFamily: HEAD,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "-0.035em",
      lineHeight: 1,
      color,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

const LogoTile: React.FC<{ src: string; h: number; pad?: number }> = ({ src, h, pad = 18 }) => (
  <div style={{ ...card(), background: "#fff", padding: `${pad}px ${pad + 8}px`, display: "flex" }}>
    <Img src={staticFile(`logos/${src}`)} style={{ height: h, width: "auto", display: "block" }} />
  </div>
);

// position along a quadratic arc (cursor and flying rows move like a hand)
const arc = (t: number, a: [number, number], b: [number, number], lift = 160) => {
  const c: [number, number] = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - lift];
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
};

type Key = { f: number; v: number[]; e?: (t: number) => number };
const keyed = (f: number, keys: Key[]) => {
  if (f <= keys[0].f) return keys[0].v;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (f <= b.f) {
      const t = (b.e ?? inOut)((f - a.f) / (b.f - a.f));
      return a.v.map((v, j) => v + (b.v[j] - v) * t);
    }
  }
  return keys[keys.length - 1].v;
};

/* ------------------------------ Mike ------------------------------ */

type Mood = "smile" | "worried" | "grin";
const Mike: React.FC<{
  f: number;
  mood: Mood;
  lh: number[];
  rh: number[];
  look?: number;
  brows?: number;
  tilt?: number;
  mug?: boolean;
  thumb?: boolean;
}> = ({ f, mood, lh, rh, look = 0, brows = 0, tilt = 0, mug, thumb }) => {
  const breath = Math.sin(f / 45) * 2.5;
  const blink = f % 211 < 7 || f % 523 < 6;
  const sh = [
    [92, 268],
    [208, 268],
  ];
  const arm = (s: number[], h: number[], k: string) => (
    <g key={k}>
      <line x1={s[0]} y1={s[1]} x2={h[0]} y2={h[1]} stroke={INK} strokeWidth={42} strokeLinecap="round" />
      <line x1={s[0]} y1={s[1]} x2={h[0]} y2={h[1]} stroke={FLEECE} strokeWidth={32} strokeLinecap="round" />
    </g>
  );
  const hand = (h: number[], k: string) => (
    <circle key={k} cx={h[0]} cy={h[1]} r={19} fill={SKIN} stroke={INK} strokeWidth={5} />
  );
  const ex = look * 4;
  const mouth =
    mood === "worried" ? (
      <path d="M132 192 Q150 182 168 192" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    ) : mood === "grin" ? (
      <path d="M124 180 Q150 212 176 180 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    ) : (
      <path d="M128 182 Q150 200 172 182" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    );
  const browY = 118 - brows * 9;
  const worriedTilt = mood === "worried" ? 5 : 0;
  return (
    <svg viewBox="0 0 300 420" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${breath})`}>
        {/* torso */}
        <rect x={128} y={210} width={44} height={50} fill={SKIN} stroke={INK} strokeWidth={5} />
        <path
          d="M36 440 L50 306 Q58 256 112 250 L188 250 Q242 256 250 306 L264 440 Z"
          fill={FLEECE}
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <path d="M118 251 L150 296 L182 251" fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <line x1={150} y1={296} x2={150} y2={440} stroke={INK} strokeWidth={4} strokeDasharray="7 6" />
        {arm(sh[0], lh, "la")}
        {arm(sh[1], rh, "ra")}
        {/* head */}
        <g transform={`rotate(${tilt} 150 215) translate(0 ${breath * 0.4})`}>
          <ellipse cx={83} cy={148} rx={12} ry={18} fill={SKIN} stroke={INK} strokeWidth={5} />
          <ellipse cx={217} cy={148} rx={12} ry={18} fill={SKIN} stroke={INK} strokeWidth={5} />
          <ellipse cx={150} cy={140} rx={68} ry={78} fill={SKIN} stroke={INK} strokeWidth={5} />
          <ellipse cx={122} cy={90} rx={18} ry={9} fill="#fff" opacity={0.28} transform="rotate(-20 122 90)" />
          {/* eyes */}
          {blink ? (
            <>
              <line x1={116 + ex} y1={144} x2={130 + ex} y2={144} stroke={INK} strokeWidth={4} strokeLinecap="round" />
              <line x1={170 + ex} y1={144} x2={184 + ex} y2={144} stroke={INK} strokeWidth={4} strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx={123 + ex} cy={144} r={5.5} fill={INK} />
              <circle cx={177 + ex} cy={144} r={5.5} fill={INK} />
            </>
          )}
          {/* glasses */}
          <rect x={100} y={128} width={46} height={32} rx={8} fill="#fff" fillOpacity={0.3} stroke={INK} strokeWidth={5} />
          <rect x={154} y={128} width={46} height={32} rx={8} fill="#fff" fillOpacity={0.3} stroke={INK} strokeWidth={5} />
          <line x1={146} y1={140} x2={154} y2={140} stroke={INK} strokeWidth={5} />
          <line x1={100} y1={138} x2={84} y2={134} stroke={INK} strokeWidth={4} />
          <line x1={200} y1={138} x2={216} y2={134} stroke={INK} strokeWidth={4} />
          {/* brows */}
          <line x1={106} y1={browY + worriedTilt} x2={138} y2={browY - worriedTilt} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <line x1={162} y1={browY - worriedTilt} x2={194} y2={browY + worriedTilt} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <path d="M150 152 Q142 168 153 171" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          {mouth}
        </g>
        {hand(lh, "lh")}
        {hand(rh, "rh")}
        {thumb && (
          <rect x={rh[0] - 8} y={rh[1] - 46} width={16} height={34} rx={8} fill={SKIN} stroke={INK} strokeWidth={5} />
        )}
        {mug && (
          <g transform={`translate(${rh[0] - 22} ${rh[1] - 52})`}>
            <path d="M44 12 q22 0 22 18 t-22 18" fill="none" stroke={INK} strokeWidth={6} />
            <rect x={0} y={0} width={46} height={52} rx={6} fill={MUG} stroke={INK} strokeWidth={5} />
            <path
              d={`M14 -8 q6 -10 0 -18 M28 -6 q6 -10 0 -18`}
              fill="none"
              stroke={INK}
              strokeWidth={3}
              opacity={0.35 + 0.25 * Math.sin(f / 12)}
            />
          </g>
        )}
      </g>
    </svg>
  );
};

const DOWN = [72, 470];
const DOWN_R = [228, 470];

const MikeLayer: React.FC<{ f: number }> = ({ f }) => {
  const [x, y, s] = keyed(f, [
    { f: 0, v: [860, 560, 0.8] },
    { f: I.likeMe - 14, v: [860, 560, 0.8] },
    { f: I.likeMe + 16, v: [860, 30, 0.8], e: outBack },
    { f: I.idea - 8, v: [860, 30, 0.8] },
    { f: I.idea + 38, v: [150, 60, 0.6] },
    { f: B.ask + 110, v: [150, 60, 0.6] },
    { f: B.ask + 150, v: [300, -120, 1.15], e: outBack },
    { f: B.lockup - 15, v: [300, -120, 1.15] },
    { f: B.lockup, v: [300, 560, 1.15], e: Easing.in(Easing.cubic) },
    { f: B.grind + 20, v: [540, 560, 0.95] },
    { f: B.grind + 54, v: [540, 0, 0.95], e: outBack },
    { f: B.income - 72, v: [540, 0, 0.95] },
    { f: B.income - 28, v: [870, 30, 0.78] },
    { f: B.calendar - 10, v: [870, 30, 0.78] },
    { f: B.calendar + 30, v: [860, 10, 0.85] },
    { f: B.data - 12, v: [860, 10, 0.85] },
    { f: B.data + 42, v: [140, 60, 0.6] },
    { f: B.fix - 12, v: [140, 60, 0.6] },
    { f: B.fix + 28, v: [150, 40, 0.65] },
    { f: B.outro - 6, v: [150, 40, 0.65] },
    { f: B.outro + 10, v: [150, 560, 0.65], e: Easing.in(Easing.cubic) },
  ]);
  if (f > B.outro + 12) return null;

  let mood: Mood = "smile";
  let look = 0;
  let brows = 0;
  let tilt = 0;
  let lh = DOWN;
  let rh = DOWN_R;
  let mug = false;
  let thumb = false;
  const mix = (a: number[], b: number[], f0: number, f1: number) => {
    const t = interpolate(f, [f0, f1], [0, 1], { ...CL, easing: inOut });
    return a.map((v, i) => v + (b[i] - v) * t);
  };

  if (f < I.today) {
    // hook: waves on "like me"
    mood = "grin";
    look = -0.6;
    const w = Math.sin(f / 5) * 14;
    rh = mix(DOWN_R, [258 + w, 168], I.likeMe, I.likeMe + 14);
  } else if (f < I.idea) {
    mood = "smile";
    tilt = Math.sin(f / 8) * 3;
  } else if (f < B.ask + 120) {
    look = 1;
    mood = f >= I.wrong && f < I.right ? "worried" : f >= I.bulk + 45 ? "grin" : "smile";
    brows = f >= I.wrong && f < I.right ? 1 : 0;
  } else if (f < B.shortcut) {
    // the ask: coffee in hand, then the pile starts growing
    mug = true;
    rh = [222, 340];
    mood = f > B.envelope + 40 ? "worried" : "smile";
    brows = f > B.envelope + 40 ? 1 : 0;
    look = interpolate(f, [B.pile + 10, B.pile + 40], [0, 1], CL);
  } else if (f < B.lockup) {
    mug = true;
    rh = [222, 340];
    mood = f > B.shortcut + 30 ? "grin" : "worried";
    look = 0.6;
  } else if (f < B.income - 60) {
    // the grind: clicking forever
    mood = "worried";
    brows = 0.6;
    const click = Math.max(0, Math.sin(((f - B.grind) / 36) * Math.PI * 2)) * 14;
    rh = [214, 336 + click];
    lh = [86, 352];
    look = Math.sin((f - B.grind) / 50) * 0.8;
  } else if (f < B.calendar) {
    mood = "worried";
    look = -1;
    brows = f > B.hours ? 1.2 : 0.4;
  } else if (f < B.data) {
    // November shrug
    look = -0.6;
    const SH_L = [30, 252];
    const SH_R = [270, 252];
    const sway = Math.sin(f / 30) * 4;
    lh = mix(DOWN, [SH_L[0], SH_L[1] + sway], B.rightNow + 15, B.rightNow + 40);
    rh = mix(DOWN_R, [SH_R[0], SH_R[1] - sway], B.rightNow + 17, B.rightNow + 42);
    brows = interpolate(f, [B.rightNow + 15, B.rightNow + 40], [0, 1.4], CL);
    tilt = interpolate(f, [B.rightNow + 15, B.rightNow + 40], [0, 7], CL) + sway * 0.3;
    mood = f > B.rightNow + 15 ? "grin" : "worried";
  } else if (f < B.fix) {
    mug = true;
    rh = [222, 340];
    look = 1;
    mood = f > B.amex ? "grin" : "smile";
  } else {
    look = 1;
    const up = B.fix + 208;
    rh = mix([222, 340], [262, 214], up, up + 20);
    thumb = f > up + 10;
    mug = f < up;
    mood = f > up ? "grin" : "smile";
  }

  return (
    <div
      style={{
        position: "absolute",
        left: x - 150 * s,
        top: 1100 - 420 * s + y,
        width: 300 * s,
        height: 420 * s,
        zIndex: 5,
      }}
    >
      <Mike f={f} mood={mood} lh={lh} rh={rh} look={look} brows={brows} tilt={tilt} mug={mug} thumb={thumb} />
    </div>
  );
};

/* --------------------------- global chrome --------------------------- */

const KICKERS: [number, string | null][] = [
  [0, null],
  [I.idea, "00 / THE IDEA"],
  [B.ask + 140, "01 / THE ASK"],
  [B.shortcut, "02 / THE SHORTCUT"],
  [B.lockup - 10, null],
  [B.grind + 10, "03 / THE GRIND"],
  [B.income - 50, "04 / THE WAIT"],
  [B.data, "05 / THE DATA"],
  [B.fix, "06 / THE FIX"],
  [B.outro, null],
];

const Kicker: React.FC<{ f: number }> = ({ f }) => {
  let idx = 0;
  KICKERS.forEach(([at], i) => {
    if (f >= at) idx = i;
  });
  const [at, label] = KICKERS[idx];
  if (!label) return null;
  const s = pop(f, at);
  return (
    <div
      style={{
        position: "absolute",
        left: 56,
        top: 52,
        zIndex: 20,
        transform: `scaleY(${s})`,
        transformOrigin: "top",
        border: `3px solid ${INK}`,
        background: PAPER,
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div style={{ width: 16, height: 16, background: RUST }} />
      <Mono size={21}>{label}</Mono>
    </div>
  );
};

const DISCLAIM: [number, number][] = [
  [B.shortcut, B.lockup - 12],
  [B.grind, B.income - 60],
  [B.data, B.outro],
];
const Disclaimer: React.FC<{ f: number }> = ({ f }) => {
  const on = DISCLAIM.find(([a, b]) => f >= a && f <= b + 12);
  if (!on) return null;
  const op = interpolate(f, [on[0], on[0] + 12, on[1], on[1] + 12], [0, 0.7, 0.7, 0], CL);
  return (
    <div style={{ position: "absolute", right: 40, bottom: 26, opacity: op, zIndex: 30 }}>
      <Mono size={15}>NOT SPONSORED · LOGOS BELONG TO THEIR OWNERS</Mono>
    </div>
  );
};

export const Backdrop: React.FC<{ f: number }> = ({ f }) => {
  const drift = (f * 0.15) % 40;
  return (
    <AbsoluteFill style={{ background: CREAM }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${INK}22 1.6px, transparent 1.8px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: `${drift}px ${drift}px`,
        }}
      />
    </AbsoluteFill>
  );
};

const Wipe: React.FC<{ f: number; at: number; label: string; exitAt?: number }> = ({ f, at, label, exitAt }) => {
  if (f < at) return null;
  const inX = interpolate(f, [at, at + 18], [-1180, 0], { ...CL, easing: inOut });
  const outX = exitAt === undefined ? 0 : interpolate(f, [exitAt, exitAt + 24], [0, 1180], { ...CL, easing: Easing.in(Easing.cubic) });
  if (exitAt !== undefined && f > exitAt + 26) return null;
  const textLag = interpolate(f, [at + 6, at + 26], [-260, 0], { ...CL, easing: outBack });
  return (
    <AbsoluteFill style={{ background: RUST, transform: `translateX(${inX + outX}px)`, zIndex: 40 }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateX(${textLag}px)` }}>
        <Head size={150} color="#fff">
          {label}
        </Head>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* --------------------------- scene 1 + 2 --------------------------- */

const SHEET_LABELS = ["STMT · JAN", "RECEIPT", "STMT · FEB", "INVOICE", "RECEIPT", "STMT · MAR", "1099", "RECEIPT"];

const Desk: React.FC<{ f: number }> = ({ f }) => {
  const y = keyed(f, [
    { f: B.ask + 120, v: [240] },
    { f: B.ask + 146, v: [0], e: outBack },
    { f: B.lockup - 18, v: [0] },
    { f: B.lockup - 4, v: [240], e: Easing.in(Easing.cubic) },
  ])[0];
  if (f > B.lockup) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 900 + y,
        height: 200,
        background: "#D6C7AC",
        borderTop: `5px solid ${INK}`,
        zIndex: 8,
      }}
    >
      <div style={{ height: 22, background: "#E2D5BE", borderBottom: `4px solid ${INK}` }} />
    </div>
  );
};

const Pile: React.FC<{ f: number }> = ({ f }) => {
  const N = 26;
  return (
    <>
      {Array.from({ length: N }).map((_, i) => {
        const at = B.pile + i * 8;
        if (f < at) return null;
        const leave = i >= 4 ? B.pileShrink + (N - 1 - i) * 4 : B.lockup - 18;
        if (f > leave + 12) return null;
        const drop = (1 - pop(f, at)) * -140;
        const ex = gone(f, leave);
        const dx = (rnd(i) - 0.5) * 22 + ex * 160;
        const rot = (rnd(i + 9) - 0.5) * 4 + ex * 20;
        const label = i % 3 === 0 ? SHEET_LABELS[(i / 3) % SHEET_LABELS.length] : null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 800 - 140 + dx,
              top: 900 - (i + 1) * 23 + drop - ex * 120,
              width: 280,
              height: 23,
              background: i % 4 === 1 ? "#F3ECDD" : "#fff",
              border: `3px solid ${INK}`,
              transform: `rotate(${rot}deg)`,
              opacity: interpolate(f - at, [0, 5], [0, 1], CL) * (1 - ex),
              zIndex: 7,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
            }}
          >
            {label && <Mono size={11}>{label}</Mono>}
          </div>
        );
      })}
    </>
  );
};

const Envelope: React.FC<{ f: number }> = ({ f }) => {
  const a = B.envelope;
  const b = B.envelope + 32;
  if (f < a || f > b) return null;
  const t = interpolate(f, [a, b], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  const [x, y] = arc(t, [1180, -120], [290, 250], 120);
  return (
    <div style={{ position: "absolute", left: x - 90, top: y - 55, transform: `rotate(${(1 - t) * 40}deg)`, zIndex: 12 }}>
      <svg width={180} height={110} viewBox="0 0 180 110">
        <rect x={3} y={3} width={174} height={104} fill="#fff" stroke={INK} strokeWidth={5} />
        <path d="M3 3 L90 62 L177 3" fill="none" stroke={INK} strokeWidth={5} />
      </svg>
    </div>
  );
};

const SceneAsk: React.FC<{ f: number }> = ({ f }) => (
  <>
    <Desk f={f} />
    <Pile f={f} />
    <Envelope f={f} />
    <At x={335} y={250}>
      <Pop f={f} at={B.envelope + 32} out={B.shortcut + 4}>
        <div style={{ ...card(10), padding: "22px 34px 26px" }}>
          <Mono size={17} color={RUST}>
            ✉ INBOX · YEAR-END
          </Mono>
          <div style={{ marginTop: 12 }}>
            <Head size={66}>Need your P&amp;L.</Head>
          </div>
        </div>
      </Pop>
    </At>
    <At x={300} y={395}>
      <Pop f={f} at={B.accountingSystem} out={B.shortcut} mode="right" dist={60}>
        <div style={{ background: INK, padding: "12px 20px" }}>
          <Mono size={19} color={PAPER}>
            → INTO THE ACCOUNTING SYSTEM
          </Mono>
        </div>
      </Pop>
    </At>
  </>
);

const Sparkle: React.FC<{ size: number; color?: string; f: number }> = ({ size, color = RUST, f }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ transform: `rotate(${Math.sin(f / 20) * 10}deg)` }}>
    <path d="M20 2 Q22 18 38 20 Q22 22 20 38 Q18 22 2 20 Q18 18 20 2 Z" fill={color} stroke={INK} strokeWidth={3} />
  </svg>
);

const SceneShortcut: React.FC<{ f: number }> = ({ f }) => {
  const at = B.shortcut + 14;
  const msg = "Help me get through my taxes.";
  const n = Math.floor(interpolate(f, [at + 30, at + 100], [0, msg.length], CL));
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 140,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
          zIndex: 9,
        }}
      >
        <Pop f={f} at={at} out={B.lockup - 22} origin="left center">
          <LogoTile src="turbotax.svg" h={78} />
        </Pop>
        <div style={{ height: 64, marginLeft: 24 }}>
          <Pop f={f} at={at + 8} out={B.lockup - 20}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: RUST, border: `4px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Head size={48} color="#fff">
                +
              </Head>
            </div>
          </Pop>
        </div>
        <Pop f={f} at={at + 14} out={B.lockup - 18} mode="up" origin="left center">
          <div style={{ ...card(), padding: "20px 26px", width: 520, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <Sparkle size={34} f={f} />
              <Mono size={17}>AI ASSISTANT</Mono>
            </div>
            <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: 32, color: INK, minHeight: 40 }}>
              {msg.slice(0, n)}
              <span style={{ opacity: f % 40 < 20 ? 1 : 0, color: RUST }}>▍</span>
            </div>
          </div>
        </Pop>
      </div>
    </>
  );
};

const SceneLockup: React.FC<{ f: number }> = ({ f }) => {
  const at = B.lockup;
  if (f < at || f > B.letsGo + 30) return null;
  const blockX = pop(f, at + 12);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <Pop f={f} at={at} mode="right" dist={40}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 26 }}>
            <div style={{ width: 26, height: 26, background: RUST, border: `3px solid ${INK}` }} />
            <Mono size={26} track={0.2}>
              MROD
            </Mono>
          </div>
        </Pop>
        <Pop f={f} at={at + 5} mode="up" dist={60}>
          <Head size={124}>AI for the</Head>
        </Pop>
        <div style={{ position: "relative", marginTop: 14 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: RUST,
              transform: `scaleX(${blockX})`,
              transformOrigin: "left",
            }}
          />
          <div style={{ position: "relative", padding: "12px 30px 22px" }}>
            <Pop f={f} at={at + 20} mode="up" dist={50}>
              <Head size={168} color="#fff">
                Rest of Us
              </Head>
            </Pop>
          </div>
        </div>
        <Pop f={f} at={at + 32} mode="up" dist={30}>
          <div style={{ marginTop: 26 }}>
            <Mono size={24}>ONE REAL TASK. PLAIN ENGLISH. NO HYPE.</Mono>
          </div>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------ opening ------------------------------ */

const Icon: React.FC<{ kind: "bank" | "receipt" | "income" | "invoice" }> = ({ kind }) => (
  <svg width={44} height={44} viewBox="0 0 44 44">
    {kind === "bank" && (
      <g fill="#fff" stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
        <path d="M4 16 L22 5 L40 16 Z" fill={RUST} />
        {[9, 19, 29].map((x) => (
          <rect key={x} x={x} y={18} width={6} height={16} />
        ))}
        <rect x={4} y={35} width={36} height={5} fill={INK} />
      </g>
    )}
    {kind === "receipt" && (
      <g fill="#fff" stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
        <path d="M9 4 H35 V40 L31 36 L27 40 L22 36 L17 40 L13 36 L9 40 Z" />
        <path d="M15 14 H29 M15 21 H29 M15 28 H24" fill="none" />
      </g>
    )}
    {kind === "income" && (
      <g stroke={INK} strokeWidth={3.5}>
        <circle cx={22} cy={22} r={17} fill={GREEN} />
        <text x={22} y={30} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={24} fill="#fff" stroke="none">
          $
        </text>
      </g>
    )}
    {kind === "invoice" && (
      <g fill="#fff" stroke={INK} strokeWidth={3.5} strokeLinejoin="round">
        <path d="M8 4 H28 L36 12 V40 H8 Z" />
        <path d="M28 4 V12 H36" fill="none" />
        <path d="M14 20 H30 M14 27 H30 M14 34 H22" fill="none" />
      </g>
    )}
  </svg>
);

type Src = { label: string; sub: string; kind: "bank" | "receipt" | "income" | "invoice"; at: number; pos: [number, number] };
const SOURCES: Src[] = [
  { label: "Banking", sub: "STATEMENTS", kind: "bank", at: I.banking, pos: [235, 215] },
  { label: "Expenses", sub: "RECEIPTS", kind: "receipt", at: I.expenses, pos: [845, 215] },
  { label: "Income", sub: "DEPOSITS", kind: "income", at: I.income, pos: [855, 835] },
  { label: "Invoices", sub: "BILLED", kind: "invoice", at: I.invoices, pos: [525, 870] },
];
const CHAT: [number, number] = [540, 520];
const intoChat = (i: number) => I.iface + i * 6;

const SHEETS = Array.from({ length: 14 }, (_, i) => ({ at: I.copy + 18 + i * 8, y: 260 + rnd(i + 40) * 520 }));

const ChatWindow: React.FC<{ f: number }> = ({ f }) => {
  const landedSrc = SOURCES.filter((_, i) => f >= intoChat(i) + 24);
  const sheets = SHEETS.filter((s) => f >= s.at + 26).length;
  const lastLand = Math.max(
    ...SOURCES.map((_, i) => intoChat(i) + 24).filter((t) => t <= f),
    ...SHEETS.map((s) => s.at + 26).filter((t) => t <= f),
    -999,
  );
  const pulse = 1 + 0.05 * Math.sin(Math.min(1, (f - lastLand) / 10) * Math.PI);
  return (
    <div style={{ ...card(10), width: 440, height: 330, transform: `scale(${pulse})`, position: "relative", overflow: "hidden" }}>
      <div style={{ height: 58, background: INK, display: "flex", alignItems: "center", gap: 12, padding: "0 18px" }}>
        <Sparkle size={30} f={f} />
        <Mono size={18} color={PAPER}>
          AI CHAT
        </Mono>
      </div>
      <div style={{ padding: 18, display: "flex", flexWrap: "wrap", gap: 10 }}>
        {landedSrc.map((s) => (
          <div key={s.label} style={{ border: `3px solid ${INK}`, background: "#fff", padding: "6px 10px", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ transform: "scale(0.6)", margin: -8 }}>
              <Icon kind={s.kind} />
            </div>
            <Mono size={15}>{s.label.toUpperCase()}</Mono>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, height: 54, border: `3px dashed ${INK}`, display: "flex", alignItems: "center", padding: "0 14px", justifyContent: "space-between" }}>
        <Mono size={15}>{sheets > 0 ? `STATEMENTS PASTED: ${sheets}` : "PASTE ANYTHING"}</Mono>
        <span style={{ opacity: f % 40 < 20 ? 1 : 0, color: RUST, fontFamily: HEAD, fontWeight: 800, fontSize: 26 }}>▍</span>
      </div>
    </div>
  );
};

const Keycap: React.FC<{ f: number; at: number; k: string; label: string }> = ({ f, at, k, label }) => {
  const press = f >= at + 14 ? Math.sin(Math.min(1, (f - at - 14) / 10) * Math.PI) : 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: 118, height: 118 }}>
        <div style={{ position: "absolute", inset: 0, background: INK, transform: "translate(8px, 8px)" }} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: PAPER,
            border: `4px solid ${INK}`,
            transform: `translate(${press * 7}px, ${press * 7}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Head size={50}>{k}</Head>
        </div>
      </div>
      <Mono size={18}>{label}</Mono>
    </div>
  );
};

const PNL_ROWS: { label: string; w: number; bad: boolean }[] = [
  { label: "SALES", w: 0.82, bad: false },
  { label: "MATERIALS", w: 0.56, bad: false },
  { label: "INSURANCE", w: 0.3, bad: false },
  { label: "FUEL", w: 0.46, bad: true },
  { label: "SOFTWARE", w: 0.24, bad: true },
  { label: "MEALS", w: 0.36, bad: true },
];
const ROW_TOP = 150;
const ROW_H = 66;

const DraftPnl: React.FC<{ f: number }> = ({ f }) => {
  let badK = 0;
  let okK = 0;
  const marq = interpolate(f, [I.bulk + 4, I.bulk + 26], [0, 1], { ...CL, easing: inOut });
  return (
    <div style={{ ...card(12), width: 580, height: 600, position: "relative" }}>
      <div style={{ position: "absolute", left: 30, top: 26 }}>
        <Mono size={16} color={RUST}>
          P&amp;L · DRAFT FROM AI
        </Mono>
        <div style={{ marginTop: 10 }}>
          <Head size={52}>Profit &amp; Loss</Head>
        </div>
      </div>
      {PNL_ROWS.map((r, i) => {
        const at = I.pnl + 16 + i * 8;
        if (f < at) return null;
        const g = interpolate(f, [at, at + 24], [0, 1], { ...CL, easing: outBack });
        const k = r.bad ? badK++ : okK++;
        const xAt = r.bad ? I.wrong + k * 8 : -1;
        const okAt = r.bad ? I.bulk + 46 + k * 5 : I.right + k * 6;
        const mark = f >= okAt ? "ok" : xAt >= 0 && f >= xAt ? "bad" : null;
        const markAt = mark === "ok" ? okAt : xAt;
        const ms = mark ? pop(f, markAt) : 0;
        return (
          <div
            key={r.label}
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              top: ROW_TOP + i * ROW_H,
              height: ROW_H - 10,
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "0 10px",
              background: mark === "bad" ? "#F2D6CE" : "transparent",
              opacity: interpolate(f - at, [0, 6], [0, 1], CL),
            }}
          >
            <div style={{ width: 150 }}>
              <Mono size={17}>{r.label}</Mono>
            </div>
            <div style={{ flex: 1, height: 22 }}>
              <div style={{ width: `${r.w * 100 * g}%`, height: "100%", background: r.bad ? RUST : INK, opacity: 0.85 }} />
            </div>
            <div
              style={{
                width: 42,
                height: 42,
                border: `4px solid ${INK}`,
                background: mark === "ok" ? GREEN : mark === "bad" ? RUST : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {mark && (
                <span style={{ transform: `scale(${ms})`, color: "#fff", fontFamily: HEAD, fontWeight: 800, fontSize: 28, lineHeight: 1 }}>
                  {mark === "ok" ? "✓" : "✗"}
                </span>
              )}
            </div>
          </div>
        );
      })}
      {/* bulk-select marquee around the wrong rows */}
      {f >= I.bulk + 4 && f < I.bulk + 120 && (
        <div
          style={{
            position: "absolute",
            left: 14,
            top: ROW_TOP + 3 * ROW_H - 8,
            width: 552 * marq,
            height: (ROW_H * 3 + 2) * marq,
            border: `4px dashed ${RUST}`,
            background: `${RUST}14`,
          }}
        />
      )}
    </div>
  );
};

const Magnifier: React.FC<{ f: number }> = ({ f }) => {
  const a = I.lookAt;
  const b = I.wrong - 10;
  if (f < a || f > b + 14) return null;
  const t = interpolate(f, [a, b], [0, 1], { ...CL, easing: inOut });
  const y = 190 + ROW_TOP + 28 + t * ROW_H * 5;
  const x = 600 + Math.sin(t * Math.PI * 3) * 120;
  const op = interpolate(f, [a, a + 8, b, b + 12], [0, 1, 1, 0], CL);
  return (
    <div style={{ position: "absolute", left: x - 55, top: y - 55, opacity: op, zIndex: 16 }}>
      <svg width={150} height={150} viewBox="0 0 150 150">
        <line x1={92} y1={92} x2={140} y2={140} stroke={INK} strokeWidth={16} strokeLinecap="round" />
        <circle cx={55} cy={55} r={46} fill="#fff" fillOpacity={0.35} stroke={INK} strokeWidth={8} />
      </svg>
    </div>
  );
};

const SceneIntro: React.FC<{ f: number }> = ({ f }) => {
  const hookOut = I.today - 14;
  const blk = pop(f, I.owner) * (1 - gone(f, hookOut + 2));
  const docOut = B.ask + 128;
  return (
    <>
      {/* hook */}
      {f <= hookOut + 14 && (
        <div style={{ position: "absolute", left: 100, top: 210, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Pop f={f} at={I.hook} out={hookOut} mode="right" dist={40}>
            <Mono size={36} track={0.18}>
              IF YOU’RE A
            </Mono>
          </Pop>
          <div style={{ marginTop: 22 }}>
            <Pop f={f} at={I.small} out={hookOut + 2} mode="up" dist={70}>
              <Head size={126}>Small business</Head>
            </Pop>
          </div>
          <div style={{ position: "relative", marginTop: 16 }}>
            <div style={{ position: "absolute", inset: 0, background: RUST, transform: `scaleX(${blk})`, transformOrigin: "left" }} />
            <div style={{ position: "relative", padding: "10px 30px 22px" }}>
              <Pop f={f} at={I.owner + 8} out={hookOut + 2} mode="up" dist={50}>
                <Head size={172} color="#fff">
                  owner
                </Head>
              </Pop>
            </div>
          </div>
        </div>
      )}
      <At x={590} y={850}>
        <Pop f={f} at={I.likeMe} out={hookOut + 4} mode="left" dist={60}>
          <div style={{ background: INK, padding: "12px 20px" }}>
            <Mono size={24} color={PAPER}>
              LIKE ME →
            </Mono>
          </div>
        </Pop>
      </At>

      {/* "how I use AI" */}
      <At x={480} y={380}>
        <Pop f={f} at={I.today} out={I.idea - 10} mode="down" dist={40}>
          <div style={{ border: `3px solid ${INK}`, background: PAPER, padding: "10px 18px" }}>
            <Mono size={22}>TODAY</Mono>
          </div>
        </Pop>
      </At>
      <At x={480} y={520}>
        <Pop f={f} at={I.howAI - 24} out={I.idea - 8} mode="up" dist={60}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <Head size={124}>How I use</Head>
            <div style={{ transform: `scale(${pop(f, I.howAI)})`, background: RUST, padding: "6px 22px 16px", border: `5px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}` }}>
              <Head size={124} color="#fff">
                AI
              </Head>
            </div>
          </div>
        </Pop>
      </At>

      {/* consolidate: four sources pulled into one AI chat */}
      <At x={CHAT[0]} y={CHAT[1]}>
        <Pop f={f} at={I.idea + 6} out={I.pnl - 18}>
          <ChatWindow f={f} />
        </Pop>
      </At>
      {SOURCES.map((s, i) => {
        const fly = intoChat(i);
        if (f >= fly + 24) return null;
        let x = s.pos[0];
        let y = s.pos[1];
        let sc = 1;
        let op = 1;
        if (f >= fly) {
          const t = inOut((f - fly) / 24);
          [x, y] = arc(t, s.pos, CHAT, 80);
          sc = 1 - t * 0.7;
          op = 1 - t * 0.6;
        }
        return (
          <At key={s.label} x={x} y={y} z={14}>
            <div style={{ transform: `scale(${sc})`, opacity: op }}>
              <Pop f={f} at={s.at}>
                <div style={{ ...card(), width: 270, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                  <Icon kind={s.kind} />
                  <div>
                    <Head size={36}>{s.label}</Head>
                    <div style={{ marginTop: 4 }}>
                      <Mono size={13}>{s.sub}</Mono>
                    </div>
                  </div>
                </div>
              </Pop>
            </div>
          </At>
        );
      })}
      <At x={CHAT[0]} y={760}>
        <Pop f={f} at={I.iface + 34} out={I.copy - 14} mode="up" dist={40}>
          <div style={{ background: INK, padding: "12px 20px" }}>
            <Mono size={20} color={PAPER}>
              ALL IN ONE PLACE
            </Mono>
          </div>
        </Pop>
      </At>

      {/* copy + paste statements */}
      <At x={175} y={330}>
        <Pop f={f} at={I.copy} out={I.pnl - 22}>
          <Keycap f={f} at={I.copy} k="⌘C" label="COPY" />
        </Pop>
      </At>
      <At x={175} y={540}>
        <Pop f={f} at={I.paste} out={I.pnl - 20}>
          <Keycap f={f} at={I.paste} k="⌘V" label="PASTE" />
        </Pop>
      </At>
      {SHEETS.map((s, i) => {
        if (f < s.at || f >= s.at + 26) return null;
        const t = inOut((f - s.at) / 26);
        const [x, y] = arc(t, [-60, s.y], [CHAT[0], CHAT[1] + 40], 90);
        return (
          <div key={i} style={{ position: "absolute", left: x - 34, top: y - 44, zIndex: 15, transform: `rotate(${(1 - t) * (rnd(i) * 40 - 20)}deg) scale(${1 - t * 0.4})` }}>
            <svg width={68} height={88} viewBox="0 0 68 88">
              <rect x={2} y={2} width={64} height={84} fill="#fff" stroke={INK} strokeWidth={4} />
              <path d="M12 18 H56 M12 32 H56 M12 46 H44 M12 60 H52" stroke={INK} strokeWidth={4} opacity={0.5} />
            </svg>
          </div>
        );
      })}

      {/* a draft P&L you can actually check */}
      <At x={560} y={490}>
        <Pop f={f} at={I.pnl} out={docOut} idle={2}>
          <DraftPnl f={f} />
        </Pop>
      </At>
      <Magnifier f={f} />
      <At x={600} y={880}>
        <Pop f={f} at={I.wrong} out={I.right - 6} mode="up" dist={40}>
          <div style={{ background: RUST, border: `4px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}`, padding: "12px 22px" }}>
            <Mono size={24} color="#fff">
              ✗ LOOKS WRONG
            </Mono>
          </div>
        </Pop>
      </At>
      <At x={600} y={880}>
        <Pop f={f} at={I.right} out={I.bulk + 14} mode="up" dist={40}>
          <div style={{ background: GREEN, border: `4px solid ${INK}`, boxShadow: `6px 6px 0 ${INK}`, padding: "12px 22px" }}>
            <Mono size={24} color="#fff">
              ✓ LOOKS RIGHT
            </Mono>
          </div>
        </Pop>
      </At>
      <At x={600} y={880}>
        <Pop f={f} at={I.bulk + 24} out={docOut + 2} mode="up" dist={40}>
          <div style={{ background: INK, border: `4px solid ${INK}`, boxShadow: `6px 6px 0 ${RUST}`, padding: "12px 22px", display: "flex", alignItems: "center", gap: 12 }}>
            <Sparkle size={28} f={f} />
            <Mono size={24} color={PAPER}>
              CHANGE IN BULK
            </Mono>
          </div>
        </Pop>
      </At>
    </>
  );
};

/* ------------------------------ scene 3 ------------------------------ */

const AppWindow: React.FC<{ f: number; logo: string; logoH: number; seed: number }> = ({ f, logo, logoH, seed }) => {
  const ROW = 50;
  const off = (f - B.grind) * 1.5;
  const first = Math.floor(off / ROW);
  return (
    <div style={{ ...card(10), width: 440, height: 480, overflow: "hidden", position: "relative" }}>
      <div
        style={{
          height: 92,
          background: "#fff",
          borderBottom: `4px solid ${INK}`,
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
        }}
      >
        <Img src={staticFile(`logos/${logo}`)} style={{ height: logoH, width: "auto" }} />
      </div>
      <div style={{ position: "absolute", top: 96, left: 0, right: 0, bottom: 52, overflow: "hidden" }}>
        {Array.from({ length: 8 }).map((_, j) => {
          const k = first + j;
          const y = k * ROW - off + 8;
          const done = y < 120;
          const w = 120 + rnd(k + seed) * 180;
          return (
            <div key={k} style={{ position: "absolute", left: 22, top: y, display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  border: `4px solid ${INK}`,
                  background: done ? RUST : "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {done && <span style={{ color: "#fff", fontSize: 18, fontWeight: 900, lineHeight: 1 }}>✓</span>}
              </div>
              <div style={{ width: w, height: 14, background: done ? "#CFC4B1" : INK, opacity: done ? 1 : 0.8 }} />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 52,
          borderTop: `4px solid ${INK}`,
          display: "flex",
          alignItems: "center",
          padding: "0 22px",
          background: CREAM,
        }}
      >
        <Mono size={16}>UNCATEGORIZED: ∞</Mono>
      </div>
    </div>
  );
};

const Cursor: React.FC<{ x: number; y: number; press: number }> = ({ x, y, press }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: 35, transform: `scale(${1 - press * 0.18})`, transformOrigin: "top left" }}>
    <svg width={46} height={58} viewBox="0 0 46 58">
      <path d="M4 4 L4 46 L15 36 L23 54 L31 50 L23 33 L38 33 Z" fill="#fff" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </svg>
  </div>
);

const GRIND_TARGETS: [number, number][] = [
  [240, 420],
  [800, 380],
  [270, 520],
  [760, 470],
  [230, 360],
  [820, 540],
  [300, 470],
  [780, 400],
];

const SceneGrind: React.FC<{ f: number }> = ({ f }) => {
  const at = B.grind;
  const out = B.income - 66;
  if (f < at || f > out + 14) return null;
  // stamp slam + shake
  const s0 = B.stamp;
  const slam = f < s0 ? 0 : f < s0 + 8 ? interpolate(f, [s0, s0 + 8], [2.6, 1], { easing: Easing.in(Easing.quad) }) : 1 + Math.sin((f - s0 - 8) / 2.2) * 0.07 * Math.exp(-(f - s0 - 8) / 8);
  const shakeT = f - (s0 + 8);
  const shake = shakeT > 0 && shakeT < 14 ? (rnd(f) - 0.5) * 18 * (1 - shakeT / 14) : 0;

  // cursor hops between windows in arcs, with a press on each landing
  const HOP = 36;
  const local = Math.max(0, f - (at + 40));
  const k = Math.floor(local / HOP) % GRIND_TARGETS.length;
  const prev = GRIND_TARGETS[(k + GRIND_TARGETS.length - 1) % GRIND_TARGETS.length];
  const next = GRIND_TARGETS[k];
  const p = (local % HOP) / 26;
  const [cx, cy] = arc(inOut(Math.min(1, p)), prev, next, 110);
  const press = p > 1 ? Math.sin(((local % HOP) - 26) / 10 * Math.PI) : 0;

  return (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      <At x={540} y={150}>
        <Pop f={f} at={at + 18} out={out} mode="down" dist={40}>
          <div style={{ background: INK, padding: "12px 22px" }}>
            <Mono size={20} color={PAPER}>
              QUICKBOOKS OR XERO — SAME GRIND
            </Mono>
          </div>
        </Pop>
      </At>
      <At x={295} y={460}>
        <Pop f={f} at={at} out={out + 2} mode="up">
          <AppWindow f={f} logo="quickbooks.svg" logoH={56} seed={3} />
        </Pop>
      </At>
      <At x={785} y={460}>
        <Pop f={f} at={at + 6} out={out + 4} mode="up">
          <AppWindow f={f} logo="xero.svg" logoH={66} seed={17} />
        </Pop>
      </At>
      {f > at + 40 && f < s0 + 4 && <Cursor x={cx} y={cy} press={press} />}
      {f >= s0 && f <= out + 12 && (
        <At x={540} y={470} z={30}>
          <div style={{ opacity: 1 - gone(f, out) }}>
            <div
              style={{
                transform: `rotate(-7deg) scale(${slam})`,
                background: RUST,
                border: `6px solid ${INK}`,
                boxShadow: `12px 12px 0 ${INK}`,
                padding: "18px 40px 24px",
              }}
            >
              <Head size={104} color="#fff">
                NOT ANYMORE.
              </Head>
            </div>
          </div>
        </At>
      )}
    </div>
  );
};

/* ------------------------------ scene 4 ------------------------------ */

const TERMS: [string, string, number][] = [
  ["01", "Income", B.income],
  ["02", "Expenses", B.expenses],
  ["03", "Balance sheet", B.balance],
  ["04", "P&L", B.pnl],
];

const Clock: React.FC<{ f: number }> = ({ f }) => {
  const t = f - B.hours;
  const min = t * 14;
  const hr = min / 12 + 40;
  return (
    <svg width={280} height={280} viewBox="0 0 280 280">
      <circle cx={140} cy={140} r={126} fill="#fff" stroke={INK} strokeWidth={8} />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={140}
          y1={26}
          x2={140}
          y2={i % 3 === 0 ? 50 : 42}
          stroke={INK}
          strokeWidth={i % 3 === 0 ? 7 : 4}
          transform={`rotate(${i * 30} 140 140)`}
        />
      ))}
      <line x1={140} y1={140} x2={140} y2={78} stroke={INK} strokeWidth={10} strokeLinecap="round" transform={`rotate(${hr} 140 140)`} />
      <line x1={140} y1={140} x2={140} y2={44} stroke={RUST} strokeWidth={7} strokeLinecap="round" transform={`rotate(${min} 140 140)`} />
      <circle cx={140} cy={140} r={10} fill={INK} />
    </svg>
  );
};

const SceneTerms: React.FC<{ f: number }> = ({ f }) => {
  const out = B.calendar - 12;
  if (f > out + 14) return null;
  const pos = [
    [275, 265],
    [685, 265],
    [275, 410],
    [685, 410],
  ];
  return (
    <>
      {TERMS.map(([n, label, at], i) => (
        <At key={n} x={pos[i][0]} y={pos[i][1]}>
          <Pop f={f} at={at} out={out + i * 2} mode="down" dist={70}>
            <div style={{ ...card(), width: 380, padding: "16px 22px 18px" }}>
              <Mono size={16} color={RUST}>
                {n}
              </Mono>
              <div style={{ marginTop: 6 }}>
                <Head size={50}>{label}</Head>
              </div>
            </div>
          </Pop>
        </At>
      ))}
      <At x={300} y={690}>
        <Pop f={f} at={B.hours} out={out + 8}>
          <Clock f={f} />
        </Pop>
      </At>
      <At x={620} y={690}>
        <Pop f={f} at={B.hours + 8} out={out + 10} mode="left">
          <Head size={112} color={RUST}>
            HOURS.
          </Head>
        </Pop>
      </At>
    </>
  );
};

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV"];
const GAPS = [28, 24, 21, 18, 16, 14, 13, 12, 40];
const FLIPS = GAPS.reduce<number[]>((acc, g) => [...acc, acc[acc.length - 1] + g], [B.firstFlip]);
const FLIP_LEN = 14;

const Page: React.FC<{ m: number; nov?: number }> = ({ m, nov = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 34 }}>
    <div style={{ transform: `scale(${1 + nov * 0.08})` }}>
      <Head size={130} color={m === 10 ? RUST : INK}>
        {MONTHS[m]}
      </Head>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 44px)", gap: 10, marginTop: 30 }}>
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} style={{ width: 44, height: 30, border: `3px solid ${INK}`, opacity: 0.25 }} />
      ))}
    </div>
  </div>
);

const Calendar: React.FC<{ f: number }> = ({ f }) => {
  let done = 0;
  FLIPS.forEach((t) => {
    if (f >= t + FLIP_LEN) done++;
  });
  const active = FLIPS.findIndex((t) => f >= t && f < t + FLIP_LEN);
  const angle = active >= 0 ? interpolate(f, [FLIPS[active], FLIPS[active] + FLIP_LEN], [0, -105], { easing: Easing.in(Easing.quad) }) : 0;
  const landed = FLIPS[FLIPS.length - 1] + FLIP_LEN;
  const nov = f >= landed ? Math.sin(Math.min(1, (f - landed) / 18) * Math.PI) : 0;
  const sway = Math.sin(f / 50) * 1.2;
  return (
    <div style={{ ...card(12), width: 500, height: 560, position: "relative", transform: `rotate(${sway}deg)`, transformOrigin: "top center" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, bottom: 0, perspective: 1400 }}>
        <Page m={active >= 0 ? done + 1 : done} nov={nov} />
        {active >= 0 && (
          <div style={{ position: "absolute", inset: 0, transform: `rotateX(${angle}deg)`, transformOrigin: "top", backfaceVisibility: "hidden", opacity: interpolate(angle, [-105, -80, 0], [0, 1, 1]) }}>
            <Page m={done} />
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 70, background: RUST, borderBottom: `4px solid ${INK}` }} />
      {[140, 360].map((x) => (
        <div key={x} style={{ position: "absolute", left: x - 12, top: -26, width: 24, height: 60, borderRadius: 12, background: CREAM, border: `4px solid ${INK}` }} />
      ))}
    </div>
  );
};

const SceneNovember: React.FC<{ f: number }> = ({ f }) => {
  const at = B.calendar;
  const out = B.data - 12;
  if (f < at || f > out + 14) return null;
  const months = Math.round(interpolate(f, [B.months + 6, B.months + 66], [0, 12], { ...CL, easing: Easing.out(Easing.cubic) }));
  return (
    <>
      <At x={400} y={490}>
        <Pop f={f} at={at} out={out} mode="down" dist={120} idle={0}>
          <Calendar f={f} />
        </Pop>
      </At>
      <At x={790} y={400}>
        <Pop f={f} at={B.rightNow} out={out + 2} mode="left">
          <div style={{ background: RUST, border: `4px solid ${INK}`, boxShadow: `8px 8px 0 ${INK}`, padding: "14px 22px" }}>
            <Mono size={26} color="#fff">
              ← RIGHT NOW
            </Mono>
          </div>
        </Pop>
      </At>
      <At x={400} y={880}>
        <Pop f={f} at={B.months} out={out + 4} mode="up" dist={50}>
          <div style={{ ...card(6), padding: "12px 22px", display: "flex", alignItems: "baseline", gap: 14 }}>
            <Head size={48} color={RUST}>
              {months}
            </Head>
            <Mono size={20}>MONTHS OF TRANSACTIONS</Mono>
          </div>
        </Pop>
      </At>
    </>
  );
};

/* ------------------------------ scene 5 ------------------------------ */

const ACCOUNTS: [string, number, number, number][] = [
  // label, x, y, tilt
  ["Payroll & Tax", 215, 365, -4],
  ["OpEx", 540, 365, 0],
  ["Income", 865, 365, 4],
];
const BANK_ROWS = ["DEPOSIT", "PAYROLL", "FUEL", "INSURANCE", "SOFTWARE", "TRANSFER", "CLIENT PMT", "PERMIT FEE", "PHONE"];
const AMEX_ROWS = ["LUMBER", "DRYWALL", "PAINT", "FASTENERS", "TILE", "HARDWARE"];

type Flyer = { at: number; from: [number, number]; label: string; amex: boolean };
const FLY = 30;
const FLYERS: Flyer[] = [
  ...Array.from({ length: 36 }, (_, i) => ({
    at: B.rowsStart + i * 10,
    from: [ACCOUNTS[i % 3][1], ACCOUNTS[i % 3][2] + 30] as [number, number],
    label: BANK_ROWS[(i * 4) % BANK_ROWS.length],
    amex: false,
  })),
  ...Array.from({ length: 18 }, (_, i) => ({
    at: B.amex + 40 + i * 11,
    from: [880, 740] as [number, number],
    label: AMEX_ROWS[i % AMEX_ROWS.length],
    amex: true,
  })),
];
const landed = (f: number) => FLYERS.filter((r) => f >= r.at + FLY);

const Row: React.FC<{ label: string; amex?: boolean; w?: number }> = ({ label, amex, w = 210 }) => (
  <div
    style={{
      width: w,
      height: 30,
      background: "#fff",
      border: `3px solid ${INK}`,
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 8px",
    }}
  >
    <div style={{ width: 10, height: 10, background: amex ? MUG : RUST }} />
    <Mono size={13} track={0.08}>
      {label}
    </Mono>
  </div>
);

// clipboard lives across scenes 5 and 6
const clipPos = (f: number) =>
  keyed(f, [
    { f: B.fix, v: [540, 760, 1] },
    { f: B.fix + 28, v: [540, 330, 0.8] },
  ]);

const Clipboard: React.FC<{ f: number }> = ({ f }) => {
  const at = B.data + 130;
  const out = B.fix + 118;
  if (f < at || f > out + 14) return null;
  const n = landed(f).length;
  const [x, y, s] = clipPos(f);
  const rows = landed(f).slice(-6);
  const pulse = f >= B.copyPaste ? 1 + 0.18 * Math.sin(Math.min(1, (f - B.copyPaste) / 22) * Math.PI) : 1;
  return (
    <At x={x} y={y} z={10}>
      <div style={{ transform: `scale(${s})` }}>
        <Pop f={f} at={at} out={out} mode="up">
          <div style={{ ...card(10), width: 360, height: 400, background: "#D9B98C", position: "relative", padding: "60px 22px 20px" }}>
            <div style={{ position: "absolute", left: 120, top: -22, width: 120, height: 46, background: INK, borderRadius: 8 }} />
            <div style={{ background: "#fff", border: `3px solid ${INK}`, height: "100%", padding: "14px 16px", position: "relative" }}>
              <div style={{ transform: `scale(${pulse})`, transformOrigin: "left center", marginBottom: 10 }}>
                <Mono size={17} color={RUST}>
                  COPY → PASTE
                </Mono>
              </div>
              {rows.map((r, i) => (
                <div key={`${r.at}`} style={{ marginBottom: 4 }}>
                  <Row label={r.label} amex={r.amex} w={270} />
                </div>
              ))}
              <div style={{ position: "absolute", left: 16, bottom: 10 }}>
                <Mono size={14}>ROWS: {n}</Mono>
              </div>
            </div>
          </div>
        </Pop>
      </div>
    </At>
  );
};

const Flyers: React.FC<{ f: number }> = ({ f }) => (
  <>
    {FLYERS.map((r, i) => {
      if (f < r.at || f >= r.at + FLY) return null;
      const t = inOut((f - r.at) / FLY);
      const to: [number, number] = [540, 640 + Math.min(i % 8, 7) * 20];
      const [x, y] = arc(t, r.from, to, r.amex ? 120 : 160);
      return (
        <div key={i} style={{ position: "absolute", left: x - 105, top: y - 15, zIndex: 15, transform: `rotate(${Math.sin(t * Math.PI) * (r.amex ? -12 : 12)}deg) scale(${1 - t * 0.15})` }}>
          <Row label={r.label} amex={r.amex} />
        </div>
      );
    })}
  </>
);

const Lumber: React.FC = () => (
  <svg width={150} height={70} viewBox="0 0 150 70">
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={4 + i * 6} y={6 + i * 20} width={110} height={18} fill="#D9A866" stroke={INK} strokeWidth={4} />
        <circle cx={114 + i * 6} cy={15 + i * 20} r={4} fill="none" stroke={INK} strokeWidth={2} />
      </g>
    ))}
    <rect x={124} y={6} width={10} height={58} fill="#7A5A3A" stroke={INK} strokeWidth={4} />
    <rect x={112} y={4} width={34} height={16} fill="#9AA0A6" stroke={INK} strokeWidth={4} />
  </svg>
);

const SceneData: React.FC<{ f: number }> = ({ f }) => {
  const at = B.data;
  const out = B.fix - 8;
  if (f < at || f > out + 14) return null;
  return (
    <>
      <At x={540} y={185}>
        <Pop f={f} at={at + 12} out={out}>
          <LogoTile src="wellsfargo.svg" h={92} pad={10} />
        </Pop>
      </At>
      {ACCOUNTS.map(([label, x, y, tilt], i) => {
        const a = at + 40 + i * 6;
        if (f < a) return null;
        const t = pop(f, a);
        const px = 540 + (x - 540) * t;
        const py = 185 + (y - 185) * t;
        return (
          <At key={label} x={px} y={py}>
            <Pop f={f} at={a} out={out + 2 + i * 2} idle={4}>
              <div style={{ ...card(), width: 290, padding: "16px 20px 16px 30px", borderLeft: `12px solid ${RUST}`, transform: `rotate(${tilt * t}deg)` }}>
                <Mono size={14} color={RUST}>
                  CHECKING
                </Mono>
                <div style={{ marginTop: 6 }}>
                  <Head size={36}>{label}</Head>
                </div>
              </div>
            </Pop>
          </At>
        );
      })}
      <At x={880} y={600}>
        <Pop f={f} at={B.amex} out={out + 6} mode="left" dist={260}>
          <LogoTile src="amex.svg" h={86} pad={10} />
        </Pop>
      </At>
      <At x={880} y={770}>
        <Pop f={f} at={B.amex + 10} out={out + 8} mode="left" dist={260}>
          <div style={{ ...card(), width: 230, padding: "14px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <Lumber />
            <Mono size={17}>MATERIALS</Mono>
          </div>
        </Pop>
      </At>
    </>
  );
};

/* ------------------------------ scene 6 ------------------------------ */

const BINS: [string, number][] = [
  ["Income", 220],
  ["Expenses", 540],
  ["Materials", 860],
];
const SORT_AT = B.fix + 30;
const SORTED = Array.from({ length: 24 }, (_, i) => ({ at: SORT_AT + i * 3, bin: i % 3 === 0 ? 0 : i % 3 === 1 ? 2 : 1 }));
const PNL_AT = B.fix + 120;

const SceneFix: React.FC<{ f: number }> = ({ f }) => {
  if (f < B.fix || f > B.outro + 30) return null;
  const out = B.outro;
  const ringAt = B.fix + 194;
  const sweep = interpolate(f, [ringAt + 6, ringAt + 66], [0, 0.88], { ...CL, easing: Easing.out(Easing.cubic) });
  const R = 96;
  const C = 2 * Math.PI * R;
  return (
    <>
      {/* rows sort into bins */}
      {SORTED.map((r, i) => {
        if (f < r.at || f >= r.at + 22) return null;
        const t = inOut((f - r.at) / 22);
        const [x, y] = arc(t, [540, 380], [BINS[r.bin][1], 720], 60);
        return (
          <div key={i} style={{ position: "absolute", left: x - 90, top: y - 15, zIndex: 15, transform: `scale(${0.85 - t * 0.3})` }}>
            <Row label={["INCOME", "EXPENSE", "MATERIAL"][r.bin]} amex={r.bin === 2} w={180} />
          </div>
        );
      })}
      {BINS.map(([label, x], i) => {
        const a = B.fix + 14 + i * 5;
        const got = SORTED.filter((r) => r.bin === i && f >= r.at + 22).length;
        // bins fly into their P&L line
        const t = interpolate(f, [PNL_AT + i * 4, PNL_AT + 26 + i * 4], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
        if (t >= 1) return null;
        const px = x + (330 - x) * t;
        const py = 740 + (360 + i * 80 - 740) * t;
        return (
          <At key={label} x={px} y={py} z={12}>
            <div style={{ transform: `scale(${1 - t * 0.6})`, opacity: 1 - t * 0.6 }}>
              <Pop f={f} at={a} mode="up">
                <div style={{ ...card(), width: 270, padding: "14px 18px" }}>
                  <Head size={36}>{label}</Head>
                  <div style={{ display: "flex", gap: 4, marginTop: 10, height: 14 }}>
                    {Array.from({ length: got }).map((_, k) => (
                      <div key={k} style={{ width: 22, background: i === 2 ? MUG : i === 0 ? GREEN : RUST }} />
                    ))}
                  </div>
                </div>
              </Pop>
            </div>
          </At>
        );
      })}

      {/* the finished P&L */}
      <At x={330} y={500}>
        <Pop f={f} at={PNL_AT} out={out} idle={3}>
          <div style={{ ...card(12), width: 470, height: 580, padding: "30px 34px", position: "relative" }}>
            <Mono size={16} color={RUST}>
              YEAR-END · RECONCILED
            </Mono>
            <div style={{ margin: "10px 0 26px" }}>
              <Head size={56}>Profit &amp; Loss</Head>
            </div>
            {[
              ["INCOME", 0.92, GREEN],
              ["EXPENSES", 0.48, RUST],
              ["MATERIALS", 0.34, MUG],
            ].map(([l, w, c], i) => {
              const g = interpolate(f, [PNL_AT + 26 + i * 6, PNL_AT + 56 + i * 6], [0, 1], { ...CL, easing: outBack });
              return (
                <div key={l as string} style={{ marginBottom: 26 }}>
                  <Mono size={15}>{l}</Mono>
                  <div style={{ marginTop: 8, height: 26, width: `${(w as number) * 100 * g}%`, background: c as string, border: `3px solid ${INK}` }} />
                </div>
              );
            })}
            <div style={{ borderTop: `4px solid ${INK}`, paddingTop: 18 }}>
              <Mono size={15}>NET PROFIT</Mono>
              <div
                style={{
                  marginTop: 8,
                  height: 34,
                  width: `${44 * interpolate(f, [PNL_AT + 50, PNL_AT + 80], [0, 1], { ...CL, easing: outBack })}%`,
                  background: INK,
                }}
              />
            </div>
          </div>
        </Pop>
      </At>
      <At x={540} y={250} z={14}>
        <Pop f={f} at={PNL_AT + 50} out={out + 2}>
          <svg width={110} height={110} viewBox="0 0 110 110" style={{ transform: "rotate(-8deg)" }}>
            <circle cx={55} cy={55} r={48} fill={GREEN} stroke={INK} strokeWidth={6} />
            <path d="M32 57 L48 73 L80 38" fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Pop>
      </At>

      {/* ready to enter into TurboTax */}
      <At x={830} y={270}>
        <Pop f={f} at={PNL_AT + 60} out={out + 4} mode="left">
          <LogoTile src="turbotax.svg" h={60} pad={14} />
        </Pop>
      </At>
      <At x={830} y={420}>
        <Pop f={f} at={PNL_AT + 70} out={out + 8} mode="up" dist={40}>
          <div style={{ background: INK, padding: "12px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <Mono size={18} color={PAPER}>
              READY TO ENTER
            </Mono>
            <Mono size={18} color={PAPER}>
              INTO TURBOTAX
            </Mono>
          </div>
        </Pop>
      </At>

      {/* under an hour */}
      <At x={830} y={680}>
        <Pop f={f} at={ringAt} out={out + 10}>
          <svg width={240} height={240} viewBox="0 0 240 240">
            <circle cx={120} cy={120} r={R} fill="#fff" stroke={INK} strokeWidth={6} />
            <circle
              cx={120}
              cy={120}
              r={R}
              fill="none"
              stroke={RUST}
              strokeWidth={22}
              strokeDasharray={`${C * sweep} ${C}`}
              transform="rotate(-90 120 120)"
            />
            <circle cx={120} cy={120} r={R - 11} fill="none" stroke={INK} strokeWidth={4} />
            <circle cx={120} cy={120} r={R + 11} fill="none" stroke={INK} strokeWidth={4} />
            <rect x={108} y={2} width={24} height={14} fill={INK} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: `scale(${pop(f, ringAt + 60)})` }}>
              <Head size={52}>&lt; 1 HR</Head>
            </div>
          </div>
        </Pop>
      </At>
    </>
  );
};

/* ------------------------------ outro ------------------------------ */

const SceneOutro: React.FC<{ f: number }> = ({ f }) => {
  const at = B.outro + 4;
  if (f < at) return null;
  const tCur = interpolate(f, [at + 2, at + 24], [0, 1], { ...CL, easing: inOut });
  const [cx, cy] = arc(tCur, [1040, 1040], [560, 560], 140);
  const pressAt = at + 26;
  const press = f >= pressAt ? Math.sin(Math.min(1, (f - pressAt) / 8) * Math.PI) : 0;
  return (
    <>
      <At x={540} y={540} z={32}>
        <Pop f={f} at={at}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: RUST, transform: "translate(10px, 10px)" }} />
            <div
              style={{
                position: "relative",
                background: INK,
                padding: "28px 48px",
                transform: `translate(${press * 8}px, ${press * 8}px)`,
              }}
            >
              <Head size={72} color="#fff">
                ▶ Let’s go
              </Head>
            </div>
          </div>
        </Pop>
      </At>
      {f < pressAt + 12 && <Cursor x={cx} y={cy} press={press} />}
      <Wipe f={f} at={pressAt + 8} label="" />
    </>
  );
};

/* ------------------------------ root ------------------------------ */

export const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all([
      new FontFace("Archivo", `url(${staticFile("fonts/Archivo.ttf")})`, { weight: "100 900" }).load(),
      new FontFace("Plex", `url(${staticFile("fonts/PlexMonoSemiBold.ttf")})`, { weight: "600" }).load(),
    ]).then((faces) => {
      faces.forEach((ff) => document.fonts.add(ff));
      continueRender(handle);
    });
  }, [handle]);
};

export const YearEndBooks: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop f={f} />
      {f < B.ask + 160 && <SceneIntro f={f} />}
      {f >= B.ask && f < B.lockup + 10 && <SceneAsk f={f} />}
      {f >= B.shortcut && f < B.lockup + 10 && <SceneShortcut f={f} />}
      <SceneLockup f={f} />
      <Wipe f={f} at={B.letsGo} label="LET’S GO" exitAt={B.letsGo + 30} />
      <SceneGrind f={f} />
      {f >= B.income - 20 && <SceneTerms f={f} />}
      <SceneNovember f={f} />
      <SceneData f={f} />
      <Flyers f={f} />
      <Clipboard f={f} />
      <SceneFix f={f} />
      <MikeLayer f={f} />
      <Kicker f={f} />
      <Disclaimer f={f} />
      <SceneOutro f={f} />
    </AbsoluteFill>
  );
};
