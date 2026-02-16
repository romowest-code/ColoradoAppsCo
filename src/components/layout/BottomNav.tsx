"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Home", icon: "home", href: "/" },
  { label: "Watchlist", icon: "visibility", href: "/watchlist" },
  { label: "Signals", icon: "show_chart", href: "/signals" },
  { label: "Archive", icon: "schedule", href: "/archive" },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border-dark bg-bg-dark h-screen sticky top-0">
      {/* Brand */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-primary flex items-center justify-center rounded-lg">
          <span className="material-icons-round text-white text-lg font-bold">
            trending_up
          </span>
        </div>
        <div>
          <h1 className="text-[10px] uppercase tracking-widest text-primary font-extrabold leading-none">
            Humbled Trader
          </h1>
          <p className="text-sm font-bold leading-tight">Watchlist</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-text-muted hover:text-text-primary hover:bg-surface-dark"
              }`}
            >
              <span className="material-icons-round text-xl">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-border-dark">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-dark flex items-center justify-center">
            <span className="material-icons-round text-text-muted text-lg">
              person
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">Trader</p>
            <p className="text-[10px] text-text-muted">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-dark border-t border-border-dark px-6 py-3 pb-7 flex justify-between items-center z-50">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-primary" : "text-text-muted"
            }`}
          >
            <span className="material-icons-round text-2xl">{tab.icon}</span>
            <span className="text-[10px] font-bold uppercase">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
