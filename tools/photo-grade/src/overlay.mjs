// Puts the River Fox cover text on ONE chosen photo per format: an Instagram post (3:4) and/or a Story / Reel
// cover (9:16), from a job's exports.
//
// The look is NOT set here. This hands each photo to tools/river-fox/text/thumb.cjs, the one cover tool, which takes
// every value from tools/river-fox/brand-pack.json (the Brand Pack's cover boards). If the pack changes, that file
// changes, never this one.
//
//   npm run overlay -- --job=<export folder> --hook1="A Worplesdon" [--hook2="welcome."] [--caps="small capitals line"] \
//       [--post=<photo name>] [--story=<photo name>] [--post-at=middle|top|<y>] [--story-at=...] [--out=<folder>]
//
// --caps is the one small capitals line under the headline, when it needs more words. --post-at / --story-at say where
// the headline sits on each photo (default middle): words never sit on the subject if there is a calm spot.
//
// Reads state/exports/<job>/Instagram post ... and Instagram story ... (made by `npm run export`), writes the
// finished files to state/exports/<job>/overlays/ (or --out). Needs Google Chrome on this Mac and a network
// connection (the fonts load from Google Fonts). Nothing goes to the OpenAI API.
// Not on Google Business photos: they get no text.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { STATE } from './config.mjs';

const args = process.argv.slice(2);
const opt = (n) => args.find((a) => a.startsWith(`--${n}=`))?.split('=').slice(1).join('=');
const job = opt('job');
const hook1 = opt('hook1'), hook2 = opt('hook2');
if (!job || !hook1 || !(opt('post') || opt('story'))) {
  console.log('usage: npm run overlay -- --job=<export folder> --hook1="…" [--hook2="…"] [--caps="…"] [--post=<name>] [--story=<name>] [--post-at=…] [--story-at=…] [--out=<folder>]');
  process.exit(1);
}
for (const f of ['post', 'story']) if (opt(`${f}-spot`)) { console.log(`--${f}-spot was renamed --${f}-at (middle, top or a y position).`); process.exit(1); }

const THUMB = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../river-fox/text/thumb.cjs');
const EXP = path.join(STATE, 'exports', job);
const OUT = opt('out') || path.join(EXP, 'overlays');
const FORMATS = {
  post: { dir: 'Instagram post 3x4 (1080x1440)', w: 1080, h: 1440, shape: '3x4' },
  story: { dir: 'Instagram story 9x16 (1080x1920)', w: 1080, h: 1920, shape: '9x16' },
};
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const report = [];
for (const [fmt, F] of Object.entries(FORMATS)) {
  const name = opt(fmt);
  if (!name) continue;
  const dir = path.join(EXP, F.dir);
  const file = fs.readdirSync(dir).find((f) => f.includes(name) && /\.jpg$/.test(f));
  if (!file) { console.log(`no ${fmt} export matching "${name}" in ${dir}`); process.exit(1); }
  fs.mkdirSync(OUT, { recursive: true });
  // "00 - with text - ..." sorts to the top of the platform's folder on a Mac, so the text version is never in its own folder
  // the shape is in the name because the post and the Story often use the same photo, and one would overwrite the other
  const outName = `00 - with text - ${file.replace(/\.jpg$/, '')} (${F.shape}).jpg`;
  const extra = [...(opt('caps') ? [`--caps=${esc(opt('caps'))}`] : []), ...(opt(`${fmt}-at`) ? [`--at=${opt(`${fmt}-at`)}`] : [])];
  execFileSync('node', [THUMB, path.join(dir, file), path.join(OUT, outName), String(F.w), String(F.h), esc(hook1), ...(hook2 ? [esc(hook2)] : []), ...extra], { stdio: 'inherit' });
  report.push({ format: fmt, photo: file, out: outName });
  console.log(`${fmt}: ${outName}  (made by thumb.cjs, ${F.w}x${F.h})`);
}
fs.writeFileSync(path.join(OUT, 'overlay.json'), JSON.stringify({ hook: [hook1, hook2].filter(Boolean), caps: opt('caps') || null, madeBy: 'tools/river-fox/text/thumb.cjs', report }, null, 1));
