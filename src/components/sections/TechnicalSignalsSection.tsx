import type { TechnicalSignal, Newsletter } from "@/lib/types";
import { SignalBadge } from "@/components/ui/SignalBadge";

function SignalCard({ signal }: { signal: TechnicalSignal }) {
  const borderColor =
    signal.signal === "Bullish"
      ? "border-l-bullish"
      : signal.signal === "Bearish"
        ? "border-l-bearish"
        : signal.signal === "Cautiously Bullish"
          ? "border-l-cautious"
          : signal.signal === "Cautiously Bearish"
            ? "border-l-cautious"
            : "border-l-neutral-signal";

  return (
    <div
      className={`bg-surface-dark border border-border-dark border-l-4 ${borderColor} rounded-xl p-4`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-mono text-primary font-bold text-sm">
            {signal.symbol}
          </span>
          <span className="text-text-muted text-xs ml-2">{signal.name}</span>
        </div>
        <SignalBadge signal={signal.signal} />
      </div>
      <p className="text-xs text-text-muted font-medium mb-2">
        {signal.key_levels}
      </p>
      <p className="text-xs text-text-primary/70 leading-relaxed">
        {signal.notes}
      </p>
    </div>
  );
}

export function TechnicalSignalsSection({
  signals,
  breadth,
}: {
  signals: TechnicalSignal[];
  breadth: {
    spx: string;
    nasdaq: string;
    russell: string;
    interpretation: string;
  };
}) {
  return (
    <div className="space-y-3">
      {signals.map((signal) => (
        <SignalCard key={signal.symbol} signal={signal} />
      ))}

      <div className="bg-surface-dark border border-border-dark rounded-xl p-4">
        <h4 className="text-xs font-bold uppercase tracking-wide text-primary mb-3">
          Market Breadth
        </h4>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <p className="text-[10px] text-text-muted uppercase">S&P 500</p>
            <p className="font-mono text-sm font-bold">{breadth.spx}</p>
          </div>
          <div>
            <p className="text-[10px] text-text-muted uppercase">Nasdaq</p>
            <p className="font-mono text-sm font-bold">{breadth.nasdaq}</p>
          </div>
          <div>
            <p className="text-[10px] text-text-muted uppercase">Russell</p>
            <p className="font-mono text-sm font-bold">{breadth.russell}</p>
          </div>
        </div>
        <p className="text-xs text-text-primary/70">{breadth.interpretation}</p>
      </div>
    </div>
  );
}
