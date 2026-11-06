import { Shell, SiteFooter, SiteHeader, Wrap } from "@/components/mrod/SiteChrome";
import { Btn, Eyebrow } from "@/components/mrod/ui";

export default function NotFound() {
  return (
    <Shell>
      <SiteHeader />
      <Wrap className="py-20 sm:py-28">
        <div className="mb-5">
          <Eyebrow>ERROR 404</Eyebrow>
        </div>
        <h1 className="font-head text-[clamp(40px,7vw,60px)] leading-[0.98] font-extrabold tracking-[-0.035em] mb-5">
          That page isn&apos;t here.
        </h1>
        <p className="text-xl leading-[1.5] text-ink-5 max-w-[32em] mb-8">
          Either I moved it or you typed it from memory. Both happen. Here are
          the three doors that definitely work.
        </p>
        <div className="flex flex-wrap gap-3.5 items-center">
          <Btn href="/">▶ BACK TO THE HOMEPAGE</Btn>
          <Btn href="/app-lab" variant="paper">
            THE APP LAB
          </Btn>
          <Btn href="/audit" variant="paper">
            THE AUDIT
          </Btn>
        </div>
      </Wrap>
      <SiteFooter home />
    </Shell>
  );
}
