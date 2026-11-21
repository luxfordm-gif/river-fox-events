#!/usr/bin/env python3
"""Storyboard as a page Matt can open on his phone (he asked 19 Nov 2026: "I don't see the storyboard. Can you open it up for me?").
Usage: python3 storyboard_page.py story.json labels.json draft.mp4 out.html [title]
One card per beat: a thumbnail taken from the draft video, the clip name, what Laura says, text on screen, framing. Publish out.html with the Artifact tool and send Matt the link. Run it BEFORE the full render (a draft is enough)."""
import json,sys,os,subprocess,base64,html
cfg=json.load(open(sys.argv[1])); labels=json.load(open(sys.argv[2])); video=sys.argv[3]; out=sys.argv[4]
title=sys.argv[5] if len(sys.argv)>5 else 'Storyboard'
tmp=os.path.join(os.path.dirname(os.path.abspath(out)),'sb_thumbs'); os.makedirs(tmp,exist_ok=True)
t=0.0; cards=[]
for i,s in enumerate(cfg['segments']):
    d=s['d']; spd=s.get('speed',1)
    name=labels.get(s['clip'],os.path.splitext(os.path.basename(s['clip']))[0])
    caps=[c['text'].replace('|',' ') for c in s.get('captions',[])]
    says=' '.join(caps) if caps else ('Laura\'s voice, no captions' if s.get('audio') else ('No talking, sped up %sx'%spd if spd!=1 else 'No talking'))
    fx=[]   # every cut, zoom, speed change or transition, flagged in the storyboard (Matt, 19 Nov 2026)
    fx.append(('opens','Opens the video') if i==0 else ('fade','Crossfade in, 0.3s'))
    if spd!=1: fx.append(('speed','Plays %sx faster'%spd))
    h=s.get('headline'); text=''
    if h: text='"%s %s"'%(h['line1'].replace('&nbsp;',' '),h['line2'].replace('&nbsp;',' '))
    if s.get('zoom') is False: frame='Stays wide (set by hand)'
    elif 'punch_at' in s: frame='Cuts in closer on her face at %.1fs (set by hand)'%s['punch_at']
    elif s.get('audio') and t>=4 and d>=4: frame='Stays wide, unless she reacts after a pause (the tool decides)'
    elif s.get('audio'): frame='Stays wide (first 4 seconds, or under 4 seconds long)'
    else: frame='Stays wide'
    cut_at=None
    if s.get('zoom') is not False:
        if 'punch_at' in s: cut_at=s['punch_at']
        elif s.get('audio') and t>=4 and d>=4:
            wj=os.path.join(cfg.get('work','work'),s['clip'].rsplit('.',1)[0]+'.words.json')
            if os.path.exists(wj):
                EM={'oh','ooh','wow','look','love','loved','smell','smells','pretty','amazing','beautiful','yummy','gorgeous','perfect','lovely','gosh','whoa','tempted','sorted','done'}
                norm=lambda x:''.join(c for c in x.lower() if c.isalnum())
                ws=[w for w in json.load(open(wj)) if s['ss']-0.01<=w['start']<=s['ss']+d*spd]; best=None
                for k,w in enumerate(ws):
                    if norm(w['word']) in EM:
                        pe=ws[k-1]['end'] if k>0 else s['ss']-1
                        if w['start']-pe>=0.4 and w['start']-s['ss']>=1.0: best=w['start']-s['ss']-0.15
                if best is not None: cut_at=best
    if cut_at is not None: fx.append(('cut','HARD CUT to a tighter crop on her face at %.1fs into this beat (stays until the beat ends)'%cut_at))
    if h: fx.append(('text','Headline fades in over the first shot'))
    if s.get('audio') and any(True for _ in s.get('captions',[])): fx.append(('text','Captions fade up word by word'))
    th=os.path.join(tmp,'b%d.jpg'%i)
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t+min(d,2.0)/2+0.4),'-i',video,'-frames:v','1','-vf','scale=216:-1','-q:v','6',th],check=True)
    b64=base64.b64encode(open(th,'rb').read()).decode()
    cards.append((i+1,t,d,name,says,text,frame,b64,fx)); t+=d-0.3
