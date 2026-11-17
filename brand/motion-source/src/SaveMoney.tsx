import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Backdrop, CL, CREAM, Head, INK, Mono, PAPER, RUST, card, useFonts } from "./YearEndBooks";
import { BONUS, Box, Card, Demo, FPS, SEGMENTS, Seg, Shot, sec } from "./SaveMoneyData";

/* ------------------------------------------------------------------ *
 *  Video 3 · "13 AI Hacks That Pay for Themselves" — 1920x1080 @ 30
 *  Green  = Mike on camera (teleprompter slate, film over it)
 *  Purple = Mike's screen recording still needed
 *  Dark browser frame = real captured output, already done
 * ------------------------------------------------------------------ */

const TEAL = "#1F6B55";
const PURPLE = "#5B4AA8";
const PAGE = "#181818";

const rise = (f: number, at: number) =>
  spring({ frame: f - at, fps: FPS, config: { damping: 14, stiffness: 170, mass: 0.7 } });

const In: React.FC<{ f: number; at: number; dy?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  f,
  at,
  dy = 60,
  children,
  style,
}) => {
  if (f < at) return null;
  const k = rise(f, at);
  return (
    <div style={{ opacity: interpolate(f - at, [0, 6], [0, 1], CL), transform: `translateY(${(1 - k) * dy}px)`, ...style }}>
      {children}
    </div>
  );
};

const Chip: React.FC<{ bg: string; fg?: string; children: React.ReactNode }> = ({ bg, fg = "#fff", children }) => (
  <span style={{ background: bg, padding: "8px 16px", border: `3px solid ${INK}`, boxShadow: `4px 4px 0 ${INK}`, display: "inline-block" }}>
    <Mono size={22} color={fg}>
      {children}
    </Mono>
  </span>
);

const Frame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg }) => {
  useFonts();
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {bg ? <AbsoluteFill style={{ background: bg }} /> : <Backdrop f={f} />}
      {children}
    </AbsoluteFill>
  );
};

// thin progress bar so Mike can see how long the slot is while filming
const Clock: React.FC<{ f: number; total: number; color: string }> = ({ f, total, color }) => (
  <div style={{ position: "absolute", left: 0, bottom: 0, height: 12, width: `${(f / total) * 100}%`, background: color }} />
);

/* ============================ TITLE ============================ */

export const TitleCard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Frame>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34 }}>
        <In f={f} at={2}>
          <Chip bg={RUST}>AI FOR THE REST OF US</Chip>
        </In>
        <In f={f} at={8} dy={90}>
          <div style={{ textAlign: "center" }}>
            <Head size={220}>13 AI hacks</Head>
          </div>
        </In>
        <In f={f} at={16} dy={90}>
          <span style={{ background: INK, padding: "10px 34px 26px", boxShadow: `12px 12px 0 ${RUST}`, display: "inline-block" }}>
            <Head size={110} color={CREAM}>
              that pay for themselves.
            </Head>
          </span>
        </In>
        <In f={f} at={34}>
          <Mono size={26}>TESTED ON REAL BILLS · PROMPTS IN THE DESCRIPTION</Mono>
        </In>
      </AbsoluteFill>
    </Frame>
  );
};

/* ============================ CARDS ============================ */

export const HackCard: React.FC<{ c: Card; total: number }> = ({ c, total }) => {
  const f = useCurrentFrame();
  const fill = c.stat === "FILL";
  const out = interpolate(f, [total - 10, total], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) });
  return (
    <Frame>
      <AbsoluteFill style={{ transform: `translateX(${-out * 1920}px)` }}>
        {/* giant number */}
        <div style={{ position: "absolute", left: 90, top: 70 }}>
          <In f={f} at={0} dy={120}>
            <Head size={400} color={RUST}>
              {c.n}
            </Head>
          </In>
        </div>
        <div style={{ position: "absolute", left: 110, top: 520, width: 1000 }}>
          <In f={f} at={8}>
            <Chip bg={INK} fg={CREAM}>
              HACK {c.n} / 13 · {c.tool}
            </Chip>
          </In>
          <div style={{ marginTop: 34 }}>
            <In f={f} at={12} dy={80}>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 104, lineHeight: 1.0, letterSpacing: "-0.035em", color: INK }}>
                {c.title}
              </div>
            </In>
          </div>
        </div>
        {/* stat */}
        <div style={{ position: "absolute", right: 110, top: 300, width: 620 }}>
          <In f={f} at={30} dy={140}>
            <div
              style={{
                ...card(14),
                padding: "46px 48px",
                background: fill ? CREAM : PAPER,
                border: fill ? `5px dashed ${PURPLE}` : `4px solid ${INK}`,
                transform: `rotate(${fill ? 0 : 1.5}deg)`,
              }}
            >
              <Mono size={20} color={fill ? PURPLE : RUST}>
                {fill ? "YOUR NUMBER GOES HERE" : "THE NUMBER"}
              </Mono>
              <div style={{ marginTop: 18 }}>
                <Head size={c.stat.length > 8 ? 92 : 140} color={fill ? PURPLE : INK}>
                  {fill ? "$ ? ? ?" : c.stat}
                </Head>
              </div>
              <div style={{ marginTop: 22, whiteSpace: "normal" }}>
                <span style={{ fontFamily: "Plex, monospace", fontWeight: 600, fontSize: 22, letterSpacing: "0.1em", lineHeight: 1.5, color: INK }}>
                  {c.statLabel}
                </span>
              </div>
            </div>
          </In>
          {c.source && (
            <div style={{ marginTop: 26, textAlign: "right" }}>
              <In f={f} at={48} dy={20}>
                <Mono size={17}>SOURCE: {c.source.toUpperCase()}</Mono>
              </In>
            </div>
          )}
        </div>
      </AbsoluteFill>
    </Frame>
  );
};

