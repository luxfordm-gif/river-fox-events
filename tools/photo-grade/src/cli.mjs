// River Fox gallery photo grade. Same approach as ~/Projects/invicta-photo-editor:
// photo -> OpenAI Images edit (fixed prompt + per-photo note) -> metrics -> before/after review -> apply on approval.
// The originals in src/assets/ are never changed: `apply` builds the folder of graded PNGs that
// scripts/gallery-images.mjs --graded=<dir> makes the /our-work/ copies from.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { config, REPO, STATE, loadPhotos, promptFor, readSource } from './config.mjs';
import { editImage, isTransient } from './openai.mjs';
import { apiSize, prepareInput, finish, finishPng, sideBySide, compareMetrics } from './image.mjs';
import { estimateCost } from './cost.mjs';

const MANIFEST = path.join(STATE, 'manifest.json');
const dirs = {
  originals: path.join(STATE, 'originals'), // untouched source, for the review page
  ai: path.join(STATE, 'ai'),               // AI result at the original's exact size, lossless PNG
  preview: path.join(STATE, 'preview'),     // AI result as WebP, for the review page
  compare: path.join(STATE, 'compare'),     // before | after sheets
  graded: path.join(STATE, 'graded'),       // what apply hands to gallery-images.mjs
};
Object.values(dirs).forEach((d) => fs.mkdirSync(d, { recursive: true }));

const args = process.argv.slice(2);
const cmd = args[0] || 'status';
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => args.find((a) => a.startsWith(`--${n}=`))?.split('=').slice(1).join('=');
const list = (n) => opt(n)?.split(',').map((s) => s.trim().replace(/\.(webp|png|jpe?g)$/i, '')).filter(Boolean);
const only = list('only');

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16);
const loadManifest = () => (fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : { spendUsd: 0, calls: [], images: {} });
const saveManifest = (m) => fs.writeFileSync(MANIFEST, JSON.stringify(m, null, 2));
const recipeOf = (p) => sha(Buffer.from(`${config.model}|${config.quality}|${promptFor(p)}`));
const matches = (p, keys = only) => !keys || keys.some((k) => p.key === k || p.key.includes(k));

function selected() {
  const { photos, trial } = loadPhotos();
  const pool = flag('trial') ? photos.filter((p) => trial.includes(p.key)) : photos.filter((p) => !p.skip);
  return pool.filter((p) => matches(p));
}

async function gradeOne(p, m) {
  const e = (m.images[p.key] ||= { key: p.key, src: p.src, attempts: 0 });
  const src = readSource(p.src);
  e.sourceHash = sha(src);
  fs.writeFileSync(path.join(dirs.originals, `${p.key}.webp`), src);
  const prepared = await prepareInput(src);
  const { width, height } = prepared;
  const { W, H, size } = apiSize(width, height);
  // send the photo at exactly the output size: given a smaller input, the model tends to re-compose (zoom) the shot
  const png = await sharp(prepared.png).resize(W, H, { fit: 'fill', kernel: 'lanczos3' }).png({ compressionLevel: 6 }).toBuffer();
  const prompt = promptFor(p);
  for (let attempt = 1; ; attempt++) {
    e.attempts++;
    try {
      const r = await editImage(png, p.key, prompt, size);
      m.spendUsd = +(m.spendUsd + (r.costUsd ?? estimateCost(config.model, config.quality, size))).toFixed(4);
      m.calls.push({ key: p.key, at: new Date().toISOString(), costUsd: r.costUsd, ms: r.ms, size });
      fs.writeFileSync(path.join(dirs.ai, `${p.key}.png`), await finishPng(r.png, width, height));
      const webp = await finish(r.png, width, height);
      fs.writeFileSync(path.join(dirs.preview, `${p.key}.webp`), webp);
      const metrics = await compareMetrics(src, webp);
      fs.writeFileSync(path.join(dirs.compare, `${p.key}.jpg`), await sideBySide(src, webp, p.key));
      Object.assign(e, { status: 'done', recipe: recipeOf(p), preset: p.preset || 'grade', size, width, height,
        costUsd: r.costUsd, metrics, error: null, at: new Date().toISOString() });
      return e;
    } catch (err) {
      if (attempt <= config.maxRetries && isTransient(err)) { await new Promise((res) => setTimeout(res, 2000 * 2 ** attempt)); continue; }
      Object.assign(e, { status: 'failed', error: String(err?.message || err).slice(0, 300) });
      return e;
    }
  }
}

