// Review cards in the pack's review template (logo pink card, rose quote mark, Fraunces Regular upright, name in small capitals).
// Sizes were measured from the cards already in Drive (Lucy, Farnham), so new cards match them.
// Run: node tools/river-fox/review/review.cjs '<JSON list of cards>'
//   Instagram 1080x1440:       {"w":1080,"h":1440,"fs":60,"lh":70,"mw":900,"mark":233,"gap":75,"ngap":102,"dy":-12,"quote":"...","name":"Sarah, Worplesdon","out":"post.png"}
//   Google Business 1200x1200: {"w":1200,"h":1200,"fs":78,"lh":90,"mw":850,"mark":213,"mh":52,"markTop":-27,"gap":84,"ngap":92,"ns":29.4,"dy":-8,"quote":"...","name":"...","out":"photo.png"}
// A long review (about 200 characters): fs 55 / lh 77 / mw 890 / gap 78 / ngap 104 (Instagram) and fs 59 / lh 83 / mw 930 / ngap 96 (Google Business).
// Finer stroke, long reviews only (Matt, 2026-11-21): Fraunces draws sturdier letters at smaller sizes, so a long quote is set at optical size 78, still Regular 400.
//   The tool does this itself for any quote of 160 characters or more and prints it; every other card keeps the font's default. Force it either way with "opsz":78 or "opsz":0.
// The size rules are in the Brand book, chapter 08 ("More copy" and "Reviews"): check the newest book before each job.
// Laura's brand is elegant: a long quote gets slightly smaller text, open line spacing and plenty of pink around it, never bigger text and never much smaller (Matt, 2026-11-21).
// Check the wrap after any size change: lines stay even, with no short tail line.
// Judge the size at phone size (the card shown 390px wide), not at full size on a computer screen.
// The quote is the full review in the client's own words (emojis left off), spelling and grammar checked first: fix clear slips only, never reword, and tell Matt each change. Join the last two words with &nbsp; so the last line is never one word.
// Uses puppeteer-core and the Mac's own Chrome, like the other River Fox tools (no Playwright install needed).
const puppeteer = (() => { try { return require('puppeteer-core'); } catch (e) { return require(require('path').join(__dirname, '../../photo-grade/node_modules/puppeteer-core')); } })();
const LONG = 160;
// Straight quote marks and apostrophes are always turned into curly ones (Matt, 2026-11-21); the run prints how many it changed.
const curly = (s) => String(s)
  .replace(/(^|[\s(\[>-]|&nbsp;)"/g, '$1“').replace(/"/g, '”')
  .replace(/(^|[\s(\[>-]|&nbsp;)'/g, '$1‘').replace(/'/g, '’');
const cards = JSON.parse(process.argv[2]).map((c) => {
  const straight = ((c.quote + c.name).match(/['"]/g) || []).length;
  console.log(`${c.out}: ${straight} straight quote mark(s) or apostrophe(s) made curly`);
  const length = String(c.quote).replace(/&nbsp;/g, ' ').length;
  const opsz = c.opsz === undefined ? (length >= LONG ? 78 : 0) : c.opsz;
  console.log(`${c.out}: ${length} characters, ${opsz ? 'finer stroke (optical size ' + opsz + ')' : 'default stroke'}`);
  return { ...c, opsz, quote: curly(c.quote), name: curly(c.name) };
});
const html = (c) => `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500&family=Fraunces:opsz,wght@9..144,400&display=swap" rel="stylesheet">
<style>html,body{margin:0}body{width:${c.w}px;height:${c.h}px;background:#F7EEE9;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.wrap{display:flex;flex-direction:column;align-items:center;transform:translateY(${c.dy||0}px)}
.m{font-family:Fraunces;font-size:${c.mark||200}px;line-height:1;height:${c.mh||57}px;color:#C69490;overflow:visible;display:block}
.m span{display:block;margin-top:${c.markTop||-30}px}
.q{font-family:Fraunces;font-weight:400;font-size:${c.fs}px;line-height:${c.lh}px;color:#191C17;text-align:center;max-width:${c.mw||880}px;margin:${c.gap||88}px 0 0;text-wrap:balance;letter-spacing:-0.015em${c.opsz ? `;font-variation-settings:'opsz' ${c.opsz}` : ''}}
.n{font-family:'DM Sans';font-weight:500;font-size:${c.ns||21.5}px;letter-spacing:0.16em;color:#494E46;margin-top:${c.ngap||96}px;text-transform:uppercase;line-height:1}
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
    await p.screenshot({ path: c.out });
    await p.close();
  }
  await b.close();
})();
