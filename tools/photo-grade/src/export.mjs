// Post-ready exports of the graded photos: the right shape and size for where they're going, brightness evened.
// Runs on this Mac only (sharp); nothing goes to the API, so nothing is redrawn.
//
//   npm run export -- --only=<job or name> [--for=google-business] [--out=<folder>] [--top=0.45] [--left=0.5] [--no-even]
//
// --for picks the target (one or several, comma separated); each has one fixed shape, size and format, so nobody
// has to remember them. Defaults to google-business. `npm run export -- --list` prints them.
//   folder: the subfolder name when several targets are exported at once, matching the Drive's own naming
//     ("Instagram post 4x5 (1080x1350)"; Matt, 2026-11-14)
//   aspect: width / height of the crop (null = keep the photo's own shape)
//   widths: one file per width (several = a responsive set named <name>-<width>.webp, as the site's srcsets expect)
//   budgetKB: quality steps down (never below 66) until each file fits (the site's targets: gallery 200, heroes 480,
//     thumbnails 100). fixedQuality: keep the quality and only warn, as scripts/gallery-images.mjs does (its own 1400s
//     run up to 316 KB).
//   upscale: false = never enlarge (gallery sets, like the site's script). Other targets are made at their exact
//     sizes, since the site imports those file names; an enlarged file is marked in export.json.
// The social sizes follow the newest Brand book and Social brand pack in Drive (Brand › Brand book) and the newest
// Automation build brief (Automation). Those documents are the source; if they change a size, change it here too.
const TARGETS = {
  // Social. JPG, sRGB, one file per photo.
  // Checked against each platform's own help pages, 14 Nov 2026 (Matt asked for the guidelines to decide):
  // - Google publishes no post size, only 720x720 recommended for Business Profile photos in general (JPG/PNG,
  //   10 KB-5 MB). Posts show in a 4:3 frame, centre-cropped (most guides), so we make the 4:3 crop ourselves and
  //   choose where it sits. Matches the brand book and the Automation build brief.
  // - Instagram keeps 1.91:1 to 3:4 at 1080 wide (help.instagram.com/1631821640426723): 1080x1440 is the tallest,
  //   and the profile grid tile is 3:4, so nothing is lost there.
  // - Facebook Feed: 4:5, 1440x1800 recommended (facebook.com/business/ads-guide, Facebook Feed image).
  // - Pinterest: 2:3, 1000x1500 (help.pinterest.com, product specs).
  'google-business': { folder: 'Google Business post 4x3 (1200x900)', aspect: 4 / 3, widths: [1200], format: 'jpg', top: 0.28, budgetKB: 5000, label: 'Google Business post: 4:3 1200x900 JPG' },
  'instagram': { folder: 'Instagram post 3x4 (1080x1440)', aspect: 3 / 4, widths: [1080], format: 'jpg', top: 0.4, label: 'Instagram feed post: portrait 3:4, 1080x1440 JPG (the tallest Instagram keeps; fills the grid tile)' },
  'instagram-square': { folder: 'Instagram post square (1080x1080)', aspect: 1, widths: [1080], format: 'jpg', top: 0.45, label: 'Instagram square post: 1080x1080 JPG' },
  'facebook': { folder: 'Facebook post 4x5 (1440x1800)', aspect: 4 / 5, widths: [1440], format: 'jpg', top: 0.4, label: 'Facebook feed post: portrait 4:5, 1440x1800 JPG (Meta Feed guide)' },
  'story': { folder: 'Instagram story 9x16 (1080x1920)', aspect: 9 / 16, widths: [1080], format: 'jpg', top: 0.5, label: 'Instagram / Facebook story or reel cover: 9:16, 1080x1920 JPG' },
  'pinterest': { folder: 'Pinterest pin 2x3 (1000x1500)', aspect: 2 / 3, widths: [1000], format: 'jpg', top: 0.4, label: 'Pinterest pin: 2:3, 1000x1500 JPG' },
  'full': { folder: 'Full photo (1080 wide)', aspect: null, widths: [1080], format: 'jpg', label: 'Whole photo, uncropped, 1080 wide JPG' },
  // Website. WebP responsive sets matching what the site's srcsets use (measured 2026-11-14). Never upscaled.
  // For photos already on the site, `npm run apply` is the way in; these are for new photos being added.
  'website': { folder: 'Website gallery (400-1400 wide)', aspect: null, widths: [400, 700, 1000, 1400], format: 'webp', quality: { 400: 78, 700: 78, 1000: 72, 1400: 70 }, budgetKB: 200, fixedQuality: true, upscale: false,
    label: 'Website gallery / content photo: own shape, WebP 400, 700, 1000, 1400 wide (as scripts/gallery-images.mjs)' },
  'website-card': { folder: 'Website card (838x462)', aspect: 838 / 462, widths: [420, 640, 838], format: 'webp', quality: 78, budgetKB: 100, top: 0.4,
    label: 'Website card / tile: wide 838x462 crop, WebP 420, 640, 838 wide (as the Christmas cards)' },
  'website-hero': { folder: 'Website hero 16x9 (960-1920 wide)', aspect: 16 / 9, widths: [960, 1440, 1920], format: 'webp', quality: 80, budgetKB: 480, top: 0.4,
    label: 'Website hero, laptop and tablet: 16:9, WebP 960, 1440, 1920 wide' },
  'website-hero-phone': { folder: 'Website hero phone 9x16 (480-720 wide)', aspect: 9 / 16, widths: [480, 720], format: 'webp', quality: 80, budgetKB: 200, top: 0.5,
    label: 'Website hero, phones: 9:16, WebP 480, 720 wide' },
  'share': { folder: 'Link preview (1200x630)', aspect: 1200 / 630, widths: [1200], format: 'webp', quality: 80, budgetKB: 200, top: 0.4,
    label: 'Link preview (Open Graph, public/og/): 1200x630 WebP' },
};
//
// Crops: when the target is taller than the photo, the crop keeps the full height and is centred left to right
// (--left, 0 = left edge, 1 = right edge). Otherwise it keeps the full width and --top says where it starts, as a
// share of the height left over (0 = the very top, 1 = the very bottom). Each target's default top sits low enough
// to drop most of a shop sign above a doorway and keep the garland filling the frame (Matt, 2026-11-14).
//
// Evening: photos in one post should sit at the same brightness. Any photo darker than the brightest is lifted to
// match it, by at most 6%, never darkened (2026-11-14: two of the True medispa photos sat a few points low).
// Measured on the first target's crop, and the same lift is used for every target.
//
// Images go to --out (e.g. the synced Google Drive folder), into one subfolder per target if there are several;
// default state/exports/<only>/. The check sheet (sheet.jpg) and the receipt data (export.json) always go to
// state/exports/<only>/, so a Drive folder holds only the images.
// A photo the tool hasn't graded (skipped for faces, say) is exported from the original and marked in export.json.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { STATE, loadPhotos, readSource } from './config.mjs';

