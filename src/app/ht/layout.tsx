import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Humbled Trader — Weekend Watchlist",
  description:
    "Interactive weekly market analysis, watchlist ideas, and trading insights from Humbled Trader.",
};

export default function HtLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
        rel="stylesheet"
      />
      <div className="font-display antialiased bg-bg-dark text-text-primary min-h-dvh">
        <AppShell>{children}</AppShell>
      </div>
    </>
  );
}
