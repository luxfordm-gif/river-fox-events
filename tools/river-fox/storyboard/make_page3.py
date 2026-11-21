import subprocess, base64, os, glob, html
V = os.environ.get('WORK', os.getcwd())

R2 = V + '/out2/R-reels/'; S2D = V + '/out2/S-stories/'; W2 = V + '/out2/W-wildcard/'
OPTS = [
  dict(group='The Worplesdon reels (your pick: E; D and F add the clips and Laura talking)', id='E', name='Timelapse, with text', mp4=R2+'E2.mp4', folder='E2', dur='30.1 s',
       line='Just the timelapse, brightened and centred on the arch. The headline now sits on the gravel.',
       beats=[('0:00-0:05', 'Headline "A Worplesdon welcome." on the gravel.'), ('0:05-0:27', 'The build at 2x: Laura on the ladder, the arch going up.'), ('0:27-0:30', 'The finished arch holds, with "Ta-da. Your door\'s sorted." on the gravel.')],
       notes='No music. A silent sound track, ready for the music you pick in Instagram.'),
  dict(id='D', name='Timelapse, then Laura, then the garland', mp4=R2+'D2.mp4', folder='D2', dur='38.4 s',
       line='Timelapse, straight into Laura talking, then the sweep along the garland and the baubles, ending on the finished porch.',
       beats=[('0:00-0:18', 'Timelapse at 3x. Headline on the gravel from 0:01.'), ('0:18-0:24', 'Laura: "All finished and I love it. It\'s so beautiful." Her words are captioned at the top, clear of her face.'), ('0:24-0:28', 'A sweep along the garland to the door.'), ('0:28-0:33', 'The baubles, including the shiny one that reflects Laura.'), ('0:33-0:38', 'The finished porch, with "Ta-da. Your door\'s sorted."')],
       notes='The lantern-and-wreath clip is gone. Her voice is the only sound, over a very quiet room tone. No music.'),
  dict(id='F', name='Laura opens, then the build', mp4=R2+'F.mp4', folder='F', dur='38.4 s',
       line='The same as D, but Laura\'s line is the hook at the very start.',
       beats=[('0:00-0:06', 'Laura: "All finished and I love it. It\'s so beautiful." This is the hook. No headline.'), ('0:06-0:24', 'Cut to the timelapse at 3x, with the headline on the gravel from 0:07.'), ('0:24-0:38', 'The sweep, the baubles, then the finished porch with "Ta-da."')],
       notes='Reels that open on a person and a feeling hold people better than ones that open on a ladder.'),
  dict(group='Wild card: big bold lettering behind Laura (from the 18 Nov wreath-making clip)', id='W1', name='Yellow lettering', mp4=W2+'W-yellow.mp4', folder='W-yellow', dur='11.2 s',
       line='"Making a wreath." in heavy, soft Fraunces behind Laura. She moves in front of the letters.',
       beats=[('0:00-0:11', 'The title sits behind her; her head covers the end of "wreath." as she moves. Captions in the same bold lettering: "So this morning I\'m making a wreath / to match a doorway / that I\'m doing later on in the week / foliage, scraps."')],
       notes='Acid yellow, like the creator you shared. The cut-out around her hair and jumper is clean on this clip. Her own voice, no music.'),
  dict(id='W2', name='Soft peach lettering', mp4=W2+'W-peach.mp4', folder='W-peach', dur='11.2 s',
       line='The same Story in River Fox soft peach.',
       beats=[('0:00-0:11', 'Same cut-out, same words, peach lettering with a slightly stronger shadow so it reads on the pale wall.')],
       notes='On brand, but softer on a bright wall. Yellow reads more easily.'),
  dict(group='Bonus Stories from the 16 and 18 Nov footage (not part of the Worplesdon job)', id='S1', name='Wholesalers', mp4=S2D+'S1-wholesalers-draft.mp4', folder='S1', dur='10.2 s',
       line='"Come with me to the wholesalers", then the flower aisle.',
       beats=[('0:00-0:05', 'Laura in the car: "I\'ve got a few doors to do this week, so come with me to the wholesalers, and let\'s get some fresh foliage."'), ('0:05-0:10', 'The flower aisle with her voice: "Oooh, look at all these. I always looove coming down here."')],
       notes='Captions sit below her face, on her jacket.'),
  dict(id='S2', name='Ribbon aisle', mp4=S2D+'S2-ribbon-draft.mp4', folder='S2', dur='9.8 s',
       line='Laura gets carried away in the ribbon aisle.',
       beats=[('0:00-0:10', '"Oooh, the ribbon aisle. I always get carried away in the ribbon aisle. I need some green velvet. I think they\'ve got me."')],
       notes='Please listen to the last line, which Whisper heard as "gotten", and the middle, where her voice is faint.'),
  dict(id='S3', name='It smells so good', mp4=S2D+'S3-smells-draft.mp4', folder='S3', dur='11.8 s',
       line='Laura loving the smell of the finished wreath.',
       beats=[('0:00-0:09', '"Looking good. Oh, look how mushy that is. And it smells amazing. Oh, it smells so good."'), ('0:09-0:12', '"Can\'t wait to put some baubles on it now."')],
       notes='There is a version with a hard cut to a tighter crop on her face at the reaction, if you want it.'),
  dict(id='S4', name='Halfway through', mp4=S2D+'S4-halfway-draft.mp4', folder='S4', dur='13.1 s',
       line='The halfway check-in.',
       beats=[('0:00-0:13', '"Okay, so we\'re about halfway through, and here\'s how it\'s looking so far. It\'s so pretty. I mean, not this, but this."')],
       notes='She lifts the wreath mid-sentence, so the pause stays in.'),
]

