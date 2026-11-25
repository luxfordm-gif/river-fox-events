// Colour-block cover: the second cover style, for when a normal cover's words would land on a face or a busy spot.
// Run through thumb.cjs (the one cover tool):
//   node thumb.cjs <photo> <out> 1080 1920 "Line1" "Line2" ["Line3"] --blocks [--at=top|middle|lower|forehead|<y>] [--between=<y0>,<y1>] [--shift=<px>] [--px=<size>] [--no-handle]
//
// No brand value is written in this file: every size, colour and position comes from ../brand-pack.json
// (cover.blocks, board "Covers", Part 3), plus the normal cover handle and fade.
//   look   - one pink block per line, hugging the words; line 1 upright, the rest italic, all the same size.
//   size   - the widest block is fitted to the pack's width, between its smallest and biggest sizes.
//   forehead - --at=forehead (a person looking to camera): the stack centred between the top of the grid view and halfway
//            down the forehead, measured from the eyebrows Vision finds and the hairline above them. --between=<y0>,<y1>
//            centres it between any two lines.
//   place  - anywhere the photo is calm, inside the pack's grid-safe band (first block no higher than its top line, last
//            block ending by its foot line): --at=top (the default: first block on the top line), --at=middle (the stack
//            centred on the frame), --at=lower (last block ending on the foot line) or --at=<y> (first block's top).
//   px     - --px=<size> sets the size by hand (Matt's call for one cover); it prints what the pack's fit would give.
//   shift  - --shift=<px> moves the photo down that far so a head clears the top blocks, the top of the photo fading into
//            a blurred copy of itself, as the board's first example does.
//   face   - finds every face with Apple Vision and will not write a cover with a block on a face (ALLOW_UNSAFE=1 to force),
//            and leaves the handle off when its fixed spot would land on a face, as the pack says.
// It prints the size, each block's box, the face boxes, and the space to the handle.
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
const K = B.cover.blocks, L = B.cover.layout['9x16'], F = B.cover.fade, ink = B.colour.inkRgb;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const faults = [];
if (!photo || !out || !lines.length) { console.log('usage: node thumb.cjs <photo> <out> 1080 1920 "Line1" "Line2" ["Line3"] --blocks [--at=top|middle|lower|<y>] [--shift=<px>] [--px=<size>]'); process.exit(1); }
if (!K.shapes.includes(shape)) { console.error(`NOT WRITTEN: the pack's colour blocks are drawn for ${K.shapes.join(', ')} covers only, not ${shape}.`); process.exit(1); }
const words = lines.join(' ').split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x));
if (words.length === 1) faults.push('a one-word hook keeps the normal big headline (the pack): run without --blocks');
if (words.length > K.wordsUpTo) faults.push(`${words.length} words: the pack allows about ${K.wordsUpTo} in blocks`);
const at = flag('at') || 'top';
const between = typeof flag('between') === 'string' ? flag('between').split(',').map(Number) : null;
if (!['top', 'middle', 'lower', 'forehead'].includes(at) && !Number.isFinite(Number(at))) { console.error(`unknown --at=${at}: use top, middle, lower, forehead or a number`); process.exit(1); }
const P = K.place, minTop = px(P.firstNoHigherThan), maxEnd = px(P.lastEndsBy);
const handSize = flag('px') ? Number(flag('px')) : null;
const shift = flag('shift') ? Math.max(0, Number(flag('shift'))) : 0;
const handle = flag('no-handle') === undefined;

