// Makes the voice-over: one clip per scene from OpenAI's speech model, trimmed,
// then joined into out/narration.wav. Writes out/timeline.js (seconds of voice
// per scene) so the animation keeps time with the voice.
// A clip is reused if its words haven't changed, so the voice stays the same.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import "./scenes.js";

const LEAD = 0.45, TAIL = 0.75; // keep in step with index.html
const VOICE = process.env.VOICE || "sage";
const STYLE = "A warm, calm woman from the south of England, speaking British English. Unhurried and friendly, like explaining something to a friend. Natural, never salesy.";
const key = process.env.OPENAI_API_KEY || "sk-proxy";
mkdirSync("out/voice", { recursive: true });

const ff = (...a) => execFileSync("ffmpeg", ["-y", "-v", "error", ...a]);
const secs = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

const timeline = [], parts = [];
for (const s of SCENES) {
  const hash = createHash("sha1").update(VOICE + STYLE + s.say).digest("hex").slice(0, 8);
  const raw = `out/voice/${s.id}-${hash}.wav`, trimmed = `out/voice/${s.id}-${hash}-trim.wav`, padded = `out/voice/${s.id}-pad.wav`;
  if (!existsSync(raw)) {
    // curl, not fetch: it follows the machine's proxy settings.
    execFileSync("curl", ["-sS", "--fail-with-body", "https://api.openai.com/v1/audio/speech", "-H", `Authorization: Bearer ${key}`,
      "-H", "Content-Type: application/json", "-o", raw, "-d",
      JSON.stringify({ model: "gpt-4o-mini-tts", voice: VOICE, input: s.say, instructions: STYLE, response_format: "wav" })]);
  }
  // The wav header from a stream has no length, so rewrite it, then trim silence from both ends.
  const trim = "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05";
  ff("-i", raw, "-af", `${trim},areverse,${trim},areverse`, "-ar", "48000", trimmed);
  const voice = secs(trimmed);
  const dur = LEAD + voice + TAIL;
  ff("-i", trimmed, "-af", `adelay=${Math.round(LEAD * 1000)},apad`, "-t", dur.toFixed(3), padded);
  timeline.push(+voice.toFixed(3));
  parts.push(padded);
  console.log(s.id.padEnd(10), voice.toFixed(2) + "s");
}
writeFileSync("out/timeline.js", `globalThis.TIMELINE = ${JSON.stringify(timeline)};\n`);
writeFileSync("out/voice/list.txt", parts.map((p) => `file '${p.replace("out/voice/", "")}'`).join("\n"));
ff("-f", "concat", "-safe", "0", "-i", "out/voice/list.txt", "-c", "copy", "out/narration.wav");
console.log("total", secs("out/narration.wav").toFixed(1) + "s");
