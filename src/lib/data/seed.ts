import { WeekData } from "../types";

export const WEEKS: WeekData[] = [
  {
    newsletter: {
      week_date: "2026-02-14",
      headline: "AI Disruption Fears Drive Divergence",
      market_summary:
        "Markets experienced another volatile week, but performance diverged sharply beneath the surface. While the S&P 500 Equal Weight index (SPXEW) notched a fresh all-time high midweek, the major cap-weighted indices finished lower as AI disruption fears intensified across multiple industries — not just software.\n\nThe week started with renewed selling in mega-cap tech as investors digested reports of accelerating AI adoption displacing traditional business models. Despite strong economic data, sentiment remained cautious as the market grappled with the longer-term implications of rapid AI integration across sectors.\n\nSector rotation was the dominant theme, with defensive and value names outperforming while growth and momentum struggled. Energy and utilities led gains, while communication services and technology lagged.",
      key_points: [
        "January Nonfarm Payrolls came in strong (+130K vs. +65K expected)",
        "CPI cooler than expected (+0.2% MoM headline, Core CPI 2.5% YoY — lowest since 2021)",
        "Treasury yields fell sharply (10Y down ~14 bps to ~4.05%)",
        "Q4 earnings solid: ~66% beating revenue, ~76% beating EPS",
        "Falling yields failed to lift equities — a notable caution signal",
      ],
      econ_summary: "Mixed but leaned constructive overall",
      econ_jobs:
        "Nonfarm Payrolls beat expectations (+130K vs. +65K), unemployment dipped to 4.3%, wage growth firm at +0.4% MoM",
      econ_inflation:
        "CPI cooler than expected (+0.2% MoM headline), core CPI at 2.5% YoY — lowest since 2021",
      econ_retail:
        "Flat month-over-month, showing consumer cooling after prior strength",
      econ_yields:
        "10-year down ~14 bps to ~4.05%. Stocks struggled to rally despite falling yields — divergence worth watching",
      econ_rate_outlook:
        "March cut odds near 10% after strong jobs report",
      crypto_narrative:
        "Bitcoin initially sold off following strong payrolls as rate cut expectations were repriced. Softer CPI triggered a rebound, but the recovery lacked conviction. Institutional flows remained mixed, with spot ETF inflows slowing compared to prior weeks. The broader crypto market followed Bitcoin's lead, with altcoins showing even more muted price action.",
      crypto_technicals:
        "Support near 200-week MA. 100-week MA (~$87K) may act as resistance. Volatility has cooled.",
      breadth_spx: "~66%",
      breadth_nasdaq: "Ticked slightly higher",
      breadth_russell: "Eased modestly",
      breadth_interpretation:
        "Selling pressure was concentrated rather than broad-based",
      sources: ["Charles Schwab", "Earnings Whispers"],
    },
    technical_signals: [
      {
        symbol: "NDX",
        name: "Nasdaq 100",
        signal: "Bearish",
        key_levels:
          "Resistance at ~25,200 (prior support). 100-day SMA confirmed pullback.",
        notes:
          "Confirmed bearish pullback at 100-day SMA. Prior support now acting as resistance. Failure to reclaim ~25,200 reinforces near-term bearish momentum.",
      },
      {
        symbol: "SPX",
        name: "S&P 500",
        signal: "Cautiously Bullish",
        key_levels:
          "Support 6,800 / Resistance 7,000. 100-day SMA near 6,800.",
        notes:
          "Rangebound between 6,800–7,000. Currently bouncing near 6,800 support and 100-day SMA. Multiple support tests increase risk of eventual breakdown. Slightly bullish short-term if 6,800 holds; vulnerable if breached.",
      },
      {
        symbol: "BTC",
        name: "Bitcoin",
        signal: "Neutral",
        key_levels:
          "Support: 200-week MA. Resistance: 100-week MA (~$87K).",
        notes:
          "Found support near 200-week MA. 100-week MA (~$87K) may act as resistance. Volatility has cooled compared to prior weeks.",
      },
    ],
    watchlist_ideas: [
      {
        ticker: "DG",
        company_name: "Dollar General",
        price_at_publish: 153.84,
        sector: "Consumer Defensive",
        trade_type: "Day/Swing Trade",
        bias: "Bullish",
        key_level: "$154.30 (previous 52-week high)",
        thesis:
          "Previous swing idea — traded from end of November 2025 until stopped out late January 2026. Current environment favorable for defensive stocks as market rotates away from growth. Looking for trend-following long setup if 52-week high (~$154.30) is taken out again. Clean chart structure with higher lows building toward resistance.",
        invalidation: "Failure to break above $154.30",
        position_disclosure: "No position",
        risk_reward: "Good",
        status: "Active",
      },
      {
        ticker: "TAC",
        company_name: "TransAlta Corp",
        price_at_publish: 13.58,
        sector: "Utilities",
        trade_type: "Swing Trade",
        bias: "Bullish",
        key_level: "$13.50 area",
        thesis:
          "Technical swing idea in utility space. Sold off in downtrend since November 2025 but defended daily 200SMA well. Looking for breakout of daily downtrend and steady trend reversal. Ideally breakout then pullback to key level for clean higher low. If fails below $13s, idea is no longer valid. Utility sector seeing inflows as defensive rotation continues.",
        invalidation: "Failure below $13.00",
        position_disclosure: "Swing long from $13.61",
        risk_reward: "Decent",
        status: "Active",
      },
      {
        ticker: "UBER",
        company_name: "Uber Technologies",
        price_at_publish: 68.42,
        sector: "Technology",
        trade_type: "Day Trade",
        bias: "Bearish",
        key_level: "$70.00 (psychological resistance)",
        thesis:
          "AI disruption narrative is weighing heavily on ride-sharing names. Autonomous vehicle developments have accelerated fears of margin compression. Watching for rejection at $70 round number for potential short entry. Volume profile shows supply zone between $69-71.",
        invalidation: "Sustained break above $71.00",
        position_disclosure: "No position",
        risk_reward: "Good",
        status: "Active",
      },
      {
        ticker: "XLE",
        company_name: "Energy Select Sector SPDR",
        price_at_publish: 92.15,
        sector: "Energy",
        trade_type: "Swing Trade",
        bias: "Bullish",
        key_level: "$91.50 (breakout level)",
        thesis:
          "Energy sector showing relative strength as rotation out of tech accelerates. XLE breaking out of multi-week consolidation. Crude oil inventories declining, supporting energy names. Looking for continuation above $91.50 breakout level with stops below $89.00.",
        invalidation: "Close below $89.00",
        position_disclosure: "No position",
        risk_reward: "Good",
        status: "Active",
      },
    ],
    market_movers: [
      {
        ticker: "COIN",
        company_name: "Coinbase Global",
        catalyst: "Better-than-expected Q4 adjusted EPS results",
        how_traded: "Backside Long",
      },
      {
        ticker: "MU",
        company_name: "Micron Technology",
        catalyst: "Better-than-expected Q4 adjusted EPS results",
        how_traded: "Backside Long",
      },
      {
        ticker: "SNAP",
        company_name: "Snap Inc.",
        catalyst: "Weak Q1 guidance despite earnings beat",
        how_traded: "Gap Fade Short",
      },
      {
        ticker: "ROKU",
        company_name: "Roku Inc.",
        catalyst:
          "Strong platform revenue growth and ad business expansion",
        how_traded: "Breakout Long",
      },
    ],
    calendar_economic: [
      {
        event_date: "2026-02-16",
        day_label: "Mon 2/16",
        events: ["Presidents' Day — Markets Closed"],
      },
      {
        event_date: "2026-02-17",
        day_label: "Tue 2/17",
        events: ["Empire State Manufacturing"],
      },
      {
        event_date: "2026-02-18",
        day_label: "Wed 2/18",
        events: [
          "Building Permits",
          "Housing Starts",
          "Industrial Production",
          "Capacity Utilization",
          "FOMC Meeting Minutes",
        ],
      },
      {
        event_date: "2026-02-19",
        day_label: "Thu 2/19",
        events: [
          "Initial Claims",
          "Continuing Claims",
          "Philadelphia Fed",
          "Pending Home Sales",
        ],
      },
      {
        event_date: "2026-02-20",
        day_label: "Fri 2/20",
        events: [
          "Q4 GDP (Advanced)",
          "PCE Prices",
          "Personal Income & Spending",
          "University of Michigan Sentiment",
        ],
      },
    ],
    calendar_earnings: [
      {
        event_date: "2026-02-17",
        day_label: "Tue 2/17",
        tickers: ["PANW", "ETOR", "MKSI"],
      },
      {
        event_date: "2026-02-18",
        day_label: "Wed 2/18",
        tickers: ["BKNG", "CVNA", "FIG", "DASH", "EBAY", "FVRR"],
      },
      {
        event_date: "2026-02-19",
        day_label: "Thu 2/19",
        tickers: ["WMT", "W", "OPEN", "AXTI"],
      },
      {
        event_date: "2026-02-20",
        day_label: "Fri 2/20",
        tickers: ["AU"],
      },
    ],
  },
];
