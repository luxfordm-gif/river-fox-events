// Thumbnail / cover with ONE big headline and the handle small at the bottom (no small caps line). Matt 21 Nov 2026.
//   node thumb.cjs <photo> <out> <w> <h> "Line1" "Line2" [weight=500] [fitWidth=940]
// Headline: Fraunces, line 1 upright, line 2 italic, fitted to fitWidth px. Handle: DM Sans 600, tiny, bottom centre, always the same place.
const puppeteer = require(require('path').join(__dirname,'../../photo-grade/node_modules/puppeteer-core'));
const fs = require('fs');
const [photo, out, W, H, l1, l2, weight = '500', fit = '940'] = process.argv.slice(2);
const w = +W, h = +H;
const tall = h / w > 1.7;                           // 9:16 only; 4:5 Facebook and 3:4 posts are not cropped by a grid
const k = w / 1080;                                  // scale handle and margins for other widths (Facebook is 1440 wide)                               // 9:16 cover: the profile grid crops the top and bottom 240px
const handleBottom = Math.round((tall ? 320 : 100) * k);               // handle sits inside the grid tile (cover: 240 crop + 80 margin)
const hookBottom = handleBottom + Math.round((tall ? 130 : 110) * k);
const img = 'data:image/jpeg;base64,' + fs.readFileSync(photo).toString('base64');
const html = `<!doctype html><meta charset=utf-8>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@600&family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&display=block" rel=stylesheet>
<style>html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:#000}
.p{position:relative;width:${w}px;height:${h}px;background:url(${img}) center/cover}
.f{position:absolute;left:0;right:0;bottom:0;height:${Math.round(h * 0.5)}px;background:linear-gradient(rgba(20,16,12,0),rgba(20,16,12,.34) 55%,rgba(20,16,12,.46))}
.t{position:absolute;left:0;right:0;bottom:${hookBottom}px;text-align:center;color:#FCFBF8;text-shadow:0 2px 26px rgba(0,0,0,.5),0 1px 4px rgba(0,0,0,.4)}
h1{font-family:Fraunces,serif;font-weight:${weight};font-size:200px;line-height:.96;letter-spacing:-.035em;margin:0;white-space:nowrap}
h1 em{font-style:italic;display:block}
.u{position:absolute;left:0;right:0;bottom:${handleBottom}px;text-align:center;color:#FCFBF8;font:600 ${Math.round((tall ? 24 : 21) * k)}px 'DM Sans',sans-serif;letter-spacing:.18em;text-shadow:0 2px 12px rgba(0,0,0,.55)}</style>
<div class=p><div class=f></div><div class=t><h1>${l1}<em>${l2}</em></h1></div><div class=u>@RIVERFOX_EVENTS</div></div>`;
(async () => {
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const pg = await br.newPage(); await pg.setViewport({ width: w, height: h });
  await pg.setContent(html, { waitUntil: 'networkidle0' }); await pg.evaluate(() => document.fonts.ready);
  await pg.evaluate((fit) => {
    const h1 = document.querySelector('h1'); const wid = (n) => { const r = document.createRange(); r.selectNodeContents(n); return r.getBoundingClientRect().width; };
    const m = Math.max(wid(h1.firstChild), wid(h1.querySelector('em')));
    h1.style.fontSize = (parseFloat(getComputedStyle(h1).fontSize) * fit * (innerWidth / 1080) / m) + 'px';
  }, +fit);
  await pg.screenshot({ path: out, type: 'jpeg', quality: 92 });
  await br.close(); console.log('wrote', out);
})();
