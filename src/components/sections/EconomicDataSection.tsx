import { CollapsibleCard } from "@/components/ui/CollapsibleCard";
import type { Newsletter } from "@/lib/types";

export function EconomicDataSection({ data }: { data: Newsletter }) {
  const sections = [
    { title: "Jobs Data", content: data.econ_jobs, icon: "work" },
    { title: "Inflation", content: data.econ_inflation, icon: "local_fire_department" },
    { title: "Retail Sales", content: data.econ_retail, icon: "shopping_cart" },
    { title: "Treasury Yields", content: data.econ_yields, icon: "account_balance" },
    { title: "Rate Cut Outlook", content: data.econ_rate_outlook, icon: "gavel" },
  ];

  return (
    <div className="space-y-2">
      <div className="bg-surface-dark border border-border-dark rounded-xl p-4 mb-2">
        <p className="text-sm font-semibold text-primary">{data.econ_summary}</p>
      </div>
      {sections.map((section) => (
        <CollapsibleCard key={section.title} title={section.title}>
          <p className="text-sm text-text-primary/80 leading-relaxed">
            {section.content}
          </p>
        </CollapsibleCard>
      ))}
    </div>
  );
}