def thumbs(folder, mp4=None):
    mp4 = mp4 or f'{V}/out/{folder}/draft.mp4'
    d = f'{V}/out2/_th/{folder}'; os.makedirs(d, exist_ok=True)
    for f in glob.glob(d + '/*.jpg'): os.remove(f)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp4, '-vf', 'fps=1/2.5,scale=420:-1', '-q:v', '7', d + '/t%02d.jpg'], check=True)
    out = []
    for i, f in enumerate(sorted(glob.glob(d + '/*.jpg'))):
        t = i * 2.5
        out.append((f'{int(t//60)}:{int(t%60):02d}', base64.b64encode(open(f, 'rb').read()).decode()))
    return out

cards = []
for o in OPTS:
    grp = f'<h3 class="grp">{html.escape(o["group"])}</h3>' if o.get('group') else ''
    th = ''.join(f'<figure><img alt="Frame at {t}" src="data:image/jpeg;base64,{b}"><figcaption>{t}</figcaption></figure>' for t, b in thumbs(o['folder'], o['mp4']))
    beats = ''.join(f'<tr><td class="tc">{html.escape(a)}</td><td>{html.escape(b)}</td></tr>' for a, b in o['beats'])
    cards.append(grp + f'''<section class="opt" id="opt-{o['id'].lower()}"><header><span class="letter">{o['id']}</span><div><h2>{html.escape(o['name'])}</h2><p class="dur">{o['dur']} - 540x960 draft</p></div></header>
<p class="line">{html.escape(o['line'])}</p><div class="strip" data-title="{html.escape(o['id'] + ' - ' + o['name'])}">{th}</div>
<div class="tbl"><table><tbody>{beats}</tbody></table></div><p class="note">{html.escape(o['notes'])}</p></section>''')