/* ============================ SLATES ============================ */

export const TakeSlate: React.FC<{ label: string; text: string; total: number }> = ({ label, text, total }) => {
  const f = useCurrentFrame();
  return (
    <Frame bg={TEAL}>
      <div style={{ position: "absolute", left: 80, top: 60, display: "flex", gap: 18, alignItems: "center" }}>
        <Chip bg={INK}>● {label}</Chip>
        <Chip bg={CREAM} fg={INK}>
          ON CAMERA · {Math.round(total / FPS)}s · READ THIS
        </Chip>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 210 }}>
        <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: text.length > 150 ? 70 : 84, lineHeight: 1.14, color: "#fff", letterSpacing: "-0.02em" }}>
          “{text}”
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, bottom: 50 }}>
        <Mono size={20} color={CREAM}>
          PLACEHOLDER · DROP YOUR TAKE ON THE TRACK ABOVE THIS ONE
        </Mono>
      </div>
      <Clock f={f} total={total} color={CREAM} />
    </Frame>
  );
};

const YouSlate: React.FC<{ d: Demo; total: number; from?: number }> = ({ d, total, from = 0 }) => {
  const f = useCurrentFrame() - from;
  return (
    <AbsoluteFill style={{ background: PURPLE }}>
      <div style={{ position: "absolute", left: 80, top: 60, display: "flex", gap: 18 }}>
        <Chip bg={INK}>▶ DEMO {d.n} · {d.tool}</Chip>
        <Chip bg={CREAM} fg={INK}>
          YOUR SCREEN RECORDING · {Math.round(total / FPS)}s
        </Chip>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 200, display: "flex", flexDirection: "column", gap: 26 }}>
        {(d.you?.steps ?? []).map((s, i) => (
          <In key={i} f={f} at={4 + i * 6} dy={40}>
            <div style={{ display: "flex", gap: 30, alignItems: "baseline" }}>
              <Head size={64} color={CREAM}>
                {String(i + 1).padStart(2, "0")}
              </Head>
              <div style={{ fontFamily: "Archivo, sans-serif", fontWeight: 700, fontSize: 52, lineHeight: 1.15, color: "#fff" }}>{s}</div>
            </div>
          </In>
        ))}
      </div>
      <div style={{ position: "absolute", left: 80, bottom: 50 }}>
        <Mono size={20} color={CREAM}>
          PLACEHOLDER · BLUR ACCOUNT NUMBERS · DROP YOUR RECORDING ON THE TRACK ABOVE
        </Mono>
      </div>
      <Clock f={f} total={total} color={CREAM} />
    </AbsoluteFill>
  );
};

/* ======================= CLAUDE REPLAY ======================= */

const SW = 1525;
const SH = 784;
const VIEW_W = 1560;
const K = VIEW_W / SW; // screenshot px -> video px
const VIEW_H = SH * K;
const BAR = 46;
const LEFT = (1920 - VIEW_W) / 2;
const TOP = 40;

const Outline: React.FC<{ b: Box; f: number; at: number }> = ({ b, f, at }) => {
  const k = interpolate(f, [at, at + 12], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  if (k <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: b.x - 8,
        top: b.y - 6,
        width: (b.w + 16) * k,
        height: b.h + 12,
        border: `5px solid ${RUST}`,
        boxShadow: `0 0 0 3px ${INK}, 0 0 40px ${RUST}88`,
        background: `${RUST}14`,
      }}
    />
  );
};

