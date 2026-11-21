// Wild-card lettering (heavy soft Fraunces, warm white) for the reel F text: headline, finale, Laura's two captions. Gap 3 style (small italic over a big word).
//   node wild_text.cjs outdir
const puppeteer = require(require('path').join(__dirname,'../../photo-grade/node_modules/puppeteer-core'));
const dir = process.argv[2];
const FONT = '<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@600&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,144,900,100,0;1,144,900,100,1&display=block" rel="stylesheet">';
const BASE = 'html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:transparent}.w,.w *{font-family:Fraunces,serif;font-variation-settings:"SOFT" 100,"WONK" 1;font-weight:900;color:#FCFBFB}';
const SH = 'text-shadow:0 4px 34px rgba(30,16,10,.55),0 2px 8px rgba(30,16,10,.3)';
const PAGES = {
  // headline on the gravel: small italic line over a big word, with the light fade
  'wh.png': ['<div class=s></div><div class="w t"><div class=a>A Worplesdon</div><div class=b id=fit>welcome.</div></div>',
    `.s{position:absolute;bottom:0;left:0;right:0;height:900px;background:linear-gradient(rgba(20,16,12,0),rgba(20,16,12,.30) 55%,rgba(20,16,12,.40))}.t{position:absolute;top:1230px;left:0;right:0;text-align:center;${SH}}.a{font-style:italic;font-size:104px;line-height:1;letter-spacing:-.02em;margin-bottom:-6px}.b{font-size:300px;line-height:1;letter-spacing:-.03em;white-space:nowrap}`, 940],
  // finale: big Ta-da, italic line, then the fixed handle is added separately
  'wf.png': ['<div class=s></div><div class="w t"><div class=b id=fit>Ta-da.</div><div class=a id=fit2>Christmas has arrived.</div><p>A GARLAND ARCH AND WREATH</p></div>',
    `.s{position:absolute;bottom:0;left:0;right:0;height:1000px;background:linear-gradient(rgba(20,16,12,0),rgba(20,16,12,.42))}.t{position:absolute;bottom:260px;left:0;right:0;text-align:center;${SH}}.b{font-size:300px;line-height:.9;letter-spacing:-.03em;white-space:nowrap}.a{font-style:italic;font-size:120px;line-height:1;letter-spacing:-.02em;white-space:nowrap;margin-top:4px}p{font-family:"DM Sans",sans-serif!important;font-variation-settings:normal!important;font-weight:600!important;font-size:26px;letter-spacing:.18em;margin:34px 0 0}`, 700],
  'wc1.png': ['<div class="w c" id=fit>All finished<br>and I love it.</div>', `.c{position:absolute;top:290px;left:0;right:0;text-align:center;font-size:96px;line-height:1.02;letter-spacing:-.025em;${SH}}`, 0],
  'wc2.png': ['<div class="w c" id=fit>It\'s so beautiful.</div>', `.c{position:absolute;top:290px;left:0;right:0;text-align:center;font-size:96px;line-height:1.02;letter-spacing:-.025em;${SH}}`, 0],
};
(async () => {
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const pg = await br.newPage(); await pg.setViewport({ width: 1080, height: 1920 });
  for (const [name, [body, css, target]] of Object.entries(PAGES)) {
    await pg.setContent(`<!doctype html><meta charset=utf-8>${FONT}<style>${BASE}${css}</style>${body}`, { waitUntil: 'load', timeout: 90000 });
    await pg.evaluate(() => document.fonts.ready);
    if (target) await pg.evaluate((target, name) => {
      const el = document.getElementById('fit'); const r = document.createRange(); r.selectNodeContents(el);
      const w = r.getBoundingClientRect().width; el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * target / w) + 'px';
      if (name === 'wf.png') { const e2 = document.getElementById('fit2'); const r2 = document.createRange(); r2.selectNodeContents(e2); const w2 = r2.getBoundingClientRect().width; e2.style.fontSize = Math.min(120, parseFloat(getComputedStyle(e2).fontSize) * 860 / w2) + 'px'; }
    }, target, name);
    await pg.screenshot({ path: `${dir}/${name}`, omitBackground: true, type: 'png' });
    console.log('wrote', name);
  }
  await br.close();
})();
