#!/usr/bin/env node
/**
 * Makes the gallery-sized copies of every photo listed in src/data/gallery.ts.
 *
 * The /our-work/ page shows ~80 photos, so it never loads the full-size
 * originals. For each `source` in the data file this writes up to four
 * WebP copies into src/assets/gallery/, named after the original with the
 * width on the end (same pattern as the Christmas page's -420/-640/-838
 * files):
 *
 *   src/assets/gallery/<original-name>-400.webp   (grid)
 *   src/assets/gallery/<original-name>-700.webp   (grid)
 *   src/assets/gallery/<original-name>-1000.webp  (grid)
 *   src/assets/gallery/<original-name>-1400.webp  (full-screen viewer)
 *
 * A photo narrower than a target width is never upscaled: its largest copy
 * is written at its own width instead. Existing copies are left alone, so
 * the script is safe to re-run after adding new entries.
 *
 * House colour grade: run scripts/grade-photos.py first, then point this
 * script at its output with --graded=<dir>. Copies are made from the graded
 * version and the manifest records `graded: true`; the gallery test fails
 * if any photo on the page hasn't been graded.
 *
 * Usage (local only - needs macOS `sips` and `cwebp`, plus Python Pillow
 * for the grade):
 *   python3 scripts/grade-photos.py /tmp/graded src/assets/<new photo>.webp ...
 *   node scripts/gallery-images.mjs --graded=/tmp/graded
 * Add --force to remake every copy (after changing the grade).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "src/assets");
const OUT = path.join(ASSETS, "gallery");
// 400-1000 for the grid; 1400 for the full-screen viewer.
const WIDTHS = [400, 700, 1000, 1400];
// Larger copies compress a little harder to stay near the 200 KB gallery target.
const QUALITY = { 400: "78", 700: "78", 1000: "72", 1400: "70" };
const qualityFor = (w) => QUALITY[w] || (w > 1000 ? "70" : w > 700 ? "72" : "78");
// --force remakes every copy (use after re-grading the source photos).
const FORCE = process.argv.includes("--force");
const GRADED = (process.argv.find((a) => a.startsWith("--graded=")) || "").slice("--graded=".length);
const previous = fs.existsSync(path.join(OUT, "manifest.json"))
  ? JSON.parse(fs.readFileSync(path.join(OUT, "manifest.json"), "utf8"))
  : {};

const data = fs.readFileSync(path.join(ROOT, "src/data/gallery.ts"), "utf8");

// "Seen elsewhere": a photo whose filename appears in any other source file
// is already on another page of the site. The gallery lists unseen photos
// first so it shows visitors something new.
const otherSources = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (p !== ASSETS) walk(p); }
    else if (/\.(tsx?|mjs|css)$/.test(e.name) && !p.endsWith(path.join("data", "gallery.ts"))) {
      otherSources.push(fs.readFileSync(p, "utf8"));
    }
  }
};
walk(path.join(ROOT, "src"));
const usedElsewhere = (file) => otherSources.some((s) => s.includes(path.basename(file)));
const sources = [...new Set([...data.matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1]))];
if (!sources.length) throw new Error("No `source:` entries found in src/data/gallery.ts");

fs.mkdirSync(OUT, { recursive: true });

const sizeOf = (file) => {
  const out = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", file], { encoding: "utf8" });
  return {
    width: Number(out.match(/pixelWidth:\s*(\d+)/)[1]),
    height: Number(out.match(/pixelHeight:\s*(\d+)/)[1]),
  };
};

// manifest.json records each photo's shape and which copies exist, so the
// page can reserve the right space before an image loads.
const MANIFEST = path.join(OUT, "manifest.json");
const manifest = {};

let made = 0;
for (const src of sources) {
  const file = path.join(ASSETS, src);
  if (!fs.existsSync(file)) throw new Error(`Missing source image: src/assets/${src}`);
  const base = path.basename(src, path.extname(src));
  const own = sizeOf(file);
  const widths = [...new Set(WIDTHS.map((w) => Math.min(w, own.width)))];
  const gradedFile = GRADED ? path.join(GRADED, `${base}.png`) : "";
  const input = gradedFile && fs.existsSync(gradedFile) ? gradedFile : file;
  let graded = !!previous[base]?.graded;
  let remade = false;
  for (const w of widths) {
    const out = path.join(OUT, `${base}-${w}.webp`);
    if (fs.existsSync(out) && !FORCE && !(input !== file && !graded)) continue;
    execFileSync("cwebp", ["-quiet", "-q", qualityFor(w), "-m", "6", "-resize", String(w), "0", input, "-o", out]);
    made++;
    remade = true;
    console.log(`  made gallery/${base}-${w}.webp`);
  }
  if (remade) graded = input !== file;
  manifest[base] = { width: own.width, height: own.height, widths, seen: usedElsewhere(src), graded };
}
// Remove copies of photos no longer in the gallery.
const keep = new Set(Object.entries(manifest).flatMap(([b, m]) => m.widths.map((w) => `${b}-${w}.webp`)));
for (const f of fs.readdirSync(OUT)) {
  if (f.endsWith(".webp") && !keep.has(f)) { fs.unlinkSync(path.join(OUT, f)); console.log(`  removed gallery/${f}`); }
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Gallery images: ${sources.length} photos, ${made} new copies.`);
