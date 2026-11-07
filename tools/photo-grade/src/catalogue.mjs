// Contact sheets of every photo on the site, one per category, each tile numbered and labelled with
// where it's used today. For choosing photos for pages. usage: node src/catalogue.mjs -> state/catalogue/
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { REPO, STATE } from './config.mjs';

const SRC = path.join(REPO, 'src');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

// where each image file is used, as plain page names (+ the role, from the import's variable name)
const PAGE = [
  [/pages\/Index|rfx\/Hero\.|rfx\/HeroEditorial|rfx\/Experiences|rfx\/About|rfx\/ScrollStrip/, 'Home'],
  [/pages\/ChildrensParties/, "Children's page"], [/pages\/Milestones/, 'Milestones page'],
  [/pages\/CorporateAndBrand/, 'Corporate page'], [/pages\/BalloonInstallations/, 'Balloons page'],
  [/pages\/ChristmasDoorways|rfx\/ChristmasPromo|rfx\/HeroGarland/, 'Christmas page'],
  [/data\/locations|rfx\/LocationHeroFan|rfx\/Location/, 'Town pages'], [/data\/articles/, 'Journal'], [/rfx\/CPHero/, 'NOTSHOWN'],
];
const role = (v) => /hero.*mobile/i.test(v) ? 'hero (phone)' : /hero/i.test(v) ? 'hero' : /hover/i.test(v) ? 'hover' : '';
const uses = {};
for (const f of walk(SRC).filter((f) => /\.(tsx?)$/.test(f))) {
  const rel = path.relative(SRC, f), text = fs.readFileSync(f, 'utf8');
  for (const m of text.matchAll(/import\s+(\w+)\s+from\s+"@\/assets\/([^"]+\.(?:webp|jpe?g|png))"/g)) {
    const page = (PAGE.find(([re]) => re.test(rel)) || [, 'Other'])[1];
    const r = /pages\/(ChildrensParties|Milestones|CorporateAndBrand|BalloonInstallations)/.test(rel) ? role(m[1]) : '';
    (uses[m[2]] ||= new Set()).add(r ? `${page} ${r}` : page);
  }
}
// gallery sections from src/data/gallery.ts
const gal = fs.readFileSync(path.join(SRC, 'data', 'gallery.ts'), 'utf8');
const section = {};
const ids = [...gal.matchAll(/\n    id: "([^"]+)"/g)].map((m) => ({ id: m[1], at: m.index }));
for (const m of gal.matchAll(/source:\s*"([^"]+)"/g)) {
  const s = ids.filter((x) => x.at < m.index).pop()?.id;
  section[m[1]] = s; (uses[m[1]] ||= new Set()).add('Our work');
}
const NAMES = { 'childrens-parties': "Children's parties", milestones: 'Milestones', corporate: 'Corporate & brand', christmas: 'Christmas' };
const guess = (src) => /christmas|garland|bauble|door/i.test(src) ? 'christmas'
  : /corporate|nxtgen|theatre|pudsey|gala|veuve|brand/i.test(src) ? 'corporate'
  : /milestone|40th|50th|baby|shower|gender|stubbs|christening|naming|iman|80th|hoop/i.test(src) ? 'milestones' : 'childrens-parties';
const skip = /gallery\/|christmas\/video\/|client-|business-cards|placeholder|-(160|320|420|640|700|800|1050|1200|1400|1440)\.webp$|burgundy-velvet|garland-swag|lush-garland|studio\.webp|laura-portrait|luxury-event-stylist/;

const byCat = {}, all = [];
function corr(a, b) { let ma = 0, mb = 0; for (let i = 0; i < a.length; i++) { ma += a[i]; mb += b[i]; } ma /= a.length; mb /= b.length;
  let n = 0, da = 0, db = 0; for (let i = 0; i < a.length; i++) { n += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; } return n / Math.sqrt(da * db || 1); }
