// Animated captions, word by word (and letter by letter on a held word), as a transparent PNG sequence at 30 fps.
//   node anim.cjs wild|box|classic outdir [seconds]
// Each word fades up and in at the moment Laura says it (times measured from her voice, clip5.mp4). "love" is held, so it
// becomes "looove" and its letters arrive one by one across the hold. Layout is fixed from the first frame, so nothing jumps.
const puppeteer = require(require('path').join(__dirname,'../../photo-grade/node_modules/puppeteer-core'));
const fs = require('fs');
const [style, dir, secs = '6.5'] = process.argv.slice(2);
fs.mkdirSync(dir, { recursive: true });
// groups: lines of words; a word is [text, onset] or [text, [char onsets]]
const GROUPS = [
  { out: 2.05, lines: [[['All', 0.54], ['finished', 0.84]]] },
  // times are about 0.06s BEFORE her voice starts (measured at 20 ms: "and I" 2.20-2.62, "looove it" 3.64-4.30), and words fade in fast
  { out: 4.55, big: true, lines: [[['and', 2.14], ['I', 3.24]], [['looove', [3.58, 3.66, 3.76, 3.86, 3.96, 4.03]]], [['it.', 4.08]]] },
  { out: 6.35, lines: [[['It\u2019s', 4.94], ['so', 5.24], ['beautiful.', 5.46]]] },
];
const FONT = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Fraunces:ital,opsz,wght,SOFT,WONK@0,144,400..900,0..100,0..1&display=block" rel="stylesheet">';
const SH = 'text-shadow:0 4px 34px rgba(30,16,10,.55),0 2px 8px rgba(30,16,10,.3)';
const CSS = {
  wild: `.g{position:absolute;left:0;right:0;top:290px;text-align:center;color:#FCFBF8;font-family:Fraunces,serif;font-variation-settings:"SOFT" 100,"WONK" 1;font-weight:900;font-size:110px;line-height:1.02;letter-spacing:-.025em;${SH}}.l{display:block;white-space:nowrap}`,
  classic: `.g{position:absolute;left:0;right:0;top:290px;text-align:center;color:#FCFBF8;font-family:Fraunces,serif;font-weight:500;font-size:106px;line-height:1.04;letter-spacing:-.03em;${SH}}.l{display:block;white-space:nowrap}`,
  box: `.g{position:absolute;left:0;right:0;top:300px;display:flex;flex-direction:column;align-items:center;gap:6px;font-family:Inter,sans-serif;font-weight:600;font-size:60px;line-height:1.1;letter-spacing:-.015em;color:#191C17}.l{display:inline-block;background:#F7EEE9;border-radius:4px;padding:14px 26px 17px;white-space:nowrap}`,
};
const BIG = {
  wild: '#g1{top:235px}#g1 .l:nth-child(2){font-size:230px;line-height:.95;letter-spacing:-.04em}',
  classic: '#g1{top:235px}#g1 .l:nth-child(2){font-size:215px;line-height:.95;letter-spacing:-.04em}',
  box: '#g1{top:250px}#g1 .l:nth-child(2){font-size:130px;padding:18px 36px 24px}',
};
const build = () => GROUPS.map((g, gi) => `<div class=g id=g${gi}>${g.lines.map((ln, li) => `<span class=l id=l${gi}_${li}>${ln.map((w, wi) => {
  const chars = Array.isArray(w[1]) ? [...w[0]].map((c, ci) => `<span class=c data-t="${w[1][ci]}" style="display:inline-block;opacity:0">${c}</span>`).join('') : w[0];
  return `<span class=w ${Array.isArray(w[1]) ? '' : `data-t="${w[1]}"`} style="display:inline-block;opacity:${Array.isArray(w[1]) ? 1 : 0}">${chars}</span>`;
}).join(' ')}</span>`).join('')}</div>`).join('');
(async () => {
  const br = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const pg = await br.newPage(); await pg.setViewport({ width: 1080, height: 1920 });
  await pg.setContent(`<!doctype html><meta charset=utf-8>${FONT}<style>html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:transparent}${CSS[style]}${BIG[style]}</style>${build()}`, { waitUntil: 'load', timeout: 90000 });
  await pg.evaluate(() => document.fonts.ready);
  await pg.evaluate((outs, style) => {
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    window.setT = (t) => {
      outs.forEach((o, gi) => {
        const g = document.getElementById('g' + gi);
        const fade = t > o ? Math.max(0, 1 - (t - o) / 0.18) : 1;
        g.style.opacity = fade;
        g.querySelectorAll('[data-t]').forEach((el) => {
          const s = parseFloat(el.dataset.t), d = el.classList.contains('c') ? 0.10 : 0.13;
          const p = Math.min(1, Math.max(0, (t - s) / d)); const e = ease(p);
          el.style.opacity = e; el.style.transform = `translateY(${(1 - e) * (el.classList.contains('c') ? 16 : 22)}px)`;
        });
        // box style: a line's box appears with its first word
        if (style === 'box') g.querySelectorAll('.l').forEach((ln) => {
          const first = ln.querySelector('[data-t]'); const s = parseFloat(first.dataset.t);
          ln.style.opacity = Math.min(1, Math.max(0, (t - s + 0.02) / 0.12));
        });
      });
    };
  }, GROUPS.map((g) => g.out), style);
  const N = Math.round(parseFloat(secs) * 30);
  for (let f = 0; f < N; f++) {
    await pg.evaluate((t) => window.setT(t), f / 30);
    await pg.screenshot({ path: `${dir}/f_${String(f).padStart(4, '0')}.png`, omitBackground: true, type: 'png' });
  }
  await br.close(); console.log(style, N, 'frames');
})();
