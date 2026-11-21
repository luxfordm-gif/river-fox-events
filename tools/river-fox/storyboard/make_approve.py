#!/usr/bin/env python3
"""One page: every decision as pictures to tap, with a summary to copy back into the chat."""
import io, base64, html, os
from PIL import Image
os.chdir(os.environ.get('WORK', os.getcwd()))
def b64(path, w=400, q=78, crop=None):
    im = Image.open(path).convert('RGB')
    if crop: im = im.crop(crop)
    im = im.resize((w, int(w * im.height / im.width))); b = io.BytesIO(); im.save(b, 'JPEG', quality=q); return base64.b64encode(b.getvalue()).decode()
def opt(group, val, label, imgs, sub=''):
    ims = ''.join(f'<img alt="{html.escape(label)}" src="data:image/jpeg;base64,{b64(p, **k)}">' for p, k in imgs)
    return f'<label class="o"><input type="radio" name="{group}" value="{html.escape(val)}"><span class="card"><span class="imgs">{ims}</span><b>{html.escape(label)}</b><em>{html.escape(sub)}</em></span></label>'
F = {}
Q = []
# 1 headline layout
Q.append(('headline', '1. Headline layout', 'The headline at weight 500, which you liked.', [
    opt('headline', 'Two lines', 'Two lines', [('appr/s_two.png', {})], '"A Worplesdon / welcome."'),
    opt('headline', 'Stacked', 'Stacked', [('appr/s_stack.png', {})], '"A", then "Worplesdon", then a smaller "welcome."')]))
# 2 finale size
Q.append(('finale', '2. "Ta-da." size', 'You said the last one was too big.', [
    opt('finale', 'Smaller (new)', 'Smaller (new)', [('appr/s_fin_new.png', {})], 'About a quarter smaller, handle small and low'),
    opt('finale', 'Bigger (before)', 'Bigger (before)', [('appr/s_fin_big.png', {})], 'The size you said was too big')]))
# 3 hook
Q.append(('hook', '3. How the reel opens', 'The first two or three seconds.', [
    opt('hook', 'Laura first', 'Laura first', [('out3/fr/F/f00.png', {})], '"All finished and I love it." My pick.'),
    opt('hook', 'Title behind her', 'Title behind her', [('hook/still_0.9.png', {})], '"All finished." behind her head, the wild-card style'),
    opt('hook', 'Timelapse first', 'Timelapse first', [('out3/fr/E/f01.png', {})], 'Headline on the gravel over the build'),
    opt('hook', 'Shiny bauble', 'Shiny bauble', [('out3/fr/D/f07.png', {})], 'Laura reflected in a bauble')]))
# 4 reel
Q.append(('reel', '4. Which reel', 'Three frames from each: start, middle, end.', [
    opt('reel', 'E', 'E: timelapse only', [('out3/fr/E/f01.png', {}), ('out3/fr/E/f05.png', {}), ('out3/fr/E/f11.png', {})], '30 s'),
    opt('reel', 'D', 'D: timelapse, Laura, garland', [('out3/fr/D/f01.png', {}), ('out3/fr/D/f08.png', {}), ('out3/fr/D/f15.png', {})], '38 s'),
    opt('reel', 'F', 'F: Laura opens, then the build', [('out3/fr/F/f00.png', {}), ('out3/fr/F/f05.png', {}), ('out3/fr/F/f15.png', {})], '38 s. My pick.')]))
blocks = ''.join(f'<section class="q" id="q-{k}"><h2>{t}</h2><p class="hint">{h}</p><div class="opts">{"".join(o)}</div></section>' for k, t, h, o in Q)

