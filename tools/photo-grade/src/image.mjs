// Image prep, post-processing and the "does it still look like the photo" metrics (ported from the Invicta tool).
import sharp from 'sharp';
import { config } from './config.mjs';

/** API output size: the photo's own aspect ratio, both sides multiples of 16, inside the API's pixel limits. */
export function apiSize(w, h) {
  let s = 1;
  if (w * h > config.maxPixels) s = Math.sqrt(config.maxPixels / (w * h));
  if (w * h < config.minPixels) s = Math.sqrt(config.minPixels / (w * h));
  let W = Math.max(16, Math.round((w * s) / 16) * 16), H = Math.max(16, Math.round((h * s) / 16) * 16);
  while (W * H > config.maxPixels) { W -= 16; H = Math.round((W * h) / w / 16) * 16; }
  while (W * H < config.minPixels) { W += 16; H = Math.round((W * h) / w / 16) * 16; }
  return { W, H, size: `${W}x${H}` };
}

export async function prepareInput(buffer) {
  const img = sharp(buffer).rotate();
  const { width, height } = await img.metadata();
  const png = await img.clone().toColourspace('srgb').png({ compressionLevel: 6 }).toBuffer();
  return { png, width, height };
}

/** Back to the exact original pixel size (so every crop / object-position on the site stays put), as WebP. */
export async function finish(png, width, height) {
  return sharp(png).resize({ width, height, fit: 'cover', position: 'centre' })
    .webp({ quality: config.webpQuality, effort: 6, smartSubsample: true }).toBuffer();
}

export async function finishPng(png, width, height) {
  return sharp(png).resize({ width, height, fit: 'cover', position: 'centre' }).png({ compressionLevel: 6 }).toBuffer();
}

/** Side-by-side before | after JPEG for review. */
export async function sideBySide(before, after, label) {
  const H = 900;
  const a = await sharp(before).resize({ height: H }).toBuffer({ resolveWithObject: true });
  const b = await sharp(after).resize({ height: H }).toBuffer({ resolveWithObject: true });
  const gap = 12, W = a.info.width + b.info.width + gap, bar = 40;
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const svg = Buffer.from(`<svg width="${W}" height="${bar}"><rect width="100%" height="100%" fill="#111"/>
    <text x="10" y="26" font-family="Helvetica" font-size="18" fill="#fff">BEFORE</text>
    <text x="${a.info.width + gap + 10}" y="26" font-family="Helvetica" font-size="18" fill="#fff">AFTER  ·  ${esc(label)}</text></svg>`);
  return sharp({ create: { width: W, height: H + bar, channels: 3, background: '#111' } })
    .composite([{ input: svg, top: 0, left: 0 }, { input: a.data, top: bar, left: 0 }, { input: b.data, top: bar, left: a.info.width + gap }])
    .jpeg({ quality: 85 }).toBuffer();
}

const MW = 600, MH = 800;
async function stats(buf) {
  const { data, info } = await sharp(buf).resize({ width: MW, height: MH, fit: 'fill' }).removeAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
  const n = info.width * info.height, w = info.width, h = info.height;
  let satSum = 0, lumSum = 0, lumSq = 0;
  const lum = new Float32Array(n), hues = new Float32Array(n), sats = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const sat = mx ? (mx - mn) / mx : 0; satSum += sat; sats[i] = mx - mn > 20 ? sat : 0;
    // per-pixel hue, for "did the balloon colours shift" (only meaningful where the colour is strong)
    if (mx - mn > 20) hues[i] = (mx === r ? (g - b) / (mx - mn) : mx === g ? 2 + (b - r) / (mx - mn) : 4 + (r - g) / (mx - mn)) * 60;
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b; lum[i] = l; lumSum += l; lumSq += l * l;
  }
  const mean = lumSum / n, std = Math.sqrt(lumSq / n - mean * mean);
  let edge = 0, flatHF = 0, flatN = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x; let s = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += lum[i + dy * w + dx];
    const d = Math.abs(lum[i] - s / 9);
    const gx = Math.abs(lum[i + 1] - lum[i - 1]), gy = Math.abs(lum[i + w] - lum[i - w]);
    if (gx + gy < 6) { flatHF += d; flatN++; } else edge += d;
  }
  return { mean, std, sat: satSum / n, edgeHF: edge / n, flatHF: flatN ? flatHF / flatN : 0, hues, sats };
}
function corr(a, b) {
  let ma = 0, mb = 0; for (let i = 0; i < a.length; i++) { ma += a[i]; mb += b[i]; } ma /= a.length; mb /= b.length;
  let num = 0, da = 0, db = 0; for (let i = 0; i < a.length; i++) { num += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; }
  return num / Math.sqrt(da * db || 1);
}
async function thumb(buf) { return sharp(buf).resize(48, 64, { fit: 'fill' }).greyscale().raw().toBuffer(); }

/**
 * How far the edit moved from the photo. Sharper is wanted here, so sharpening only flags when extreme.
 * Flags: drift (composition changed), hue (palette shifted), sat (colour boosted), waxy (texture smoothed away), oversharp.
 */
export async function compareMetrics(before, after) {
  const [a, b] = await Promise.all([stats(before), stats(after)]);
  const [ta, tb] = await Promise.all([thumb(before), thumb(after)]);
  // median hue change over pixels that are strongly coloured in both (balloons, signage, florals)
  const diffs = [];
  for (let i = 0; i < a.hues.length; i++) {
    if (a.sats[i] < 0.3 || b.sats[i] < 0.3) continue;
    let d = Math.abs(a.hues[i] - b.hues[i]) % 360; if (d > 180) d = 360 - d; diffs.push(d);
  }
  diffs.sort((x, y) => x - y);
  const dh = diffs.length > 500 ? diffs[Math.floor(diffs.length / 2)] : 0;
  const m = {
    brightness: +((b.mean - a.mean) / 255).toFixed(3),
    contrast: +(b.std / a.std).toFixed(3),
    saturation: +(b.sat / a.sat).toFixed(3),
    hueShiftDeg: +dh.toFixed(1),
    sharpen: +(b.edgeHF / a.edgeHF).toFixed(3),
    smooth: +(b.flatHF / (a.flatHF || 1)).toFixed(3),
    similarity: +corr(ta, tb).toFixed(3),
  };
  const flags = [];
  if (m.similarity < 0.9) flags.push('scene drifted');
  if (m.hueShiftDeg > 6) flags.push('palette shifted');
  if (m.saturation > 1.2) flags.push('colour boosted');
  if (m.contrast > 1.3) flags.push('contrast heavy');
  if (m.smooth < 0.45) flags.push('waxy / texture lost');
  if (m.sharpen > 1.8) flags.push('over-sharpened');
  return { ...m, flags };
}
