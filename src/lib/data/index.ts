import { WEEKS } from "./seed";
import type { WeekData, TechnicalSignal, WatchlistIdea, MarketMover } from "../types";

export function getCurrentWeek(): WeekData {
  return WEEKS[0];
}

export function getWeekByDate(date: string): WeekData | undefined {
  return WEEKS.find((w) => w.newsletter.week_date === date);
}

export function getAllWeeks(): WeekData[] {
  return WEEKS;
}

export function getAllWatchlistIdeas(): WatchlistIdea[] {
  return WEEKS.flatMap((w) => w.watchlist_ideas);
}

export function getAllTechnicalSignals(): TechnicalSignal[] {
  return WEEKS.flatMap((w) => w.technical_signals);
}

export function getAllMarketMovers(): MarketMover[] {
  return WEEKS.flatMap((w) => w.market_movers);
}

export function getTickerHistory(symbol: string) {
  const upper = symbol.toUpperCase();
  return {
    watchlistIdeas: WEEKS.flatMap((w) =>
      w.watchlist_ideas
        .filter((i) => i.ticker === upper)
        .map((i) => ({ ...i, week_date: w.newsletter.week_date }))
    ),
    signals: WEEKS.flatMap((w) =>
      w.technical_signals
        .filter((s) => s.symbol === upper)
        .map((s) => ({ ...s, week_date: w.newsletter.week_date }))
    ),
    movers: WEEKS.flatMap((w) =>
      w.market_movers
        .filter((m) => m.ticker === upper)
        .map((m) => ({ ...m, week_date: w.newsletter.week_date }))
    ),
  };
}

export function getAllTickers(): string[] {
  const tickers = new Set<string>();
  WEEKS.forEach((w) => {
    w.watchlist_ideas.forEach((i) => tickers.add(i.ticker));
    w.technical_signals.forEach((s) => tickers.add(s.symbol));
    w.market_movers.forEach((m) => tickers.add(m.ticker));
    w.calendar_earnings.forEach((e) =>
      e.tickers.forEach((t) => tickers.add(t))
    );
  });
  return Array.from(tickers).sort();
}
