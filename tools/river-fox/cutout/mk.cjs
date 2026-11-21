// node mk.cjs colourName hex  -> writes title_<name>.png and cap_<name>_<n>.png
const puppeteer = require(require('path').join(__dirname,'../../photo-grade/node_modules/puppeteer-core'));
const [name, hex] = process.argv.slice(2);
const peach = name === 'peach';
const SH = peach ? .8 : .6, SH2 = peach ? .6 : .45, TS = peach ? .55 : .38, TS2 = peach ? .35 : .15;
const FONT = '<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,144,900,100,0;1,144,900,100,1&display=block" rel="stylesheet">';
const BASE = `html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:transparent}*{font-family:Fraunces,serif;font-variation-settings:"SOFT" 100,"WONK" 1;font-weight:900;color:${hex}}`;
const CAPS = [["So this morning","I'm making a wreath"],["to match a doorway"],["that I'm doing","later on in the week"],["I've got some","bits of"],["foliage, scraps."]];
(async () => {
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const pg = await br.newPage(); await pg.setViewport({ width: 1080, height: 1920 });
  const shot = async (html, css, out) => { await pg.setContent(`<!doctype html><meta charset=utf-8>${FONT}<style>${BASE}${css}</style>${html}`, { waitUntil: 'load', timeout: 90000 }); await pg.evaluate(() => document.fonts.ready); await pg.screenshot({ path: out, omitBackground: true }); };
  // title: small italic line over a huge word, upper-middle
  const TCSS = `.t{position:absolute;left:0;right:0;top:220px;text-align:center;text-shadow:0 4px 36px rgba(40,20,10,${TS}),0 2px 8px rgba(40,20,10,${TS2})}.a{font-style:italic;font-size:92px;line-height:1;letter-spacing:-.02em;margin:0 0 -20px 0}.b{font-size:292px;line-height:1;letter-spacing:-.03em;margin:0;white-space:nowrap}`;
  await shot(`<div class=t><div class=a>Making a</div><div class=b><span id=sp>wreath.</span></div></div>`, TCSS, `title_${name}.png`);
  const w = await pg.evaluate(() => { const r = document.querySelector('#sp').getBoundingClientRect(); return [r.width, r.height]; }); console.log('title word box', w);
  const CCSS = `.c{position:absolute;left:0;right:0;bottom:380px;text-align:center;font-size:84px;line-height:1.02;letter-spacing:-.025em;text-shadow:0 3px 24px rgba(30,15,10,${SH}),0 2px 6px rgba(30,15,10,${SH2}),0 0 2px rgba(30,15,10,.35)}`;
  for (let i = 0; i < CAPS.length; i++) {
    await shot(`<div class=c>${CAPS[i].join('<br>')}</div>`, CCSS, `cap_${name}_${i}.png`);
    console.log(i, await pg.evaluate(() => { const r = document.querySelector('.c').getBoundingClientRect(); return [r.top, r.bottom]; }));
  }
  await br.close();
})();
