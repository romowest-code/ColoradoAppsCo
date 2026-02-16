export function Header() {
  return (
    <header className="md:hidden px-6 py-4 flex items-center justify-between border-b border-border-dark bg-bg-dark sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg">
          <span className="material-icons-round text-white font-bold">
            trending_up
          </span>
        </div>
        <div>
          <h1 className="text-xs uppercase tracking-widest text-primary font-extrabold">
            Humbled Trader
          </h1>
          <p className="text-lg font-bold leading-tight">Weekly Watchlist</p>
        </div>
      </div>
      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
        <span className="material-icons-round">notifications_none</span>
      </button>
    </header>
  );
}
