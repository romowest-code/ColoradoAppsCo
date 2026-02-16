"use client";

import { useState } from "react";
import type { Newsletter } from "@/lib/types";

export function MarketSummaryCard({ data }: { data: Newsletter }) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = data.market_summary.split("\n\n");
  const preview = paragraphs[0];

  return (
    <div className="bg-surface-dark border border-border-dark rounded-xl p-5">
      <h3 className="text-primary font-bold text-xl mb-3">{data.headline}</h3>

      <div className="text-sm text-text-primary/80 leading-relaxed mb-4">
        <p>{preview}</p>
        {expanded &&
          paragraphs.slice(1).map((p, i) => (
            <p key={i} className="mt-3">
              {p}
            </p>
          ))}
        {paragraphs.length > 1 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-primary text-xs font-semibold mt-2 hover:text-primary-light transition-colors"
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {data.key_points.map((point, i) => (
          <span
            key={i}
            className="px-3 py-1.5 bg-primary/8 border border-primary/15 rounded-lg text-[11px] font-medium text-text-primary/70"
          >
            {point}
          </span>
        ))}
      </div>

      {data.sources.length > 0 && (
        <p className="text-[10px] text-text-muted">
          Sources: {data.sources.join(", ")}
        </p>
      )}
    </div>
  );
}
