// Review cards in the pack's review template (logo pink card, rose quote mark, Fraunces Regular upright, name in small capitals).
// Sizes were measured from the cards already in Drive (Lucy, Farnham), so new cards match them.
// Run: node tools/river-fox/review/review.cjs '<JSON list of cards>'
//   Instagram 1080x1440:       {"w":1080,"h":1440,"fs":60,"lh":70,"mw":900,"mark":233,"gap":75,"ngap":102,"dy":-12,"quote":"...","name":"Sarah, Worplesdon","out":"post.png"}
//   Google Business 1200x1200: {"w":1200,"h":1200,"fs":78,"lh":90,"mw":850,"mark":213,"mh":52,"markTop":-27,"gap":84,"ngap":92,"ns":29.4,"dy":-8,"quote":"...","name":"...","out":"photo.png"}
// A long review (about 200 characters): fs 62 / lh 82 / mw 890 / gap 80 / ngap 110 (Instagram) and fs 66 / lh 86 / mw 970 / ngap 96 (Google Business).
// Keep long quotes big with open line spacing and let the block run taller, rather than shrinking the text (Matt, 2026-11-21).
// The quote is the full review, word for word (emojis left off). Join the last two words with &nbsp; so the last line is never one word.
const { chromium } = require('playwright');
const cards = JSON.parse(process.argv[2]);
const html = (c) => `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500&family=Fraunces:opsz,wght@9..144,400&display=swap" rel="stylesheet">
<style>html,body{margin:0}body{width:${c.w}px;height:${c.h}px;background:#F7EEE9;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.wrap{display:flex;flex-direction:column;align-items:center;transform:translateY(${c.dy||0}px)}
.m{font-family:Fraunces;font-size:${c.mark||200}px;line-height:1;height:${c.mh||57}px;color:#C69490;overflow:visible;display:block}
.m span{display:block;margin-top:${c.markTop||-30}px}
.q{font-family:Fraunces;font-weight:400;font-size:${c.fs}px;line-height:${c.lh}px;color:#191C17;text-align:center;max-width:${c.mw||880}px;margin:${c.gap||88}px 0 0;text-wrap:balance;letter-spacing:-0.01em}
.n{font-family:'DM Sans';font-weight:500;font-size:${c.ns||21.5}px;letter-spacing:0.16em;color:#494E46;margin-top:${c.ngap||96}px;text-transform:uppercase;line-height:1}
</style><div class="wrap"><div class="m"><span>“</span></div><p class="q">${c.quote}</p><div class="n">${c.name}</div></div>`;
(async () => {
  const b = await chromium.launch();
  for (const c of cards) {
    const p = await b.newPage({ viewport: { width: c.w, height: c.h }, deviceScaleFactor: 1 });
    await p.setContent(html(c), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: c.out });
    await p.close();
  }
  await b.close();
})();
