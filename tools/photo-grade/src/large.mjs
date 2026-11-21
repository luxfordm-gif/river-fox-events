// Makes the "Large" website master of each graded photo: the model's full-size result (state/ai/<name>.png, 1632 wide for a
// tall photo, which is the most it can draw) as WebP quality 82. For heroes and the full-screen viewer, not the grids
// (about 700 KB each). The 400/700/1000/1400 set comes from `npm run export -- --for=website`.
//   npm run large -- --only=<job or name> --out=<folder>
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { STATE } from './config.mjs';

const opt = (n) => process.argv.slice(2).find((a) => a.startsWith(`--${n}=`))?.split('=').slice(1).join('=');
const only = opt('only'), out = opt('out');
if (!only || !out) { console.log('usage: npm run large -- --only=<name or part of a name shared by the job> --out=<folder>'); process.exit(1); }
fs.mkdirSync(out, { recursive: true });
const files = fs.readdirSync(path.join(STATE, 'ai')).filter((f) => f.endsWith('.png') && f.includes(only));
for (const f of files) {
  const dest = path.join(out, f.replace(/\.png$/, '-1632.webp'));
  const info = await sharp(path.join(STATE, 'ai', f)).webp({ quality: 82 }).toFile(dest);
  console.log(`${path.basename(dest)}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
console.log(`${files.length} file(s) in ${out}`);
