// Thumbnail / cover: one big headline (one or two lines), an optional small capitals line, and the small handle.
//   node thumb.cjs <photo> <out> <w> <h> "Line1" ["Line2"] [--caps="small capitals line"] [--at=middle|top|<y>]
//                  [--italic] [--tint] [--no-handle]
//   node thumb.cjs <photo> <out> 1080 1920 "Line1" "Line2" ["Line3"] --blocks [--at=face|top|middle|lower|<y>] [--px=<size>]
//                  the colour-block cover, for when the words would land on a face: see blocks.cjs
//
// No brand value is written in this file. Every size, colour, font setting and position comes from
// ../brand-pack.json, where each group says what it is about. To change the look, Matt changes
// the pack; then that file changes to match.
//
// What it does, and prints every time:
//   type  - the headline is set in the pack's cover face, line 1 upright and line 2 italic, both the same size. The size
//           follows the words: the longer line is fitted to the pack's width for this shape, up to the pack's biggest
//           size. A one-word headline must end with a full stop. A headline that would come out smaller than the
//           tool's smallest size is refused: shorten it, or move words into --caps. Never shrink it to fit a sentence.
//   caps  - --caps adds the one small capitals line under the headline, when the headline needs more words.
//   place - --at=middle (the default, where the pack's examples sit), --at=top, or --at=<y> (the headline's centre,
//           in pixels at this frame's own size). It measures how busy the photo is under the headline and in the other
//           spots and says if a calmer one exists: words never sit on the subject if there is a calm spot. Look at it.
//   fade  - every photo cover gets the pack's one gradient over the whole image. --tint adds the pack's even dark tint
//           when the words still don't read. --no-handle leaves the handle off a very busy photo.
//   faces - it looks for faces (Apple Vision, as blocks.cjs does). Words on a face are refused: the pack says put the hook
//           under the face, or use colour blocks (--blocks, Reel covers only). A handle whose fixed spot would land on a
//           face is left off, as the pack says (cover.faces).
// It then measures the lettering and will not write a cover whose words fall outside the fitted width, outside what the
// profile grid shows (9:16), too close to the handle, or off the frame (ALLOW_UNSAFE=1 writes it anyway and says so).
const path = require('path');
const fs = require('fs');
const puppeteer = require(path.join(__dirname, '../../photo-grade/node_modules/puppeteer-core'));
const B = require('../brand-pack.json');
const { faces, photoSize, coverFit, faceBoxes, overlaps, busy: busyIn, calmer } = require('./photo-check.cjs');

// The colour-block cover (the pack's cover rules, for words that would land on a face) lives in blocks.cjs; --blocks hands over to it.
if (process.argv.includes('--blocks')) { require('./blocks.cjs'); return; }

