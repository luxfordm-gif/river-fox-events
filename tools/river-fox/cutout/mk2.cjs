// node mk2.cjs out.png hex aTop [shadowStrength]  -> the wild-card TITLE ("Making a" over "wreath.") with a tight line gap
const puppeteer = require(require('path').join(__dirname,'../../photo-grade/node_modules/puppeteer-core'));
const [out, hex, aTop = '300', sh = '0.38'] = process.argv.slice(2);
const FONT = '<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,144,900,100,0;1,144,900,100,1&display=block" rel="stylesheet">';
const css = `html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:transparent}*{font-family:Fraunces,serif;font-variation-settings:"SOFT" 100,"WONK" 1;font-weight:900;color:${hex}}
.t{position:absolute;left:0;right:0;top:0;height:1920px;text-shadow:0 4px 36px rgba(40,20,10,${sh}),0 2px 8px rgba(40,20,10,${sh*0.4})}
.a{position:absolute;left:0;right:0;top:${aTop}px;text-align:center;font-style:italic;font-size:92px;line-height:1;letter-spacing:-.02em}
.b{position:absolute;left:0;right:0;top:292px;text-align:center;font-size:292px;line-height:1;letter-spacing:-.03em;white-space:nowrap}`;
(async () => {
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const pg = await br.newPage(); await pg.setViewport({ width: 1080, height: 1920 });
  await pg.setContent(`<!doctype html><meta charset=utf-8>${FONT}<style>${css}</style><div class=t><div class=a>Making a</div><div class=b>wreath.</div></div>`, { waitUntil: 'load', timeout: 90000 });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: out, omitBackground: true, type: 'png' });
  await br.close();
})();
