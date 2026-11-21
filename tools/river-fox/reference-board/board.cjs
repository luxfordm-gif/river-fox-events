// Reference board for the Social brand pack v1.20 prompt: 12 numbered examples from the Worplesdon job.
const path = require('path');
const fs = require('fs');
const puppeteer = require('../../photo-grade/node_modules/puppeteer-core');
const B = __dirname;
const D = process.env.JOB;
const W = process.env.WILD;
const u = (p) => 'file://' + encodeURI(p);
const P = [
  ['1', 'Reel cover, dusk', 'One big Classic headline (Fraunces Medium 500, line 2 italic). Small handle at the bottom. No small caps line.', u(D + '/Instagram - Reels (9x16)/05 - Cover - Dusk.jpg'), '9/16'],
  ['2', 'Reel cover, day', 'Same layout on the daylight photo. Every job gets a dusk and a day option.', u(D + '/Instagram - Reels (9x16)/06 - Cover - Day.jpg'), '9/16'],
  ['3', 'Instagram post cover (3:4)', 'Same headline and handle on the 1080x1440 post.', u(D + '/Instagram - Posts (3x4)/01 - Cover - Dusk.jpg'), '3/4'],
  ['4', 'Facebook post cover (4:5)', 'Same again at 1440x1800.', u(D + '/Facebook - Posts (4x5)/01 - Cover - Dusk.jpg'), '4/5'],
  ['5', 'Pink box captions (the default)', 'Logo pink box hugging the words, dark ink, Inter SemiBold. In the top third, never on her face.', u(B + '/pink_all.jpg'), '9/16'],
  ['6', 'Pink box, the held word', '"looove" spelled long and much bigger, letters arriving one by one, the rest of the phrase small on the same screen.', u(B + '/pink_big.jpg'), '9/16'],
  ['7', 'Wild font captions (option)', 'Fraunces 900, soft, warm white, no box.', u(B + '/wild.jpg'), '9/16'],
  ['8', 'Classic font captions (option)', 'Fraunces Medium 500, warm white, no box.', u(B + '/classic.jpg'), '9/16'],
  ['9', 'Headline on video', '"A Worplesdon welcome." Classic font on a calm area, soft dark fade behind.', u(B + '/head.jpg'), '9/16'],
  ['10', 'Closing text, handle at the top', '"Ta-da." large, a small italic line under it. On video the handle sits at the top.', u(B + '/fin.jpg'), '9/16'],
  ['11', 'Safe area on a Reel', 'All text inside the clear box: 240 to 1,450 down, 70 to 940 across (of 1080x1920).', u(B + '/fin.jpg'), '9/16', 'safe'],
  ['12', 'Wild card Story (option)', 'A heavy soft title behind her head; she moves in front of it. Warm white.', u(W), '9/16'],
];
const html = `<!doctype html><meta charset=utf-8>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600&family=Fraunces:opsz,wght@9..144,500&display=block" rel=stylesheet>
<style>
body{margin:0;background:#FBF8F4;font-family:'DM Sans',sans-serif;color:#191C17;width:2400px}
.w{padding:70px 70px 60px}
h1{font-family:Fraunces,serif;font-weight:500;font-size:64px;margin:0 0 10px;letter-spacing:-.02em}
.s{font-size:26px;color:#494E46;margin:0 0 46px}
.g{display:grid;grid-template-columns:repeat(4,535px);gap:44px 40px}
.c{display:flex;flex-direction:column}
.f{height:920px;display:flex;align-items:flex-end;justify-content:center}
.i{position:relative;border-radius:10px;overflow:hidden;background:#ddd}
.i img{display:block;height:100%;width:100%;object-fit:cover}
.n{display:flex;gap:14px;align-items:baseline;margin-top:18px}
.n b{font-size:22px;background:#191C17;color:#FBF8F4;border-radius:6px;padding:4px 12px;font-weight:600}
.n span{font-size:27px;font-weight:600}
.d{font-size:21px;line-height:1.4;color:#494E46;margin-top:8px}
.z{position:absolute;background:rgba(200,40,40,.42)}
.k{position:absolute;border:3px solid #fff;box-sizing:border-box}
.l{position:absolute;left:0;right:0;text-align:center;color:#fff;font-size:17px;font-weight:600;text-shadow:0 1px 4px #000}
</style><div class=w>
<h1>River Fox Events - reference board for Social brand pack v1.20</h1>
<p class=s>Twelve examples from the Worplesdon garland and wreath job, 21 November 2026. The numbers are the ones the prompt refers to.</p>
<div class=g>${P.map(([n, t, d, src, r, safe]) => `<div class=c><div class=f><div class=i style="${r === '9/16' ? 'width:517px;height:920px' : r === '3/4' ? 'width:535px;height:713px' : 'width:535px;height:669px'}"><img src="${src}">${safe ? `
<div class=z style="left:0;right:0;top:0;height:12.5%"></div><div class=z style="left:0;right:0;top:75.52%;bottom:0"></div>
<div class=z style="left:0;width:6.48%;top:12.5%;height:63.02%"></div><div class=z style="left:87.04%;right:0;top:12.5%;height:63.02%"></div>
<div class=k style="left:6.48%;top:12.5%;width:80.56%;height:63.02%"></div>
<div class=l style="top:4.5%">Cropped by the profile grid (top 240)</div>
<div class=l style="top:84%">Covered by Instagram: name, caption, buttons</div>` : ''}</div></div>
<div class=n><b>${n}</b><span>${t}</span></div><div class=d>${d}</div></div>`).join('')}</div></div>`;
(async () => {
  fs.writeFileSync(path.join(B, 'board.html'), html);
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--allow-file-access-from-files'] });
  const pg = await br.newPage();
  await pg.setViewport({ width: 2400, height: 1200, deviceScaleFactor: 1 });
  await pg.goto('file://' + path.join(B, 'board.html'), { waitUntil: 'networkidle0' });
  await pg.evaluate(() => document.fonts.ready);
  const bad = await pg.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
  console.log('fonts', await pg.evaluate(() => document.fonts.check('500 40px Fraunces')), 'missing images', bad);
  await pg.screenshot({ path: path.join(B, 'board.jpg'), type: 'jpeg', quality: 88, fullPage: true });
  await br.close();
})();