page = f'''<title>Worplesdon Decisions</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..600&display=swap">
<style>
/* Layout: one question per card, pictures to tap, a summary at the bottom to copy back into the chat. River Fox colours. */
:root{{--bg:#FBF7F4;--card:#FFFFFF;--ink:#191C17;--muted:#5D554B;--line:#E7DDD6;--pink:#F7EEE9;--sel:#191C17;--serif:'Fraunces',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#171512;--card:#211E1A;--ink:#F2ECE6;--muted:#B7ADA3;--line:#3A342E;--pink:#2A2420;--sel:#F2ECE6;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#171512;--card:#211E1A;--ink:#F2ECE6;--muted:#B7ADA3;--line:#3A342E;--pink:#2A2420;--sel:#F2ECE6;color-scheme:dark}}
body{{background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.5;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 64px}}
main{{max-width:860px;margin:0 auto;display:flex;flex-direction:column;gap:22px}}
h1{{font-family:var(--serif);font-weight:500;font-size:clamp(30px,6vw,42px);line-height:1.1;margin:0;text-wrap:balance}}
.intro{{color:var(--muted);margin:8px 0 0;max-width:60ch}}
.q{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;min-width:0}}
.q h2{{font-family:var(--serif);font-weight:500;font-size:22px;margin:0}}
.hint{{margin:2px 0 14px;color:var(--muted);font-size:14px}}
.opts{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:12px}}
.o{{display:block;cursor:pointer;min-width:0}}
.o input{{position:absolute;opacity:0;pointer-events:none}}
.card{{display:flex;flex-direction:column;gap:6px;border:2px solid var(--line);border-radius:12px;padding:8px;height:100%;box-sizing:border-box;transition:border-color .15s,background .15s}}
.imgs{{display:flex;gap:4px}}
.imgs img{{display:block;flex:1;min-width:0;width:100%;height:auto;border-radius:6px}}
.card b{{font-size:15px}}.card em{{font-style:normal;color:var(--muted);font-size:13px}}
.o input:checked + .card{{border-color:var(--sel);background:var(--pink)}}
.o input:checked + .card b::before{{content:"\\2713  "}}
.o input:focus-visible + .card{{outline:2px solid var(--sel);outline-offset:2px}}
.words{{display:flex;flex-direction:column;gap:10px}}
.words label{{font-size:14px;color:var(--muted)}}
.words input{{width:100%;box-sizing:border-box;font:inherit;padding:10px 12px;border-radius:8px;border:1px solid var(--line);background:var(--bg);color:var(--ink)}}
.sum{{background:var(--pink);border-radius:14px;padding:18px}}
.sum h2{{font-family:var(--serif);font-weight:500;font-size:22px;margin:0 0 8px}}
#out{{white-space:pre-wrap;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px;font-size:15px;margin:0 0 12px}}
button{{font:600 16px var(--sans);padding:12px 20px;border-radius:24px;border:0;background:var(--sel);color:var(--bg);cursor:pointer}}
button:focus-visible{{outline:2px solid var(--sel);outline-offset:2px}}
.done{{margin:8px 0 0;color:var(--muted);font-size:14px}}
</style>
<main>
<div><h1>Worplesdon <em>decisions</em></h1><p class="intro">Tap one in each box. Settled already: warm white wild card, gap 3, headline weight 500, no music, captions off Laura's face. The summary at the bottom updates as you tap. Copy it into the chat.</p></div>
{blocks}
<section class="q" id="q-words"><h2>5. The wording</h2><p class="hint">Mine are placeholders. Leave blank to keep them, or type your own or Laura's.</p><div class="words">
<label for="w1">Headline</label><input id="w1" type="text" placeholder="A Worplesdon welcome." autocomplete="off">
<label for="w2">Finale</label><input id="w2" type="text" placeholder="Ta-da. Your door's sorted." autocomplete="off">
<label for="w3">Small line under the finale</label><input id="w3" type="text" placeholder="A garland arch and wreath" autocomplete="off"></div></section>
<section class="sum"><h2>Your answers</h2><div id="out" aria-live="polite"></div><button id="copy" type="button">Copy answers</button><p class="done" id="done"></p></section>
</main>
<script>
(function(){{
var names=[['headline','Headline'],['finale','"Ta-da." size'],['hook','Opening'],['reel','Reel']];
var out=document.getElementById('out');
function val(n){{var e=document.querySelector('input[name="'+n+'"]:checked');return e?e.value:null}}
function text(){{var l=names.map(function(p){{return p[1]+': '+(val(p[0])||'not chosen yet')}});
 var w=[['w1','Headline words'],['w2','Finale words'],['w3','Small line']].map(function(p){{var v=document.getElementById(p[0]).value.trim();return p[1]+': '+(v||'keep mine')}});
 return l.concat(w).join('\\n')}}
function upd(){{out.textContent=text()}}
document.addEventListener('input',upd);document.addEventListener('change',upd);upd();
document.getElementById('copy').addEventListener('click',function(){{var t=text(),d=document.getElementById('done');
 function ok(){{d.textContent='Copied. Paste it into the chat.'}}
 function fail(){{var r=document.createRange();r.selectNodeContents(out);var s=getSelection();s.removeAllRanges();s.addRange(r);d.textContent='Select and copy the text above.'}}
 try{{navigator.clipboard.writeText(t).then(ok,fail)}}catch(e){{fail()}}}});
}})();
</script>'''
open('approve.html', 'w').write(page); print(len(page) // 1024, 'KB')
