// Thumbnail / cover: one big two-line headline and the small handle. Nothing else.
//   node thumb.cjs <photo> <out> <w> <h> "Line1" "Line2" [--fade=auto|light|standard] [--hook=auto|long|short]
//
// No brand value is written in this file. Every size, colour, font setting and position comes from
// ../brand-pack.json, which names the Brand Pack canvas board each one was copied from. To change the look,
// change the canvas, then that file.
//
// What it decides itself, and prints every time:
//   fade  - every cover gets the canvas's whole-image eased gradient (the canvas does not say how light a "light photo"
//           is, so the tool does not guess); --fade=standard gives the older straight one. The photo's brightness is printed.
//   hook  - a long hook gets line 2 smaller than line 1; a short hook stays one size; --hook=long or --hook=short overrides.
// It then measures the lettering and will not write a cover whose words fall outside the fitted width or, on a
// 9:16 cover, outside what the profile grid shows (ALLOW_UNSAFE=1 writes it anyway and says so).
const path = require('path');
const fs = require('fs');
const puppeteer = require(path.join(__dirname, '../../photo-grade/node_modules/puppeteer-core'));
const B = require('../brand-pack.json');

const argv = process.argv.slice(2);
const flag = (n, d) => (argv.find((a) => a.startsWith(`--${n}=`)) || `--${n}=${d}`).split('=')[1];
const [photo, out, W, H, raw1, raw2] = argv.filter((a) => !a.startsWith('--'));
if (!photo || !out || !W || !H || !raw1 || !raw2) {
  console.log('usage: node thumb.cjs <photo> <out> <w> <h> "Line1" "Line2" [--fade=auto|light|standard] [--hook=auto|long|short]');
  process.exit(1);
}
const curly = (s) => s.replace(/(^|[\s(])"/g, '$1“').replace(/"/g, '”').replace(/(^|[\s(])'/g, '$1‘').replace(/'/g, '’');
const l1 = curly(raw1), l2 = curly(raw2);
const w = +W, h = +H, k = w / 1080;
const shape = h / w > 1.7 ? '9x16' : Math.abs(h / w - 1.25) < 0.02 ? '4x5' : '3x4';
const C = B.cover, L = C.layout[shape], T = C.type, ink = B.colour.inkRgb, white = B.colour.warmWhite;
const fit = C.fit.widthAt1080 * k;
const px = (n) => Math.round(n * k);
const gradient = (stops) => `linear-gradient(to bottom, ${stops.map(([at, a]) => `rgba(${ink},${a}) ${at}%`).join(', ')})`;

// 9:16: the hook block ends at hookBottomY and the handle starts at handleTopY, both from the top (as the canvas draws them).
// 3:4 and 4:5: the handle sits handleFromBottom up, the hook a fixed step above it.
const hookCss = shape === '9x16'
  ? `top:0;height:${px(L.hookBottomY)}px`
  : `top:0;bottom:${px(L.handleFromBottom + L.toolOwn.hookAboveHandle)}px`;
const handleCss = shape === '9x16'
  ? `top:${px(L.handleTopY)}px;line-height:${px(L.handleLinePx)}px`
  : `bottom:${px(L.handleFromBottom)}px;line-height:1`;

const img = 'data:image/jpeg;base64,' + fs.readFileSync(photo).toString('base64');
const html = `<!doctype html><meta charset=utf-8>
<link href="https://fonts.googleapis.com/css2?family=${B.handle.font.replace(/ /g, '+')}:wght@${B.handle.weight}&family=${T.font}:ital,opsz,wght@0,9..144,${T.weight};1,9..144,${T.weight}&display=block" rel=stylesheet>
<style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#000}
.p{position:relative;width:${w}px;height:${h}px;overflow:hidden}
.p img{position:absolute;left:0;top:0;width:${w}px;height:${h}px;object-fit:cover}
.f{position:absolute;left:0;top:0;width:${w}px;height:${h}px}
.t{position:absolute;left:0;width:${w}px;${hookCss};display:flex;flex-direction:column;justify-content:flex-end;text-align:center;color:${white};
  font-family:'${T.font}',serif;font-variation-settings:'opsz' ${T.opticalSize};font-weight:${T.weight};letter-spacing:${T.tracking};word-spacing:${T.wordSpacing};white-space:nowrap}
.l1{font-size:100px;line-height:${T.line1Leading}}
.l2{font-size:100px;line-height:${T.line2Leading};font-style:italic}
.u{position:absolute;left:0;width:${w}px;${handleCss};text-align:center;color:${white};font-family:'${B.handle.font}',sans-serif;font-weight:${B.handle.weight};font-size:${px(L.handlePx)}px;letter-spacing:${B.handle.tracking};text-transform:uppercase}</style>
<div class=p><img src="${img}"><div class=f></div><div class=t><div class=l1><span>${l1}</span></div><div class=l2><span>${l2}</span></div></div><div class=u><span>${B.handle.text}</span></div></div>`;

(async () => {
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const pg = await br.newPage(); await pg.setViewport({ width: w, height: h });
  await pg.setContent(html, { waitUntil: 'networkidle0', timeout: 90000 }); await pg.evaluate(() => document.fonts.ready);

  // How light is the photo, as it is cropped into this frame? 0 is black, 1 is white.
  const brightness = await pg.evaluate(async () => {
    const im = document.querySelector('.p img'); await im.decode();
    const cw = 108, ch = Math.round(108 * innerHeight / innerWidth), c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight), dw = im.naturalWidth * s, dh = im.naturalHeight * s;
    const cx = c.getContext('2d'); cx.drawImage(im, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    const d = cx.getImageData(0, 0, cw, ch).data; let sum = 0;
    for (let i = 0; i < d.length; i += 4) sum += 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    return sum / (d.length / 4) / 255;
  });
  const fadeAsk = flag('fade', 'auto');
  const fadeKind = fadeAsk === 'auto' ? C.fade.toolOwn.default : fadeAsk;
  const F = C.fade[fadeKind];
  if (!F || !F.stops) { console.error(`unknown --fade=${fadeAsk}`); process.exit(1); }

  const m = await pg.evaluate(({ fit, k, LH, hookAsk, grad, shadow, handleShadow }) => {
    document.querySelector('.f').style.background = grad;
    document.querySelector('.t').style.textShadow = shadow;
    document.querySelector('.u').style.textShadow = handleShadow;
    const box = (sel) => document.querySelector(sel + ' span').getBoundingClientRect();
    const e1 = document.querySelector('.l1'), e2 = document.querySelector('.l2');
    const w1 = box('.l1').width, w2 = box('.l2').width;              // both at 100px
    const long = hookAsk === 'auto' ? w2 > w1 : hookAsk === 'long';
    let s1, s2, note = '';
    if (long) {
      s1 = 100 * fit / w1;
      const min = LH.line2MinPxAt1080 * k;
      s2 = Math.max(min, LH.line2Scale * s1);
      if (w2 * s2 / 100 > fit) { s2 = Math.max(min, 100 * fit / w2); note = 'line 2 shrunk to fit'; }
    } else { s1 = s2 = 100 * fit / Math.max(w1, w2); }
    e1.style.fontSize = s1 + 'px'; e2.style.fontSize = s2 + 'px';
    const a = box('.l1'), b = box('.l2'), u = box('.u');
    const r = (n) => Math.round(n);
    return { long, note, s1: r(s1), s2: r(s2), w1: r(a.width), w2: r(b.width), left: r(Math.min(a.left, b.left)), right: r(Math.max(a.right, b.right)),
      hookTop: r(a.top), hookBottom: r(b.bottom), handleTop: r(u.top), handleBottom: r(u.bottom), handleW: r(u.width),
      fonts: document.fonts.check(`500 20px Fraunces`) && document.fonts.check(`500 20px 'DM Sans'`) };
  }, { fit, k, LH: C.longHook, hookAsk: flag('hook', 'auto'), grad: gradient(F.stops), shadow: F.shadow, handleShadow: F.handleShadow });

  console.log(`${path.basename(out)} (${w}x${h}, ${shape})`);
  console.log(`  photo brightness ${brightness.toFixed(2)} (0 black, 1 white); ${fadeKind} fade${fadeAsk === 'auto' ? '' : ' (set by --fade)'}: whole image, ${F.stops.map(([at, a]) => `${Math.round(a * 100)}% at ${at}%`).join(', ')}  [${F.board}]`);
  console.log(`  ${m.long ? 'long' : 'short'} hook: line 1 ${m.s1}px, ${m.w1}px wide; line 2 ${m.s2}px (${(m.s2 / m.s1).toFixed(2)} of line 1), ${m.w2}px wide${m.note ? '; ' + m.note : ''}`);
  console.log(`  lettering x ${m.left} to ${m.right}, y ${m.hookTop} to ${m.hookBottom}; handle y ${m.handleTop} to ${m.handleBottom}, ${m.handleW}px wide; both lines ${white}; fonts loaded: ${m.fonts}`);

  const x0 = Math.floor((w - fit) / 2) - 2, x1 = Math.ceil((w + fit) / 2) + 2;
  const faults = [];
  if (!m.fonts) faults.push('the fonts did not load');
  if (m.left < x0 || m.right > x1) faults.push(`a line is wider than the ${Math.round(fit)}px fit (x ${x0} to ${x1}): shorten the hook`);
  if (m.long && m.s2 < Math.round(C.longHook.line2MinPxAt1080 * k)) faults.push('line 2 is under the smallest size allowed');
  if (shape === '9x16') {
    const g = B.safeArea.coverGrid;
    if (m.hookTop < px(g.y0)) faults.push(`the headline starts above what the profile grid shows (y ${px(g.y0)})`);
    if (m.handleBottom > px(g.y1)) faults.push(`the handle ends below what the profile grid shows (y ${px(g.y1)})`);
  } else if (m.hookTop < 0) faults.push('the headline runs off the top');
  if (faults.length && !process.env.ALLOW_UNSAFE) { console.error('NOT WRITTEN: ' + faults.join('; ')); await br.close(); process.exit(1); }

  await pg.screenshot({ path: out, type: 'jpeg', quality: 92 });
  await br.close();
  console.log(faults.length ? `  wrote ${out} although: ${faults.join('; ')} (ALLOW_UNSAFE)` : `  wrote ${out}`);
})();