for (const src of Object.keys(uses).sort()) {
  if (skip.test(src)) continue;
  const abs = path.join(SRC, 'assets', src);
  if (!fs.existsSync(abs)) continue;
  // the same photo saved under two names (often at two sizes) is shown once, with both sets of uses
  const thumb = await sharp(abs).resize(24, 32, { fit: 'fill' }).greyscale().raw().toBuffer();
  const used = [...uses[src]].filter((u) => u !== 'Our work' && u !== 'NOTSHOWN');
  const twin = all.find((q) => corr(q.thumb, thumb) > 0.96);
  if (twin) { twin.used = [...new Set([...twin.used, ...used])]; twin.inGallery ||= !!section[src]; if (section[src]) twin.cat = section[src]; continue; }
  all.push({ src, abs, thumb, used, inGallery: !!section[src], cat: section[src] || guess(src) });
}
for (const p of all) (byCat[p.cat] ||= []).push(p);

const out = path.join(STATE, 'catalogue');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const W = 360, H = 450, CAP = 62, C = 3, G = 12, HEAD = 74, PER = 12;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '&#39;');
const wrap = (s, n) => { const w = s.split(' '), l = ['']; for (const x of w) { if ((l.at(-1) + ' ' + x).trim().length > n) l.push(x); else l[l.length - 1] = (l.at(-1) + ' ' + x).trim(); } return l.slice(0, 2); };
const index = [];
let n = 0;
for (const cat of ['childrens-parties', 'milestones', 'corporate', 'christmas']) {
  const list = (byCat[cat] || []).sort((a, b) => (b.used.length - a.used.length) || a.src.localeCompare(b.src));
  const cells = [];
  for (const p of list) {
    n++;
    const md = await sharp(p.abs).metadata();
    const img = await sharp(p.abs).resize({ width: W, height: H, fit: 'cover' }).toBuffer();
    const name = path.basename(p.src, '.webp').replace(/^river-fox-events-/, '').replace(/-/g, ' ');
    const used = p.used.length ? p.used.join(' · ') : (p.inGallery ? 'Our work only' : 'not shown');
    const [l1, l2] = wrap(name, 44);
    const svg = Buffer.from(`<svg width="${W}" height="${CAP}"><rect width="100%" height="100%" fill="#fff"/>
      <text x="8" y="18" font-family="Helvetica" font-size="15" font-weight="bold" fill="#222">${n}. ${esc(l1)}</text>
      ${l2 ? `<text x="8" y="36" font-family="Helvetica" font-size="14" fill="#444">${esc(l2)}</text>` : ''}
      <text x="8" y="${l2 ? 55 : 38}" font-family="Helvetica" font-size="14" fill="${p.used.length ? '#b06a55' : '#888'}">${esc(used)} · ${md.width}px</text></svg>`);
    const badge = Buffer.from(`<svg width="44" height="30"><rect width="44" height="30" rx="4" fill="#222" fill-opacity="0.8"/><text x="22" y="20" text-anchor="middle" font-family="Helvetica" font-size="15" font-weight="bold" fill="#fff">${n}</text></svg>`);
    cells.push(await sharp({ create: { width: W, height: H + CAP, channels: 3, background: '#fff' } })
      .composite([{ input: img, left: 0, top: 0 }, { input: badge, left: 8, top: 8 }, { input: svg, left: 0, top: H }]).png().toBuffer());
    index.push({ n, category: NAMES[cat], file: p.src, width: md.width, used: p.used });
  }
  const TW = C * (W + G) + G, pages = Math.ceil(cells.length / PER);
  for (let pg = 0; pg < pages; pg++) {
    const part = cells.slice(pg * PER, pg * PER + PER), R = Math.ceil(part.length / C);
    const title = `${NAMES[cat]} (${cells.length})${pages > 1 ? `  ${pg + 1}/${pages}` : ''}`;
    const head = Buffer.from(`<svg width="${TW}" height="${HEAD}"><rect width="100%" height="100%" fill="#faf8f4"/><text x="${G}" y="48" font-family="Georgia" font-size="34" fill="#222">${esc(title)}</text></svg>`);
    await sharp({ create: { width: TW, height: HEAD + R * (H + CAP + G) + G, channels: 3, background: '#faf8f4' } })
      .composite([{ input: head, left: 0, top: 0 }, ...part.map((c, i) => ({ input: c, left: G + (i % C) * (W + G), top: HEAD + Math.floor(i / C) * (H + CAP + G) }))])
      .jpeg({ quality: 80 }).toFile(path.join(out, `${cat}-${pg + 1}.jpg`));
  }
  console.log(`${NAMES[cat]}: ${cells.length}`);
}
fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify(index, null, 2));
