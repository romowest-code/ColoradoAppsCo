// Renders the full rough cut + bonus clip, then slices one clip per segment for Premiere.
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out");
mkdirSync(path.join(out, "clips"), { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });

for (const [id, file] of [["SaveMoneyCut", "rough-cut-8m51.mp4"], ["SaveMoneyBonusCalendly", "clips/bonus-calendly.mp4"]]) {
  const composition = await selectComposition({ serveUrl, id });
  let last = -1;
  await renderMedia({
    composition, serveUrl, codec: "h264", crf: 18,
    outputLocation: path.join(out, file),
    onProgress: ({ progress }) => { const p = Math.floor(progress * 20); if (p !== last) { last = p; console.log(`${id} ${p * 5}%`); } },
  });
}

// segment table comes from the same data the video uses
const { SEGMENTS, FPS } = await import(pathToData());
function pathToData() { return path.join(root, "out/segments.mjs"); }
let at = 0;
const rows = [];
for (const [i, s] of SEGMENTS.entries()) {
  const frames = Math.round(s.s * FPS);
  const name = `${String(i + 1).padStart(2, "0")}-${s.id}.mp4`;
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", path.join(out, "rough-cut-8m51.mp4"),
    "-vf", `trim=start_frame=${at}:end_frame=${at + frames},setpts=PTS-STARTPTS`,
    "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-r", String(FPS), "-an", path.join(out, "clips", name)]);
  rows.push({ name, kind: s.kind, start: at, frames, label: s.label ?? s.id });
  at += frames;
}
writeFileSync(path.join(out, "clips.json"), JSON.stringify(rows, null, 2));
console.log("DONE", rows.length, "clips,", at, "frames");
