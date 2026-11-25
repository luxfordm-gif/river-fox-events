// Colour-block cover: the second cover style, for when a normal cover's words would land on a face or a busy spot.
// Run through thumb.cjs (the one cover tool):
//   node thumb.cjs <photo> <out> 1080 1920 "Line1" "Line2" ["Line3"] --blocks [--at=face|top|middle|lower|<y>] [--between=<y0>,<y1>] [--px=<size>] [--no-handle]
//
// No brand value is written in this file: every size, colour and position comes from ../brand-pack.json
// (cover.blocks: the pack's cover rules for colour blocks), plus the normal cover handle and fade.
//   look   - one pink block per line, hugging the words; line 1 upright, the rest italic, all the same size.
//   size   - the widest block is fitted to the pack's width, between its smallest and biggest sizes. If that size
//            doesn't fit where the stack has to go, it steps down towards the smallest size until it does.
//   face   - --at=face (the default when Apple Vision finds a face): never on the eyes, nose or mouth. In order:
//              1. above the eyes, centred in the space between the pack's top line and the eyebrows, if it fits there;
//              2. below the chin, centred in the space between the chin and the pack's foot line, if it fits there;
//              3. over the forehead: centred between the top of the grid view and halfway down the forehead.
//            The eyebrows come from Vision; the hairline is where the skin above them gives way to darker hair.
//   place  - with no face, anywhere the photo is calm, inside the pack's band (first block no higher than its top line,
//            last block ending by its foot line): --at=top, --at=middle, --at=lower, --at=<y> (first block's top), or
//            --between=<y0>,<y1> to centre it between two lines. Place each cover by eye, not one height every time.
//   px     - --px=<size> sets the size by hand (Matt's call for one cover); it prints what the pack's fit would give.
// The photo is never moved, extended or blurred (the pack's cover rules: photos stay full bleed).
// It refuses a block on the eyes, nose or mouth, above the top line, below the foot line or into the Reel icon in the
// grid (ALLOW_UNSAFE=1 to force), and leaves the handle off when its fixed spot would land on a face, as the pack says.
// It prints the size, each block's box, the face and the space it found above and below it, and the space to the handle.
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const puppeteer = require(path.join(__dirname, '../../photo-grade/node_modules/puppeteer-core'));
const B = require('../brand-pack.json');

const argv = process.argv.slice(2);
const flag = (n) => { const a = argv.find((x) => x === `--${n}` || x.startsWith(`--${n}=`)); return a === undefined ? undefined : a.includes('=') ? a.split('=').slice(1).join('=') : true; };
const [photo, out, W, H, ...rawLines] = argv.filter((a) => !a.startsWith('--'));
const curly = (s) => s.replace(/(^|[\s(])"/g, '$1“').replace(/"/g, '”').replace(/(^|[\s(])'/g, '$1‘').replace(/'/g, '’');
const lines = rawLines.map(curly);
const w = +W, h = +H, k = w / 1080, px = (n) => Math.round(n * k);
const shape = h / w > 1.7 ? '9x16' : Math.abs(h / w - 1.25) < 0.02 ? '4x5' : '3x4';
const K = B.cover.blocks, L = B.cover.layout['9x16'], F = B.cover.fade, ink = B.colour.inkRgb, T = K.toolOwn;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const faults = [];
if (!photo || !out || !lines.length) { console.log('usage: node thumb.cjs <photo> <out> 1080 1920 "Line1" "Line2" ["Line3"] --blocks [--at=face|top|middle|lower|<y>] [--between=<y0>,<y1>] [--px=<size>]'); process.exit(1); }
if (flag('shift') !== undefined) { console.error('--shift was removed: the pack keeps photos full bleed, never moved, extended or blurred. Leave it off.'); process.exit(1); }
if (!K.shapes.includes(shape)) { console.error(`NOT WRITTEN: the pack's colour blocks are drawn for ${K.shapes.join(', ')} covers only, not ${shape}.`); process.exit(1); }
const words = lines.join(' ').split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x));
if (words.length === 1) faults.push('a one-word hook keeps the normal big headline (the pack): run without --blocks');
if (words.length > K.wordsUpTo) faults.push(`${words.length} words: the pack allows about ${K.wordsUpTo} in blocks`);
const between = typeof flag('between') === 'string' ? flag('between').split(',').map(Number) : null;
const P = K.place, minTop = px(P.firstNoHigherThan), maxEnd = px(P.lastEndsBy), gridTop = px(B.safeArea.coverGrid.y0);
const handSize = flag('px') ? Number(flag('px')) : null;
const handle = flag('no-handle') === undefined;

