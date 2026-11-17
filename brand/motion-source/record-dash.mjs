// Records each dashboard page frame by frame (deterministic, via window.__seek) into an mp4.
// usage: node record-dash.mjs flights [seconds]   or   node record-dash.mjs all
import puppeteer from "puppeteer-core";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const CHROME = path.join(root, "node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell");
const PAGES = { flights: 8.5, groceries: 8.5, marketplace: 8.5, warranty: 8.5, moneyhunt: 8.5, budget: 8.5, classaction: 8.5, internet: 8.5, calendly: 8.5 };
const FPS = 30;
const outDir = path.join(root, "public/dash");
mkdirSync(outDir, { recursive: true });

const which = process.argv[2] === "all" || !process.argv[2] ? Object.keys(PAGES) : [process.argv[2]];
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--allow-file-access-from-files", "--hide-scrollbars"] });

for (const name of which) {
  const secs = Number(process.argv[3]) || PAGES[name];
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1.2 });
  await page.evaluateOnNewDocument(() => { window.__REC = true; });
  page.on("pageerror", (e) => console.error(name, "PAGE ERROR", e.message));
  await page.goto("file://" + path.join(root, "dash", name + ".html"), { waitUntil: "networkidle0" });
  await page.waitForFunction("window.__ready === true", { timeout: 20000 });

  const file = path.join(outDir, name + ".mp4");
  const ff = spawn("ffmpeg", ["-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
    "-c:v", "libx264", "-crf", "16", "-pix_fmt", "yuv420p", "-vf", "scale=1920:1080", file]);
  const frames = Math.round(secs * FPS);
  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.__seek(t), f / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await page.close();
  console.log("recorded", name, frames, "frames");
}
await browser.close();
