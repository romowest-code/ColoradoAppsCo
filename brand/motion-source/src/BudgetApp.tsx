import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  At,
  Backdrop,
  CL,
  CREAM,
  GREEN,
  Head,
  INK,
  Mono,
  PAPER,
  Pop,
  RUST,
  card,
  inOut,
  outBack,
  rnd,
  useFonts,
} from "./YearEndBooks";

/* ------------------------------------------------------------------ *
 *  Video 2 · "Make your own budget app for free"
 *  Four stand-alone clips, 1920x1080 @ 60fps. Each one is self-timed to
 *  the matching lines in brand/video-02-budget-app/script.md, so cut
 *  them in on the cue and trim to taste.
 * ------------------------------------------------------------------ */

const Note: React.FC<{ f: number; text: string }> = ({ f, text }) => (
  <div style={{ position: "absolute", right: 48, bottom: 30, opacity: interpolate(f, [30, 50], [0, 0.7], CL) }}>
    <Mono size={18}>{text}</Mono>
  </div>
);

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useFonts();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop f={f} />
      {children}
    </AbsoluteFill>
  );
};

// a rust bar that draws itself across whatever it sits on
const Strike: React.FC<{ f: number; at: number; w: number; angle?: number }> = ({ f, at, w, angle = -9 }) => {
  const k = interpolate(f, [at, at + 14], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: w,
        height: 22,
        marginLeft: -w / 2,
        marginTop: -11,
        background: RUST,
        boxShadow: `5px 5px 0 ${INK}`,
        transform: `rotate(${angle}deg) scaleX(${k})`,
        transformOrigin: "center",
        zIndex: 5,
      }}
    />
  );
};

/* ============================ MG1 ============================ *
 *  "Monarch. Fifteen bucks a month… Start here instead."  20s
 * ============================================================= */

const APPS = [
  { name: "Monarch", tier: "CORE PLAN", mo: "$14.99", yr: "$180", yrNote: "/YR BILLED MONTHLY" },
  { name: "YNAB", tier: "STANDARD", mo: "$14.99", yr: "$180", yrNote: "/YR BILLED MONTHLY" },
  { name: "Rocket Money", tier: "PREMIUM", mo: "$7–14", yr: "$168", yrNote: "/YR AT THE TOP" },
];

const A1 = { cards: 20, yearly: 300, strike: 520, verdict: 560, leave: 760, here: 830, steps: 880 };

const AppCard: React.FC<{ f: number; i: number }> = ({ f, i }) => {
  const a = APPS[i];
  const flip = interpolate(f, [A1.yearly + i * 14, A1.yearly + i * 14 + 16], [0, 1], { ...CL, easing: inOut });
  const showYr = flip > 0.5;
  const squash = Math.abs(Math.cos(flip * Math.PI));
  return (
    <div style={{ ...card(10), width: 470, height: 380, position: "relative", padding: "34px 38px" }}>
      <Mono size={20} color={RUST}>
        {a.tier}
      </Mono>
      <div style={{ marginTop: 14 }}>
        <Head size={62}>{a.name}</Head>
      </div>
      <div style={{ marginTop: 44, transform: `scaleY(${squash})`, display: "flex", alignItems: "baseline", gap: 14 }}>
        <Head size={104} color={showYr ? RUST : INK}>
          {showYr ? a.yr : a.mo}
        </Head>
        <Mono size={24}>{showYr ? "" : "/MO"}</Mono>
      </div>
      <div style={{ marginTop: 16, opacity: showYr ? 1 : 0 }}>
        <Mono size={18}>{a.yrNote}</Mono>
      </div>
      <Strike f={f} at={A1.strike + i * 10} w={520} />
    </div>
  );
};

