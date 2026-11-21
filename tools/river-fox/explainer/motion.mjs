// Builds the motion test: out/river-fox-motion-test.mp4 (animation + voice + sound effects).
// `node motion.mjs --stills` saves a strip of frames for checking instead.
import { createRequire } from "node:module";
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
const { chromium } = createRequire(import.meta.url)("playwright");

const FPS = 30;
const LINES = [ // [start in seconds, spoken line]
  [0.5, "Laura finishes a job, and snaps her photos and videos."],
  [5.5, "They all pile into one folder."],
  [9.8, "And that folder syncs straight to Google Drive."],
];
const STYLE = "A bright, friendly woman from the south of England, speaking British English. Light and playful, with a smile in her voice, at a natural lively pace.";
mkdirSync("out/motion", { recursive: true });
const ff = (...a) => execFileSync("ffmpeg", ["-y", "-v", "error", ...a]);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL("motion.html").href);
await page.waitForFunction("window.READY");
const duration = await page.evaluate("window.DURATION");

if (process.argv.includes("--stills")) {
  const times = [0.6, 1.5, 1.93, 2.3, 3.2, 4.7, 5.5, 6.3, 6.95, 7.9, 8.9, 9.7, 10.6, 11.6, 12.9, 14];
  for (const [i, t] of times.entries()) {
    await page.evaluate((x) => window.seek(x), t);
    await page.screenshot({ path: `out/motion/still-${String(i).padStart(2, "0")}.png` });
  }
  ff("-pattern_type", "glob", "-i", "out/motion/still-*.png", "-vf", "scale=640:-1,tile=4x4:padding=8:color=white", "-frames:v", "1", "out/motion/sheet.png");
  await browser.close();
  process.exit(0);
}

// Voice (kept between runs) and sound effects
const key = process.env.OPENAI_API_KEY || "sk-proxy";
const inputs = ["-i", "out/motion-sfx.wav"], filters = ["[0:a]volume=0.55[s]"], names = ["[s]"];
execFileSync("python3", ["motion-sound.py"], { stdio: "inherit" });
for (const [i, [at, say]] of LINES.entries()) {
  const raw = `out/motion/voice-${i}.wav`, clean = `out/motion/voice-${i}-trim.wav`;
  if (!existsSync(raw)) execFileSync("curl", ["-sS", "--fail-with-body", "https://api.openai.com/v1/audio/speech", "-H", `Authorization: Bearer ${key}`,
    "-H", "Content-Type: application/json", "-o", raw, "-d", JSON.stringify({ model: "gpt-4o-mini-tts", voice: process.env.VOICE || "sage", input: say, instructions: STYLE, response_format: "wav" })]);
  const trim = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05";
  ff("-i", raw, "-af", `${trim},areverse,${trim},areverse`, "-ar", "48000", clean);
  inputs.push("-i", clean);
  filters.push(`[${i + 1}:a]adelay=${Math.round(at * 1000)}[v${i}]`);
  names.push(`[v${i}]`);
}
ff(...inputs, "-filter_complex", `${filters.join(";")};${names.join("")}amix=inputs=${names.length}:normalize=0,alimiter=limit=0.95[a]`, "-map", "[a]", "-t", String(duration), "out/motion/audio.wav");

const enc = spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-", "-i", "out/motion/audio.wav",
  "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", "out/river-fox-motion-test.mp4"], { stdio: ["pipe", "inherit", "inherit"] });
for (let f = 0; f < Math.ceil(duration * FPS); f++) {
  await page.evaluate((x) => window.seek(x), f / FPS);
  enc.stdin.write(await page.screenshot({ type: "jpeg", quality: 96 }));
}
enc.stdin.end();
await new Promise((r) => enc.on("close", r));
await browser.close();
console.log("made out/river-fox-motion-test.mp4");
