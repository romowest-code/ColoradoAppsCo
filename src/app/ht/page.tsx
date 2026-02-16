import { getCurrentWeek } from "@/lib/data";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MarketSummaryCard } from "@/components/sections/MarketSummaryCard";
import { TechnicalSignalsSection } from "@/components/sections/TechnicalSignalsSection";
import { EconomicDataSection } from "@/components/sections/EconomicDataSection";
import { CryptoUpdateCard } from "@/components/sections/CryptoUpdateCard";
import { CalendarView } from "@/components/sections/CalendarView";
import { WatchlistIdeasList } from "@/components/sections/WatchlistIdeasList";
import { MarketMoversSection } from "@/components/sections/MarketMoversSection";
import { DisclaimerFooter } from "@/components/sections/DisclaimerFooter";

export default function HomePage() {
  const week = getCurrentWeek();
  const { newsletter } = week;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Week Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold">This Week</h2>
          <span className="text-sm font-medium text-primary/80">
            Week of Feb 14, 2026
          </span>
        </div>
      </div>

      <div className="px-6 space-y-8">
        {/* Market Summary */}
        <section>
          <SectionHeader icon="analytics" title="Market Summary" />
          <div className="mt-4">
            <MarketSummaryCard data={newsletter} />
          </div>
        </section>

        {/* Technical Signals */}
        <section>
          <SectionHeader
            icon="show_chart"
            title="Technical Signals"
            viewAllHref="/ht/signals"
          />
          <div className="mt-4">
            <TechnicalSignalsSection
              signals={week.technical_signals}
              breadth={{
                spx: newsletter.breadth_spx,
                nasdaq: newsletter.breadth_nasdaq,
                russell: newsletter.breadth_russell,
                interpretation: newsletter.breadth_interpretation,
              }}
            />
          </div>
        </section>

        {/* Economic Data */}
        <section>
          <SectionHeader icon="account_balance" title="Economic Data & Rates" />
          <div className="mt-4">
            <EconomicDataSection data={newsletter} />
          </div>
        </section>

        {/* Crypto Update */}
        <section>
          <SectionHeader icon="currency_bitcoin" title="Crypto Update" />
          <div className="mt-4">
            <CryptoUpdateCard data={newsletter} />
          </div>
        </section>

        {/* Upcoming Calendar */}
        <section>
          <SectionHeader icon="calendar_today" title="Upcoming Week" />
          <div className="mt-4">
            <CalendarView
              economic={week.calendar_economic}
              earnings={week.calendar_earnings}
            />
          </div>
        </section>

        {/* Watchlist Ideas (HERO) */}
        <section>
          <SectionHeader
            icon="star"
            title="Watchlist Ideas"
            viewAllHref="/ht/watchlist"
          />
          <div className="mt-4">
            <WatchlistIdeasList ideas={week.watchlist_ideas} />
          </div>
        </section>

        {/* Market Movers */}
        <section>
          <SectionHeader icon="trending_up" title="Market Movers" />
          <div className="mt-4">
            <MarketMoversSection movers={week.market_movers} />
          </div>
        </section>

        {/* CTA Banner */}
        <section className="rounded-xl overflow-hidden relative bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20">
          <div className="flex flex-col justify-center p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
              Premium Feature
            </p>
            <h3 className="text-text-primary font-bold text-lg leading-tight">
              Master the market with
              <br />
              <span className="text-primary">Humbled Trader Academy</span>
            </h3>
            <button className="mt-4 w-fit px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors">
              Get Started
            </button>
          </div>
        </section>

        <DisclaimerFooter />
      </div>
    </div>
  );
}
