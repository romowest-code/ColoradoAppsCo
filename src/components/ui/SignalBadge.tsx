import type { Signal, Bias } from "@/lib/types";

const signalStyles: Record<string, string> = {
  Bullish: "bg-bullish/15 text-bullish border-bullish/30",
  "Cautiously Bullish": "bg-cautious/15 text-cautious border-cautious/30",
  Neutral: "bg-neutral-signal/15 text-neutral-signal border-neutral-signal/30",
  "Cautiously Bearish": "bg-cautious/15 text-cautious border-cautious/30",
  Bearish: "bg-bearish/15 text-bearish border-bearish/30",
};

export function SignalBadge({ signal }: { signal: Signal | Bias }) {
  const style = signalStyles[signal] ?? signalStyles.Neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${style}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {signal}
    </span>
  );
}
