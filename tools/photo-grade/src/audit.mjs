// Score every photo on the site for the things that stop it looking editorial:
// dark or flat exposure, colour casts, softness, noise and low resolution.
// usage: node src/audit.mjs   (SOURCE_REF=origin/<branch> reads an unmerged branch)
// writes state/audit.json and prints the photos worst first.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { REPO, STATE, readSource } from './config.mjs';

const EXCLUDE = /(^|\/)(gallery|christmas\/video)\/|client-|business-cards|studio\.webp|collage|placeholder|logo/i;
const ref = process.env.SOURCE_REF;
const listing = ref
  ? execFileSync('git', ['ls-tree', '-r', '--name-only', ref, 'src/assets'], { cwd: REPO }).toString()
  : execFileSync('git', ['ls-files', 'src/assets'], { cwd: REPO }).toString();
const files = listing.split('\n').filter((f) => /\.(webp|jpe?g|png)$/i.test(f)).map((f) => f.replace(/^src\/assets\//, '')).filter((f) => !EXCLUDE.test(f));

const L = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
async function score(src) {
  const buf = readSource(src);
  const meta = await sharp(buf).metadata();
  // everything measured at the same 1000px long edge so photos compare fairly
  const { data, info } = await sharp(buf).rotate().resize({ width: 1000, height: 1000, fit: 'inside' }).removeAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, n = w * h;
  const lum = new Float32Array(n); let satSum = 0; const nr = [0, 0, 0]; let nn = 0;
  for (let i = 0; i < n; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const l = L(r, g, b) / 255; lum[i] = l;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b); const s = mx ? (mx - mn) / mx : 0; satSum += s;
    // near-neutral, mid-bright pixels (walls, floors, white boards) show the colour cast
    if (l > 0.3 && l < 0.92 && s < 0.18) { nr[0] += r; nr[1] += g; nr[2] += b; nn++; }
  }
  const sorted = Float32Array.from(lum).sort();
  const pct = (p) => sorted[Math.min(n - 1, Math.floor(p * n))];
  // sharpness: mean absolute Laplacian on edges; noise: the same on flat areas
  let lapEdge = 0, ne = 0, lapFlat = 0, nf = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    const lap = Math.abs(4 * lum[i] - lum[i - 1] - lum[i + 1] - lum[i - w] - lum[i + w]);
    const grad = Math.abs(lum[i + 1] - lum[i - 1]) + Math.abs(lum[i + w] - lum[i - w]);
    if (grad > 0.08) { lapEdge += lap; ne++; } else if (grad < 0.02) { lapFlat += lap; nf++; }
  }
  let castWarm = 0, castGreen = 0;
  if (nn > n * 0.03) {
    const [r, g, b] = nr.map((v) => v / nn), m = (r + g + b) / 3;
    castWarm = (r - b) / m;           // + warm/orange, - blue
    castGreen = (g - (r + b) / 2) / m; // + green, - magenta
  }
  return {
    src, width: meta.width, height: meta.height, mp: +((meta.width * meta.height) / 1e6).toFixed(2),
    median: +pct(0.5).toFixed(3), shadows: +pct(0.05).toFixed(3), highlights: +pct(0.99).toFixed(3),
    range: +(pct(0.99) - pct(0.01)).toFixed(3), sat: +(satSum / n).toFixed(3),
    castWarm: +castWarm.toFixed(3), castGreen: +castGreen.toFixed(3), neutralShare: +(nn / n).toFixed(2),
    sharp: +((lapEdge / (ne || 1)) * 100).toFixed(2), noise: +((lapFlat / (nf || 1)) * 1000).toFixed(2),
  };
}

const rows = [];
for (const f of files) { try { rows.push(await score(f)); } catch (e) { console.error('skip', f, e.message); } }

// "Editorial" target: bright, airy, clean whites, full tonal range, crisp. Penalties are 0 when on target.
const med = (k) => { const v = rows.map((r) => r[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
const sharpMed = med('sharp'), noiseMed = med('noise');
for (const r of rows) {
  const p = {
    dark: Math.max(0, 0.5 - r.median) * 6,                       // murky mid-tones
    shadows: Math.max(0, 0.06 - r.shadows) * 4,                    // crushed blacks
    flat: Math.max(0, 0.85 - r.range) * 3,                         // grey, no punch
    cast: Math.max(0, Math.abs(r.castWarm) - 0.08) * 6 + Math.max(0, Math.abs(r.castGreen) - 0.04) * 8,
    soft: Math.max(0, sharpMed / r.sharp - 1) * 1.5,               // softer than the site's middle photo
    noise: Math.max(0, r.noise / noiseMed - 1.3) * 0.6,
    lowres: Math.max(0, 1.0 - r.mp) * 1.2,                         // under 1 MP struggles on big screens
  };
  r.penalties = Object.fromEntries(Object.entries(p).map(([k, v]) => [k, +v.toFixed(2)]));
  r.score = +Object.values(p).reduce((a, b) => a + b, 0).toFixed(2);
  r.issues = Object.entries(p).filter(([, v]) => v >= 0.15).sort((a, b) => b[1] - a[1]).map(([k]) => k);
}
rows.sort((a, b) => b.score - a.score);
fs.mkdirSync(STATE, { recursive: true });
fs.writeFileSync(path.join(STATE, 'audit.json'), JSON.stringify(rows, null, 2));
console.log(`${rows.length} photos scored (higher = further from editorial). state/audit.json`);
console.log('rank score  median range warm  green sharp noise  MP   issues  photo');
rows.forEach((r, i) => console.log(`${String(i + 1).padStart(3)} ${r.score.toFixed(2).padStart(5)}  ${r.median.toFixed(2)}  ${r.range.toFixed(2)} ${r.castWarm.toFixed(2).padStart(5)} ${r.castGreen.toFixed(2).padStart(5)} ${r.sharp.toFixed(1).padStart(5)} ${r.noise.toFixed(1).padStart(5)} ${r.mp.toFixed(1).padStart(4)}  ${r.issues.join(',').padEnd(18)} ${r.src}`));
