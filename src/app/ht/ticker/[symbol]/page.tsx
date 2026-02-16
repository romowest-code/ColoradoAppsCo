import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTickerHistory, getAllTickers } from "@/lib/data";
import { SignalBadge } from "@/components/ui/SignalBadge";

export function generateStaticParams() {
  return getAllTickers().map((symbol) => ({ symbol }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol } = await params;
  return {
    title: `${symbol.toUpperCase()} — Humbled Trader`,
    description: `Historical watchlist appearances for ${symbol.toUpperCase()}`,
  };
}

export default async function TickerPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const upper = symbol.toUpperCase();
  const history = getTickerHistory(upper);

  const hasData =
    history.watchlistIdeas.length > 0 ||
    history.signals.length > 0 ||
    history.movers.length > 0;

  if (!hasData) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <span className="font-mono text-3xl font-bold text-primary">
          {upper}
        </span>
        {history.watchlistIdeas[0] && (
          <p className="text-sm text-text-muted mt-1">
            {history.watchlistIdeas[0].company_name}
          </p>
        )}
      </div>

      {/* Watchlist Appearances */}
      {history.watchlistIdeas.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-primary mb-4">
            Watchlist Appearances
          </h3>
          <div className="space-y-3">
            {history.watchlistIdeas.map((idea, i) => (
              <div
                key={i}
                className="bg-surface-dark border border-border-dark rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted">
                    Week of {idea.week_date}
                  </span>
                  <SignalBadge signal={idea.bias} />
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-sm font-bold">
                    @ ${idea.price_at_publish.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-text-muted bg-accent-dark px-2 py-0.5 rounded">
                    {idea.trade_type}
                  </span>
                </div>
                <p className="text-xs text-text-primary/70 leading-relaxed">
                  {idea.thesis}
                </p>
                <div className="flex gap-4 mt-3 text-[10px] text-text-muted">
                  <span>Key: {idea.key_level}</span>
                  <span>Invalidation: {idea.invalidation}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Signal Appearances */}
      {history.signals.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-primary mb-4">
            Signal History
          </h3>
          <div className="space-y-3">
            {history.signals.map((signal, i) => (
              <div
                key={i}
                className="bg-surface-dark border border-border-dark rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted">
                    Week of {signal.week_date}
                  </span>
                  <SignalBadge signal={signal.signal} />
                </div>
                <p className="text-xs font-medium mb-1">{signal.key_levels}</p>
                <p className="text-xs text-text-primary/70">{signal.notes}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Market Mover Appearances */}
      {history.movers.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-primary mb-4">
            Market Mover History
          </h3>
          <div className="space-y-3">
            {history.movers.map((mover, i) => (
              <div
                key={i}
                className="bg-surface-dark border border-border-dark rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted">
                    Week of {mover.week_date}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {mover.how_traded}
                  </span>
                </div>
                <p className="text-xs text-text-primary/70">{mover.catalyst}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
