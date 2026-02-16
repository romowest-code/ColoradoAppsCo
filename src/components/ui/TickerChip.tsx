import Link from "next/link";

export function TickerChip({
  ticker,
  className = "",
}: {
  ticker: string;
  className?: string;
}) {
  return (
    <Link
      href={`/ticker/${ticker}`}
      className={`inline-flex items-center px-3 py-1.5 bg-primary/10 border border-primary/30 rounded text-xs font-mono font-bold text-primary hover:bg-primary/20 transition-colors ${className}`}
    >
      ${ticker}
    </Link>
  );
}
