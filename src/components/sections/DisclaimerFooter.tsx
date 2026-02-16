export function DisclaimerFooter() {
  return (
    <footer className="mt-8 pt-6 border-t border-border-dark">
      <p className="text-[10px] text-text-muted leading-relaxed text-center">
        This application and all content within it are{" "}
        <strong>NOT trade alerts to buy or sell.</strong> We are not financial
        advisers. All information is for{" "}
        <strong>educational and entertainment purposes only.</strong> Investing
        of any kind involves risk. While it is possible to minimize risk, your
        investments are solely your responsibility. It is imperative that you
        conduct your own research. We are merely sharing our opinion with no
        guarantee of gains or losses on investments.
      </p>
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="w-6 h-6 bg-primary flex items-center justify-center rounded">
          <span className="material-icons-round text-bg-dark text-sm">
            trending_up
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
          Humbled Trader
        </span>
      </div>
    </footer>
  );
}
