"use client";

export function SegmentedControl({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className="bg-primary/5 p-1 rounded-xl flex">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
            activeTab === tab
              ? "bg-primary text-bg-dark shadow-lg"
              : "text-text-muted hover:text-text-primary"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