total=t+0.3
def card(c):
    n,t0,d,name,says,text,frame,b64,fx=c
    chips=''.join('<span class="fx %s">%s</span>'%(k,html.escape(v)) for k,v in fx)
    on='<div class="row"><b>On screen</b><span>%s</span></div>'%html.escape(text) if text else ''
    return '<article class="card"><div class="th"><img src="data:image/jpeg;base64,%s" alt="Beat %d: %s"><span class="n">%d</span></div><div class="body"><div class="top"><h2>%s</h2><span class="time">%d:%02d &middot; %.1fs</span></div><div class="row"><b>Says</b><span>%s</span></div>%s<div class="row"><b>Framing</b><span>%s</span></div><div class="fxs">%s</div></div></article>'%(b64,n,html.escape(name),n,html.escape(name),int(t0)//60,int(t0)%60,d,html.escape(says),on,html.escape(frame),chips)
page='''<title>%(t)s</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Inter:wght@500;600&display=swap">
<style>
/* Layout: one row per beat, thumbnail left, words right; a single column on a phone. */
:root{--bg:#FBF8F6;--fg:#191C17;--muted:#6B645B;--line:#E6DCD5;--card:#FFFFFF;--soft:#F1E9E3;--accent:#8A5A4A;--brown:#5D554B;--serif:"Fraunces",Georgia,serif;--sans:"Inter",system-ui,sans-serif}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#171513;--fg:#F3ECE7;--muted:#A99F95;--line:#34302B;--card:#1F1C19;--soft:#2A2622;--accent:#C88A74;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#171513;--fg:#F3ECE7;--muted:#A99F95;--line:#34302B;--card:#1F1C19;--soft:#2A2622;--accent:#C88A74;color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--sans);padding-inline:max(16px,env(safe-area-inset-left,0px)) max(16px,env(safe-area-inset-right,0px));padding-block:26px 56px}
.wrap{max-width:760px;margin:0 auto}
h1{font-family:var(--serif);font-weight:400;font-size:clamp(32px,7vw,48px);line-height:1.05;letter-spacing:-.02em;margin:0 0 6px;text-wrap:balance}
h1 em{font-style:italic;color:var(--accent)}
.lead{color:var(--muted);font-size:15px;line-height:1.5;margin:0 0 20px;max-width:58ch}
.list{display:grid;gap:12px}
.card{display:grid;grid-template-columns:108px minmax(0,1fr);gap:14px;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px}
.th{position:relative;align-self:start}
.th img{display:block;width:100%%;border-radius:6px;aspect-ratio:9/16;object-fit:cover}
.n{position:absolute;left:6px;top:6px;background:var(--brown);color:#F7EEE9;font-size:12px;font-weight:600;border-radius:4px;padding:2px 7px}
.top{display:flex;justify-content:space-between;gap:10px;align-items:baseline;flex-wrap:wrap;margin-bottom:6px}
h2{font-family:var(--serif);font-weight:400;font-size:21px;letter-spacing:-.01em;margin:0}
.time{font-size:12.5px;color:var(--muted);font-variant-numeric:tabular-nums}
.row{display:grid;grid-template-columns:78px minmax(0,1fr);gap:8px;font-size:14px;line-height:1.45;padding:3px 0}
.row b{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);font-weight:600;padding-top:2px}
.fxs{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.fx{font-size:12px;font-weight:600;border-radius:4px;padding:3px 8px;background:var(--soft);color:var(--fg)}.fx.cut{background:var(--accent);color:#fff}.fx.fade{background:transparent;border:1px solid var(--line);color:var(--muted)}.fx.speed{background:var(--brown);color:#F7EEE9}.fx.opens{background:transparent;border:1px solid var(--line);color:var(--muted)}
.key{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 16px;font-size:12.5px;color:var(--muted);align-items:center}
.end{margin-top:18px;padding:12px 14px;border:1px solid var(--line);border-radius:10px;font-size:14px;line-height:1.5}
@media (max-width:420px){.card{grid-template-columns:84px minmax(0,1fr);gap:10px}.row{grid-template-columns:1fr;gap:1px}}
</style>
<div class="wrap">
<h1>%(h1)s <em>storyboard</em></h1>
<p class="lead">%(n)d beats, about %(tot).0f seconds. Check the order, what Laura says in each beat and the framing, then tell Claude what to change before anything is rendered. Every cut, zoom, speed change and transition is flagged under its beat.</p>
<div class="key"><span class="fx cut">Hard cut</span> a jump to a closer crop <span class="fx fade">Crossfade</span> a soft blend between beats <span class="fx speed">Speed</span> sped-up making shots <span class="fx text">Text</span> words appearing</div>
<div class="list">%(cards)s</div>
<div class="end"><b>Ends on:</b> %(last)s. No end card. Captions %(cs)s, fade up. Her voice is kept, with bumps and rustles cut out.</div>
</div>'''%dict(t=html.escape(title),h1=html.escape(title.replace(' storyboard','')),n=len(cards),tot=total,cards=''.join(card(c) for c in cards),last=html.escape(cards[-1][3]),cs='word by word' if cfg.get('caption_style','words')=='words' else 'as a whole line')
open(out,'w').write(page); print('wrote',out,len(page))
