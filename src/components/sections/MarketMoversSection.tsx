import type { MarketMover } from "@/lib/types";
import { TickerChip } from "@/components/ui/TickerChip";

function MarketMoverCard({ mover }: { mover: MarketMover }) {
  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TickerChip ticker={mover.ticker} />
          <span className="text-xs text-text-muted">{mover.company_name}</span>
        </div>
      </div>
      <p className="text-xs text-text-primary/70 mb-2">{mover.catalyst}</p>
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
        {mover.how_traded}
      </span>
    </div>
  );
}

export function MarketMoversSection({ movers }: { movers: MarketMover[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {movers.map((mover) => (
        <MarketMoverCard key={mover.ticker} mover={mover} />
      ))}
    </div>
  );
}
