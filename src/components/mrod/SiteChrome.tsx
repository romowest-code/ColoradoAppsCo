import Link from "next/link";
import { BtnSm, Square } from "./ui";

const NAV_LINK =
  "font-label text-[13px] font-medium tracking-[0.08em] text-ink-2 no-underline py-2.5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange";

const NAV_ACTIVE =
  "font-label text-[13px] font-semibold tracking-[0.08em] text-ink border-b-[3px] py-2.5";

type Section = "learn" | "lab" | "audit" | null;

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper text-ink font-body">{children}</div>
  );
}

export function Wrap({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-[1180px] mx-auto px-5 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

export function SiteHeader({
  active = null,
  cta = { href: "/#newsletter", label: "GET THE 15-HOUR CHECKLIST" },
}: {
  active?: Section;
  cta?: { href: string; label: string };
}) {
  return (
    <header className="w-full border-b-2 border-ink bg-paper">
      <Wrap className="py-4 flex flex-wrap gap-5 items-center">
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline text-ink py-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
        >
          <span className="w-[22px] h-[22px] bg-orange border-2 border-ink inline-block" />
          <span className="font-label text-[17px] font-semibold tracking-[0.08em]">
            MROD
          </span>
        </Link>

        <nav className="flex flex-wrap gap-6 items-center grow">
          {active === "learn" ? (
            <span className={`${NAV_ACTIVE} border-live`}>LEARN</span>
          ) : (
            <Link href="/#learn" className={NAV_LINK}>
              LEARN
            </Link>
          )}
          {active === "lab" ? (
            <span className={`${NAV_ACTIVE} border-orange`}>APP LAB</span>
          ) : (
            <Link href="/app-lab" className={NAV_LINK}>
              APP LAB
            </Link>
          )}
          {active === "audit" ? (
            <span className={`${NAV_ACTIVE} border-idea`}>HIRE</span>
          ) : (
            <Link href="/audit" className={NAV_LINK}>
              HIRE
            </Link>
          )}
          <Link href="/#newsletter" className={`${NAV_LINK} hidden sm:block`}>
            NEWSLETTER
          </Link>
        </nav>

        <BtnSm href={cta.href}>{cta.label}</BtnSm>
      </Wrap>
    </header>
  );
}

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className="border-t-2 border-ink bg-paper">
      <Wrap className="py-7 flex flex-wrap gap-5 items-center">
        <span className="font-label text-xs tracking-[0.08em] text-ink-3 grow">
          MROD · APPS BUILT BY COLORADO APPS CO. · DENVER, COLORADO
        </span>
        {home ? (
          <>
            <Link
              href="/app-lab"
              className="font-label text-xs tracking-[0.08em] text-ink-2 no-underline py-2.5"
            >
              APP LAB
            </Link>
            <Link
              href="/audit"
              className="font-label text-xs tracking-[0.08em] text-ink-2 no-underline py-2.5"
            >
              HIRE
            </Link>
            <Link
              href="/#newsletter"
              className="font-label text-xs tracking-[0.08em] text-ink-2 no-underline py-2.5"
            >
              NEWSLETTER
            </Link>
          </>
        ) : (
          <Link
            href="/"
            className="font-label text-xs tracking-[0.08em] text-ink-2 no-underline py-2.5"
          >
            ← HOME
          </Link>
        )}
      </Wrap>
    </footer>
  );
}

/** Section eyebrow used above the door headings. */
export function DoorTag({
  n,
  name,
  tone,
}: {
  n: string;
  name: string;
  tone: "orange" | "live" | "idea";
}) {
  return (
    <div className="flex items-center gap-[9px] px-4 py-3 border-b-2 border-ink">
      <Square tone={tone} size={10} />
      <span className="font-label text-xs font-medium tracking-[0.14em] text-ink-2">
        {n} / {name}
      </span>
    </div>
  );
}
