// Builds a Final Cut Pro 7 XML (xmeml v4) that Premiere imports via File > Import.
//   V1  finished graphics: title, 13 cards, Claude/Google replays, end card
//   V2  GREEN slates: your on-camera lines
//   V3  PURPLE slates: screen recordings still to film
//   V4  empty: drop your footage here, above the slate it replaces
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const rows = JSON.parse(readFileSync(path.join(root, "out/clips.json"), "utf8"));
const { SEGMENTS } = await import(path.join(root, "out/segments.mjs"));
const FPS = 30;
const total = rows.reduce((a, r) => a + r.frames, 0);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rate = `<rate><timebase>${FPS}</timebase><ntsc>FALSE</ntsc></rate>`;

const track = (r, i) => {
  const s = SEGMENTS[i];
  if (s.kind === "take") return 2;
  if (s.kind === "demo" && !s.demo.shots?.length) return 3;
  return 1;
};

const clip = (r, i) => {
  const url = "file://" + encodeURI(path.join(root, "out/clips", r.name));
  return `
        <clipitem id="clip-${i}">
          <name>${esc(r.name)}</name>
          <duration>${r.frames}</duration>
          ${rate}
          <start>${r.start}</start>
          <end>${r.start + r.frames}</end>
          <in>0</in>
          <out>${r.frames}</out>
          <file id="file-${i}">
            <name>${esc(r.name)}</name>
            <pathurl>${url}</pathurl>
            ${rate}
            <duration>${r.frames}</duration>
            <media><video><samplecharacteristics>${rate}<width>1920</width><height>1080</height></samplecharacteristics></video></media>
          </file>
        </clipitem>`;
};

const tracks = [1, 2, 3].map(
  (t) => `
      <track>${rows
        .map((r, i) => [r, i])
        .filter(([r, i]) => track(r, i) === t)
        .map(([r, i]) => clip(r, i))
        .join("")}
      </track>`,
);
tracks.push(`
      <track></track>`);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4">
  <sequence id="save-money">
    <name>13 AI Hacks - rough cut</name>
    <duration>${total}</duration>
    ${rate}
    <media>
      <video>
        <format><samplecharacteristics>${rate}<width>1920</width><height>1080</height><pixelaspectratio>square</pixelaspectratio></samplecharacteristics></format>${tracks.join("")}
      </video>
    </media>
  </sequence>
</xmeml>
`;
writeFileSync(path.join(root, "out/13-ai-hacks-premiere.xml"), xml);
const count = [1, 2, 3].map((t) => rows.filter((r, i) => track(r, i) === t).length);
console.log(`wrote out/13-ai-hacks-premiere.xml · V1 ${count[0]} · V2 ${count[1]} · V3 ${count[2]} · ${total} frames`);
