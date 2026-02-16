import type { Metadata } from "next";
import { getAllWeeks } from "@/lib/data";
import { SignalBadge } from "@/components/ui/SignalBadge";

export const metadata: Metadata = {
  title: "Signals — Humbled Trader Weekend Watchlist",
  description: "Technical signal history across all weeks.",
};

export default function SignalsPage() {
  const weeks = getAllWeeks();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-1">Technical Signals</h2>
        <p className="text-sm text-text-muted">
          Weekly signal history for major indices and Bitcoin.
        </p>
      </div>

      {weeks.map((week) => (
        <section key={week.newsletter.week_date}>
          <h3 className="text-primary font-bold text-sm tracking-wide mb-4 uppercase">
            Week of {week.newsletter.week_date}
          </h3>

          <div className="space-y-3">
            {week.technical_signals.map((signal) => {
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
                  key={signal.symbol}
                  className={`bg-surface-dark border border-border-dark border-l-4 ${borderColor} rounded-xl p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-mono text-primary font-bold text-sm">
                        {signal.symbol}
                      </span>
                      <span className="text-text-muted text-xs ml-2">
                        {signal.name}
                      </span>
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
            })}
          </div>

          {/* Breadth */}
          <div className="mt-3 bg-surface-dark border border-border-dark rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wide text-primary mb-3">
              Market Breadth
            </h4>
            <div className="grid grid-cols-3 gap-3 mb-2">
              <div>
                <p className="text-[10px] text-text-muted uppercase">S&P 500</p>
                <p className="font-mono text-sm font-bold">
                  {week.newsletter.breadth_spx}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase">Nasdaq</p>
                <p className="font-mono text-sm font-bold">
                  {week.newsletter.breadth_nasdaq}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-text-muted uppercase">Russell</p>
                <p className="font-mono text-sm font-bold">
                  {week.newsletter.breadth_russell}
                </p>
              </div>
            </div>
            <p className="text-xs text-text-primary/70">
              {week.newsletter.breadth_interpretation}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}
