#!/usr/bin/env node
/**
 * Makes the gallery-sized copies of every photo listed in src/data/gallery.ts.
 *
 * The /our-work/ page shows ~45 photos, so it never loads the full-size
 * originals. For each `source` in the data file this writes up to three
 * WebP copies into src/assets/gallery/, named after the original with the
 * width on the end (same pattern as the Christmas page's -420/-640/-838
 * files):
 *
 *   src/assets/gallery/<original-name>-400.webp
 *   src/assets/gallery/<original-name>-700.webp
 *   src/assets/gallery/<original-name>-1000.webp
 *
 * A photo narrower than a target width is never upscaled: its largest copy
 * is written at its own width instead. Existing copies are left alone, so
 * the script is safe to re-run after adding new entries.
 *
 * Usage (local only - needs macOS `sips` and `cwebp`):
 *   node scripts/gallery-images.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS = path.join(ROOT, "src/assets");
const OUT = path.join(ASSETS, "gallery");
const WIDTHS = [400, 700, 1000];
const QUALITY = "78";

const data = fs.readFileSync(path.join(ROOT, "src/data/gallery.ts"), "utf8");
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
  manifest[base] = { width: own.width, height: own.height, widths };
  for (const w of widths) {
    const out = path.join(OUT, `${base}-${w}.webp`);
    if (fs.existsSync(out)) continue;
    execFileSync("cwebp", ["-quiet", "-q", QUALITY, "-m", "6", "-resize", String(w), "0", file, "-o", out]);
    made++;
    console.log(`  made gallery/${base}-${w}.webp`);
  }
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Gallery images: ${sources.length} photos, ${made} new copies.`);