page = f'''<title>Worplesdon Reel Drafts</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&display=swap">
<style>
/* Layout: one calm column, a card per option, a filmstrip of frames in each. River Fox's own colours (logo pink, logo brown, ink). */
:root{{--bg:#FBF7F4;--card:#FFFFFF;--ink:#191C17;--muted:#5D554B;--line:#E7DDD6;--pink:#F7EEE9;--accent:#8A5A4B;--serif:'Fraunces',Georgia,serif;--sans:'DM Sans',system-ui,sans-serif}}
@media (prefers-color-scheme:dark){{:root:not([data-theme="light"]){{--bg:#171512;--card:#211E1A;--ink:#F2ECE6;--muted:#B7ADA3;--line:#3A342E;--pink:#2A2420;--accent:#D9A898;color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#171512;--card:#211E1A;--ink:#F2ECE6;--muted:#B7ADA3;--line:#3A342E;--pink:#2A2420;--accent:#D9A898;color-scheme:dark}}
body{{background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.55;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 56px}}
main{{max-width:860px;margin:0 auto;display:flex;flex-direction:column;gap:28px}}
h1{{font-family:var(--serif);font-weight:400;font-size:clamp(30px,6vw,44px);line-height:1.1;margin:0;text-wrap:balance}}
h1 em{{font-style:italic}}
.intro{{color:var(--muted);margin:10px 0 0;max-width:62ch}}
.opt{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:14px;min-width:0}}
.opt header{{display:flex;gap:14px;align-items:center}}
.letter{{font-family:var(--serif);font-size:30px;width:48px;height:48px;border-radius:50%;background:var(--pink);display:grid;place-items:center;flex:none}}
h2{{font-family:var(--serif);font-weight:400;font-size:24px;line-height:1.2;margin:0}}
.dur{{margin:0;color:var(--muted);font-size:14px}}
.line{{margin:0;font-weight:500}}
.strip{{display:flex;gap:6px;overflow-x:auto;padding-bottom:8px}}
.strip figure{{margin:0;flex:none;text-align:center}}
.strip img{{display:block;width:96px;height:auto;border-radius:6px;cursor:zoom-in}}
.strip figcaption{{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}}
.tbl{{overflow-x:auto}}
table{{border-collapse:collapse;width:100%;font-size:15px}}
td{{padding:6px 10px 6px 0;vertical-align:top;border-top:1px solid var(--line)}}
td.tc{{white-space:nowrap;color:var(--muted);font-variant-numeric:tabular-nums;width:1%}}
.grp{{font-family:var(--serif);font-weight:400;font-size:20px;margin:14px 0 -8px;color:var(--muted)}}
.note{{margin:0;color:var(--muted);font-size:14px}}
.next{{background:var(--pink);border-radius:14px;padding:20px}}
.next h2{{margin-bottom:8px}}
.next ul{{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px}}
</style>
<main>
<div><h1>Worplesdon <em>Reel drafts</em></h1>
<p class="intro">The reels, a wild-card Story and four short Stories, all low-resolution drafts. Music is off everywhere. Captions of Laura\'s words never sit on her face: when she is close, they move to the top of the frame. Tap any frame to see it full screen, then swipe left or right to move through the frames. The videos themselves are in the chat.</p></div>
{''.join(cards)}
<section class="next"><h2>What I need from you</h2><ul>
<li>Which reel to take to full quality: E, D or F. My pick is F, because it opens on Laura\'s reaction.</li>
<li>The wording on the text. "A Worplesdon welcome." and "Your door\'s sorted." are mine.</li>
<li>Whether the wild-card lettering (heavy soft Fraunces, the cut-out behind Laura) should become part of the style, and which colour.</li>
<li>Which of the four bonus Stories are worth keeping. They come from earlier footage, not Worplesdon.</li>
<li>Please listen to Story S2 (ribbon aisle): a couple of words are uncertain.</li>
</ul></section>
</main>'''
EXTRA = '\n<style>\n.lb{position:fixed;inset:0;z-index:50;background:#0c0b0a;display:none;flex-direction:column;align-items:center;justify-content:center;touch-action:pan-y;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)}\n.lb.on{display:flex}\n.lb img{max-width:100%;max-height:calc(100% - 84px);object-fit:contain;border-radius:6px;user-select:none;-webkit-user-drag:none;transition:transform .25s ease,opacity .25s ease}\n.lb .cap{color:#EFE8E1;font:500 15px/1.4 \'DM Sans\',system-ui,sans-serif;padding:12px 64px 0;text-align:center;min-height:56px}\n.lb button{position:absolute;background:rgba(255,255,255,.12);color:#fff;border:0;border-radius:50%;width:44px;height:44px;font-size:22px;cursor:pointer;display:grid;place-items:center}\n.lb .x{top:max(14px,env(safe-area-inset-top,0px));right:max(14px,env(safe-area-inset-right,0px))}\n.lb .pv{left:max(10px,env(safe-area-inset-left,0px));top:50%}\n.lb .nx{right:max(10px,env(safe-area-inset-right,0px));top:50%}\n.lb button:focus-visible{outline:2px solid #fff;outline-offset:2px}\n@media (prefers-reduced-motion:reduce){.lb img{transition:none}}\n</style>\n<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Frame viewer"><button class="x" id="lbx" aria-label="Close">&#10005;</button><button class="pv" id="lbp" aria-label="Previous frame">&#8249;</button><img id="lbi" alt=""><div class="cap" id="lbc"></div><button class="nx" id="lbn" aria-label="Next frame">&#8250;</button></div>\n<script>\n(function(){\nvar lb=document.getElementById(\'lb\'),im=document.getElementById(\'lbi\'),cap=document.getElementById(\'lbc\'),list=[],idx=0,title=\'\';\nfunction show(d){var el=list[idx];im.style.opacity=0;im.style.transform=\'translateX(\'+(d*24)+\'px)\';\n setTimeout(function(){im.src=el.src;cap.textContent=title+\'  -  \'+el.alt.replace(\'Frame at \',\'\')+\'  (\'+(idx+1)+\' of \'+list.length+\')\';im.style.transform=\'translateX(0)\';im.style.opacity=1;},d?120:0);}\nfunction go(d){idx=(idx+d+list.length)%list.length;show(d);}\nfunction open(imgs,i,t){list=imgs;idx=i;title=t;lb.classList.add(\'on\');document.body.style.overflow=\'hidden\';show(0);document.getElementById(\'lbx\').focus();}\nfunction close(){lb.classList.remove(\'on\');document.body.style.overflow=\'\';}\ndocument.querySelectorAll(\'.strip\').forEach(function(strip){var imgs=[].slice.call(strip.querySelectorAll(\'img\'));\n imgs.forEach(function(el,i){el.tabIndex=0;el.setAttribute(\'role\',\'button\');el.addEventListener(\'click\',function(){open(imgs,i,strip.dataset.title)});el.addEventListener(\'keydown\',function(e){if(e.key===\'Enter\'||e.key===\' \'){e.preventDefault();open(imgs,i,strip.dataset.title)}})})});\ndocument.getElementById(\'lbx\').onclick=close;document.getElementById(\'lbp\').onclick=function(){go(-1)};document.getElementById(\'lbn\').onclick=function(){go(1)};\ndocument.addEventListener(\'keydown\',function(e){if(!lb.classList.contains(\'on\'))return;if(e.key===\'Escape\')close();if(e.key===\'ArrowLeft\')go(-1);if(e.key===\'ArrowRight\')go(1)});\nvar sx=0,sy=0;lb.addEventListener(\'touchstart\',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});\nlb.addEventListener(\'touchend\',function(e){var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))go(dx<0?1:-1);else if(dy>90&&Math.abs(dy)>Math.abs(dx))close();},{passive:true});\n})();\n</script>\n'
open(f'{V}/storyboard.html', 'w').write(page + EXTRA)
print(len(page) // 1024, 'KB')
