// SUPERSEDED (21 Nov 2026) by tools/river-fox/text/thumb.cjs: covers and post images are now ONE big Classic-font headline
// plus only the small handle at the bottom, no small caps line, in the safe areas. Kept for reference; do not use for new jobs.
//
// Puts the River Fox cover text (the "hook") on ONE chosen photo per format: an Instagram post (3:4) and/or a
// Story / Reel cover (9:16). The look is the Social brand pack's cover rules; read the newest pack in Drive before
// each job, and change the numbers below if it moves (the pack wins, never this file).
//
//   npm run overlay -- --job=<export folder> --hook1="A Worplesdon" --hook2="welcome." \
//       --caps="A GARLAND ARCH AND WREATH FOR CHRISTMAS" \
//       [--post=<photo name> --post-spot=bottom|top|middle] [--story=<photo name> --story-spot=...] [--out=<folder>]
//
// Reads state/exports/<job>/Instagram post ... and Instagram story ... (made by `npm run export`), writes the
// finished files to state/exports/<job>/overlays/ (or --out). Needs Google Chrome on this Mac and a network
// connection (the fonts, Fraunces and DM Sans, load from Google Fonts). Nothing goes to the OpenAI API.
// Not on Google Business photos: they get no text (brand pack).
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { STATE } from './config.mjs';

const args = process.argv.slice(2);
const opt = (n) => args.find((a) => a.startsWith(`--${n}=`))?.split('=').slice(1).join('=');
const job = opt('job');
const hook1 = opt('hook1'), hook2 = opt('hook2'), caps = opt('caps');
if (!job || !hook1 || !hook2 || !caps || !(opt('post') || opt('story'))) {
  console.log('usage: npm run overlay -- --job=<export folder> --hook1="…" --hook2="…" --caps="…" [--post=<name> --post-spot=bottom] [--story=<name> --story-spot=bottom] [--out=<folder>]');
  process.exit(1);
}
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const EXP = path.join(STATE, 'exports', job);
const OUT = opt('out') || path.join(EXP, 'overlays');

// Numbers from Social brand pack v1.18/v1.19: hook Fraunces Regular 400, tracking -0.03em, line height 0.98;
// caps line DM Sans 600; handle DM Sans 500 on Stories and Reel covers only; feed posts keep 96px clear, Reels 64px;
// text stays inside the middle 1080x1440 (the profile grid crops 240px top and bottom); white text on a soft moss-black
// fade (up to about 58% at the foot) or a band (about 42%) in the middle, with a soft shadow, no boxes.
const FORMATS = {
  post: { dir: 'Instagram post 3x4 (1080x1440)', w: 1080, h: 1440, edge: 96, hook: 144, caps: 26, handle: false, safeTop: 0, safeBot: 1440, bottomGap: 96 },
  story: { dir: 'Instagram story 9x16 (1080x1920)', w: 1080, h: 1920, edge: 64, hook: 160, caps: 28, handle: true, safeTop: 240, safeBot: 1680, bottomGap: 20 },
};
const MOSS = '30,36,33';
const fade = (spot) => (spot === 'bottom' ? `linear-gradient(to top, rgba(${MOSS},.66) 0%, rgba(${MOSS},.46) 24%, rgba(${MOSS},0) 52%)`
  : spot === 'top' ? `linear-gradient(to bottom, rgba(${MOSS},.66) 0%, rgba(${MOSS},.46) 24%, rgba(${MOSS},0) 52%)`
  : `linear-gradient(to bottom, rgba(${MOSS},0) 12%, rgba(${MOSS},.58) 34%, rgba(${MOSS},.58) 66%, rgba(${MOSS},0) 88%)`);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
