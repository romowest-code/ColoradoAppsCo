/* ------------------------------------------------------------------ *
 *  Video 3 · "13 AI Hacks That Pay for Themselves"
 *  Every number on screen lives here. After the shoot, fill in the
 *  `stat` fields marked FILL and re-render. Nothing else needs editing.
 *
 *  Screenshot coordinates are in the 1525x784 frame Claude in Chrome
 *  captured them at.
 * ------------------------------------------------------------------ */

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

export type Box = { x: number; y: number; w: number; h: number };

export type Shot = {
  src: string; // file in public/demos
  hi?: Box[]; // rust outline, drawn in one after another
  cover?: Box[]; // painted over with the page background (UI glitches)
  blur?: Box[]; // privacy blur
  zoom?: Box; // slow push toward this region
  w?: number; // capture size if not 1525x784
  h?: number;
};

export type Card = {
  n: string;
  title: string;
  tool: string;
  stat: string; // "FILL" = placeholder until the shoot
  statLabel: string;
  source?: string;
};

export type Demo = {
  n: string;
  tool: string;
  tag: string; // label on the replay, e.g. REAL CLAUDE OUTPUT
  shots?: Shot[];
  callout?: { big: string; small: string };
  dash?: string; // recorded dashboard in public/dash, plays after the screenshots
  // what still needs Mike. If set with shots, the replay plays first and
  // a purple slate takes over for `youSeconds` at the end.
  you?: { steps: string[]; seconds: number };
};

export type Seg =
  | { kind: "take"; id: string; label: string; text: string; s: number }
  | { kind: "title"; id: string; s: number }
  | { kind: "card"; id: string; card: Card; s: number }
  | { kind: "demo"; id: string; demo: Demo; s: number }
  | { kind: "end"; id: string; s: number };

const CAPTURED = "REAL CLAUDE OUTPUT · NOV 13, 2026";

export const CARDS: Card[] = [
  { n: "01", title: "AI negotiates your phone bill", tool: "PINE AI", stat: "$40", statLabel: "VERIZON CREDIT ONE USER GOT BACK", source: "Reported by Pine AI · 19pine.ai" },
  { n: "02", title: "Grocery ad becomes a meal plan", tool: "CLAUDE", stat: "~$60", statLabel: "5 DINNERS FOR 4 · KING SOOPERS, NOV 11–17", source: "Claude, from this week's ad" },
  { n: "03", title: "Track flight prices for free", tool: "GOOGLE AI MODE", stat: "$0", statLabel: "TO HAVE IT WATCH THE FARE FOR YOU" },
  { n: "04", title: "AI fights your car insurance", tool: "PINE AI", stat: "FILL", statLabel: "OLD PREMIUM → NEW PREMIUM" },
  { n: "05", title: "AI haggles on Marketplace", tool: "CLAUDE", stat: "$650 → $575", statLabel: "\"FIRM\" PELOTON → CLAUDE'S FINAL OFFER" },
  { n: "06", title: "Warranty claims, handled", tool: "CLAUDE", stat: "$0", statLabel: "WASHER REPAIR, IF YOU FILE BEFORE MONTH 12" },
  { n: "07", title: "Give AI a weekly money hunt", tool: "MUSE + CLAUDE", stat: "$2.5B", statLabel: "UNCLAIMED MONEY COLORADO IS HOLDING", source: "Colorado Treasury, Jan 2026" },
  { n: "08", title: "A budget from one bank statement", tool: "CLAUDE", stat: "≈$5,000/yr", statLabel: "OVERSPENDING FOUND IN ONE SAMPLE MONTH", source: "Sample statement, not real account data" },
  { n: "09", title: "Bookkeeping in 3 minutes", tool: "CLAUDE", stat: "FILL", statLabel: "CHARGES SORTED · MINUTES" },
  { n: "10", title: "Find class action money you're owed", tool: "MUSE + GMAIL", stat: "FILL", statLabel: "OPEN CLAIMS FOUND" },
  { n: "11", title: "Unsubscribe from the junk", tool: "MUSE + GMAIL", stat: "FILL", statLabel: "LISTS REMOVED" },
  { n: "12", title: "A bill watcher that never forgets", tool: "MUSE", stat: "FILL", statLabel: "FIRST PRICE HIKE CAUGHT" },
  { n: "13", title: "AI calls your internet company", tool: "PINE AI", stat: "$115 → $66", statLabel: "ONE XFINITY CUSTOMER, ONE CALL", source: "Reported by Pine AI · 19pine.ai" },
];