async function run() {
  const m = loadManifest();
  const todo = selected().filter((p) => flag('force') || m.images[p.key]?.status !== 'done' || m.images[p.key]?.recipe !== recipeOf(p));
  const paid = m.calls.filter((c) => c.costUsd).map((c) => c.costUsd);
  const avg = paid.length ? paid.reduce((a, b) => a + b, 0) / paid.length : null;
  const est = estimateCost(config.model, config.quality, '1088x1456', avg);
  console.log(`${todo.length} photo(s) to grade · ~$${(est * todo.length).toFixed(2)} estimated · $${m.spendUsd.toFixed(2)} spent of $${config.maxSpendUsd} cap · ${config.model} ${config.quality}`);
  if (flag('dry-run')) { todo.forEach((p) => console.log('  ', p.preset || 'grade', p.key)); return; }
  let i = 0;
  const worker = async () => {
    while (i < todo.length) {
      if (m.spendUsd + est > config.maxSpendUsd) { console.log(`stop: next call would pass the $${config.maxSpendUsd} cap`); return; }
      const p = todo[i++];
      const e = await gradeOne(p, m);
      saveManifest(m);
      const f = e.metrics?.flags?.length ? `  ⚠ ${e.metrics.flags.join(', ')}` : '';
      console.log(`${e.status === 'done' ? '✓' : '✗'} ${p.key}${e.status === 'done' ? `  $${e.costUsd?.toFixed(3)}${f}` : `  ${e.error}`}`);
    }
  };
  await Promise.all(Array.from({ length: config.concurrency }, worker));
  saveManifest(m);
  console.log(`spent $${m.spendUsd.toFixed(2)} so far. Before/after sheets: tools/photo-grade/state/compare/`);
  review(m);
}

function status() {
  const m = loadManifest();
  const all = loadPhotos().photos.filter((p) => !p.skip);
  const by = (s) => all.filter((p) => (m.images[p.key]?.status || 'pending') === s).length;
  console.log(`${all.length} gallery photos · done ${by('done')} · failed ${by('failed')} · pending ${by('pending')} · spend $${m.spendUsd.toFixed(2)}`);
  for (const p of all) {
    const e = m.images[p.key];
    if (e?.status === 'done') console.log(`  ${e.applied ? 'applied' : 'ready  '} ${p.key}  ${e.metrics.flags.join(', ') || 'ok'}`);
    if (e?.status === 'failed') console.log(`  failed  ${p.key}  ${e.error}`);
  }
}