// Faces, with Apple Vision (the story builder's face.swift, extended here to every face).
function faces(file) {
  const bin = path.join(__dirname, 'faces');
  const src = path.join(__dirname, 'faces.swift');
  if (!fs.existsSync(bin) || fs.statSync(bin).mtimeMs < fs.statSync(src).mtimeMs) execFileSync('swiftc', ['-O', src, '-o', bin], { stdio: 'inherit' });
  const outp = execFileSync(bin, [file], { encoding: 'utf8' }).trim();
  return outp ? outp.split('\n').filter((l) => /^[\d.-]+( [\d.-]+){4}$/.test(l.trim())).map((l) => l.trim().split(' ').map(Number)) : []; // x y w h browTop, fractions, origin top-left
}
const size = (file) => { const o = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' }); return [+o.match(/pixelWidth: (\d+)/)[1], +o.match(/pixelHeight: (\d+)/)[1]]; };

const [iw, ih] = size(photo);
// Where the photo is drawn: covering the frame, or the frame minus the shift, sitting at the foot.
const dh = h - px(shift), s = Math.max(w / iw, dh / ih), drawW = iw * s, drawH = ih * s, ox = (w - drawW) / 2, oy = px(shift) + (dh - drawH) / 2;
const found = faces(photo);
const faceBoxes = found.map(([fx, fy, fw, fh]) => {
  const g = K.toolOwn.faceMargin;
  const x0 = ox + (fx - fw * g) * drawW, x1 = ox + (fx + fw * (1 + g)) * drawW, y0 = oy + (fy - fh * g) * drawH, y1 = oy + (fy + fh * (1 + g)) * drawH;
  return [x0, y0, x1, y1].map(Math.round);
});
// Where a block may not go: from just above the eyebrows down (the pack allows a stack over hair and the upper forehead,
// "above the eyes"). Without eyebrows, the whole face box.
const noGo = found.map(([fx, fy, fw, fh, brow], i) => {
  const b = faceBoxes[i];
  return brow >= 0 ? [b[0], Math.round(oy + (brow - fh * K.toolOwn.browMargin) * drawH), b[2], b[3]] : b;
});
const toFrameY = (f) => Math.round(oy + f * drawH);

// The space the photo leaves at the top is filled with the photo's own top strip, stretched and blurred (never a copy of
// the subject, which would show as a ghost of it).
const blurH = px(shift) + px(K.toolOwn.shiftFadePx) + px(80);
const img = 'data:image/jpeg;base64,' + fs.readFileSync(photo).toString('base64');
const fam = (f) => f.replace(/ /g, '+');
const grad = `linear-gradient(to bottom, ${F.stops.map(([p, a]) => `rgba(${ink},${a}) ${p}%`).join(', ')})`;
const html = `<!doctype html><meta charset=utf-8>
<link href="https://fonts.googleapis.com/css2?family=${fam(K.font)}:ital@0;1&family=${fam(B.handle.font)}:wght@${B.handle.weight}&display=block" rel=stylesheet>
<style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#000}
.p{position:relative;width:${w}px;height:${h}px;overflow:hidden}
.blur{position:absolute;left:-${px(40)}px;top:-${px(40)}px;width:${w + px(80)}px;height:${blurH}px;background:url(${img}) 0 0/100% ${Math.round(blurH / K.toolOwn.shiftFillFrom)}px no-repeat;filter:blur(${px(K.toolOwn.shiftBlurPx)}px)}
.ph{position:absolute;left:0;top:${px(shift)}px;width:${w}px;height:${dh}px;background:url(${img}) center/cover;${shift ? `-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 ${px(K.toolOwn.shiftFadePx)}px)` : ''}}
.f{position:absolute;inset:0;background:${grad}}
.t{position:absolute;left:0;top:${minTop}px;width:${w}px;display:flex;flex-direction:column;align-items:center;gap:${px(K.gap)}px}
.b{font-family:'${K.font}',serif;font-weight:${K.weight};letter-spacing:${K.tracking};line-height:${K.leading};white-space:nowrap;color:${K.text};background:${K.fill};padding:${px(K.padTop)}px ${px(K.padX)}px ${px(K.padBottom)}px;font-size:100px}
.b+.b{font-style:italic}
.u{position:absolute;left:0;width:${w}px;top:${px(L.handleTopY)}px;line-height:${px(L.handleLinePx)}px;text-align:center;color:${B.colour.warmWhite};font-family:'${B.handle.font}',sans-serif;font-weight:${B.handle.weight};font-size:${px(L.handlePx)}px;letter-spacing:${B.handle.tracking};text-transform:uppercase;text-shadow:${F.handleShadow}}</style>
<div class=p>${shift ? '<div class=blur></div>' : ''}<div class=ph></div><div class=f></div>
<div class=t>${lines.map((l) => `<div class=b>${esc(l)}</div>`).join('')}</div>
${handle ? `<div class=u>${B.handle.text}</div>` : ''}</div>`;