const D: Record<string, Demo> = {
  "01": {
    n: "01", tool: "PINE AI", tag: "YOUR SCREEN RECORDING",
    you: { seconds: 18, steps: ["Upload your cell phone bill PDF", "Say: \"lower this bill, loyalty discounts only, keep my features\"", "Record the approval screen + progress updates", "Screenshot the result and the new monthly price"] },
  },
  "02": {
    n: "02", tool: "CLAUDE", tag: CAPTURED, dash: "groceries.mp4",
    shots: [
      { src: "02-working.jpg", hi: [{ x: 540, y: 78, w: 575, h: 122 }], zoom: { x: 400, y: 60, w: 760, h: 220 } },
      { src: "02-answer.jpg", hi: [{ x: 408, y: 272, w: 650, h: 42 }, { x: 408, y: 448, w: 650, h: 80 }], zoom: { x: 400, y: 260, w: 700, h: 300 } },
      { src: "02-list.jpg", hi: [{ x: 408, y: 245, w: 710, h: 452 }], zoom: { x: 400, y: 200, w: 720, h: 500 } },
    ],
    callout: { big: "~$60", small: "5 DINNERS · FAMILY OF 4" },
    you: { seconds: 6, steps: ["Optional: redo it with a photo of YOUR fridge + this week's ad"] },
  },
  "03": {
    n: "03", tool: "GOOGLE AI MODE", tag: "REAL GOOGLE AI MODE · NOV 13, 2026", dash: "flights.mp4",
    shots: [
      { src: "03-prompt.jpg", hi: [{ x: 432, y: 292, w: 714, h: 70 }], zoom: { x: 420, y: 200, w: 740, h: 230 } },
      { src: "03-answer.jpg", hi: [{ x: 226, y: 200, w: 625, h: 92 }, { x: 233, y: 500, w: 622, h: 52 }], blur: [{ x: 1452, y: 22, w: 52, h: 52 }], zoom: { x: 220, y: 190, w: 650, h: 380 } },
    ],
    callout: { big: "$492", small: "CHEAPEST NONSTOP · PER PERSON" },
    you: { seconds: 6, steps: ["Click \"Track prices\" on this search and film the confirmation", "Later: screenshot the first price-drop email"] },
  },
  "04": {
    n: "04", tool: "PINE AI", tag: "YOUR SCREEN RECORDING",
    you: { seconds: 18, steps: ["Blur policy number + VIN on your declarations page", "Upload to Pine: \"lowest premium, same coverage\"", "Record the approval screen and the result", "Write down before and after premium"] },
  },
  "05": {
    n: "05", tool: "CLAUDE", tag: CAPTURED, dash: "marketplace.mp4",
    shots: [
      { src: "05-prompt.jpg", w: 1478, h: 812, hi: [{ x: 444, y: 340, w: 592, h: 84 }], zoom: { x: 430, y: 260, w: 620, h: 240 } },
      { src: "05-answer.jpg", w: 1478, h: 812, hi: [{ x: 396, y: 276, w: 624, h: 60 }, { x: 396, y: 414, w: 632, h: 60 }], zoom: { x: 390, y: 240, w: 660, h: 300 } },
    ],
    you: { seconds: 5, steps: ["Send one of these on a real listing; record the chat (blur the seller)"] },
  },
  "06": {
    n: "06", tool: "CLAUDE", tag: CAPTURED, dash: "warranty.mp4",
    shots: [
      { src: "06-prompt.jpg", w: 1478, h: 812, hi: [{ x: 444, y: 332, w: 592, h: 98 }], zoom: { x: 430, y: 250, w: 620, h: 250 } },
      { src: "06-answer.jpg", w: 1478, h: 812, hi: [{ x: 404, y: 288, w: 672, h: 28 }, { x: 404, y: 440, w: 662, h: 76 }], zoom: { x: 398, y: 260, w: 690, h: 330 } },
    ],
    you: { seconds: 5, steps: ["Send it for a real appliance; film Samsung's reply when it lands"] },
  },
  "07": {
    n: "07", tool: "MUSE + CLAUDE", tag: CAPTURED, dash: "moneyhunt.mp4",
    shots: [
      { src: "07-prompt.jpg", hi: [{ x: 452, y: 326, w: 620, h: 100 }], zoom: { x: 440, y: 240, w: 650, h: 240 } },
      { src: "07-answer.jpg", hi: [{ x: 408, y: 274, w: 655, h: 72 }, { x: 412, y: 394, w: 630, h: 62 }], blur: [{ x: 822, y: 394, w: 214, h: 22 }, { x: 436, y: 414, w: 412, h: 22 }], zoom: { x: 400, y: 240, w: 700, h: 420 } },
    ],
    callout: { big: "$2.5B", small: "HELD BY COLORADO · CO TREASURY" },
    you: { seconds: 6, steps: ["Set the weekly Muse job", "Search your own name on GreatCOPayback.com, on camera, even if it's $0"] },
  },
  "08": {
    n: "08", tool: "CLAUDE", tag: "REAL CLAUDE OUTPUT · SAMPLE STATEMENT", dash: "budget.mp4",
    shots: [
      { src: "08-prompt.jpg", hi: [{ x: 452, y: 276, w: 620, h: 220 }], zoom: { x: 440, y: 260, w: 650, h: 250 } },
      { src: "08-answer.jpg", hi: [{ x: 408, y: 412, w: 440, h: 24 }, { x: 408, y: 450, w: 706, h: 240 }], zoom: { x: 400, y: 400, w: 720, h: 300 } },
      { src: "08-over.jpg", hi: [{ x: 408, y: 512, w: 650, h: 44 }], zoom: { x: 400, y: 210, w: 680, h: 360 } },
    ],
    callout: { big: "≈$5,000/yr", small: "FOUND IN ONE MONTH" },
    you: { seconds: 4, steps: ["Optional: redo with your real statement (blur account number)"] },
  },
  "09": {
    n: "09", tool: "CLAUDE", tag: "YOUR SCREEN RECORDING",
    you: { seconds: 18, steps: ["Upload a month of your business card statement", "Upload your chart of accounts", "\"Match each charge to a category. Total by category. Save as a skill.\"", "Stopwatch on screen, write down charges, total, minutes"] },
  },
  "10": {
    n: "10", tool: "CLAUDE → MUSE", tag: CAPTURED, dash: "classaction.mp4",
    shots: [
      { src: "10-prompt.jpg", hi: [{ x: 452, y: 336, w: 620, h: 82 }], zoom: { x: 440, y: 250, w: 650, h: 230 } },
      { src: "10-answer.jpg", hi: [{ x: 408, y: 312, w: 655, h: 56 }, { x: 408, y: 420, w: 708, h: 140 }], zoom: { x: 400, y: 280, w: 720, h: 420 } },
    ],
    callout: { big: "4 OPEN", small: "CONFIRMED ON OFFICIAL SITES" },
    you: { seconds: 6, steps: ["Muse + Gmail: scan 18 months incl. spam", "File one claim yourself, on camera"] },
  },
  "11": {
    n: "11", tool: "MUSE + GMAIL", tag: "YOUR SCREEN RECORDING",
    you: { seconds: 18, steps: ["Screenshot your unread count first", "\"Find lists I never open and unsubscribe me. Show me the list first.\"", "Approve the list on camera", "Show how many lists were removed"] },
  },
  "12": {
    n: "12", tool: "MUSE", tag: "YOUR SCREEN RECORDING",
    you: { seconds: 18, steps: ["List your recurring bills", "Set the job: \"Alert me if any bill goes up or is due in 3 days\"", "Film the setup", "Screenshot the first alert when it arrives"] },
  },
  "13": {
    n: "13", tool: "CLAUDE + PINE AI", tag: CAPTURED, dash: "internet.mp4",
    shots: [
      { src: "13-prompt.jpg", hi: [{ x: 452, y: 326, w: 620, h: 100 }], zoom: { x: 440, y: 240, w: 650, h: 240 } },
      { src: "13-answer.jpg", hi: [{ x: 408, y: 336, w: 630, h: 60 }, { x: 408, y: 530, w: 630, h: 60 }], zoom: { x: 400, y: 280, w: 680, h: 340 } },
    ],
    callout: { big: "THE SCRIPT", small: "OR LET PINE AI MAKE THE CALL" },
    you: { seconds: 7, steps: ["Pine AI: your bill + competitor price, decline upsells", "Show the new price and how long it's locked"] },
  },
};

