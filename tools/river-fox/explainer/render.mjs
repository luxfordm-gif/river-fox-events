// Records the animation frame by frame (1920 x 1080, 30 a second) and joins it
// with out/narration.wav into out/river-fox-how-it-works.mp4.
// `node render.mjs --stills` saves one picture per scene instead, for checking.
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

const { chromium } = createRequire(import.meta.url)("playwright");

const FPS = 30, WORKERS = 4;
const stills = process.argv.includes("--stills");
mkdirSync("out/stills", { recursive: true });
const browser = await chromium.launch();
const open = async () => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL("index.html").href);
  await page.waitForFunction("window.READY");
  return page;
};

if (stills) {
  const page = await open();
  const starts = await page.evaluate("[window.STARTS, window.DURATION]");
  for (const [i, s] of starts[0].entries()) {
    const end = (starts[0][i + 1] ?? starts[1]) - 0.4;
    await page.evaluate((t) => window.seek(t), end);
    await page.screenshot({ path: `out/stills/${String(i).padStart(2, "0")}.jpg`, quality: 80 });
    await page.evaluate((t) => window.seek(t), s + (end - s) * 0.45);
    await page.screenshot({ path: `out/stills/${String(i).padStart(2, "0")}-mid.jpg`, quality: 80 });
  }
  await browser.close();
  process.exit(0);
}

const pages = await Promise.all(Array.from({ length: WORKERS }, open));
const total = Math.ceil((await pages[0].evaluate("window.DURATION")) * FPS);
const ff = spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
  "-i", "out/narration.wav", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", "out/river-fox-how-it-works.mp4"], { stdio: ["pipe", "inherit", "inherit"] });

// Each worker takes every fourth frame; frames are written to ffmpeg in order.
const done = new Map();
let next = 0;
const flush = () => { while (done.has(next)) { ff.stdin.write(done.get(next)); done.delete(next); next++; } };
await Promise.all(pages.map(async (page, w) => {
  for (let f = w; f < total; f += WORKERS) {
    while (f - next > 120) await new Promise((r) => setTimeout(r, 20));
    await page.evaluate((t) => window.seek(t), f / FPS);
    done.set(f, await page.screenshot({ type: "jpeg", quality: 96 }));
    flush();
    if (f % 300 === 0) console.log(`frame ${f} / ${total}`);
  }
}));
flush();
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close();
console.log("made out/river-fox-how-it-works.mp4");