// the last two words of a line are joined with a no-break space, so nothing is left alone on a last line
const nb = (s) => esc(s).replace(/ (\S+)$/, '&nbsp;$1');

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
const report = [];
for (const [fmt, F] of Object.entries(FORMATS)) {
  const name = opt(fmt);
  if (!name) continue;
  const dir = path.join(EXP, F.dir);
  const file = fs.readdirSync(dir).find((f) => f.includes(name) && /\.jpg$/.test(f));
  if (!file) { console.log(`no ${fmt} export matching "${name}" in ${dir}`); process.exit(1); }
  const spot = opt(`${fmt}-spot`) || 'bottom';
  const cy = F.safeTop + (F.safeBot - F.safeTop) * { top: 0.17, middle: 0.5, bottom: 0.83 }[spot];
  const pos = spot === 'bottom' ? `bottom:${F.h - F.safeBot + F.bottomGap}px;` : `top:${cy}px;transform:translateY(-50%);`;
  const img = 'data:image/jpeg;base64,' + fs.readFileSync(path.join(dir, file)).toString('base64');
  const html = `<!doctype html><meta charset=utf-8>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500;600&family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&display=block" rel=stylesheet>
<style>
html,body{margin:0;width:${F.w}px;height:${F.h}px;overflow:hidden;background:#000}
.p{position:relative;width:${F.w}px;height:${F.h}px;background:url(${img}) center/cover}
.f{position:absolute;inset:0;background:${fade(spot)}}
.t{position:absolute;left:${F.edge}px;right:${F.edge}px;${pos}text-align:center;color:#FCFBF8;text-shadow:0 2px 18px rgba(${MOSS},.45),0 1px 3px rgba(${MOSS},.35)}
.h{white-space:nowrap;font-family:Fraunces,serif;font-weight:400;font-size:${F.hook}px;line-height:.98;letter-spacing:-.03em;font-optical-sizing:auto}
.h i{display:block;font-style:italic}
.c{white-space:nowrap;font-family:'DM Sans',sans-serif;font-weight:600;font-size:${F.caps}px;letter-spacing:.12em;margin-top:${Math.round(F.hook * 0.22)}px}
.u{position:absolute;left:0;right:0;bottom:120px;text-align:center;color:#FCFBF8;font-family:'DM Sans',sans-serif;font-weight:500;font-size:40px;letter-spacing:.12em;text-shadow:0 2px 12px rgba(${MOSS},.5)}
</style>
<div class=p><div class=f></div>
<div class=t><div class=h>${nb(hook1)}<i>${nb(hook2)}</i></div><div class=c>${esc(caps.toUpperCase())}</div></div>
${F.handle ? '<div class=u>@RIVERFOX_EVENTS</div>' : ''}</div>`;
  const page = await browser.newPage();
  await page.setViewport({ width: F.w, height: F.h, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // type shrinks before it wraps: fit the hook and the caps line inside the safe width
  const fit = await page.evaluate((edge, w) => {
    const t = document.querySelector('.t'), h = t.querySelector('.h'), c = t.querySelector('.c');
    const max = w - edge * 2, width = (el) => { const r = document.createRange(); r.selectNodeContents(el); return r.getBoundingClientRect().width; };
    const lw = () => Math.max(...[...h.childNodes].map(width));
    let fs = parseFloat(getComputedStyle(h).fontSize); while (lw() > max && fs > 60) { fs -= 2; h.style.fontSize = fs + 'px'; }
    let cs = parseFloat(getComputedStyle(c).fontSize); while (width(c) > max && cs > 16) { cs -= 1; c.style.fontSize = cs + 'px'; }
    const hs = document.fonts.check('400 40px Fraunces') && document.fonts.check('600 20px "DM Sans"');
    const r = t.getBoundingClientRect();
    return { hook: fs, caps: cs, fontsLoaded: hs, top: Math.round(r.top), bottom: Math.round(r.bottom) };
  }, F.edge, F.w);
  fs.mkdirSync(OUT, { recursive: true });
  // "00 - with text - ..." sorts to the top of the platform's folder on a Mac, so the text version is never in its own folder
  const outName = `00 - with text - ${file.replace(/\.jpg$/, '')}.jpg`;
  await page.screenshot({ path: path.join(OUT, outName), type: 'jpeg', quality: 92 });
  await page.close();
  report.push({ format: fmt, photo: file, spot, ...fit });
  console.log(`${fmt}: ${outName}  spot=${spot}  hook ${fit.hook}px  caps ${fit.caps}px  text y ${fit.top}-${fit.bottom}${fit.fontsLoaded ? '' : '  ! FONTS DID NOT LOAD'}`);
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'overlay.json'), JSON.stringify({ hook: [hook1, hook2], caps, report }, null, 1));