const TAKES: Record<string, string> = {
  hook: "Every month I pay more for things I never agreed to pay this much for. So I let AI fight back. Thirteen hacks, real bills, real dollars. Prompts for every one are in the description.",
  "01": "Your phone company is counting on you never calling. So don't. Let AI make the call. Here's me trying it on mine.",
  "02": "Snap this week's grocery ad and a photo of your fridge. AI plans the week's dinners around what's on sale.",
  "03": "Planning a trip? Tell Google's AI Mode where and when, in plain English. It emails you when the price drops.",
  "04": "Insurance went up again? Upload the policy page and let the AI work the phones for you.",
  "05": "Facebook Marketplace. AI writes the offer and the counteroffer. I just hit send.",
  "06": "Washer quit a month before the warranty runs out? AI writes the claim that gets it fixed for free.",
  "07": "Give AI a standing job: every week, go find money with my name on it.",
  checklist: "Quick one. If you want to find the money in your own week, grab the free 15-Hour Checklist at ai-rest-of-us.app. Link below.",
  "08": "One bank statement in. A real budget out. No formulas.",
  "09": "This is my business credit card statement. Watch the clock.",
  "10": "Class action settlements hide in your inbox. AI digs them out, even from spam.",
  "11": "All that junk email? AI finds what I never open and unsubscribes me.",
  "12": "A bill watcher that never sleeps. Any bill goes up, I hear about it first.",
  "13": "Last one, and it's the big one. AI calls my internet company.",
  close: "Thirteen hacks. Pick one and try it this week. And since you stuck around, let me show you something I built.",
};

