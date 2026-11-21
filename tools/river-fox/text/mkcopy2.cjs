// River Fox copy style, round 2 (Matt 21 Nov): lighter fade, a stacked headline option, a smaller "Ta-da.", and ONE fixed handle.
//   node mkcopy2.cjs hl-two   out.png                       "A Worplesdon" "welcome."
//   node mkcopy2.cjs hl-stack out.png                       "A" "Worplesdon" "welcome."
//   node mkcopy2.cjs finale   out.png                       "Ta-da." "Your door's sorted." "A GARLAND ARCH AND WREATH"
//   node mkcopy2.cjs handle   out.png                       (@RIVERFOX_EVENTS, always the same size and place)
const puppeteer = require(require('path').join(__dirname,'../../photo-grade/node_modules/puppeteer-core'));
const [mode, out, a, b, c] = process.argv.slice(2);
const FONTS = '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@600&family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&display=block" rel="stylesheet">';
const SHADOW = 'text-shadow:0 2px 26px rgba(0,0,0,.5),0 1px 4px rgba(0,0,0,.42)';
const HFADE = '.s{position:absolute;bottom:0;left:0;right:0;height:1050px;background:linear-gradient(rgba(20,16,12,0),rgba(20,16,12,.30) 55%,rgba(20,16,12,.40))}';
const WT = process.env.WEIGHT || 400, WIDTH = Number(process.env.WIDTH || 900);
const SERIF = `font-family:Fraunces,serif;font-weight:${WT};letter-spacing:-.035em;margin:0;white-space:nowrap`;
const CSS = {
  'hl-two': HFADE + `.t{position:absolute;top:${process.env.HEADTOP||1260}px;left:0;right:0;text-align:center;color:#fff;${SHADOW}}h1{${SERIF};font-size:124px;line-height:.98}h1 em{font-style:italic;display:block}`,
  'hl-stack': HFADE + `.t{position:absolute;top:1130px;left:0;right:0;text-align:center;color:#fff;${SHADOW}}.l1{${SERIF};font-size:150px;line-height:.9}.l2{${SERIF};font-size:230px;line-height:.9}.l3{${SERIF};font-style:italic;font-size:130px;line-height:.95}`,
  finale: '.s{position:absolute;bottom:0;left:0;right:0;height:1000px;background:linear-gradient(rgba(20,16,12,0),rgba(20,16,12,.42))}' + `.t{position:absolute;bottom:${process.env.FINBOTTOM||260}px;left:0;right:0;text-align:center;color:#fff;${SHADOW}}h1{${SERIF};font-size:300px;line-height:.9;letter-spacing:-.04em}h2{${SERIF};font-style:italic;font-size:120px;line-height:.98;margin:8px 0 0}p{font-family:"DM Sans",sans-serif;font-weight:600;font-size:26px;letter-spacing:.18em;margin:34px 0 0}`,
  handle: `.f{position:absolute;top:0;left:0;right:0;height:520px;background:linear-gradient(rgba(20,16,12,.42),rgba(20,16,12,0))}.u{position:absolute;left:0;right:0;${process.env.HANDLETOP?`top:${process.env.HANDLETOP}px;`:'bottom:120px;'}text-align:center;color:#fff;font-family:"DM Sans",sans-serif;font-weight:600;font-size:26px;letter-spacing:.18em;${SHADOW}}`,
};
const BODY = {
  'hl-two': `<div class=s></div><div class=t><h1>${a}<em>${b}</em></h1></div>`,
  'hl-stack': `<div class=s></div><div class=t><div class=l1>${a}</div><div class=l2>${b}</div><div class=l3>${c}</div></div>`,
  finale: `<div class=s></div><div class=t><h1>${a}</h1><h2>${b}</h2><p>${c}</p></div>`,
  handle: (process.env.HANDLETOP?'<div class=f></div>':'')+'<div class=u>@RIVERFOX_EVENTS</div>',
};
(async () => {
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const pg = await br.newPage();
  await pg.setViewport({ width: 1080, height: 1920 });
  await pg.setContent(`<!doctype html><meta charset=utf-8>${FONTS}<style>html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:transparent}${CSS[mode]}</style>${BODY[mode]}`, { waitUntil: 'networkidle0' });
  await pg.evaluate(() => document.fonts.ready);
  await pg.evaluate(([mode, WIDTH]) => {
    const wid = (el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().width; };
    const fit = (el, target, max) => { const fs = parseFloat(getComputedStyle(el).fontSize); el.style.fontSize = Math.min(max, fs * target / wid(el)) + 'px'; };
    if (mode === 'hl-two') { const h1 = document.querySelector('h1'); const w = Math.max(wid(h1.firstChild), wid(h1.querySelector('em'))); h1.style.fontSize = Math.min(260, 124 * WIDTH / w) + 'px'; }
    if (mode === 'hl-stack') { const l2 = document.querySelector('.l2'); fit(l2, 880, 260); const fs = parseFloat(l2.style.fontSize); document.querySelector('.l1').style.fontSize = (fs * 0.62) + 'px'; document.querySelector('.l3').style.fontSize = (fs * 0.55) + 'px'; }
    if (mode === 'finale') { fit(document.querySelector('h1'), 600, 330); fit(document.querySelector('h2'), 760, 150); }
  }, [mode, WIDTH]);
  await pg.screenshot({ path: out, omitBackground: true, type: 'png' });
  await br.close();
  console.log('wrote', out);
})();