const argv = process.argv.slice(2);
const flag = (n) => { const a = argv.find((x) => x === `--${n}` || x.startsWith(`--${n}=`)); return a === undefined ? undefined : a.includes('=') ? a.split('=').slice(1).join('=') : true; };
for (const old of ['hook', 'fade']) if (flag(old) !== undefined) { console.error(`--${old} was removed: the pack has one headline size rule and one fade.`); process.exit(1); }
const [photo, out, W, H, raw1, raw2] = argv.filter((a) => !a.startsWith('--'));
if (!photo || !out || !W || !H || !raw1) {
  console.log('usage: node thumb.cjs <photo> <out> <w> <h> "Line1" ["Line2"] [--caps="..."] [--at=middle|top|<y>] [--italic] [--tint] [--no-handle]');
  process.exit(1);
}
const curly = (s) => s.replace(/(^|[\s(])"/g, '$1“').replace(/"/g, '”').replace(/(^|[\s(])'/g, '$1‘').replace(/'/g, '’');
const l1 = curly(raw1), l2 = raw2 ? curly(raw2) : '';
const caps = typeof flag('caps') === 'string' ? curly(flag('caps')) : '';
const w = +W, h = +H, k = w / 1080;
const shape = h / w > 1.7 ? '9x16' : Math.abs(h / w - 1.25) < 0.02 ? '4x5' : '3x4';
const C = B.cover, L = C.layout[shape], T = C.type, S = C.size, CP = C.capsLine, F = C.fade, ink = B.colour.inkRgb, white = B.colour.warmWhite;
const px = (n) => Math.round(n * k);
const fit = S.fitWidth[shape] * k, maxPx = S.maxPx * k, minPx = S.toolOwn.minPx * k;
const plain = `${raw1} ${raw2 || ''}`.replace(/&[a-z]+;/g, ' ').trim();
const words = plain.split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x));
const handle = flag('no-handle') === undefined;
const at = flag('at') || 'middle';
const centreY = at === 'middle' ? px(L.middleY) : at === 'top' ? null : Number(at);
if (at !== 'middle' && at !== 'top' && !Number.isFinite(centreY)) { console.error(`unknown --at=${at}: use middle, top or a number`); process.exit(1); }
const lowest = Math.min(shape === '9x16' ? px(L.hookBottomMax) : Infinity, handle ? (shape === '9x16' ? px(L.handleTopY) : h - px(L.handleFromBottom) - px(L.handlePx)) - px(L.handleClear) : h - px(B.safeArea.feedEdgeClear));
const gradient = (stops) => `linear-gradient(to bottom, ${stops.map(([p, a]) => `rgba(${ink},${a}) ${p}%`).join(', ')})`;
const handleCss = shape === '9x16' ? `top:${px(L.handleTopY)}px;line-height:${px(L.handleLinePx)}px` : `bottom:${px(L.handleFromBottom)}px;line-height:1`;

const faults = [];
// Faces, with Apple Vision, as boxes in this frame (a little wider than Vision's own box).
let faceBox = [];
try {
  const found = faces(photo);
  if (found.length) faceBox = faceBoxes(found, coverFit(...photoSize(photo), w, h), B.cover.faces.toolOwn.faceMargin);
} catch (e) {
  if (!process.env.ALLOW_UNSAFE) { console.error(`NOT WRITTEN: could not look for faces (Apple Vision, on the Mac): ${String(e.message).split('\n')[0]}`); process.exit(1); }
  console.log('  faces NOT checked (ALLOW_UNSAFE)');
}
if (words.length === 1 && !plain.endsWith(S.singleWordEndsWith)) faults.push(`a one-word headline ends with a full stop (the pack): "${plain}${S.singleWordEndsWith}"`);

const img = 'data:image/jpeg;base64,' + fs.readFileSync(photo).toString('base64');
const fam = (f) => f.replace(/ /g, '+');
const html = `<!doctype html><meta charset=utf-8>
<link href="https://fonts.googleapis.com/css2?family=${fam(T.font)}:ital@0;1&family=${fam(B.handle.font)}:wght@${B.handle.weight};${CP.weight}&display=block" rel=stylesheet>
<style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#000}
.p{position:relative;width:${w}px;height:${h}px;overflow:hidden}
.p img{position:absolute;left:0;top:0;width:${w}px;height:${h}px;object-fit:cover}
.f,.g{position:absolute;left:0;top:0;width:${w}px;height:${h}px}
.t{position:absolute;left:0;width:${w}px;top:0;display:flex;flex-direction:column;align-items:center;text-align:center;color:${white}}
.hl{font-family:'${T.font}',serif;font-weight:${T.weight};letter-spacing:${T.tracking};line-height:${T.leading};white-space:nowrap;font-size:100px}
.hl div{display:block}.hl .i{font-style:italic}
.c{font-family:'${CP.font}',sans-serif;font-weight:${CP.weight};font-size:${px(CP.px)}px;line-height:${CP.leading};letter-spacing:${CP.tracking};text-transform:uppercase;white-space:nowrap;margin-top:${px(CP.gap)}px;text-shadow:${CP.shadow}}
.u{position:absolute;left:0;width:${w}px;${handleCss};text-align:center;color:${white};font-family:'${B.handle.font}',sans-serif;font-weight:${B.handle.weight};font-size:${px(L.handlePx)}px;letter-spacing:${B.handle.tracking};text-transform:uppercase}</style>
<div class=p><img src="${img}"><div class=f></div><div class=g></div>
<div class=t><div class=hl><div class="${!l2 && flag('italic') ? 'i' : ''}"><span>${l1}</span></div>${l2 ? `<div class=i><span>${l2}</span></div>` : ''}</div>${caps ? `<div class=c><span>${caps}</span></div>` : ''}</div>
${handle ? `<div class=u><span>${B.handle.text}</span></div>` : ''}</div>`;