const ShotView: React.FC<{ s: Shot; f: number; dur: number }> = ({ s, f, dur }) => {
  const SW = s.w ?? 1525;
  const SH = s.h ?? 784;
  const K = VIEW_W / SW;
  // slow push toward the zoom box, starting after the first highlight lands
  const z = s.zoom;
  const p = interpolate(f, [10, dur], [0, 1], { ...CL, easing: Easing.inOut(Easing.quad) });
  const cx = z ? z.x + z.w / 2 : SW / 2;
  const cy = z ? z.y + z.h / 2 : SH / 2;
  const target = z ? Math.min(1.45, Math.min(SW / z.w, SH / z.h) * 0.92) : 1;
  const scale = 1 + (target - 1) * p;
  const step = Math.max(14, Math.floor((dur * 0.5) / Math.max(1, s.hi?.length ?? 1)));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: PAGE }}>
      {/* outer fits the 1525x784 capture to the window; inner pushes the zoom box toward center */}
      <div style={{ position: "absolute", left: 0, top: 0, width: SW, height: SH, transformOrigin: "0 0", transform: `scale(${K})` }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SW,
          height: SH,
          transformOrigin: `${cx}px ${cy}px`,
          transform: `translate(${(SW / 2 - cx) * p}px, ${(SH / 2 - cy) * p}px) scale(${scale})`,
        }}
      >
        <Img src={staticFile(`demos/${s.src}`)} style={{ width: SW, height: SH, display: "block" }} />
        {(s.cover ?? []).map((b, i) => (
          <div key={`c${i}`} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, background: PAGE }} />
        ))}
        {(s.blur ?? []).map((b, i) => (
          <div
            key={`b${i}`}
            style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: b.h, background: "repeating-linear-gradient(135deg, #2e2e2e 0 8px, #262626 8px 16px)", borderRadius: 4 }}
          />
        ))}
        {(s.hi ?? []).map((b, i) => (
          <Outline key={`h${i}`} b={b} f={f} at={12 + i * step} />
        ))}
      </div>
      </div>
    </div>
  );
};

