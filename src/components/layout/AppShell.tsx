import { Header } from "./Header";
import { SideNav, MobileBottomNav } from "./BottomNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex bg-bg-dark">
      <SideNav />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 pb-24 md:pb-8">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}
