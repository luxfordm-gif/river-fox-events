// Review cards in the pack's review template (logo pink card, rose quote mark, upright quote, name in small capitals).
// Run: node tools/river-fox/review/review.cjs '<JSON list of cards>'
//   {"size":"instagram","quote":"...","name":"Sarah, Worplesdon","out":"post.png"}
//   {"size":"google","quote":"...","name":"Sarah, Worplesdon","out":"photo.png"}
// No brand value is written in this file. Card sizes, text sizes for short and long reviews, colours and the finer stroke
// on long reviews come from ../brand-pack.json, which names the Brand Pack canvas board each one was copied from.
// The tool picks short or long from the quote's length and prints which; any setting can still be given on a card to
// override it (fs, lh, mw, mark, gap, ngap, dy, opsz).
// It prints each line's width and how far the text sits from every edge, and will not write a card whose text is closer
// to an edge than the canvas allows (ALLOW_UNSAFE=1 writes it anyway and says so).
// Join the last two words with &nbsp; so the last line is never one word. Judge the result at phone size.
// Uses puppeteer-core and the Mac's own Chrome, like the other River Fox tools.
const puppeteer = (() => { try { return require('puppeteer-core'); } catch (e) { return require(require('path').join(__dirname, '../../photo-grade/node_modules/puppeteer-core')); } })();
const B = require('../brand-pack.json');
const R = B.review, LONG = R.toolOwn.longFrom;
// Straight quote marks and apostrophes are always turned into curly ones (Matt, 2026-11-21); the run prints how many it changed.
const curly = (s) => String(s)
  .replace(/(^|[\s(\[>-]|&nbsp;)"/g, '$1“').replace(/"/g, '”')
  .replace(/(^|[\s(\[>-]|&nbsp;)'/g, '$1‘').replace(/'/g, '’');
const cards = JSON.parse(process.argv[2]).map((given) => {
  const size = given.size || (given.w === R.google.w ? 'google' : 'instagram');
  const kind = String(given.quote).replace(/&nbsp;/g, ' ').length >= LONG ? 'long' : 'short';
  const c = { w: R[size].w, h: R[size].h, ...R[size][kind], ...R.toolOwn[size][kind], ...given };
  console.log(`${c.out}: ${size} ${c.w}x${c.h}, ${kind} review: ${c.fs}px text on ${c.lh}px lines, up to ${c.mw}px wide  [${R.board}]`);
  const straight = ((c.quote + c.name).match(/['"]/g) || []).length;
  console.log(`${c.out}: ${straight} straight quote mark(s) or apostrophe(s) made curly`);
  const length = String(c.quote).replace(/&nbsp;/g, ' ').length;
  const opsz = c.opsz === undefined ? (length >= LONG ? R.longOpticalSize : 0) : c.opsz;
  console.log(`${c.out}: ${length} characters, ${opsz ? 'finer stroke (optical size ' + opsz + ')' : 'default stroke'}`);
  return { ...c, opsz, quote: curly(c.quote), name: curly(c.name) };
});
const html = (c) => `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@${B.handle.weight}&family=${R.font}:opsz,wght@9..144,${R.weight}&display=swap" rel="stylesheet">
<style>html,body{margin:0}body{width:${c.w}px;height:${c.h}px;background:${R.fill};display:flex;flex-direction:column;align-items:center;justify-content:center;}
.wrap{display:flex;flex-direction:column;align-items:center;transform:translateY(${c.dy||0}px)}
.m{font-family:Fraunces;font-size:${c.mark||200}px;line-height:1;height:${c.mh||57}px;color:${R.toolOwn.markColour};overflow:visible;display:block}
.m span{display:block;margin-top:${c.markTop||-30}px}
.q{font-family:${R.font};font-weight:${R.weight};font-size:${c.fs}px;line-height:${c.lh}px;color:${R.text};text-align:center;max-width:${c.mw||880}px;margin:${c.gap||88}px 0 0;text-wrap:balance;letter-spacing:-0.015em${c.opsz ? `;font-variation-settings:'opsz' ${c.opsz}` : ''}}
.n{font-family:'DM Sans';font-weight:500;font-size:${c.ns||21.5}px;letter-spacing:0.16em;color:${R.toolOwn.nameColour};margin-top:${c.ngap||96}px;text-transform:uppercase;line-height:1}
</style><div class="wrap"><div class="m"><span>“</span></div><p class="q">${c.quote}</p><div class="n">${c.name}</div></div>`;
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  for (const c of cards) {
    const p = await b.newPage();
    await p.setViewport({ width: c.w, height: c.h, deviceScaleFactor: 1 });
    await p.setContent(html(c), { waitUntil: 'networkidle0', timeout: 90000 });
    await p.evaluate(() => document.fonts.ready);
    // Print what was drawn: each line's width, and how far the text sits from every edge.
    const m = await p.evaluate(() => {
      const q = document.querySelector('.q'), r = document.createRange(); r.selectNodeContents(q);
      const rows = {}; for (const b of r.getClientRects()) { const k = Math.round(b.top); rows[k] = rows[k] || [1e9, 0]; rows[k][0] = Math.min(rows[k][0], b.left); rows[k][1] = Math.max(rows[k][1], b.right); }
      const lines = Object.values(rows).map(([l, rt]) => Math.round(rt - l));
      const w = document.querySelector('.wrap').getBoundingClientRect(), n = document.querySelector('.n').getBoundingClientRect();
      const left = Math.min(...Object.values(rows).map((x) => x[0])), right = Math.max(...Object.values(rows).map((x) => x[1]));
      return { lines, top: Math.round(w.top), bottom: Math.round(innerHeight - n.bottom), left: Math.round(left), right: Math.round(innerWidth - right), font: document.fonts.check('400 20px Fraunces') };
    });
    console.log(`${c.out}: ${m.lines.length} lines, widths ${m.lines.join(' / ')}px; clear of edges: top ${m.top}, bottom ${m.bottom}, left ${m.left}, right ${m.right}px; Fraunces loaded: ${m.font}`);
    const tight = ['top', 'bottom', 'left', 'right'].filter((e) => m[e] < R.edgeClear);
    if (tight.length && !process.env.ALLOW_UNSAFE) { console.error(`${c.out}: NOT WRITTEN, the text is under ${R.edgeClear}px from the ${tight.join(' and ')} edge`); await p.close(); process.exitCode = 1; continue; }
    if (tight.length) console.log(`${c.out}: written although the text is under ${R.edgeClear}px from the ${tight.join(' and ')} edge (ALLOW_UNSAFE)`);
    await p.screenshot({ path: c.out });
    await p.close();
  }
  await b.close();
})();