const DashView: React.FC<{ d: Demo; dur: number }> = ({ d, dur }) => {
  const f = useCurrentFrame();
  const W = 1600, H = 900, top = 30, left = (1920 - W) / 2;
  const k = interpolate(f, [0, 12], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
  // recordings are 8.5s; fit them to the slot
  const rate = Math.min(1.25, Math.max(0.8, (8.5 * FPS) / dur));
  return (
    <Frame>
      <div style={{ position: "absolute", left, top, width: W, height: H - 50, ...card(12), border: `4px solid ${INK}`, background: PAGE, transform: `scale(${0.94 + 0.06 * k})`, opacity: k }}>
        <div style={{ height: BAR, background: INK, display: "flex", alignItems: "center", padding: "0 18px", gap: 10 }}>
          {["#E5604A", "#E8B44C", "#5DB36A"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
          <div style={{ marginLeft: 18 }}>
            <Mono size={18} color={CREAM}>
              claude.ai · artifact
            </Mono>
          </div>
        </div>
        <div style={{ position: "absolute", top: BAR, left: 0, width: W - 8, height: H - 50 - BAR - 8, overflow: "hidden" }}>
          <OffthreadVideo src={staticFile(`dash/${d.dash}`)} playbackRate={rate} muted style={{ width: W - 8, height: ((W - 8) * 9) / 16, display: "block" }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: left + 24, bottom: 34 }}>
        <Chip bg={INK} fg={CREAM}>
          ✓ DASHBOARD CLAUDE BUILT FROM THAT ANSWER
        </Chip>
      </div>
      <div style={{ position: "absolute", right: left + 24, bottom: 34 }}>
        <Chip bg={RUST}>DEMO {d.n}</Chip>
      </div>
    </Frame>
  );
};

const Replay: React.FC<{ d: Demo; dur: number }> = ({ d, dur: full }) => {
  if (d.dash) {
    const shotsLen = Math.min(sec(4), full - sec(5));
    return (
      <AbsoluteFill>
        <Sequence durationInFrames={shotsLen}>
          <Replay d={{ ...d, dash: undefined, callout: undefined }} dur={shotsLen} />
        </Sequence>
        <Sequence from={shotsLen} durationInFrames={full - shotsLen}>
          <DashView d={d} dur={full - shotsLen} />
        </Sequence>
      </AbsoluteFill>
    );
  }
  const dur = full;
  const f = useCurrentFrame();
  const shots = d.shots ?? [];
  // first shot (the prompt) gets a shorter beat than the answers
  const weights = shots.map((_, i) => (i === 0 && shots.length > 1 ? 0.7 : 1));
  const W = weights.reduce((a, b) => a + b, 0);
  const starts: number[] = [];
  let acc = 0;
  weights.forEach((w) => {
    starts.push(Math.round(acc));
    acc += (w / W) * dur;
  });
  const cur = Math.max(0, starts.filter((s) => f >= s).length - 1);
  const local = f - starts[cur];
  const len = (starts[cur + 1] ?? dur) - starts[cur];
  const flash = interpolate(local, [0, 6], [1, 0], CL);
  const calloutAt = Math.round(dur * 0.55);
  return (
    <Frame>
      {/* browser window */}
      <div style={{ position: "absolute", left: LEFT, top: TOP, width: VIEW_W, height: VIEW_H + BAR, ...card(12), border: `4px solid ${INK}`, background: PAGE }}>
        <div style={{ height: BAR, background: INK, display: "flex", alignItems: "center", padding: "0 18px", gap: 10 }}>
          {["#E5604A", "#E8B44C", "#5DB36A"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
          <div style={{ marginLeft: 18 }}>
            <Mono size={18} color={CREAM}>
              {d.tool.includes("GOOGLE") ? "google.com · AI Mode" : "claude.ai"}
            </Mono>
          </div>
        </div>
        <div style={{ position: "absolute", top: BAR, left: 0, width: VIEW_W, height: VIEW_H, overflow: "hidden" }}>
          {shots[cur] && <ShotView s={shots[cur]} f={local} dur={len} />}
          <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.15 }} />
        </div>
      </div>
      {/* tag */}
      <div style={{ position: "absolute", left: LEFT + 24, bottom: 26 }}>
        <Chip bg={INK} fg={CREAM}>
          ✓ {d.tag}
        </Chip>
      </div>
      <div style={{ position: "absolute", right: LEFT + 24, bottom: 26 }}>
        <Chip bg={RUST}>DEMO {d.n}</Chip>
      </div>
      {/* the payoff number */}
      {d.callout && f >= calloutAt && (
        <div style={{ position: "absolute", right: 60, top: 150, transform: "rotate(-3deg)" }}>
          <In f={f} at={calloutAt} dy={-60}>
            <div style={{ ...card(12), background: RUST, padding: "26px 36px 30px", border: `4px solid ${INK}` }}>
              <Head size={d.callout.big.length > 8 ? 82 : 110} color="#fff">
                {d.callout.big}
              </Head>
              <div style={{ marginTop: 10 }}>
                <Mono size={20} color={CREAM}>
                  {d.callout.small}
                </Mono>
              </div>
            </div>
          </In>
        </div>
      )}
    </Frame>
  );
};

export const DemoSeg: React.FC<{ d: Demo; total: number }> = ({ d, total }) => {
  if (!d.shots?.length) {
    return (
      <Frame bg={PURPLE}>
        <YouSlate d={d} total={total} />
      </Frame>
    );
  }
  const youLen = d.you ? Math.min(sec(d.you.seconds), total - sec(8)) : 0;
  const replayLen = total - youLen;
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={replayLen}>
        <Replay d={d} dur={replayLen} />
      </Sequence>
      {youLen > 0 && (
        <Sequence from={replayLen} durationInFrames={youLen}>
          <Frame bg={PURPLE}>
            <YouSlate d={d} total={youLen} />
          </Frame>
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

export const BonusClip: React.FC = () => <Replay d={BONUS} dur={sec(13)} />;
export const BONUS_FRAMES = sec(13);

/* ============================ END ============================ */

export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Frame>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
        <In f={f} at={2}>
          <Mono size={28}>FIND THE MONEY IN YOUR OWN WEEK</Mono>
        </In>
        <In f={f} at={8} dy={90}>
          <Head size={150}>The free 15-Hour Checklist</Head>
        </In>
        <In f={f} at={18} dy={90}>
          <span style={{ background: RUST, padding: "10px 40px 24px", boxShadow: `12px 12px 0 ${INK}`, display: "inline-block" }}>
            <Head size={120} color="#fff">
              ai-rest-of-us.app
            </Head>
          </span>
        </In>
        <In f={f} at={34}>
          <Mono size={24}>LINK IN THE DESCRIPTION · SUBSCRIBE FOR ONE REAL TASK A WEEK</Mono>
        </In>
      </AbsoluteFill>
    </Frame>
  );
};

/* ============================ CUT ============================ */

export const SegView: React.FC<{ seg: Seg }> = ({ seg }) => {
  const total = sec(seg.s);
  switch (seg.kind) {
    case "title":
      return <TitleCard />;
    case "card":
      return <HackCard c={seg.card} total={total} />;
    case "take":
      return <TakeSlate label={seg.label} text={seg.text} total={total} />;
    case "demo":
      return <DemoSeg d={seg.demo} total={total} />;
    case "end":
      return <EndCard />;
  }
};

export const SaveMoneyCut: React.FC = () => {
  let at = 0;
  return (
    <AbsoluteFill>
      {SEGMENTS.map((seg) => {
        const from = at;
        at += sec(seg.s);
        return (
          <Sequence key={seg.id} from={from} durationInFrames={sec(seg.s)}>
            <SegView seg={seg} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
