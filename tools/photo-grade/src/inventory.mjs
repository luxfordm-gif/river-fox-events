// Every photo the site actually shows: imported by a page/component/data file, or a `source:` of the gallery.
// usage: node src/inventory.mjs   -> state/site-photos.json, and prints the photos not graded yet
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { REPO, STATE } from './config.mjs';

const SRC = path.join(REPO, 'src');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const code = walk(SRC).filter((f) => /\.(tsx?|jsx?)$/.test(f));

const users = {};
for (const f of code) {
  const text = fs.readFileSync(f, 'utf8');
  for (const m of text.matchAll(/@\/assets\/([^"'`]+?\.(?:webp|jpe?g|png))/g)) (users[m[1]] ||= new Set()).add(path.relative(SRC, f));
}
const gallery = [...fs.readFileSync(path.join(SRC, 'data', 'gallery.ts'), 'utf8').matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1]);
for (const g of gallery) (users[g] ||= new Set()).add('data/gallery.ts');

const manifest = fs.existsSync(path.join(STATE, 'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(STATE, 'manifest.json'), 'utf8')) : { images: {} };
const rows = [];
for (const rel of Object.keys(users).sort()) {
  const abs = path.join(SRC, 'assets', rel);
  if (!fs.existsSync(abs)) continue;
  const md = await sharp(abs).metadata();
  const key = path.basename(rel, path.extname(rel));
  rows.push({ rel, key, width: md.width, height: md.height, alpha: !!md.hasAlpha, gallery: gallery.includes(rel),
    graded: manifest.images[key]?.status === 'done', users: [...users[rel]] });
}
fs.writeFileSync(path.join(STATE, 'site-photos.json'), JSON.stringify(rows, null, 2));
console.log(`${rows.length} image files in use · ${rows.filter((r) => r.graded).length} graded · state/site-photos.json`);
for (const r of rows.filter((r) => !r.graded))
  console.log(`${`${r.width}x${r.height}`.padEnd(10)} ${r.alpha ? 'A' : ' '} ${r.rel.padEnd(72)} ${r.users.join(' ').slice(0, 80)}`);
