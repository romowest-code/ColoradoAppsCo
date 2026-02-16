"use client";

import { useState, useMemo } from "react";
import type { Metadata } from "next";
import { getAllWatchlistIdeas } from "@/lib/data";
import { WatchlistIdeaCard } from "@/components/sections/WatchlistIdeaCard";
import type { WatchlistIdea } from "@/lib/types";

const sectors = ["All", "Consumer Defensive", "Utilities", "Technology", "Energy"];
const tradeTypes = ["All", "Day Trade", "Swing Trade", "Day/Swing Trade"];
const biases = ["All", "Bullish", "Bearish", "Neutral"];

export default function WatchlistPage() {
  const allIdeas = getAllWatchlistIdeas();
  const [sector, setSector] = useState("All");
  const [tradeType, setTradeType] = useState("All");
  const [bias, setBias] = useState("All");

  const filtered = useMemo(() => {
    return allIdeas.filter((idea) => {
      if (sector !== "All" && idea.sector !== sector) return false;
      if (tradeType !== "All" && idea.trade_type !== tradeType) return false;
      if (bias !== "All" && idea.bias !== bias) return false;
      return true;
    });
  }, [allIdeas, sector, tradeType, bias]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Watchlist Ideas</h2>
        <p className="text-sm text-text-muted">
          {filtered.length} idea{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wide text-text-muted block mb-1.5">
            Sector
          </label>
          <div className="flex flex-wrap gap-2">
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => setSector(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  sector === s
                    ? "bg-primary text-bg-dark"
                    : "bg-accent-dark text-text-muted hover:text-text-primary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wide text-text-muted block mb-1.5">
            Trade Type
          </label>
          <div className="flex flex-wrap gap-2">
            {tradeTypes.map((t) => (
              <button
                key={t}
                onClick={() => setTradeType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  tradeType === t
                    ? "bg-primary text-bg-dark"
                    : "bg-accent-dark text-text-muted hover:text-text-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wide text-text-muted block mb-1.5">
            Bias
          </label>
          <div className="flex flex-wrap gap-2">
            {biases.map((b) => (
              <button
                key={b}
                onClick={() => setBias(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  bias === b
                    ? "bg-primary text-bg-dark"
                    : "bg-accent-dark text-text-muted hover:text-text-primary"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((idea) => (
            <WatchlistIdeaCard key={idea.ticker} idea={idea} />
          ))
        ) : (
          <div className="text-center py-12">
            <span className="material-icons-round text-4xl text-text-muted mb-2 block">
              search_off
            </span>
            <p className="text-sm text-text-muted">
              No ideas match your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
