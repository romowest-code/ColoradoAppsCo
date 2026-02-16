import type { Newsletter } from "@/lib/types";

export function CryptoUpdateCard({ data }: { data: Newsletter }) {
  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-icons-round text-primary text-lg">
          currency_bitcoin
        </span>
        <span className="font-mono text-sm font-bold text-primary">BTC</span>
      </div>
      <p className="text-sm text-text-primary/80 leading-relaxed mb-4">
        {data.crypto_narrative}
      </p>
      <div className="bg-accent-dark rounded-lg p-3">
        <p className="text-[10px] font-bold uppercase tracking-wide text-text-muted mb-1">
          Technical Levels
        </p>
        <p className="text-xs text-text-primary/70">{data.crypto_technicals}</p>
      </div>
    </div>
  );
}