const Step: React.FC<{ n: string; title: string; sub: string; hot?: boolean }> = ({ n, title, sub, hot }) => (
  <div
    style={{
      ...card(10),
      width: 440,
      padding: "30px 34px",
      background: hot ? RUST : PAPER,
    }}
  >
    <Mono size={20} color={hot ? CREAM : RUST}>
      {n}
    </Mono>
    <div style={{ marginTop: 12 }}>
      <Head size={58} color={hot ? "#fff" : INK}>
        {title}
      </Head>
    </div>
    <div style={{ marginTop: 14 }}>
      <Mono size={19} color={hot ? CREAM : INK}>
        {sub}
      </Mono>
    </div>
  </div>
);

const Arrow: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const k = interpolate(f, [at, at + 12], [0, 1], { ...CL, easing: outBack });
  return (
    <div style={{ transform: `scale(${k})`, opacity: k > 0 ? 1 : 0 }}>
      <Head size={90} color={RUST}>
        →
      </Head>
    </div>
  );
};

export const MG1Apps: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Frame>
      {/* headline */}
      <At x={960} y={150}>
        {f < A1.verdict ? (
          <Pop f={f} at={6} out={A1.verdict - 12} mode="down">
            <Mono size={30}>{f < A1.yearly ? "BUDGET APPS · PER MONTH" : "PER YEAR"}</Mono>
          </Pop>
        ) : (
          <Pop f={f} at={A1.verdict} out={A1.leave} mode="down">
            <div style={{ textAlign: "center" }}>
              <Head size={84}>To be told you spent too much.</Head>
            </div>
          </Pop>
        )}
      </At>

      {/* the three apps */}
      {APPS.map((_, i) => (
        <At key={i} x={420 + i * 540} y={590}>
          <Pop f={f} at={A1.cards + i * 18} out={A1.leave + i * 6} mode="up" dist={160}>
            <AppCard f={f} i={i} />
          </Pop>
        </At>
      ))}

      {/* start here instead */}
      <At x={960} y={250}>
        <Pop f={f} at={A1.here} mode="scale">
          <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
            <Head size={120}>Start</Head>
            <span style={{ background: RUST, padding: "4px 26px 14px", boxShadow: `10px 10px 0 ${INK}` }}>
              <Head size={120} color="#fff">
                here.
              </Head>
            </span>
          </div>
        </Pop>
      </At>
      <At x={960} y={650}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Pop f={f} at={A1.steps} mode="up">
            <Step n="01" title="Your bank" sub="12 MONTHS · COPY + PASTE" />
          </Pop>
          <Arrow f={f} at={A1.steps + 30} />
          <Pop f={f} at={A1.steps + 40} mode="up">
            <Step n="02" title="Free AI agent" sub="IT RUNS ITS OWN COMPUTER" />
          </Pop>
          <Arrow f={f} at={A1.steps + 70} />
          <Pop f={f} at={A1.steps + 80} mode="up">
            <Step n="03" title="$0 budget app" sub="BUILT FOR CASH ENVELOPES" hot />
          </Pop>
        </div>
      </At>
      {f < A1.leave + 20 && <Note f={f} text="NOT SPONSORED · PRICES AS OF NOV 2026" />}
    </Frame>
  );
};
export const MG1_DURATION = 1200;

/* ============================ MG2 ============================ *
 *  Dave Ramsey's cash envelope method.  22s
 * ============================================================= */

const ENV = [
  ["HOUSING", 1500],
  ["GROCERIES", 650],
  ["UTILITIES", 300],
  ["GAS", 250],
  ["EATING OUT", 200],
  ["FUN", 150],
  ["GIVING", 250],
  ["SAVINGS", 1500],
] as const;
const PAY = 4800;
const A2 = { title: 6, pay: 70, envs: 150, fill: 330, fillEach: 34, job: 640, cash: 820, months: 960 };

const envPos = (i: number) => ({ x: 330 + (i % 4) * 420, y: 530 + Math.floor(i / 4) * 300 });