/** state/review/index.html: every graded photo before | after with its metrics, for a scroll-through on a phone or laptop. */
function review(m = loadManifest()) {
  const dir = path.join(STATE, 'review');
  fs.mkdirSync(dir, { recursive: true });
  const rows = Object.values(m.images).filter((e) => e.status === 'done').map((e) => {
    const b = path.relative(dir, path.join(dirs.originals, `${e.key}.webp`)), a = path.relative(dir, path.join(dirs.preview, `${e.key}.webp`));
    const mm = e.metrics;
    return `<section><h2>${e.key}</h2><p class="meta">${e.preset} · brightness ${mm.brightness > 0 ? '+' : ''}${mm.brightness} · contrast ×${mm.contrast} · colour ×${mm.saturation} · hue ${mm.hueShiftDeg}° · sharpness ×${mm.sharpen} · match ${mm.similarity}${mm.flags.length ? ` · <b>${mm.flags.join(', ')}</b>` : ''}</p>
<div class="pair"><figure><img src="${b}" loading="lazy"><figcaption>Before</figcaption></figure><figure><img src="${a}" loading="lazy"><figcaption>After</figcaption></figure></div></section>`;
  });
  fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Photo grade review</title>
<style>body{margin:0;padding:16px;font:14px/1.4 -apple-system,Helvetica,sans-serif;background:#faf8f4;color:#222}h2{font-size:15px;margin:28px 0 4px;word-break:break-all}.meta{color:#666;margin:0 0 8px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:8px}figure{margin:0}img{width:100%;display:block;border-radius:4px}figcaption{font-size:12px;color:#888;padding-top:4px}</style>
<h1 style="font-size:20px">Photo grade review (${rows.length})</h1>${rows.join('\n')}`);
  console.log('review page: tools/photo-grade/state/review/index.html');
}

/**
 * Build the graded folder and remake the gallery copies.
 *   --ai=all | --ai=name1,name2   photos that take the AI version (they must be done)
 * Every other gallery photo gets the house grade (scripts/grade-photos.py), so the
 * gallery test's "every photo graded" check still passes.
 */
function apply() {
  const m = loadManifest();
  const aiKeys = opt('ai') === 'all' ? null : list('ai');
  if (!opt('ai')) { console.log('Say which photos take the AI grade: --ai=all or --ai=name1,name2'); return; }
  const photos = loadPhotos().photos.filter((p) => p.gallery);
  fs.rmSync(dirs.graded, { recursive: true, force: true });
  fs.mkdirSync(dirs.graded, { recursive: true });
  const house = [];
  for (const p of photos) {
    const e = m.images[p.key];
    const useAi = e?.status === 'done' && matches(p, aiKeys) && !p.skip;
    if (useAi && e.sourceHash !== sha(readSource(p.src))) throw new Error(`${p.key} changed since it was graded; re-run it first`);
    if (useAi) fs.copyFileSync(path.join(dirs.ai, `${p.key}.png`), path.join(dirs.graded, `${p.key}.png`));
    else house.push(path.join('src/assets', p.src));
    if (e) e.applied = useAi;
  }
  if (house.length) execFileSync('python3', ['scripts/grade-photos.py', dirs.graded, ...house], { cwd: REPO, stdio: 'inherit' });
  execFileSync('node', ['scripts/gallery-images.mjs', `--graded=${dirs.graded}`, '--force'], { cwd: REPO, stdio: 'inherit' });
  saveManifest(m);
  console.log(`${photos.length - house.length} photo(s) on the AI grade, ${house.length} on the house grade. Copies remade in src/assets/gallery/.`);
}

/** state/sheets/page-NN.jpg: before | after pairs, six to a page, labelled with flags, for checking a big run by eye. */
async function sheets() {
  const m = loadManifest();
  const keys = Object.values(m.images).filter((e) => e.status === 'done' && matches(e)).map((e) => e.key).sort();
  const dir = path.join(STATE, 'sheets');
  fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const W = 330, H = 440, PER = 6, COLS = 2, LAB = 26, G = 10, PW = W * 2 + 4;
  for (let pg = 0; pg * PER < keys.length; pg++) {
    const batch = keys.slice(pg * PER, pg * PER + PER), cells = [];
    for (const k of batch) {
      const [a, b] = await Promise.all([`originals/${k}.webp`, `preview/${k}.webp`].map((f) => sharp(path.join(STATE, f)).resize({ width: W, height: H, fit: 'contain', background: '#222' }).toBuffer()));
      const fl = m.images[k].metrics.flags.join(', ');
      const label = `${k.slice(0, 48)}${fl ? '  ⚠ ' + fl : ''}`.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      const svg = Buffer.from(`<svg width="${PW}" height="${LAB}"><rect width="100%" height="100%" fill="${fl ? '#5a1d1d' : '#000'}"/><text x="4" y="17" font-family="Helvetica" font-size="12" fill="#fff">${label}</text></svg>`);
      cells.push(await sharp({ create: { width: PW, height: H + LAB, channels: 3, background: '#000' } })
        .composite([{ input: svg, left: 0, top: 0 }, { input: a, left: 0, top: LAB }, { input: b, left: W + 4, top: LAB }]).png().toBuffer());
    }
    const R = Math.ceil(cells.length / COLS);
    await sharp({ create: { width: COLS * (PW + G), height: R * (H + LAB + G), channels: 3, background: '#111' } })
      .composite(cells.map((c, i) => ({ input: c, left: (i % COLS) * (PW + G), top: Math.floor(i / COLS) * (H + LAB + G) })))
      .jpeg({ quality: 82 }).toFile(path.join(dir, `page-${String(pg + 1).padStart(2, '0')}.jpg`));
  }
  console.log(`${keys.length} pairs on ${Math.ceil(keys.length / PER)} page(s): tools/photo-grade/state/sheets/`);
}

const cmds = { run, status, review: () => review(), apply, sheets };
if (!cmds[cmd]) { console.log(`commands: ${Object.keys(cmds).join(', ')}`); process.exit(1); }
await cmds[cmd]();
