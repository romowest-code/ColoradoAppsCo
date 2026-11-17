# 13 AI Hacks That Pay for Themselves: rough cut

- `rough-cut-8m51.mp4`: the whole video, 1920x1080 at 30 fps, for watching through.
- `13-ai-hacks-premiere.xml`: in Premiere, use File > Import and pick this file. It opens as a sequence:
  - **V1** has the finished graphics: the title, the 13 cards, the real Claude and Google replays, and the end card.
  - **V2** has the green slates. These are your on-camera lines, written as a teleprompter.
  - **V3** has the purple slates. These are the screen recordings you still need to make.
  - **V4** is empty. Put each take or recording there, directly above the slate it replaces.
- `clips/`: one file per segment, numbered in timeline order. `bonus-calendly.mp4` is not in the cut. Drop it in if you film the Calendly bit.

## Already done (real output, captured Nov 13, 2026)

| Demo | What's on screen | The number |
|---|---|---|
| 02 Groceries | Claude read this week's King Soopers ad (Nov 11–17) and planned 5 dinners | about $58–62 for a family of 4 |
| 03 Flights | Google AI Mode: Denver to NYC, Dec 20–27, 4 people | no nonstop under $400; cheapest is $492 a person |
| 05 Marketplace | Claude's opening offer and 2 counters on a "$650 firm" Peloton | $475, then $525, then $575 |
| 06 Warranty | Claude's Samsung washer claim (5C drain error, month 11 of 12) | $0 parts and labor if filed in time |
| 07 Money hunt | Claude's official-sites checklist | Colorado holds $2.5B (Treasury, 2026) |
| 08 Budget | Claude sorted a **sample** statement (30 charges) | about $400–475 a month, roughly $5,000 a year |
| 10 Class actions | Claude checked official settlement sites | 4 confirmed open, no receipt needed |
| 13 Internet | Claude's word-for-word Xfinity retention script | $115 vs. a $55 competitor (example numbers) |
| Bonus | Calendly vs. free Google booking page | $192 a year if Google's page is enough |

## Dashboards

Every replay now cuts from the real Claude screen (about 4 seconds) to an animated dashboard built from that answer: the Denver to NYC flight map, the Peloton price ladder, the washer warranty countdown, the Colorado money map, the budget donut, the class-action deadline timeline, the Xfinity script, and the Calendly comparison.

They're all in one artifact you can put in the video description: https://claude.ai/artifact/FQprw5qZygZfLU6dmvRHmJ (private until you share it from its Share menu). The source pages are in `dash/`, and `node record-dash.mjs all` re-records them.

## Still yours: the purple slates

01 Pine phone bill · 04 Pine car insurance · 09 your business card statement · 11 unsubscribe · 12 bill watcher · the Income Stack show-and-tell

Some replays end with a short purple tail. That's an optional reshoot with your own data: 02, 03 (click "Track prices"), 05, 06, 07 (search your name on camera), 08, 10 (file one claim), 13 (the Pine call).

## Before you publish

- **Card numbers:** five cards say "YOUR NUMBER GOES HERE" (04, 09, 10, 11, 12). After the shoot, edit `src/SaveMoneyData.ts` and change those `stat: "FILL"` values, or send me the numbers.
- **Not your numbers:** the stats on cards 01 ($40) and 13 ($115 → $66) are figures Pine AI reports for its own customers. Each card says so, and your take on 01 says "here's me trying it on mine."
- **Sample data:** demo 08 uses a made-up statement, and the replay is labeled SAMPLE STATEMENT.
- **Deadlines expire:** the class-action replay shows deadlines from Nov 16 to Nov 27, 2026. If the video goes up later, re-run the prompt that week.
- **Redacted:** your name and business names in the money-hunt answer.