const args = process.argv.slice(2);
const opt = (n, d) => args.find((a) => a.startsWith(`--${n}=`))?.split('=').slice(1).join('=') ?? d;
const only = opt('only');
if (args.includes('--list')) { for (const [k, t] of Object.entries(TARGETS)) console.log(`${k.padEnd(20)} ${t.label}`); process.exit(0); }
if (!only) { console.log(`usage: npm run export -- --only=<job or name> [--for=${Object.keys(TARGETS).join('|')}] [--out=<folder>]`); process.exit(1); }
const targets = opt('for', 'google-business').split(',').map((t) => t.trim());
for (const t of targets) if (!TARGETS[t]) { console.log(`unknown --for "${t}"; choose from ${Object.keys(TARGETS).join(', ')}`); process.exit(1); }
const work = path.join(STATE, 'exports', only);
const out = path.resolve(opt('out', work));
const topOverride = opt('top') == null ? null : Number(opt('top'));
const left = Number(opt('left', 0.5));
const even = !args.includes('--no-even');
const MAX_LIFT = 1.06;

const manifest = JSON.parse(fs.readFileSync(path.join(STATE, 'manifest.json'), 'utf8'));
const photos = loadPhotos().photos.filter((p) => p.key === only || p.key.startsWith(only) || p.src.includes(`/${only}/`) || p.key.includes(only));
if (!photos.length) { console.log(`no photos match "${only}"`); process.exit(1); }

/** The crop box for a target on a W x H photo. */
function box(t, W, H) {
  const T = TARGETS[t];
  if (!T.aspect) return { left: 0, top: 0, width: W, height: H };
  const a = T.aspect;
  if (W / H > a) { const cw = Math.round(H * a); return { left: Math.round((W - cw) * left), top: 0, width: cw, height: H }; }
  const ch = Math.round(W / a);
  return { left: 0, top: Math.round((H - ch) * (topOverride ?? T.top)), width: W, height: ch };
}

