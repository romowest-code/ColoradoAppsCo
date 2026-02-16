export type Signal =
  | "Bullish"
  | "Cautiously Bullish"
  | "Neutral"
  | "Cautiously Bearish"
  | "Bearish";

export type TradeType = "Day Trade" | "Swing Trade" | "Day/Swing Trade";

export type Bias = "Bullish" | "Bearish" | "Neutral";

export type WatchlistStatus =
  | "Active"
  | "Triggered"
  | "Invalidated"
  | "Closed";

export interface Newsletter {
  week_date: string;
  headline: string;
  market_summary: string;
  key_points: string[];
  econ_summary: string;
  econ_jobs: string;
  econ_inflation: string;
  econ_retail: string;
  econ_yields: string;
  econ_rate_outlook: string;
  crypto_narrative: string;
  crypto_technicals: string;
  breadth_spx: string;
  breadth_nasdaq: string;
  breadth_russell: string;
  breadth_interpretation: string;
  sources: string[];
}

export interface TechnicalSignal {
  symbol: string;
  name: string;
  signal: Signal;
  key_levels: string;
  notes: string;
}

export interface WatchlistIdea {
  ticker: string;
  company_name: string;
  price_at_publish: number;
  sector: string;
  trade_type: TradeType;
  bias: Bias;
  key_level: string;
  thesis: string;
  invalidation: string;
  position_disclosure: string;
  risk_reward: string;
  status: WatchlistStatus;
}

export interface MarketMover {
  ticker: string;
  company_name: string;
  catalyst: string;
  how_traded: string;
}

export interface CalendarEconomicEvent {
  event_date: string;
  day_label: string;
  events: string[];
}

export interface CalendarEarnings {
  event_date: string;
  day_label: string;
  tickers: string[];
}

export interface WeekData {
  newsletter: Newsletter;
  technical_signals: TechnicalSignal[];
  watchlist_ideas: WatchlistIdea[];
  market_movers: MarketMover[];
  calendar_economic: CalendarEconomicEvent[];
  calendar_earnings: CalendarEarnings[];
}
