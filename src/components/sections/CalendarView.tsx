"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TickerChip } from "@/components/ui/TickerChip";
import { ImpactDots } from "@/components/ui/ImpactDots";
import type { CalendarEconomicEvent, CalendarEarnings } from "@/lib/types";

function getImpactLevel(event: string): number {
  const high = [
    "FOMC",
    "GDP",
    "PCE",
    "CPI",
    "Nonfarm",
    "NFP",
    "Federal",
    "Fed",
    "Sentiment",
  ];
  const medium = [
    "Claims",
    "Manufacturing",
    "Housing",
    "Building",
    "Industrial",
    "Philadelphia",
    "Empire",
    "Income",
    "Spending",
  ];

  if (high.some((h) => event.includes(h))) return 3;
  if (medium.some((m) => event.includes(m))) return 2;
  return 1;
}

function EconomicTimeline({ events }: { events: CalendarEconomicEvent[] }) {
  return (
    <section className="space-y-8">
      {events.map((day, dayIdx) => (
        <div key={day.event_date} className="relative">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center pt-1">
              <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
              {dayIdx < events.length - 1 && (
                <div className="w-0.5 flex-1 bg-primary/20 min-h-[60px]" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <h3 className="text-primary font-bold text-sm tracking-wide mb-4 uppercase">
                {day.day_label}
              </h3>
              <div className="space-y-3">
                {day.events.map((event, i) => (
                  <div
                    key={i}
                    className="bg-surface-dark border border-border-dark rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-tighter text-text-muted">
                        {event.includes("Closed") ? "All Day" : "Scheduled"}
                      </span>
                      <ImpactDots level={getImpactLevel(event)} />
                    </div>
                    <h4
                      className={`font-bold text-base mb-1 ${
                        getImpactLevel(event) === 3 ? "text-primary" : ""
                      }`}
                    >
                      {event}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function EarningsTimeline({ earnings }: { earnings: CalendarEarnings[] }) {
  return (
    <section className="space-y-8">
      {earnings.map((day, dayIdx) => (
        <div key={day.event_date} className="relative">
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center pt-1">
              <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
              {dayIdx < earnings.length - 1 && (
                <div className="w-0.5 flex-1 bg-primary/20 min-h-[40px]" />
              )}
            </div>
            <div className="flex-1 pb-2">
              <h3 className="text-primary font-bold text-sm tracking-wide mb-4 uppercase">
                {day.day_label}
              </h3>
              <div className="flex flex-wrap gap-2">
                {day.tickers.map((ticker) => (
                  <TickerChip key={ticker} ticker={ticker} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export function CalendarView({
  economic,
  earnings,
}: {
  economic: CalendarEconomicEvent[];
  earnings: CalendarEarnings[];
}) {
  const [activeTab, setActiveTab] = useState("Economic Events");

  return (
    <div className="space-y-6">
      <SegmentedControl
        tabs={["Economic Events", "Notable Earnings"]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      {activeTab === "Economic Events" ? (
        <EconomicTimeline events={economic} />
      ) : (
        <EarningsTimeline earnings={earnings} />
      )}
    </div>
  );
}
