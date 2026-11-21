// Builds the explainer video: out/river-fox-how-it-works.mp4
// (animation from film.html + voice-over + sound effects).
//   node film.mjs            the full video
//   node film.mjs --stills   two pictures of every scene, for checking
import { createRequire } from "node:module";
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
const { chromium } = createRequire(import.meta.url)("playwright");

const FPS = 30, WORKERS = 4;
const VOICE = process.env.VOICE || "sage";
const STYLE = "A British woman from the south of England talking to a colleague, both adults. Plain, relaxed and fairly quick, the way people really talk. Flat, even delivery: no performing, no sing-song, no emphasis on words, no smile in the voice.";
const TEMPO = 1.1; // speeds the voice up a little without changing its pitch
const SFX = process.env.SFX === "1"; // sound effects are off unless asked for (Matt, 2026-11-21: the generated ones sounded wrong)
const key = process.env.OPENAI_API_KEY || "sk-proxy";
mkdirSync("out/film/voice", { recursive: true });
const ff = (...a) => execFileSync("ffmpeg", ["-y", "-v", "error", ...a]);
const secs = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

const browser = await chromium.launch();
const open = async () => {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL("film.html").href);
  await page.waitForFunction("window.READY");
  return page;
};

// 1. Voice: one clip per line, reused while its words stay the same.
if (!existsSync("out/film/timeline.js")) writeFileSync("out/film/timeline.js", "");
let page = await open();
const timeline = {}, clips = {};
for (const { id, text } of await page.evaluate("window.LINES")) {
  const hash = createHash("sha1").update(VOICE + STYLE + TEMPO + text).digest("hex").slice(0, 8);
  const raw = `out/film/voice/${id}-${hash}.wav`, clean = `out/film/voice/${id}-${hash}-trim.wav`;
  if (!existsSync(raw)) execFileSync("curl", ["-sS", "--fail-with-body", "https://api.openai.com/v1/audio/speech", "-H", `Authorization: Bearer ${key}`,
    "-H", "Content-Type: application/json", "-o", raw, "-d", JSON.stringify({ model: "gpt-4o-mini-tts", voice: VOICE, input: text, instructions: STYLE, response_format: "wav" })]);
  const trim = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05";
  if (!existsSync(clean)) ff("-i", raw, "-af", `${trim},areverse,${trim},areverse,atempo=${TEMPO}`, "-ar", "48000", clean);
  timeline[id] = +secs(clean).toFixed(3);
  clips[id] = clean;
}
writeFileSync("out/film/timeline.js", `globalThis.TIMELINE = ${JSON.stringify(timeline)};\n`);
await page.close();
page = await open(); // again, now the scenes know how long each line is
const { duration, lines, events, starts } = await page.evaluate("({ duration: window.DURATION, lines: window.LINES, events: window.EVENTS, starts: window.STARTS })");
console.log(`video length ${duration.toFixed(1)}s`);

if (process.argv.includes("--stills")) {
  mkdirSync("out/film/stills", { recursive: true });
  let n = 0;
  for (const [s, d] of starts) for (const k of d > 12 ? [.1, .16, .3, .42, .52, .62, .75, .92] : [.5, .93]) {
    await page.evaluate((x) => window.seek(x), s + d * k);
    await page.screenshot({ path: `out/film/stills/${String(n++).padStart(2, "0")}.png` });
  }
  ff("-pattern_type", "glob", "-i", "out/film/stills/*.png", "-vf", `scale=640:-1,tile=4x${Math.ceil(n / 4)}:padding=8:color=white`, "-frames:v", "1", "out/film/sheet.png");
  await browser.close();
  process.exit(0);
}

// 2. Sound effects, then one audio track: voice over the effects.
writeFileSync("out/film/events.json", JSON.stringify(events));
if (SFX) execFileSync("python3", ["film-sound.py", String(duration)], { stdio: "inherit" });
else ff("-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono", "-t", "1", "out/film/sfx.wav");
const inputs = ["-i", "out/film/sfx.wav"], filters = ["[0:a]volume=0.5[s]"], names = ["[s]"];
lines.forEach(({ id, at }, i) => { inputs.push("-i", clips[id]); filters.push(`[${i + 1}:a]adelay=${Math.round(at * 1000)}[v${i}]`); names.push(`[v${i}]`); });
ff(...inputs, "-filter_complex", `${filters.join(";")};${names.join("")}amix=inputs=${names.length}:normalize=0,alimiter=limit=0.95[a]`, "-map", "[a]", "-t", String(duration), "out/film/audio.wav");

// 3. Record every frame (four browser pages share the work) and join with the audio.
const pages = [page, ...(await Promise.all(Array.from({ length: WORKERS - 1 }, open)))];
const total = Math.ceil(duration * FPS);
const enc = spawn("ffmpeg", ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-", "-i", "out/film/audio.wav",
  "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", "out/river-fox-how-it-works.mp4"], { stdio: ["pipe", "inherit", "inherit"] });
const done = new Map();
let next = 0;
const flush = () => { while (done.has(next)) { enc.stdin.write(done.get(next)); done.delete(next); next++; } };
await Promise.all(pages.map(async (p, w) => {
  for (let f = w; f < total; f += WORKERS) {
    while (f - next > 120) await new Promise((r) => setTimeout(r, 20));
    await p.evaluate((x) => window.seek(x), f / FPS);
    done.set(f, await p.screenshot({ type: "jpeg", quality: 96 }));
    flush();
  }
}));
flush();
enc.stdin.end();
await new Promise((r) => enc.on("close", r));
await browser.close();
console.log("made out/river-fox-how-it-works.mp4");