const take = (key: string, label: string, s = 10): Seg => ({ kind: "take", id: `take-${key}`, label, text: TAKES[key], s });

const block = (i: number): Seg[] => {
  const c = CARDS[i];
  return [
    { kind: "card", id: `card-${c.n}`, card: c, s: 7 },
    take(c.n, `TAKE ${c.n}`),
    { kind: "demo", id: `demo-${c.n}`, demo: D[c.n], s: 18 },
  ];
};

export const SEGMENTS: Seg[] = [
  take("hook", "TAKE · HOOK", 15),
  { kind: "title", id: "title", s: 5 },
  ...[0, 1, 2, 3, 4, 5, 6].flatMap(block),
  take("checklist", "TAKE · CHECKLIST"),
  ...[7, 8, 9, 10, 11, 12].flatMap(block),
  take("close", "TAKE · CLOSE"),
  {
    kind: "demo", id: "demo-income-stack", s: 30,
    demo: { n: "★", tool: "THE INCOME STACK", tag: "YOUR SCREEN RECORDING", you: { seconds: 30, steps: ["Open instack.app", "Walk through one real scenario", "Show-and-tell only. No pitch."] } },
  },
  { kind: "end", id: "end", s: 6 },
];

// Bonus clip, not in the 8:51 cut: drop it in if you film the Calendly segment.
export const BONUS: Demo = {
  n: "+", tool: "CLAUDE", tag: CAPTURED, dash: "calendly.mp4",
  shots: [
    { src: "bonus-prompt.jpg", hi: [{ x: 452, y: 326, w: 620, h: 100 }], zoom: { x: 440, y: 240, w: 650, h: 240 } },
    { src: "bonus-answer.jpg", hi: [{ x: 408, y: 272, w: 610, h: 42 }, { x: 408, y: 652, w: 706, h: 50 }], zoom: { x: 400, y: 260, w: 720, h: 440 } },
  ],
  callout: { big: "$192/yr", small: "IF A FREE GOOGLE PAGE IS ENOUGH" },
};

export const TOTAL_FRAMES = SEGMENTS.reduce((a, s) => a + sec(s.s), 0);