(async () => {
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const pg = await br.newPage(); await pg.setViewport({ width: w, height: h });
  await pg.setContent(html, { waitUntil: 'networkidle0', timeout: 90000 }); await pg.evaluate(() => document.fonts.ready);

  const m = await pg.evaluate(({ fit, maxPx, grad, tint, shadow, handleShadow, centreY, topY, lowest }) => {
    document.querySelector('.f').style.background = grad;
    if (tint) document.querySelector('.g').style.background = tint;
    document.querySelector('.hl').style.textShadow = shadow;
    const u = document.querySelector('.u'); if (u) u.style.textShadow = handleShadow;
    const hl = document.querySelector('.hl'), spans = [...hl.querySelectorAll('span')];
    const widest = Math.max(...spans.map((s) => s.getBoundingClientRect().width));   // at 100px
    const size = Math.min(maxPx, 100 * fit / widest);
    hl.style.fontSize = size + 'px';
    const t = document.querySelector('.t'), th = t.getBoundingClientRect().height;
    // never lower than the pack allows: if a capitals line makes the block taller, it moves up instead
    let top = centreY === null ? topY : centreY - th / 2, moved = 0;
    if (top + th > lowest) { moved = Math.round(top + th - lowest); top = lowest - th; }
    t.style.top = top + 'px';
    const r = (n) => Math.round(n), box = (el) => el.getBoundingClientRect();
    const lines = spans.map((s) => r(box(s).width));
    const all = [...spans, ...(document.querySelector('.c span') ? [document.querySelector('.c span')] : [])].map(box);
    const ub = u ? box(u) : null, us = u ? box(u.querySelector('span')) : null;
    return { moved, size: r(size), lines, boxes: all.map((b) => [r(b.left), r(b.top), r(b.right), r(b.bottom)]),
      handleBox: us ? [r(us.left), r(us.top), r(us.right), r(us.bottom)] : null, capsW: document.querySelector('.c span') ? r(box(document.querySelector('.c span')).width) : 0,
      left: r(Math.min(...all.map((b) => b.left))), right: r(Math.max(...all.map((b) => b.right))),
      top: r(box(t).top), bottom: r(box(t).bottom), handleTop: ub ? r(ub.top) : null, handleBottom: ub ? r(ub.bottom) : null,
      fonts: document.fonts.check(`20px "${getComputedStyle(hl).fontFamily.split(',')[0].replace(/['"]/g, '')}"`) };
  }, { fit, maxPx, grad: gradient(F.stops), tint: flag('tint') ? `rgba(${ink},${F.tint})` : '', shadow: F.shadow, handleShadow: F.handleShadow, centreY, topY: px(L.toolOwn.topY), lowest });

  // How busy the photo is (average edge strength, 0 calm) in the band the headline covers and in the other spots.
  const hgt = m.bottom - m.top, mid = px(L.middleY), topY = px(L.toolOwn.topY);
  const busy = await pg.evaluate(busyIn, { src: img, w, h, bands: [['headline', m.top, m.bottom], ['middle', mid - hgt / 2, mid + hgt / 2], ['top', topY, topY + hgt]] });

  // Faces: words never on one (the pack: under the face, or colour blocks), and the handle left off one.
  const wordsOnFace = faceBox.filter((f) => m.boxes.some((b) => overlaps(f, b)));
  if (wordsOnFace.length) faults.push(`the words land on a face (y ${wordsOnFace[0][1]} to ${wordsOnFace[0][3]}). The pack: ${B.cover.faces.words} Move them under the face with --at=<y>${shape === '9x16' ? ', or run with --blocks' : ''}`);
  const handleOnFace = m.handleBox && faceBox.some((f) => overlaps(f, m.handleBox));
  if (handleOnFace) {
    await pg.evaluate(() => document.querySelector('.u').remove());
    console.log(`  handle left off: at y ${m.handleBox[1]} it would sit on a face (the pack: ${B.cover.faces.handle})`);
    m.handleTop = m.handleBottom = null;
  }

  console.log(`${path.basename(out)} (${w}x${h}, ${shape})`);
  console.log(`  fade over the whole image${flag('tint') ? ` plus an even ${Math.round(F.tint * 100)}% tint` : ''}  [the pack's ${F.subject}]`);
  console.log(`  ${words.length} word(s) in the headline${words.length > S.words.upTo ? ` - the pack asks for ${S.words.upTo} or fewer; move the rest to --caps if it reads better` : ''}; ${T.font} ${m.size}px, both lines the same size; line widths ${m.lines.join(' / ')}px (fit ${Math.round(fit)}, biggest ${Math.round(maxPx)}px)`);
  if (caps) console.log(`  capitals line ${CP.font} ${CP.weight} ${px(CP.px)}px, ${m.capsW}px wide`);
  console.log(`  lettering x ${m.left} to ${m.right}, y ${m.top} to ${m.bottom} (--at=${at}${m.moved ? `, moved up ${m.moved}px to keep the handle clear` : ''})${m.handleTop !== null ? `; handle y ${m.handleTop} to ${m.handleBottom}` : '; no handle'}; fonts loaded: ${m.fonts}`);
  console.log(`  faces found: ${faceBox.length}${faceBox.length ? ` (${faceBox.map((f) => `y ${f[1]} to ${f[3]}`).join('; ')})` : ''}`);
  const calm = calmer(busy);
  console.log(`  how busy the photo is behind the words (lower is calmer): ${busy.map(([n, v]) => `${n} ${v.toFixed(1)}`).join(', ')}`);
  if (calm) console.log(`  CHECK: the ${calm} spot is calmer than where the words are. Words never sit on the subject if there is a calm spot: look, and try --at=${calm} if the subject is under them.`);

  const x0 = Math.floor((w - fit) / 2) - 2, x1 = Math.ceil((w + fit) / 2) + 2;
  if (!m.fonts) faults.push('the fonts did not load');
  if (m.size < minPx) faults.push(`the headline came out at ${m.size}px, under ${Math.round(minPx)}px: shorten it or move words to --caps (never shrink the headline to fit a sentence)`);
  if (m.left < x0 || m.right > x1) faults.push(`a line is wider than the ${Math.round(fit)}px fit (x ${x0} to ${x1}): shorten the capitals line`);
  if (m.top < px(L.hookTopMin)) faults.push(`the words start above y ${px(L.hookTopMin)}`);
  if (shape === '9x16' && m.bottom > px(L.hookBottomMax) + 4) faults.push(`the words end below y ${px(L.hookBottomMax)}`);
  if (m.handleTop !== null && m.handleTop - m.bottom < px(L.handleClear) - 4) faults.push(`only ${m.handleTop - m.bottom}px between the words and the handle (the pack asks for ${px(L.handleClear)})`);
  if (m.handleTop === null && m.bottom > h - px(B.safeArea.feedEdgeClear)) faults.push('the words run into the foot of the frame');
  if (shape === '9x16' && m.handleBottom !== null && m.handleBottom > px(B.safeArea.coverGrid.y1)) faults.push(`the handle ends below what the profile grid shows (y ${px(B.safeArea.coverGrid.y1)})`);
  if (faults.length && !process.env.ALLOW_UNSAFE) { console.error('NOT WRITTEN: ' + faults.join('; ')); await br.close(); process.exit(1); }

  await pg.screenshot({ path: out, type: 'jpeg', quality: 92 });
  await br.close();
  console.log(faults.length ? `  wrote ${out} although: ${faults.join('; ')} (ALLOW_UNSAFE)` : `  wrote ${out}`);
})();
