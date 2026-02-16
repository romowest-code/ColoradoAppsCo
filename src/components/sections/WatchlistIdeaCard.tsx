"use client";

import { useState } from "react";
import { SignalBadge } from "@/components/ui/SignalBadge";
import type { WatchlistIdea } from "@/lib/types";

const tradeTypeStyles: Record<string, string> = {
  "Day Trade": "bg-cautious/10 text-cautious border-cautious/20",
  "Swing Trade": "bg-bullish/10 text-bullish border-bullish/20",
  "Day/Swing Trade": "bg-primary/10 text-primary border-primary/20",
};

export function WatchlistIdeaCard({ idea }: { idea: WatchlistIdea }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-5 border-t-2 border-t-primary">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-2xl font-bold text-primary">
              {idea.ticker}
            </span>
            <span className="text-sm text-text-muted">
              @ ${idea.price_at_publish.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-text-primary/70">{idea.company_name}</p>
        </div>
        <SignalBadge signal={idea.bias} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
            tradeTypeStyles[idea.trade_type] ?? "bg-primary/10 text-primary border-primary/20"
          }`}
        >
          {idea.trade_type}
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-accent-dark text-text-muted border border-border-dark">
          {idea.sector}
        </span>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-accent-dark text-text-muted border border-border-dark">
          R:R {idea.risk_reward}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-accent-dark rounded-lg p-3">
          <p className="text-[10px] text-text-muted uppercase font-bold mb-0.5">
            Key Level
          </p>
          <p className="text-xs font-mono font-semibold">{idea.key_level}</p>
        </div>
        <div className="bg-accent-dark rounded-lg p-3">
          <p className="text-[10px] text-text-muted uppercase font-bold mb-0.5">
            Invalidation
          </p>
          <p className="text-xs font-mono font-semibold text-bearish">
            {idea.invalidation}
          </p>
        </div>
      </div>

      <div className="text-sm text-text-primary/80 leading-relaxed">
        <p>{expanded ? idea.thesis : idea.thesis.slice(0, 150) + "..."}</p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-primary text-xs font-semibold mt-2 hover:text-primary-light transition-colors"
        >
          {expanded ? "Show less" : "Read full thesis"}
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-border-dark">
        <p className="text-[10px] text-text-muted">
          Position: {idea.position_disclosure} · Status:{" "}
          <span
            className={
              idea.status === "Active"
                ? "text-bullish"
                : idea.status === "Invalidated"
                  ? "text-bearish"
                  : "text-text-muted"
            }
          >
            {idea.status}
          </span>
        </p>
      </div>
    </div>
  );
}