(async () => {
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const pg = await br.newPage(); await pg.setViewport({ width: w, height: h });
  await pg.setContent(html, { waitUntil: 'networkidle0', timeout: 90000 }); await pg.evaluate(() => document.fonts.ready);
  // Halfway down the forehead of the largest face: the eyebrows from Vision, the hairline where the skin above them
  // gives way to darker hair, scanning up the middle of the face.
  let forehead = null;
  if (found.length) {
    const [fx, fy, fw, fh, brow] = found.slice().sort((a, b) => b[2] * b[3] - a[2] * a[3])[0];
    if (brow >= 0) {
      const hair = await pg.evaluate(async ({ src, cx, brow, fh }) => {
        const im = new Image(); im.src = src; await im.decode();
        const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
        const g = c.getContext('2d'); g.drawImage(im, 0, 0);
        const W = c.width, Hh = c.height, x = Math.round(cx * W);
        const lum = (y) => { const d = g.getImageData(x - 8, y - 8, 17, 17).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; return s / (d.length / 4); };
        const by = Math.round(brow * Hh), skin = lum(Math.round(by - fh * Hh * 0.08));
        for (let y = by - Math.round(fh * Hh * 0.08); y > 10; y -= 4) if (lum(y) < skin * 0.6) return y / Hh;
        return null;
      }, { src: img, cx: fx + fw / 2, brow, fh });
      if (hair !== null) forehead = { hair: toFrameY(hair), brow: toFrameY(brow), mid: toFrameY((hair + brow) / 2) };
    }
  }
  if ((at === 'forehead') && !forehead) { console.error('NOT WRITTEN: --at=forehead needs a face with eyebrows and a hairline; none found. Use --between or another --at.'); await br.close(); process.exit(1); }
  const gridTop = px(B.safeArea.coverGrid.y0);
  const span = between || (at === 'forehead' ? [gridTop, forehead.mid] : null);

  const r = await pg.evaluate(({ fit, maxPx, minPx, handSize, at, minTop, maxEnd, H, span }) => {
    const bs = [...document.querySelectorAll('.b')];
    const widest = Math.max(...bs.map((b) => b.getBoundingClientRect().width)); // at 100px, padding included
    const pad = parseFloat(getComputedStyle(bs[0]).paddingLeft) * 2;
    const packSize = Math.max(minPx, Math.min(maxPx, (100 * (fit - pad)) / (widest - pad)));
    const size = handSize || packSize;
    bs.forEach((b) => (b.style.fontSize = size + 'px'));
    const t = document.querySelector('.t'), th = t.getBoundingClientRect().height;
    t.style.top = (span ? (span[0] + span[1]) / 2 - th / 2 : at === 'top' ? minTop : at === 'middle' ? H / 2 - th / 2 : at === 'lower' ? maxEnd - th : Number(at)) + 'px';
    const R = (n) => Math.round(n), u = document.querySelector('.u');
    return { size: R(size), packSize: R(packSize), boxes: bs.map((b) => { const q = b.getBoundingClientRect(); return [q.left, q.top, q.right, q.bottom].map(R); }),
      handle: u ? (() => { const q = u.firstChild ? (() => { const rg = document.createRange(); rg.selectNodeContents(u); return rg.getBoundingClientRect(); })() : u.getBoundingClientRect(); return [R(q.top), R(q.bottom), R(q.left), R(q.right)]; })() : null,
      fonts: document.fonts.check(`20px "${getComputedStyle(bs[0]).fontFamily.split(',')[0].replace(/['"]/g, '')}"`) };
  }, { fit: px(K.fitWidth), maxPx: px(K.maxPx), minPx: px(K.minPx), handSize: handSize && px(handSize), at, minTop, maxEnd, H: h, span });

  const top = Math.min(...r.boxes.map((b) => b[1])), bottom = Math.max(...r.boxes.map((b) => b[3]));
  const left = Math.min(...r.boxes.map((b) => b[0])), right = Math.max(...r.boxes.map((b) => b[2]));
  console.log(`${path.basename(out)} (${w}x${h}, colour blocks)  [${K.board}]`);
  console.log(`  ${words.length} words, ${lines.length} block(s); ${K.font} ${r.size}px${handSize ? ` set by hand (the pack's fit would give ${r.packSize}px)` : ''} (fit ${px(K.fitWidth)}, ${px(K.minPx)} to ${px(K.maxPx)}px), line 1 upright, the rest italic`);
  r.boxes.forEach((b, i) => console.log(`  block ${i + 1}: x ${b[0]} to ${b[2]} (${b[2] - b[0]}px wide), y ${b[1]} to ${b[3]}`));
  console.log(`  --at=${at}: blocks y ${top} to ${bottom} (the pack: first block no higher than ${minTop}, last ending by ${maxEnd})${shift ? `; photo moved down ${px(shift)}px` : ''}`);
  console.log(`  faces found: ${faceBoxes.length ? faceBoxes.map((f, i) => `x ${f[0]} to ${f[2]}, y ${f[1]} to ${f[3]}, no blocks below y ${noGo[i][1]} (eyebrows)`).join('; ') : 'none'}`);
  if (forehead) console.log(`  forehead: hairline y ${forehead.hair}, eyebrows y ${forehead.brow}, halfway y ${forehead.mid}`);
  if (span) console.log(`  stack centred between y ${span[0]} and ${span[1]} (centre ${Math.round((span[0] + span[1]) / 2)})${at === 'forehead' ? ': the top of the grid view and halfway down the forehead (the pack)' : ''}`);
  if (r.handle) console.log(`  handle y ${r.handle[0]} to ${r.handle[1]}, x ${r.handle[2]} to ${r.handle[3]}; ${r.handle[0] - bottom}px below the last block`);
  // The pack: a handle that would land on a face is left off.
  const handleOnFace = r.handle && faceBoxes.some((f) => f[1] < r.handle[1] && f[3] > r.handle[0] && f[0] < r.handle[3] && f[2] > r.handle[2]);
  if (handleOnFace) { await pg.evaluate(() => document.querySelector('.u').remove()); console.log(`  handle left off: at y ${r.handle[0]} it would sit on a face (the pack: ${K.handleOnFace.split(':')[0]})`); }
  const grid = B.safeArea.coverGrid;
  console.log(`  in the profile grid (y ${px(grid.y0)} to ${px(grid.y1)} shown): first block ${top - px(grid.y0)}px below the tile's top edge`);

  if (!r.fonts) faults.push('the fonts did not load');
  if (top < minTop - 1) faults.push(`the first block starts at y ${top}, above the pack's ${minTop} (the grid crops the top 240px and the reel icon sits top right)`);
  if (bottom > maxEnd + 2) faults.push(`the blocks end at y ${bottom}, below the pack's ${maxEnd}: move them up or shorten the hook`);
  if (handSize && (handSize < K.minPx || handSize > K.maxPx)) faults.push(`--px=${handSize} is outside the pack's ${K.minPx} to ${K.maxPx}px`);
  if (right - left > px(K.fitWidth) + 4) faults.push(`a block is ${right - left}px wide, over the pack's ${px(K.fitWidth)} even at the smallest size: shorten that line`);
  const ic = K.toolOwn.reelIconInGrid, gy = px(B.safeArea.coverGrid.y0);
  const icon = [px(ic.x0 - ic.clear), gy + px(ic.y0 - ic.clear), px(ic.x1 + ic.clear), gy + px(ic.y1 + ic.clear)];
  const onIcon = r.boxes.filter((b) => b[0] < icon[2] && b[2] > icon[0] && b[1] < icon[3] && b[3] > icon[1]);
  console.log(`  Reel icon in the grid: x ${icon[0]} to ${icon[2]}, y ${icon[1]} to ${icon[3]} (with ${px(ic.clear)}px clear): ${onIcon.length ? 'a block runs into it' : 'clear'}`);
  if (onIcon.length) faults.push(`block ${r.boxes.indexOf(onIcon[0]) + 1} runs into the Reel icon in the profile grid: set it smaller with --px or move the stack down`);
  const hit = noGo.filter((f) => r.boxes.some((b) => b[0] < f[2] && b[2] > f[0] && b[1] < f[3] && b[3] > f[1]));
  if (hit.length) faults.push(`a block sits on a face (${hit.map((f) => `y ${f[1]} to ${f[3]}`).join('; ')}): try another --at, or --shift to move the photo down`);
  if (faults.length && !process.env.ALLOW_UNSAFE) { console.error('NOT WRITTEN: ' + faults.join('; ')); await br.close(); process.exit(1); }
  await pg.screenshot({ path: out, type: 'jpeg', quality: 92 });
  await br.close();
  console.log(faults.length ? `  wrote ${out} although: ${faults.join('; ')} (ALLOW_UNSAFE)` : `  wrote ${out}`);
})();
