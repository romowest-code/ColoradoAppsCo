import type { Metadata } from "next";
import Link from "next/link";
import { getAllWeeks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Archive — Humbled Trader Weekend Watchlist",
  description: "Browse past weekly watchlists from Humbled Trader.",
};

export default function ArchivePage() {
  const weeks = getAllWeeks();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-bold">Archive</h2>
      <p className="text-sm text-text-muted">
        Browse past weekly watchlists and market analysis.
      </p>

      <div className="space-y-3">
        {weeks.map((week) => (
          <Link
            key={week.newsletter.week_date}
            href="/ht"
            className="block bg-surface-dark border border-border-dark rounded-xl p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-primary font-bold uppercase tracking-wide">
                Week of {week.newsletter.week_date}
              </span>
              <span className="material-icons-round text-text-muted text-lg">
                chevron_right
              </span>
            </div>
            <h3 className="font-bold text-base mb-2">
              {week.newsletter.headline}
            </h3>
            <div className="flex flex-wrap gap-2">
              {week.watchlist_ideas.slice(0, 3).map((idea) => (
                <span
                  key={idea.ticker}
                  className="px-2 py-0.5 bg-primary/10 border border-primary/30 rounded text-[10px] font-mono font-bold text-primary"
                >
                  ${idea.ticker}
                </span>
              ))}
              {week.watchlist_ideas.length > 3 && (
                <span className="text-[10px] text-text-muted">
                  +{week.watchlist_ideas.length - 3} more
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center py-8">
        <p className="text-sm text-text-muted">
          More archives coming soon as new newsletters are published.
        </p>
      </div>
    </div>
  );
}