const Envelope: React.FC<{ label: string; amt: number; fill: number }> = ({ label, amt, fill }) => (
  <div style={{ position: "relative", width: 340, height: 200 }}>
    <svg width={340} height={200} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <rect x={6} y={6} width={334} height={194} fill={INK} />
      <rect x={0} y={0} width={334} height={194} fill={PAPER} stroke={INK} strokeWidth={4} />
      <polyline points="2,2 167,96 332,2" fill="none" stroke={INK} strokeWidth={4} />
    </svg>
    {/* cash peeking out of the top */}
    <div
      style={{
        position: "absolute",
        left: 40,
        top: -60 * fill + 10,
        width: 254,
        height: 60 * fill,
        background: GREEN,
        border: `3px solid ${INK}`,
        borderBottom: "none",
        opacity: fill > 0.02 ? 1 : 0,
        zIndex: -1,
      }}
    />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center" }}>
      <Mono size={20}>{label}</Mono>
      <div style={{ marginTop: 6 }}>
        <Head size={44} color={fill > 0.98 ? RUST : INK}>
          ${Math.round(amt * fill).toLocaleString()}
        </Head>
      </div>
    </div>
  </div>
);

export const MG2Envelopes: React.FC = () => {
  const f = useCurrentFrame();
  const fills = ENV.map((_, i) =>
    interpolate(f, [A2.fill + i * A2.fillEach, A2.fill + i * A2.fillEach + 40], [0, 1], { ...CL, easing: inOut }),
  );
  const spent = ENV.reduce((s, [, amt], i) => s + amt * fills[i], 0);
  const left = Math.max(0, Math.round(PAY - spent));
  const showEnv = f < A2.cash - 10;
  return (
    <Frame>
      <At x={960} y={110}>
        <Pop f={f} at={A2.title} mode="down">
          <div style={{ textAlign: "center" }}>
            <Mono size={24} color={RUST}>
              DAVE RAMSEY’S
            </Mono>
            <div style={{ marginTop: 10 }}>
              <Head size={82}>The cash envelope method</Head>
            </div>
          </div>
        </Pop>
      </At>

      {/* take-home pay draining into the envelopes */}
      {showEnv && (
        <At x={960} y={290}>
          <Pop f={f} at={A2.pay} out={A2.cash - 22} mode="scale">
            <div
              style={{
                ...card(10),
                width: 900,
                padding: "22px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Mono size={22}>{f < A2.job ? "TAKE-HOME PAY · EXAMPLE" : "EVERY DOLLAR HAS A JOB"}</Mono>
              <Head size={64} color={left === 0 ? RUST : INK}>
                ${left.toLocaleString()}
              </Head>
            </div>
          </Pop>
        </At>
      )}

      {/* bills in flight */}
      {ENV.map((_, i) => {
        const s = A2.fill + i * A2.fillEach;
        if (f < s || f > s + 40 || !showEnv) return null;
        const t = interpolate(f, [s, s + 34], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) });
        const p = envPos(i);
        const x = 960 + (p.x - 960) * t;
        const y = 300 + (p.y - 120 - 300) * t - Math.sin(t * Math.PI) * 120;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 70,
              top: y - 34,
              width: 140,
              height: 68,
              background: GREEN,
              border: `3px solid ${INK}`,
              transform: `rotate(${(rnd(i) - 0.5) * 50 + t * 30}deg)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            <Head size={40} color={CREAM}>
              $
            </Head>
          </div>
        );
      })}

      {showEnv &&
        ENV.map(([label, amt], i) => {
          const p = envPos(i);
          return (
            <At key={label} x={p.x} y={p.y}>
              <Pop f={f} at={A2.envs + i * 10} out={A2.cash - 24 + i * 2} mode="up">
                <Envelope label={label} amt={amt} fill={fills[i]} />
              </Pop>
            </At>
          );
        })}

      {/* cards in the drawer, cash only */}
      <At x={700} y={600}>
        <Pop f={f} at={A2.cash} mode="scale">
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 480,
                height: 300,
                background: INK,
                borderRadius: 24,
                boxShadow: `12px 12px 0 ${RUST}`,
                padding: 36,
                transform: "rotate(-6deg)",
              }}
            >
              <div style={{ width: 80, height: 60, background: "#d9b86a", borderRadius: 8, marginTop: 70 }} />
              <div style={{ marginTop: 40 }}>
                <Mono size={28} color={CREAM}>
                  •••• •••• •••• 0000
                </Mono>
              </div>
            </div>
            <Strike f={f} at={A2.cash + 24} w={620} angle={-24} />
            <Strike f={f} at={A2.cash + 34} w={620} angle={24} />
          </div>
        </Pop>
      </At>
      <At x={1370} y={560}>
        <Pop f={f} at={A2.cash + 50} mode="left">
          <div>
            <span style={{ display: "inline-block", background: RUST, padding: "6px 28px 16px", boxShadow: `10px 10px 0 ${INK}` }}>
              <Head size={130} color="#fff">
                Cash only.
              </Head>
            </span>
          </div>
        </Pop>
      </At>
      <At x={1370} y={740}>
        <Pop f={f} at={A2.months} mode="up">
          <Head size={72}>for 3–6 months</Head>
        </Pop>
      </At>
      <Note f={f} text="NOT SPONSORED · EXAMPLE NUMBERS" />
    </Frame>
  );
};
export const MG2_DURATION = 1320;

/* ============================ MG3 ============================ *
 *  Budget apps vs. your AI budget.  15s
 * ============================================================= */

const ROWS: [string, string, string, boolean | null][] = [
  // [row, budget apps, your AI budget, who wins: true = AI, false = apps, null = tie]
  ["Cost", "$100–180 / yr", "$0", true],
  ["Connects to your bank", "Automatic", "Paste once a month", false],
  ["Built for cash envelopes", "Sort of", "That’s the whole point", true],
  ["Cancels subscriptions", "Rocket Money does", "Finds them — you call", false],
  ["What it knows about you", "Every linked account", "Only what you paste", true],
];
const A3 = { head: 10, row0: 90, rowGap: 80, verdict: 720 };
const COLS = [120, 760, 1320];

export const MG3Compare: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Frame>
      <div style={{ position: "absolute", left: COLS[0], top: 70 }}>
        <Pop f={f} at={A3.head} mode="down">
          <Head size={72}>Is it better? Honestly…</Head>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: COLS[1], top: 210 }}>
        <Pop f={f} at={A3.head + 20} mode="down">
          <Mono size={26}>BUDGET APPS</Mono>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: COLS[2], top: 200 }}>
        <Pop f={f} at={A3.head + 30} mode="down">
          <span style={{ background: RUST, padding: "6px 14px" }}>
            <Mono size={26} color="#fff">
              YOUR AI BUDGET
            </Mono>
          </span>
        </Pop>
      </div>
      {ROWS.map(([label, app, ai, aiWins], i) => {
        const at = A3.row0 + i * A3.rowGap;
        const y = 280 + i * 130;
        const lineK = interpolate(f, [at, at + 20], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
        return (
          <React.Fragment key={label}>
            <div
              style={{
                position: "absolute",
                left: COLS[0],
                top: y,
                width: 1680 * lineK,
                height: 3,
                background: INK,
                opacity: 0.85,
              }}
            />
            <div style={{ position: "absolute", left: COLS[0], top: y + 34 }}>
              <Pop f={f} at={at} mode="right" dist={60}>
                <Head size={44}>{label}</Head>
              </Pop>
            </div>
            <div style={{ position: "absolute", left: COLS[1], top: y + 40 }}>
              <Pop f={f} at={at + 10} mode="up" dist={50}>
                <Mark win={aiWins === false} />
                <Mono size={28} color={aiWins === false ? INK : "#6b665e"}>
                  {app}
                </Mono>
              </Pop>
            </div>
            <div style={{ position: "absolute", left: COLS[2], top: y + 40 }}>
              <Pop f={f} at={at + 20} mode="up" dist={50}>
                <Mark win={aiWins === true} />
                <Mono size={28} color={aiWins === true ? RUST : "#6b665e"}>
                  {ai}
                </Mono>
              </Pop>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: COLS[0], top: 950 }}>
        <Pop f={f} at={A3.verdict} mode="up">
          <Head size={56}>
            Starting out?{" "}
            <span style={{ background: RUST, color: "#fff", padding: "0 14px 6px" }}>You need a plan, not software.</span>
          </Head>
        </Pop>
      </div>
    </Frame>
  );
};

const Mark: React.FC<{ win: boolean }> = ({ win }) => (
  <span
    style={{
      display: "inline-block",
      width: 34,
      marginRight: 12,
      fontFamily: "Archivo, sans-serif",
      fontWeight: 900,
      fontSize: 34,
      color: win ? RUST : "transparent",
    }}
  >
    ✓
  </span>
);
export const MG3_DURATION = 900;

/* ============================ MG4 ============================ *
 *  The prompt types itself out, then sends.  12s
 * ============================================================= */

const PROMPT = [
  "Build me a simple budget app based on Dave Ramsey’s cash envelope method.",
  "",
  "1. Sort my last 12 months of transactions into categories.",
  "2. Find my real monthly average for each one.",
  "3. Flag every subscription and what it costs per year.",
  "4. Give me 6–8 envelopes so every dollar of my pay has a job.",
  "5. Build it as an app I can open, log cash in, and print labels from.",
].join("\n");
const A4 = { win: 6, type: 40, cps: 1.25, send: 560 };

export const MG4Prompt: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.floor((f - A4.type) * A4.cps));
  const shown = PROMPT.slice(0, n);
  const done = n >= PROMPT.length;
  const caret = !done || Math.floor(f / 30) % 2 === 0;
  const press = interpolate(f, [A4.send, A4.send + 6, A4.send + 14], [0, 6, 0], CL);
  const sent = f > A4.send + 10;
  return (
    <Frame>
      <At x={960} y={540}>
        <Pop f={f} at={A4.win} mode="up" dist={140}>
          <div style={{ ...card(14), width: 1440, background: "#fff" }}>
            <div
              style={{
                background: INK,
                padding: "16px 28px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Mono size={20} color={CREAM}>
                AI AGENT · NEW TASK
              </Mono>
              <div style={{ display: "flex", gap: 10 }}>
                {[RUST, CREAM, CREAM].map((c, i) => (
                  <div key={i} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
                ))}
              </div>
            </div>
            <div
              style={{
                padding: "40px 48px 30px",
                minHeight: 470,
                fontFamily: "Plex, monospace",
                fontWeight: 600,
                fontSize: 30,
                lineHeight: 1.6,
                color: INK,
                whiteSpace: "pre-wrap",
              }}
            >
              {shown}
              <span style={{ opacity: caret && !sent ? 1 : 0, color: RUST }}>▌</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 48px 34px" }}>
              <Mono size={20} color="#6b665e">
                + 12 MONTHS OF TRANSACTIONS · ACCOUNT NUMBERS REMOVED
              </Mono>
              <div
                style={{
                  background: sent ? INK : RUST,
                  border: `4px solid ${INK}`,
                  boxShadow: `${6 - press}px ${6 - press}px 0 ${INK}`,
                  transform: `translate(${press}px, ${press}px)`,
                  padding: "14px 30px",
                }}
              >
                <Mono size={24} color="#fff">
                  {sent ? "SENT ✓" : "SEND ↵"}
                </Mono>
              </div>
            </div>
          </div>
        </Pop>
      </At>
      <At x={960} y={70}>
        <Pop f={f} at={20} mode="down">
          <Mono size={24} color={RUST}>
            FULL PROMPT IN THE SHOW NOTES
          </Mono>
        </Pop>
      </At>
    </Frame>
  );
};
export const MG4_DURATION = 720;