const sources = await Promise.all(photos.map(async (p) => {
  const done = manifest.images[p.key]?.status === 'done' && fs.existsSync(path.join(STATE, 'preview', `${p.key}.webp`));
  const upright = await sharp(done ? fs.readFileSync(path.join(STATE, 'preview', `${p.key}.webp`)) : readSource(p.src)).rotate().toBuffer();
  const { width, height } = await sharp(upright).metadata();
  // sharp's stats() reads the input, not the pipeline, so render the crop first
  const grey = await sharp(upright).extract(box(targets[0], width, height)).greyscale().toBuffer();
  return { p, buf: upright, graded: done, width, height, luma: (await sharp(grey).stats()).channels[0].mean };
}));
const brightest = Math.max(...sources.map((s) => s.luma));

// several targets: one subfolder each, named the way the Drive's campaign folders are (Social › Christmas 2026 › Images)
const dirOf = (t) => (targets.length > 1 ? path.join(out, TARGETS[t].folder) : out);
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(work, { recursive: true });
for (const t of targets) fs.mkdirSync(dirOf(t), { recursive: true });
/** File name: <name>.jpg for a single size, <name>-<width>.webp for a responsive set (the site's pattern). */
const fileOf = (t, key, w) => path.join(dirOf(t), TARGETS[t].widths.length > 1 ? `${key}-${w}.${TARGETS[t].format}` : `${key}.${TARGETS[t].format}`);
/** Encode at the target's quality, stepping down by 4 (to 66) until the file fits its budget, unless fixedQuality. */
async function encode(img, T, w) {
  let q = typeof T.quality === 'object' ? T.quality[w] : T.quality ?? 88, buf;
  for (;;) {
    buf = T.format === 'webp'
      ? await img.clone().webp({ quality: q, effort: 6, smartSubsample: true }).toBuffer()
      : await img.clone().jpeg({ quality: q, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer();
    if (!T.budgetKB || T.fixedQuality || buf.length <= T.budgetKB * 1024 || q <= 66) return { buf, q };
    q -= 4;
  }
}
const report = [];
for (const s of sources) {
  const lift = even && s.luma < brightest ? Math.min(MAX_LIFT, brightest / s.luma) : 1;
  const files = {};
  for (const t of targets) {
    const T = TARGETS[t], b = box(t, s.width, s.height);
    files[t] = [];
    // gallery sets are never upscaled: a width bigger than the crop is written at the crop's own width, once
    const widths = [...new Set(T.widths.map((w) => (T.upscale === false ? Math.min(w, b.width) : w)))];
    for (const w of widths) {
      const h = T.aspect ? Math.round(w / T.aspect) : null;
      const img = sharp(s.buf).modulate({ brightness: lift }).extract(b).resize(w, h, { fit: 'cover', kernel: 'lanczos3' });
      const { buf, q } = await encode(img, T, w);
      const f = fileOf(t, s.p.key, w);
      fs.writeFileSync(f, buf);
      const kb = Math.round(buf.length / 1024);
      if (T.budgetKB && kb > T.budgetKB) console.log(`  ! ${path.basename(f)} is ${kb} KB, over the ${T.budgetKB} KB budget (quality ${q})`);
      const upscaled = w > b.width ? `from ${b.width} wide` : undefined;
      files[t].push({ file: f, width: w, height: h ?? Math.round(w * b.height / b.width), kb, quality: q, upscaled });
    }
  }
  report.push({ key: s.p.key, graded: s.graded, brightness: Math.round(s.luma), liftedBy: `${Math.round((lift - 1) * 100)}%`, files });
  console.log(`${s.graded ? '✓' : '○ not graded'} ${s.p.key}  brightness ${Math.round(s.luma)}${lift > 1 ? ` → lifted ${Math.round((lift - 1) * 100)}%` : ''}`);
}

// check sheet: one row per target
const H = 300, G = 10;
const rows = await Promise.all(targets.map((t) => Promise.all(report.map((r) => sharp(r.files[t].at(-1).file).resize({ height: H }).toBuffer({ resolveWithObject: true })))));
const width = Math.max(...rows.map((row) => row.reduce((n, x) => n + x.info.width + G, -G)));
await sharp({ create: { width, height: targets.length * (H + G) - G, channels: 3, background: '#fff' } })
  .composite(rows.flatMap((row, y) => { let x = 0; return row.map((r) => { const c = { input: r.data, left: x, top: y * (H + G) }; x += r.info.width + G; return c; }); }))
  .jpeg({ quality: 82 }).toFile(path.join(work, 'sheet.jpg'));
fs.writeFileSync(path.join(work, 'export.json'), JSON.stringify({ only, at: new Date().toISOString(), out,
  targets: Object.fromEntries(targets.map((t) => [t, TARGETS[t].label])), brightest: Math.round(brightest), photos: report }, null, 2));
console.log(`exported ${report.length} photo(s) for ${targets.join(', ')} to ${out}\ncheck sheet: ${path.join(work, 'sheet.jpg')}`);
