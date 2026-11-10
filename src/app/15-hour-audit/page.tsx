import type { Metadata } from "next";
import {
  Shell,
  SiteFooter,
  SiteHeader,
  Wrap,
} from "@/components/mrod/SiteChrome";
import { AuditQuestionnaire } from "@/components/mrod/AuditQuestionnaire";
import { Eyebrow } from "@/components/mrod/ui";

export const metadata: Metadata = {
  title: "The 15-Hour Audit — MRod",
  description:
    "Eight questions about your week. You get back a list of the work that repeats, what a machine should take over, and what to keep doing yourself. Free, nothing to install.",
};

export default function FifteenHourAuditPage() {
  return (
    <Shell>
      <div className="print:hidden">
        <SiteHeader
          active="learn"
          cta={{ href: "/audit", label: "THREE HOURS, OR IT'S FREE" }}
        />
      </div>

      <section className="pt-12 pb-8 print:hidden">
        <Wrap>
          <Eyebrow>FREE · NOTHING TO INSTALL · ABOUT FOUR MINUTES</Eyebrow>
          <h1 className="mt-5 font-head text-[clamp(34px,6.5vw,56px)] leading-[1.02] font-extrabold tracking-[-0.035em] text-ink max-w-[14em]">
            The 15-Hour Audit
          </h1>
          <p className="mt-5 text-[19px] leading-[1.55] text-ink-3 max-w-[34em]">
            Eight questions about how your week actually runs. At the end you
            get a list of the work that repeats, which parts a machine should
            be doing, and the one thing you should carry on doing yourself.
          </p>
          <p className="mt-4 text-[16px] leading-[1.55] text-ink-3 max-w-[34em]">
            No account. No email needed to see it — only if you want a copy
            sent to you.
          </p>
        </Wrap>
      </section>

      <section className="pb-20">
        <Wrap>
          <AuditQuestionnaire />
        </Wrap>
      </section>

      <div className="print:hidden">
        <SiteFooter />
      </div>
    </Shell>
  );
}
