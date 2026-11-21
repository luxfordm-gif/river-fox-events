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
const VOICE = process.env.VOICE || "shimmer" /* voice B, chosen by Matt 2026-11-21 */;
const STYLE = "An adult British woman from the south of England talking to another adult, a colleague. Calm, natural and matter-of-fact, at a normal conversational pace. Understated and dry. Not upbeat, not sing-song, no exaggerated emphasis, never patronising.";
const TEMPO = 1.08; // speeds the voice up a little without changing its pitch
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
// ElevenLabs by default (George, a British male storyteller, Matt 2026-11-21); TTS=openai for the old voice.
const USE_EL = process.env.TTS !== "openai";
const EL_VOICE = process.env.EL_VOICE || "JBFqnCBsd6RMkjVDRZzb"; // George
const EL_SETTINGS = { stability: 0.45, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true };
if (!existsSync("out/film/timeline.js")) writeFileSync("out/film/timeline.js", "");
let page = await open();
const timeline = {}, clips = {};
for (const { id, text } of await page.evaluate("window.LINES")) {
  const tag = USE_EL ? "el" + EL_VOICE + JSON.stringify(EL_SETTINGS) : VOICE + STYLE + TEMPO;
  const hash = createHash("sha1").update(tag + text).digest("hex").slice(0, 8);
  const raw = `out/film/voice/${id}-${hash}.${USE_EL ? "mp3" : "wav"}`, clean = `out/film/voice/${id}-${hash}-trim.wav`;
  if (!existsSync(raw)) {
    if (USE_EL) execFileSync("curl", ["-sS", "--fail-with-body", `https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE}?output_format=mp3_44100_128`, "-H", "xi-api-key: proxy-injected",
      "-H", "Content-Type: application/json", "-o", raw, "-d", JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: EL_SETTINGS })]);
    else execFileSync("curl", ["-sS", "--fail-with-body", "https://api.openai.com/v1/audio/speech", "-H", `Authorization: Bearer ${key}`,
      "-H", "Content-Type: application/json", "-o", raw, "-d", JSON.stringify({ model: "gpt-4o-mini-tts", voice: VOICE, input: text, instructions: STYLE, response_format: "wav" })]);
  }
  const trim = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05";
  if (!existsSync(clean)) ff("-i", raw, "-af", `${trim},areverse,${trim},areverse${USE_EL ? "" : `,atempo=${TEMPO}`}`, "-ar", "48000", "-ac", "1", clean);
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

// 2. Sound: the voice, a few real sound effects and a quiet music bed (all from ElevenLabs, in sounds/).
// Matt, 2026-11-21: real sounds only, no whooshes. Set SFX=0 for voice only.
const info = await page.evaluate("window.SCENE_INFO");
const at = (id, d) => { const s = info.find((x) => x.id === id); return s.start + Math.max(0, d * s.k - .15); };
const SOUNDS = process.env.SFX === "0" ? [] : [
  ...[1.9, 2.8, 3.6].map((t) => ["shutter", t, 0.9]),           // the three camera flashes
  ["chime", 12.7, 0.5],                                          // the Drive sync tick
  ["typing", at("skill", 1.3), 0.7],                             // Matt types the command
  ...[1.1, 3.1, 4.2].map((d) => ["ping", at("ask", d), 0.5]),    // the chat messages
  ["chime", at("end", .3), 0.55],                                // the logo
];
const inputs = [], filters = [], names = [];
const add = (file, delay, gain) => { const i = inputs.length / 2; inputs.push("-i", file); filters.push(`[${i}:a]aresample=48000,aformat=channel_layouts=mono,volume=${gain},adelay=${Math.round(delay * 1000)}[a${i}]`); names.push(`[a${i}]`); };
lines.forEach(({ id, at: t }) => add(clips[id], t, 1));
SOUNDS.forEach(([n, t, g]) => add(`sounds/${n}.mp3`, t, g));
if (process.env.SFX !== "0" && existsSync("sounds/music-loop.mp3")) {
  const i = inputs.length / 2;
  inputs.push("-stream_loop", "-1", "-i", "sounds/music-loop.mp3");
  filters.push(`[${i}:a]aresample=48000,aformat=channel_layouts=mono,atrim=0:${duration},volume=0.13,afade=t=in:d=1.5,afade=t=out:st=${duration - 3}:d=3[m]`);
  names.push("[m]");
}
ff(...inputs, "-filter_complex", `${filters.join(";")};${names.join("")}amix=inputs=${names.length}:normalize=0,alimiter=limit=0.95,apad[a]`, "-map", "[a]", "-t", String(duration), "out/film/audio.wav");

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