// Faces, with Apple Vision.
function faces(file) {
  const bin = path.join(__dirname, 'faces');
  const src = path.join(__dirname, 'faces.swift');
  if (!fs.existsSync(bin) || fs.statSync(bin).mtimeMs < fs.statSync(src).mtimeMs) execFileSync('swiftc', ['-O', src, '-o', bin], { stdio: 'inherit' });
  const outp = execFileSync(bin, [file], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  return outp ? outp.split('\n').filter((l) => /^[\d.-]+( [\d.-]+){4}$/.test(l.trim())).map((l) => l.trim().split(' ').map(Number)) : []; // x y w h browTop, fractions, origin top-left
}
const size = (file) => { const o = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' }); return [+o.match(/pixelWidth: (\d+)/)[1], +o.match(/pixelHeight: (\d+)/)[1]]; };

const [iw, ih] = size(photo);
// The photo covers the frame, centred, as on every cover.
const s = Math.max(w / iw, h / ih), drawW = iw * s, drawH = ih * s, ox = (w - drawW) / 2, oy = (h - drawH) / 2;
const toFrameY = (f) => Math.round(oy + f * drawH);
const found = faces(photo);
// The whole face, a little wider (used for the handle), and the part no block may touch: the eyes, nose and mouth,
// from just above the eyebrows to just below the chin.
const faceBoxes = found.map(([fx, fy, fw, fh]) => {
  const g = T.faceMargin;
  return [ox + (fx - fw * g) * drawW, oy + (fy - fh * g) * drawH, ox + (fx + fw * (1 + g)) * drawW, oy + (fy + fh * (1 + g)) * drawH].map(Math.round);
});
const features = found.map(([fx, fy, fw, fh, brow], i) => {
  const b = faceBoxes[i];
  const yTop = brow >= 0 ? toFrameY(brow - fh * T.browMargin) : b[1];
  return [b[0], yTop, b[2], toFrameY(fy + fh * (1 + T.chinMargin))];
});
const at = flag('at') || (found.length ? 'face' : 'top');
if (!['face', 'top', 'middle', 'lower'].includes(at) && !Number.isFinite(Number(at))) { console.error(`unknown --at=${at}: use face, top, middle, lower or a number`); process.exit(1); }
if (at === 'face' && !found.length) { console.error('NOT WRITTEN: --at=face, but no face was found. Use --at=top, middle, lower, a number, or --between.'); process.exit(1); }

const img = 'data:image/jpeg;base64,' + fs.readFileSync(photo).toString('base64');
const fam = (f) => f.replace(/ /g, '+');
const grad = `linear-gradient(to bottom, ${F.stops.map(([p, a]) => `rgba(${ink},${a}) ${p}%`).join(', ')})`;
const html = `<!doctype html><meta charset=utf-8>
<link href="https://fonts.googleapis.com/css2?family=${fam(K.font)}:ital@0;1&family=${fam(B.handle.font)}:wght@${B.handle.weight}&display=block" rel=stylesheet>
<style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#000}
.p{position:relative;width:${w}px;height:${h}px;overflow:hidden}
.ph{position:absolute;inset:0;background:url(${img}) center/cover}
.f{position:absolute;inset:0;background:${grad}}
.t{position:absolute;left:0;top:${minTop}px;width:${w}px;display:flex;flex-direction:column;align-items:center;gap:${px(K.gap)}px}
.b{font-family:'${K.font}',serif;font-weight:${K.weight};letter-spacing:${K.tracking};line-height:${K.leading};white-space:nowrap;color:${K.text};background:${K.fill};padding:${px(K.padTop)}px ${px(K.padX)}px ${px(K.padBottom)}px;font-size:100px}
.b+.b{font-style:italic}
.u{position:absolute;left:0;width:${w}px;top:${px(L.handleTopY)}px;line-height:${px(L.handleLinePx)}px;text-align:center;color:${B.colour.warmWhite};font-family:'${B.handle.font}',sans-serif;font-weight:${B.handle.weight};font-size:${px(L.handlePx)}px;letter-spacing:${B.handle.tracking};text-transform:uppercase;text-shadow:${F.handleShadow}}</style>
<div class=p><div class=ph></div><div class=f></div>
<div class=t>${lines.map((l) => `<div class=b>${esc(l)}</div>`).join('')}</div>
${handle ? `<div class=u>${B.handle.text}</div>` : ''}</div>`;

(async () => {
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const pg = await br.newPage(); await pg.setViewport({ width: w, height: h });
  await pg.setContent(html, { waitUntil: 'networkidle0', timeout: 90000 }); await pg.evaluate(() => document.fonts.ready);

  // The largest face: its eyebrows, chin and halfway down its forehead.
  let face = null;
  if (found.length) {
    const i = found.map((f, j) => [f[2] * f[3], j]).sort((a, b) => b[0] - a[0])[0][1];
    const [fx, , fw, fh, brow] = found[i];
    let mid = null;
    if (brow >= 0) {
      const hair = await pg.evaluate(async ({ src, cx, brow, fh }) => {
        const im = new Image(); im.src = src; await im.decode();
        const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
        const g = c.getContext('2d'); g.drawImage(im, 0, 0);
        const Wd = c.width, Hh = c.height, x = Math.round(cx * Wd);
        const lum = (y) => { const d = g.getImageData(x - 8, y - 8, 17, 17).data; let t = 0; for (let n = 0; n < d.length; n += 4) t += 0.2126 * d[n] + 0.7152 * d[n + 1] + 0.0722 * d[n + 2]; return t / (d.length / 4); };
        const by = Math.round(brow * Hh), skin = lum(Math.round(by - fh * Hh * 0.08));
        for (let y = by - Math.round(fh * Hh * 0.08); y > 10; y -= 4) if (lum(y) < skin * 0.6) return y / Hh;
        return null;
      }, { src: img, cx: fx + fw / 2, brow, fh });
      if (hair !== null) mid = { hair: toFrameY(hair), brow: toFrameY(brow), y: toFrameY((hair + brow) / 2) };
    }
    face = { features: features[i], mid };
  }

  const ic = T.reelIconInGrid;
  const icon = [px(ic.x0 - ic.clear), gridTop + px(ic.y0 - ic.clear), px(ic.x1 + ic.clear), gridTop + px(ic.y1 + ic.clear)];
  // Where to try, in order. Each is [name, y0, y1, how]: "centre" centres the stack in y0..y1.
  let tries;
  if (at === 'face') {
    const f = face.features;
    tries = [['above the eyes', minTop, f[1], 'centre'], ['below the chin', f[3], maxEnd, 'centre']];
    if (face.mid) tries.push(['over the forehead', gridTop, face.mid.y, 'centre']);
  } else if (between) tries = [['between the given lines', between[0], between[1], 'centre']];
  else if (at === 'top') tries = [['top', minTop, null, 'top']];
  else if (at === 'middle') tries = [['middle', 0, h, 'centre']];
  else if (at === 'lower') tries = [['lower', null, maxEnd, 'bottom']];
  else tries = [[`y ${at}`, Number(at), null, 'top']];

  const r = await pg.evaluate(({ fit, maxPx, minPx, handSize, tries, minTop, maxEnd, noGo, icon, step }) => {
    const bs = [...document.querySelectorAll('.b')], t = document.querySelector('.t');
    const widest = Math.max(...bs.map((b) => b.getBoundingClientRect().width)); // at 100px, padding included
    const pad = parseFloat(getComputedStyle(bs[0]).paddingLeft) * 2;
    const packSize = Math.max(minPx, Math.min(maxPx, (100 * (fit - pad)) / (widest - pad)));
    const R = (n) => Math.round(n);
    const lay = (size, tr) => {
      bs.forEach((b) => (b.style.fontSize = size + 'px'));
      const th = t.getBoundingClientRect().height;
      const [, y0, y1, how] = tr;
      t.style.top = (how === 'centre' ? (y0 + y1) / 2 - th / 2 : how === 'top' ? y0 : y1 - th) + 'px';
      const boxes = bs.map((b) => { const q = b.getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom].map(R); });
      const top = Math.min(...boxes.map((b) => b[1])), bottom = Math.max(...boxes.map((b) => b[3]));
      const hits = (z) => boxes.some((b) => b[0] < z[2] && b[2] > z[0] && b[1] < z[3] && b[3] > z[1]);
      const why = [];
      if (top < minTop - 1) why.push('starts above the top line');
      if (bottom > maxEnd + 2) why.push('ends below the foot line');
      if (noGo.some(hits)) why.push('touches the eyes, nose or mouth');
      if (hits(icon)) why.push('runs into the Reel icon');
      return { size: R(size), boxes, top, bottom, why };
    };
    const sizes = [];
    if (handSize) sizes.push(handSize); else for (let s = packSize; s >= minPx - 0.01; s -= step) sizes.push(s);
    const log = [];
    let pick = null;
    for (const tr of tries) {
      let last = null;
      for (const s of sizes) { last = lay(s, tr); if (!last.why.length) { pick = { ...last, place: tr[0] }; break; } }
      if (pick) break;
      log.push(`${tr[0]}: no room even at ${last.size}px (${last.why.join(', ')})`);
    }
    if (!pick) { const tr = tries[tries.length - 1]; pick = { ...lay(sizes[sizes.length - 1], tr), place: tr[0] }; }
    const u = document.querySelector('.u');
    const hb = u ? (() => { const rg = document.createRange(); rg.selectNodeContents(u); const q = rg.getBoundingClientRect(); return [R(q.top), R(q.bottom), R(q.left), R(q.right)]; })() : null;
    return { ...pick, packSize: R(packSize), log, handle: hb,
      fonts: document.fonts.check(`20px "${getComputedStyle(bs[0]).fontFamily.split(',')[0].replace(/['"]/g, '')}"`) };
  }, { fit: px(K.fitWidth), maxPx: px(K.maxPx), minPx: px(K.minPx), handSize: handSize && px(handSize), tries, minTop, maxEnd, noGo: features, icon, step: px(T.sizeStep) });

  console.log(`${path.basename(out)} (${w}x${h}, colour blocks)  [the pack's ${K.subject}]`);
  if (face) {
    const f = face.features;
    console.log(`  face: eyes, nose and mouth from y ${f[1]} to ${f[3]}; room above the eyes ${f[1] - minTop}px, below the chin ${maxEnd - f[3]}px`);
    if (face.mid) console.log(`  forehead: hairline y ${face.mid.hair}, eyebrows y ${face.mid.brow}, halfway y ${face.mid.y}`);
  }
  r.log.forEach((l) => console.log(`  tried ${l}`));
  console.log(`  placed ${r.place}: blocks y ${r.top} to ${r.bottom} (the pack: first block no higher than ${minTop}, last ending by ${maxEnd})`);
  console.log(`  ${words.length} words, ${lines.length} block(s); ${K.font} ${r.size}px${handSize ? ' set by hand' : r.size < r.packSize ? ', stepped down to fit' : ''} (the pack's fit gives ${r.packSize}px; ${px(K.minPx)} to ${px(K.maxPx)}px), line 1 upright, the rest italic`);
  r.boxes.forEach((b, i) => console.log(`  block ${i + 1}: x ${b[0]} to ${b[2]} (${b[2] - b[0]}px wide), y ${b[1]} to ${b[3]}`));
  if (r.handle) console.log(`  handle y ${r.handle[0]} to ${r.handle[1]}, x ${r.handle[2]} to ${r.handle[3]}`);
  // The pack: a handle that would land on a face is left off.
  const handleOnFace = r.handle && faceBoxes.some((f) => f[1] < r.handle[1] && f[3] > r.handle[0] && f[0] < r.handle[3] && f[2] > r.handle[2]);
  if (handleOnFace) { await pg.evaluate(() => document.querySelector('.u').remove()); console.log(`  handle left off: at y ${r.handle[0]} it would sit on a face (the pack: ${K.handleOnFace.split(':')[0]})`); }
  console.log(`  in the profile grid (y ${gridTop} to ${px(B.safeArea.coverGrid.y1)} shown): first block ${r.top - gridTop}px below the tile's top edge; Reel icon ${r.why.includes('runs into the Reel icon') ? 'hit' : 'clear'}`);

  if (!r.fonts) faults.push('the fonts did not load');
  if (handSize && (handSize < K.minPx || handSize > K.maxPx)) faults.push(`--px=${handSize} is outside the pack's ${K.minPx} to ${K.maxPx}px`);
  const right = Math.max(...r.boxes.map((b) => b[2])), left = Math.min(...r.boxes.map((b) => b[0]));
  if (right - left > px(K.fitWidth) + 4) faults.push(`a block is ${right - left}px wide, over the pack's ${px(K.fitWidth)} even at the smallest size: shorten that line`);
  if (r.why.length) faults.push(`no place fits: the stack ${r.why.join(' and ')}. Shorten the hook${at === 'face' ? '' : ', or try another --at'}`);
  if (faults.length && !process.env.ALLOW_UNSAFE) { console.error('NOT WRITTEN: ' + faults.join('; ')); await br.close(); process.exit(1); }
  await pg.screenshot({ path: out, type: 'jpeg', quality: 92 });
  await br.close();
  console.log(faults.length ? `  wrote ${out} although: ${faults.join('; ')} (ALLOW_UNSAFE)` : `  wrote ${out}`);
})();
