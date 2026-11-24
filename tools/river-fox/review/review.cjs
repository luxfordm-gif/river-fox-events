// Review cards in the pack's review layout: flat logo pink, the small capitals label CLIENT REVIEW in a fixed spot at
// the top, the quote upright and centred, and the name (first name and town) in a fixed spot as far from the foot as
// the label is from the top. No quote mark, no handle. Instagram and Google Business use the same layout.
// Run: node tools/river-fox/review/review.cjs '<JSON list of cards>'
//   {"size":"instagram","quote":"...","name":"Sarah, Worplesdon","out":"post.png"}
//   {"size":"google","quote":"...","name":"Sarah, Worplesdon","out":"photo.png"}
// No brand value is written in this file: sizes, spots, colours and type come from ../brand-pack.json, which names the
// Brand Pack board each one was copied from.
// The words: a short review is used whole. A long one (over the pack's character count) must be given as an excerpt:
// whole sentences, word for word, up to the pack's word count, and the SAME excerpt on both cards. The tool refuses a
// long quote over that word count rather than set it small: every card uses the one quote size.
// It joins the last two words with a no-break space (never one word alone on the last line), turns straight quote marks
// into curly ones, prints each line's width and the space to the label, the name and every edge, and will not write a
// card whose quote runs into the label or name or too close to an edge (ALLOW_UNSAFE=1 writes it anyway and says so).
// Judge the result at phone size. Uses puppeteer-core and the Mac's own Chrome, like the other River Fox tools.
const puppeteer = (() => { try { return require('puppeteer-core'); } catch (e) { return require(require('path').join(__dirname, '../../photo-grade/node_modules/puppeteer-core')); } })();
const B = require('../brand-pack.json');
const R = B.review;
const curly = (s) => String(s)
  .replace(/(^|[\s(\[>-]|&nbsp;)"/g, '$1“').replace(/"/g, '”')
  .replace(/(^|[\s(\[>-]|&nbsp;)'/g, '$1‘').replace(/'/g, '’');
const keepLastTwo = (s) => s.replace(/&nbsp;/g, ' ').replace(/\s+(\S+)\s*$/, ' $1');
let refused = false;
const cards = JSON.parse(process.argv[2]).map((given) => {
  const size = given.size === 'google' ? 'google' : 'instagram';
  const c = { ...R[size], size, ...given };
  const text = String(c.quote).replace(/&nbsp;/g, ' ').trim();
  const words = text.split(/\s+/).length;
  const long = text.length > R.shortUpToChars;
  console.log(`${c.out}: ${size} ${c.w}x${c.h}, ${text.length} characters, ${words} words: ${long ? 'a long review, so this must be the excerpt' : 'a short review, used whole'}  [${R.board}]`);
  if (long && words > R.excerptUpToWords) {
    console.error(`${c.out}: NOT WRITTEN, ${words} words. A long review uses an excerpt of whole sentences, word for word, up to about ${R.excerptUpToWords} words, the same on both cards.`);
    refused = true; return null;
  }
  const straight = ((c.quote + c.name).match(/['"]/g) || []).length;
  console.log(`${c.out}: ${straight} straight quote mark(s) or apostrophe(s) made curly; last two words joined`);
  return { ...c, quote: keepLastTwo(curly(c.quote)), name: curly(c.name) };
}).filter(Boolean);
const html = (c) => `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=${R.labelFont.replace(/ /g, '+')}:wght@${R.labelWeight}&family=${R.font}:opsz,wght@9..144,${R.weight}&display=swap" rel="stylesheet">
<style>html,body{margin:0}body{width:${c.w}px;height:${c.h}px;background:${R.fill};position:relative;overflow:hidden;text-align:center}
.s{position:absolute;left:0;width:${c.w}px;font-family:'${R.labelFont}';font-weight:${R.labelWeight};font-size:${c.smallPx}px;line-height:${c.smallLine}px;text-transform:uppercase;color:${R.smallColour}}
.l{top:${c.labelTop}px;letter-spacing:${R.labelTracking}}.n{top:${c.nameTop}px;letter-spacing:${R.nameTracking}}
.b{position:absolute;left:${c.sideClear}px;top:0;width:${c.w - 2 * c.sideClear}px;height:${c.h}px;display:flex;align-items:center;justify-content:center}
.q{margin:0;font-family:${R.font};font-weight:${R.weight};font-size:${c.quotePx}px;line-height:${c.quoteLine}px;letter-spacing:${R.tracking};color:${R.text};text-wrap:balance}
</style><div class="s l">${R.labelText}</div><div class="b"><p class="q">${c.quote}</p></div><div class="s n">${c.name}</div>`;
(async () => {
  if (!cards.length) { process.exitCode = 1; return; }
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  for (const c of cards) {
    const p = await b.newPage();
    await p.setViewport({ width: c.w, height: c.h, deviceScaleFactor: 1 });
    await p.setContent(html(c), { waitUntil: 'networkidle0', timeout: 90000 });
    await p.evaluate(() => document.fonts.ready);
    const m = await p.evaluate(() => {
      const q = document.querySelector('.q'), r = document.createRange(); r.selectNodeContents(q);
      const rows = {}; for (const x of r.getClientRects()) { const k = Math.round(x.top); rows[k] = rows[k] || [1e9, 0]; rows[k][0] = Math.min(rows[k][0], x.left); rows[k][1] = Math.max(rows[k][1], x.right); }
      const qb = q.getBoundingClientRect(), lb = document.querySelector('.l').getBoundingClientRect(), nb = document.querySelector('.n').getBoundingClientRect();
      const left = Math.min(...Object.values(rows).map((x) => x[0])), right = Math.max(...Object.values(rows).map((x) => x[1]));
      return { lines: Object.values(rows).map(([l, rt]) => Math.round(rt - l)), toLabel: Math.round(qb.top - lb.bottom), toName: Math.round(nb.top - qb.bottom),
        left: Math.round(left), right: Math.round(innerWidth - right), labelTop: Math.round(lb.top), nameBottom: Math.round(innerHeight - nb.bottom),
        font: document.fonts.check('400 20px Fraunces') };
    });
    console.log(`${c.out}: ${c.quotePx}px on ${c.quoteLine}px lines, ${m.lines.length} lines, widths ${m.lines.join(' / ')}px; ${m.toLabel}px below the label, ${m.toName}px above the name; ${m.left}px from the left, ${m.right}px from the right; label ${m.labelTop}px from the top, name ${m.nameBottom}px from the foot; Fraunces loaded: ${m.font}`);
    const clear = c.edgeClear || c.sideClear, faults = [];
    if (m.left < clear || m.right < clear) faults.push(`the quote is under ${clear}px from a side`);
    if (m.toLabel < c.quotePx * 0.5 || m.toName < c.quotePx * 0.5) faults.push('the quote runs too close to the label or the name: use a shorter excerpt');
    if (!m.font) faults.push('Fraunces did not load');
    if (faults.length && !process.env.ALLOW_UNSAFE) { console.error(`${c.out}: NOT WRITTEN, ${faults.join('; ')}`); await p.close(); process.exitCode = 1; continue; }
    if (faults.length) console.log(`${c.out}: written although ${faults.join('; ')} (ALLOW_UNSAFE)`);
    await p.screenshot({ path: c.out });
    await p.close();
  }
  await b.close();
  if (refused) process.exitCode = 1;
})();
