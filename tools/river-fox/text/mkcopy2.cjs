// Headline, closing text and handle for VIDEO, as transparent overlays (covers and thumbnails are thumb.cjs).
//   node mkcopy2.cjs hl-two out.png "A Worplesdon" "welcome."
//   node mkcopy2.cjs finale out.png "Ta-da." "Christmas has arrived." "A garland arch and wreath"
//   node mkcopy2.cjs handle out.png                          (HANDLETOP=300 on video: the handle sits at the top)
// The look follows the pack's board "Headline and closing text on video": the cover face, line 1 upright and line 2
// italic at the same size, fitted to WIDTH (default from ../brand-pack.json, inside the pack's width limit for text on
// video); the closing text is one large word or short phrase, a smaller italic line and the small capitals line. After
// drawing, it measures where the lettering really sits and refuses to write a file outside the Instagram safe area
// (Reels, or Stories with STORY=1). ALLOW_UNSAFE=1 writes it anyway and says so. HEADTOP moves the headline's centre and
// FINTOP the closing text's top: put words on a calm part of the picture, never on Laura's face or the piece.
// No brand value is written in this file: everything comes from ../brand-pack.json, which names the board for each.
const puppeteer = require(require('path').join(__dirname,'../../photo-grade/node_modules/puppeteer-core'));
const B = require('../brand-pack.json');
const V = B.videoText, HL = V.headline, FN = V.finale, WHITE = B.colour.warmWhite, CAPS = V.capsLine;
const HANDLE = `font-family:"${B.handle.font}",sans-serif;font-weight:${B.handle.weight};font-size:${V.handlePx}px;letter-spacing:${B.handle.tracking};text-transform:uppercase`;
const [mode, out, a, b, c] = process.argv.slice(2);
if (mode === 'hl-stack') { console.error('hl-stack was removed: the pack sets a headline as two lines of the same size (hl-two).'); process.exit(1); }
if (!['hl-two', 'finale', 'handle'].includes(mode) || !out) { console.error('usage: node mkcopy2.cjs hl-two|finale|handle out.png ...'); process.exit(1); }
if (process.env.WEIGHT) { console.error('WEIGHT was removed: the pack has one weight for text on video.'); process.exit(1); }
const fam = (f) => f.replace(/ /g, '+');
const FONTS = `<link href="https://fonts.googleapis.com/css2?family=${fam(CAPS.font)}:wght@${B.handle.weight};${CAPS.weight}&family=${fam(V.font)}:ital@0;1&display=block" rel="stylesheet">`;
const WIDTH = Number(process.env.WIDTH || V.toolOwn.fitWidth);
if (WIDTH > V.maxWidth) { console.error(`WIDTH ${WIDTH} is over the pack's ${V.maxWidth}px limit for text on video.`); process.exit(1); }
const SERIF = `font-family:"${V.font}",serif;font-weight:${V.weight};letter-spacing:${V.tracking};line-height:${V.leading};margin:0;white-space:nowrap`;
const FADE = (g) => `.s{position:absolute;inset:0;background:${g}}`;
const CSS = {
  'hl-two': FADE(HL.fade) + `.t{position:absolute;top:0;left:0;right:0;text-align:center;color:${WHITE};text-shadow:${HL.shadow}}h1{${SERIF};font-size:100px}h1 span,h1 em{display:block}h1 em{font-style:italic}`,
  finale: FADE(FN.fade) + `.t{position:absolute;top:${process.env.FINTOP || FN.topY}px;left:0;right:0;text-align:center;color:${WHITE};text-shadow:${FN.shadow}}h1{${SERIF};font-size:${FN.wordPx}px}h2{${SERIF};font-style:italic;font-size:${FN.linePx}px;margin-top:${FN.lineGap}px}p{font-family:"${CAPS.font}",sans-serif;font-weight:${CAPS.weight};font-size:${CAPS.px}px;letter-spacing:${CAPS.tracking};text-transform:uppercase;margin:${FN.capsGap}px 0 0}`,
  handle: `.u{position:absolute;left:0;right:0;${process.env.HANDLETOP ? `top:${process.env.HANDLETOP}px;` : 'bottom:120px;'}text-align:center;color:${WHITE};${HANDLE};text-shadow:${HL.shadow}}`,
};
const BODY = {
  'hl-two': `<div class=s></div><div class=t><h1><span>${a}</span><em>${b}</em></h1></div>`,
  finale: `<div class=s></div><div class=t><h1>${a}</h1><h2>${b}</h2>${c ? `<p>${c}</p>` : ''}</div>`,
  handle: `<div class=u>${B.handle.text}</div>`,
};
(async () => {
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const pg = await br.newPage();
  await pg.setViewport({ width: 1080, height: 1920 });
  await pg.setContent(`<!doctype html><meta charset=utf-8>${FONTS}<style>html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:transparent}${CSS[mode]}</style>${BODY[mode]}`, { waitUntil: 'networkidle0' });
  await pg.evaluate(() => document.fonts.ready);
  const sizes = await pg.evaluate(([mode, WIDTH, centre]) => {
    const wid = (el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().width; };
    if (mode === 'hl-two') {
      const h1 = document.querySelector('h1'); const w = Math.max(wid(h1.querySelector('span')), wid(h1.querySelector('em')));
      h1.style.fontSize = (100 * WIDTH / w) + 'px';
      const t = document.querySelector('.t'); t.style.top = (centre - t.getBoundingClientRect().height / 2) + 'px';
      return `headline ${Math.round(100 * WIDTH / w)}px, both lines the same size`;
    }
    if (mode === 'finale') {
      const fitDown = (el) => { const fs = parseFloat(getComputedStyle(el).fontSize); if (wid(el) > WIDTH) el.style.fontSize = (fs * WIDTH / wid(el)) + 'px'; return Math.round(parseFloat(el.style.fontSize || fs)); };
      return `closing word ${fitDown(document.querySelector('h1'))}px, italic line ${fitDown(document.querySelector('h2'))}px`;
    }
    return '';
  }, [mode, WIDTH, Number(process.env.HEADTOP || HL.centreY)]);
  if (sizes) console.log(sizes);
  const png = await pg.screenshot({ omitBackground: true, type: 'png' });
  // where the lettering really is: solid, near-white pixels (the soft fade and the shadow are neither)
  const ink = await pg.evaluate(async (b64) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
    const c = document.createElement('canvas'); c.width = 1080; c.height = 1920;
    const cx = c.getContext('2d'); cx.drawImage(im, 0, 0);
    const d = cx.getImageData(0, 0, 1080, 1920).data;
    let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
    for (let y = 0; y < 1920; y++) for (let x = 0; x < 1080; x++) {
      const i = (y * 1080 + x) * 4;
      if (d[i + 3] > 200 && Math.min(d[i], d[i + 1], d[i + 2]) > 200) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    return { x0, x1, y0, y1 };
  }, Buffer.from(png).toString('base64'));
  await br.close();
  const SAFE = process.env.STORY ? B.safeArea.story : B.safeArea.reel;
  const outside = [['left', ink.x0 < SAFE.x0], ['right', ink.x1 > SAFE.x1], ['top', ink.y0 < SAFE.y0], ['bottom', ink.y1 > SAFE.y1]].filter((s) => s[1]).map((s) => s[0]);
  console.log(`lettering x ${ink.x0} to ${ink.x1}, y ${ink.y0} to ${ink.y1}, ${ink.x1 - ink.x0 + 1} wide; safe area x ${SAFE.x0} to ${SAFE.x1}, y ${SAFE.y0} to ${SAFE.y1}`);
  if (outside.length && !process.env.ALLOW_UNSAFE) {
    console.error(`NOT WRITTEN: the lettering is outside the safe area on the ${outside.join(' and ')}. Make WIDTH smaller or move it (HEADTOP, FINTOP, HANDLETOP).`);
    process.exit(1);
  }
  require('fs').writeFileSync(out, png);
  console.log(outside.length ? `wrote ${out} although it is OUTSIDE the safe area on the ${outside.join(' and ')} (ALLOW_UNSAFE)` : `wrote ${out}, inside the safe area`);
})();
