#!/usr/bin/env python3
"""Build a captioned Instagram Story from clips. Usage: python3 story.py story.json
See SKILL.md for the config format. Needs ffmpeg and Google Chrome."""
import json,subprocess,sys,os,html,hashlib,re
DRAFT='--draft' in sys.argv
PW,PH=(540,960) if DRAFT else (1080,1920)
cfg=json.load(open(sys.argv[1])); W=os.path.abspath(cfg.get('work','work')); os.makedirs(W,exist_ok=True)
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FONTS='<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@600&family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Inter:wght@600&display=block" rel="stylesheet">'
BASE='html,body{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden}'
def shot(name,body,css):
    p=os.path.join(W,name+'.html'); html='<!doctype html><html><head><meta charset="utf-8">%s<style>%s%s</style></head><body>%s</body></html>'%(FONTS,BASE,css,body)
    if os.path.exists(p) and os.path.exists(os.path.join(W,name+'.png')) and open(p).read()==html: return os.path.join(W,name+'.png')  # unchanged: reuse the picture (faster re-runs)
    open(p,'w').write(html)
    subprocess.run([CH,'--headless=new','--disable-gpu','--hide-scrollbars','--default-background-color=00000000','--force-device-scale-factor=1','--window-size=1080,1920','--virtual-time-budget=8000','--screenshot=%s/%s.png'%(W,name),'file://'+p],stderr=subprocess.DEVNULL)
    return os.path.join(W,name+'.png')
# Caption: logo-pink box, ink text, Inter 600 52px, small 4px corners, one box per line ("|" breaks a line), centred, 360px above the bottom
CAPBG=cfg.get('caption_bg','#F7EEE9'); CAPFG=cfg.get('caption_fg','#191C17')
CAP_CSS='.w{position:absolute;left:0;right:0;bottom:360px;display:flex;flex-direction:column;align-items:center;gap:6px}.b{background:'+CAPBG+';color:'+CAPFG+';border-radius:4px;padding:14px 26px 17px;font-family:Inter,sans-serif;font-weight:600;font-size:52px;line-height:1.1;letter-spacing:-.015em;white-space:nowrap}'
def wrap(t,maxc=26):
    # Matt, 18 Nov 2026: a caption box too close to the screen edge looks tight. Any line over ~26 characters breaks in two, balanced, with at least two words on each line ("Okay, so we're about | halfway through"). "|" in the text forces your own breaks.
    if '|' in t or len(t)<=maxc: return t
    w=t.split(); best=None
    for i in range(2,len(w)-1):
        a_,b_=' '.join(w[:i]),' '.join(w[i:])
        d=abs(len(a_)-len(b_))
        if best is None or d<best[0]: best=(d,a_+'|'+b_)
    return best[1] if best else t
def caption(name,text):
    text=wrap(text); return shot(name,'<div class="w">%s</div>'%''.join('<div class="b">%s</div>'%html.escape(l) for l in text.split('|')),CAP_CSS)
# Headline (top): white Fraunces 124px, line 1 upright, line 2 italic, soft dark fade behind at the top
TOP_CSS='.s{position:absolute;top:0;left:0;right:0;height:900px;background:linear-gradient(rgba(20,16,12,.42),rgba(20,16,12,0))}.t{position:absolute;top:300px;left:0;right:0;text-align:center;color:#fff;text-shadow:0 2px 24px rgba(0,0,0,.35)}h1{font-family:Fraunces,serif;font-weight:400;font-size:124px;line-height:.98;letter-spacing:-.035em;margin:0}h1 em{font-style:italic;display:block}'
def top(name,l1,l2): return shot(name,'<div class="s"></div><div class="t"><h1>%s<em>%s</em></h1></div>'%(l1,l2),TOP_CSS)
# Finale: huge Fraunces word at the bottom, italic line under it, caps line with the handle
FIN_CSS='.s{position:absolute;bottom:0;left:0;right:0;height:1000px;background:linear-gradient(rgba(20,16,12,0),rgba(20,16,12,.5))}.t{position:absolute;bottom:400px;left:0;right:0;text-align:center;color:#fff;text-shadow:0 2px 30px rgba(0,0,0,.4)}h1{font-family:Fraunces,serif;font-weight:400;font-size:260px;line-height:.9;letter-spacing:-.04em;margin:0}h2{font-family:Fraunces,serif;font-weight:400;font-style:italic;font-size:132px;line-height:.98;letter-spacing:-.035em;margin:10px 0 0}p{font-family:"DM Sans",sans-serif;font-weight:600;font-size:28px;letter-spacing:.18em;margin:44px 0 0}'
def finale(name,l1,l2,caps): return shot(name,'<div class="s"></div><div class="t"><h1>%s</h1><h2>%s</h2><p>%s</p></div>'%(l1,l2,caps),FIN_CSS)
# House grade (matches the photo look: bright, airy, true whites). "grade": false keeps the phone's own colour.
DN="hqdn3d=0.5:0.5:1.5:1.5," if cfg.get("hq") else "hqdn3d=1.5:1.5:3:3,"
G=DN+"colortemperature=temperature=6100:mix=0.45,curves=master='0/0.03 0.25/0.33 0.5/0.6 0.8/0.87 1/1',eq=contrast=1.05:saturation=1.15:gamma=1.06,"
V=(G if cfg.get('grade',True) else '')+"scale=%d:%d:flags=lanczos,unsharp=5:5:"%(PW,PH)+("0.4" if cfg.get("hq") else "0.8")+",setsar=1,format=yuv420p"

FACE=os.path.join(os.path.dirname(os.path.abspath(__file__)),'face')
def find_face(s,clips_dir):
    """Follow Laura's face through the part of the clip after the cut-in: a frame every 0.4s, macOS Vision face detection (face.swift), gaps filled from the neighbours, lightly smoothed. Returns [(t,cx,cy),...] (fractions of the frame) or None if the face is found in under 60% of the frames (hidden behind the piece, out of shot)."""
    if not os.path.exists(FACE): subprocess.run(['swiftc','-O',FACE+'.swift','-o',FACE],check=True)
    t0=s.get('punch_at',1.2); d=s['d']; spd=s.get('speed',1); ts=[]; t=t0
    while t<d-0.1: ts.append(round(t,2)); t+=0.4
    if not ts or ts[-1]<d-0.3: ts.append(round(d,2))
    fr=[]
    for k,t in enumerate(ts):
        p=os.path.join(W,'face_%s_%s_%d.png'%(os.path.basename(s['clip']).replace('.','_'),str(s['ss']).replace('.','_'),k))
        subprocess.run(['ffmpeg','-v','error','-y','-ss',str(s['ss']+min(t,d-0.05)*spd),'-i',os.path.join(clips_dir,s['clip']),'-frames:v','1','-vf','scale=540:-1',p],check=True); fr.append(p)
    res=subprocess.run([FACE]+fr,capture_output=True,text=True).stdout.splitlines()
    raw=[None if 'none' in l else (float(l.split()[1]),float(l.split()[2])) for l in res]
    if sum(1 for r in raw if r)<max(2,0.6*len(ts)): return None
    n=len(raw); pts=list(raw)
    for i in range(n):          # fill gaps from the nearest found neighbours
        if pts[i] is None:
            L=next((pts[j] for j in range(i-1,-1,-1) if raw[j]),None); R=next((raw[j] for j in range(i+1,n) if raw[j]),None)
            pts[i]=L or R if not (L and R) else ((L[0]+R[0])/2,(L[1]+R[1])/2)
    sm=[]
    for i in range(n):          # 3-frame smoothing so the crop glides rather than twitches
        w=[pts[j] for j in range(max(0,i-1),min(n,i+2))]; sm.append((sum(a for a,_ in w)/len(w),sum(b for _,b in w)/len(w)))
    return [(ts[i],round(sm[i][0],4),round(sm[i][1],4)) for i in range(n)]
def lerp_expr(pts,k):
    """piecewise-linear expression in t through (t, value) pairs"""
    e=str(pts[-1][k])
    for i in range(len(pts)-2,-1,-1):
        (ta,*va),(tb,*vb)=pts[i],pts[i+1]; a,b=va[k-1],vb[k-1]
        e='if(lt(t,%s),%s+(%s)*(t-%s)/%s,%s)'%(tb,a,round(b-a,4),ta,round(max(tb-ta,0.01),3),e)
    return e

EMPH={'oh','ooh','wow','look','love','loved','smell','smells','pretty','amazing','beautiful','yummy','gorgeous','perfect','lovely','gosh','whoa','tempted','sorted','done'}
def emphasis_cut(s):
    """WHEN is a cut-in worth it? (Matt, 19 Nov 2026: "cuts work best when something interesting is going on, like a reaction".) Looks in the transcript for the best reaction inside this clip: a word like oh / ooh / look / love / smell(s) / pretty / lovely that comes right AFTER A PAUSE of at least 0.4s (a new thought, a reaction). Takes the last such trigger and cuts in 0.15s before it, so the cut lands in the gap, never mid-sentence. Returns seconds from the clip start, or None (stay wide)."""
    stem=s['clip'].rsplit('.',1)[0]; wj=os.path.join(W,stem+'.words.json')
    if not os.path.exists(wj): return None
    words=json.load(open(wj)); a,b=s['ss'],s['ss']+s['d']*s.get('speed',1)
    win=[w for w in words if a-0.01<=w['start']<=b]
    best=None
    for i,w in enumerate(win):
        if _norm(w['word']) in EMPH:
            prev_end=win[i-1]['end'] if i>0 else a-1
            if w['start']-prev_end>=0.4 and w['start']-a>=1.0:
                best=w['start']-a-0.15
    return round(best,2) if best is not None else None
def zoom_plan(s):
    """Tighter crop (Matt, 19 Nov 2026: "I don't want it to zoom. I just want it to cut into a tighter crop, always focused on the subject, Laura's face"). While Laura talks ("zoom":"auto", the default for clips with sound) the shot starts wide and at "punch_at" seconds (default 1.2) HARD-CUTS to a fixed, tighter crop (130%, "punch":1.3 to change) centred on her face, which stays there until the clip ends. No animated zoom, no zooming back out. If her face isn't found or she moves around too much, the clip stays wide and the build says so. Silent clips get no zoom ("zoom":"drift" gives a slow push-in if wanted). "zoom":false switches it off. "face":[cx,cy] sets the centre by hand."""
    d=s['d']; z=s.get('zoom','auto' if s.get('audio') else False)
    if z is False or z=='none': return None
    if z=='drift': return ('1+0.06*t/%s'%d,None,None)
    p=s.get('punch',1.3)
    if 'punch_at' in s: t0=s['punch_at']
    else:
        if s.get('_t0',0)<4: print('no cut-in for %s @%s: the opening 4 seconds stay on one framing'%(s['clip'],s['ss'])); return None
        if s['d']<4: print('no cut-in for %s @%s: clip too short'%(s['clip'],s['ss'])); return None
        t0=emphasis_cut(s)
        if t0 is None: print('no cut-in for %s @%s: no reaction after a pause, staying wide'%(s['clip'],s['ss'])); return None
        print('cut-in for %s @%s at %.2fs: a reaction line follows a pause'%(s['clip'],s['ss'],t0))
    s=dict(s,punch_at=t0)
    f=s.get('face') or find_face(s,clips)
    if not f:
        print('no tight crop for %s @%s: face not found or moving too much, staying wide'%(s['clip'],s['ss'])); return None
    if isinstance(f,(list,tuple)) and f and not isinstance(f[0],(list,tuple)): f=[(t0,f[0],f[1]),(s['d'],f[0],f[1])]   # a hand-set "face":[cx,cy]
    print('tight crop for %s @%s: following the face (%d points), cut in at %ss'%(s['clip'],s['ss'],len(f),t0))
    return ('if(gte(t,%s),%s,1)'%(t0,p),(f,t0,p),None)


def room_tone(stem,words):
    """Room tone (Matt, 19 Nov 2026: silencing noise leaves dead silence, which is odd under music, and a muted stretch once swallowed real speech). The quietest half second of the clip that no transcribed word covers, saved as <work>/<stem>.room.wav. Noise bursts are replaced with this, so the background ambience never drops out."""
    out=os.path.join(W,stem+'.room.wav')
    if os.path.exists(out): return out
    wav=os.path.join(W,stem+'.wav'); wj=os.path.join(W,stem+'.words.json')
    words=json.load(open(wj)) if os.path.exists(wj) else []
    sr=int(subprocess.run(['ffprobe','-v','error','-select_streams','a:0','-show_entries','stream=sample_rate','-of','csv=p=0',wav],capture_output=True,text=True).stdout.strip() or 16000)
    n=int(sr*0.25)
    o=subprocess.run(['ffmpeg','-v','error','-i',wav,'-af','asetnsamples=n=%d:p=0,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-'%n,'-f','null','-'],capture_output=True,text=True).stdout
    vals=[]
    for l in o.splitlines():
        if 'RMS_level=' in l:
            v=l.split('=')[1].strip(); vals.append(-99.0 if v in ('-inf','nan') else float(v))
    best=None
    for i in range(len(vals)-1):
        a,b=i*0.25,(i+2)*0.25
        if any(w['start']-0.3<=b and w['end']+0.2>=a for w in words): continue
        lv=max(vals[i],vals[i+1])
        if lv<-90: continue
        if best is None or lv<best[0]: best=(lv,a)
    if best is None:
        i=min(range(max(len(vals)-1,1)),key=lambda k:max(vals[k],vals[k+1])); best=(0,i*0.25)
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(best[1]),'-t','0.5','-i',wav,out],check=True)
    return out
def fill_with_room_tone(stem,ss,d,mute,out):
    """The segment's voice audio (ss..ss+d of <work>/<stem>.wav) with each mute window crossfaded (40ms) to room tone instead of silence."""
    rt=room_tone(stem,None)
    terms=['clip(min(t-%s,%s-t)/0.04,0,1)'%(a,b) for a,b in mute]
    g=terms[-1]
    for t_ in reversed(terms[:-1]): g='max(%s,%s)'%(t_,g)   # ffmpeg's max() takes exactly two arguments
    fc="[0:a]volume='1-%s':eval=frame[v];[1:a]atrim=0:%s,asetpts=N/SR/TB,volume='%s':eval=frame[r];[v][r]amix=inputs=2:normalize=0:duration=first[o]"%(g,d,g)
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(ss),'-t',str(d),'-i',os.path.join(W,stem+'.wav'),'-stream_loop','-1','-i',rt,'-filter_complex',fc,'-map','[o]','-t',str(d),out],check=True)

def voiced_share(wav,t0,t1):
    """Share of 40ms frames in [t0,t1] that look like a voice (strong periodicity at 75-300 Hz). Measured 19 Nov 2026: real speech about 45%, bumps and ambience 0 to 10%. Returns None if numpy is missing."""
    try:
        import numpy as np, wave
    except Exception: return None
    w=wave.open(wav); sr=w.getframerate(); ch=w.getnchannels()
    a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)
    if ch>1: a=a.reshape(-1,ch).mean(1)
    seg=a[int(t0*sr):int(t1*sr)]; fl=int(0.04*sr); hop=int(0.02*sr); vals=[]
    for i in range(0,len(seg)-fl,hop):
        f=seg[i:i+fl]; f=f-f.mean()
        if np.sqrt((f**2).mean())<30: continue
        ac=np.correlate(f,f,'full')[len(f)-1:]; ac=ac/(ac[0]+1e-9)
        lo,hi=int(sr/300),int(sr/75); vals.append(ac[lo:hi].max())
    return float(np.mean([v>0.5 for v in vals])) if vals else 0.0
def noise_windows(wav,ss,d,words,loud=-36):
    """Audio clean-up (Matt, 19 Nov 2026): anything loud that is NOT speech (a sit-down thud, handling noise, a stray word at the cut) is silenced. A frame counts as speech only if a transcribed word covers it (start-0.25s to end+0.1s); loud frames outside that are muted. Silence stays silence. Needs <work>/<clip>.words.json (transcribe.py writes it)."""
    if not words: return []
    sr=int(subprocess.run(['ffprobe','-v','error','-select_streams','a:0','-show_entries','stream=sample_rate','-of','csv=p=0',wav],capture_output=True,text=True).stdout.strip() or 16000)
    n=int(sr*0.05)
    out=subprocess.run(['ffmpeg','-v','error','-ss',str(ss),'-t',str(d),'-i',wav,'-af','asetnsamples=n=%d:p=0,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-'%n,'-f','null','-'],capture_output=True,text=True).stdout
    vals=[]
    for l in out.splitlines():
        if 'RMS_level=' in l:
            v=l.split('=')[1]; vals.append(-99.0 if v.strip() in ('-inf','nan') else float(v))
    def spoken(t):
        a=ss+t
        return any(w['start']-0.25<=a<=w['end']+0.1 for w in words)
    wins=[];cur=None
    for i,v in enumerate(vals):
        t=i*0.05
        bad=v>loud and not spoken(t)
        if bad:
            if cur and t-cur[1]<=0.1: cur[1]=t+0.05
            else:
                if cur: wins.append(cur)
                cur=[t,t+0.05]
    if cur: wins.append(cur)
    return [[round(max(a-0.04,0),2),round(min(b+0.04,d),2)] for a,b in wins if b-a>=0.1]

BAND_Y,BAND_H=1320,240
WORD_CSS='.cell{position:relative;height:__H__px;overflow:hidden}.w{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;gap:6px}.b{background:'+CAPBG+';color:'+CAPFG+';border-radius:4px;padding:14px 26px 17px;font-family:Inter,sans-serif;font-weight:600;font-size:52px;line-height:1.1;letter-spacing:-.015em;white-space:nowrap}.b.t{background:transparent}.h{visibility:hidden}.s{visibility:visible}'
WORD_CSS=WORD_CSS.replace('__H__',str(BAND_H))

HOLD={'oh','ooh','ah','aww','wow','love','loved','look','lovely','pretty','yum','yummy','so','no','mmm','hmm','smell','smells','amazing','beautiful','gorgeous','perfect','please','sorted'}
INTERJ={'oh','ooh','ah','aww','wow','mmm','hmm','yum'}
def voiced_run(wav,t0,maxlen=3.0):
    """seconds of continuous voiced sound from t0 (40ms frames every 20ms, one unvoiced frame forgiven); needs numpy"""
    import numpy as np, wave
    w=wave.open(wav); sr=w.getframerate(); ch=w.getnchannels()
    a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)
    if ch>1: a=a.reshape(-1,ch).mean(1)
    fl=int(0.04*sr); hop=int(0.02*sr); start=int(t0*sr); i=start; miss=0; last=t0
    while i<len(a)-fl and (i-start)/sr<maxlen:
        f=a[i:i+fl]; f=f-f.mean(); ok=False
        if np.sqrt((f**2).mean())>=40:
            ac=np.correlate(f,f,'full')[len(f)-1:]; ac=ac/(ac[0]+1e-9)
            ok=ac[int(sr/300):int(sr/75)].max()>0.5
        if ok: last=i/sr+0.04; miss=0
        else:
            miss+=1
            if miss>1 and i/sr>t0+0.15: break
        i+=hop
    return last-t0
def stretch_word(word,n):
    """loooove: repeat the stressed vowel n more times (the only vowel of a one-syllable word, the first vowel group otherwise; a silent final e is skipped)"""
    m=list(re.finditer(r'[aeiouAEIOU]+',word))
    if not m: return word
    cand=m[:]
    if len(cand)>1 and cand[-1].group().lower()=='e' and cand[-1].end()==len(word): cand=cand[:-1]
    g=cand[-1] if len(cand)==1 else cand[0]
    pos=g.end()-1
    add=word[pos].lower() if word[pos].isupper() else word[pos]   # Ooooooh, not OOOOOOh
    return word[:pos+1]+add*n+word[pos+1:]

BIG_Y,BIG_H=900,300
STOP={'the','a','an','of','to','and','or','in','on','at','is','it','its','it\'s','i','i\'m','my','me','we','so','as','for','with','that','this','these','those','be','but','if','are','was','you','your'}
BIG_CSS='.cell{position:relative;height:300px;overflow:hidden}.w{position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;text-align:center;color:#fff;text-shadow:0 3px 22px rgba(0,0,0,.45),0 1px 3px rgba(0,0,0,.35);white-space:nowrap}.sans{font-family:"Inter Tight",Inter,sans-serif;font-weight:700;font-size:168px;letter-spacing:-.05em;line-height:1}.ital{font-family:Fraunces,serif;font-style:italic;font-weight:600;font-size:186px;letter-spacing:-.03em;line-height:1;color:#F7EEE9}'
BIG_FONTS='<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700&family=Fraunces:ital,opsz,wght@1,9..144,600&display=block" rel="stylesheet">'
def emphasis_words(flat,times,held,s,stem_wav,wj):
    """BIG WORDS (Matt, 19 Nov 2026, from the itsmegkilgore inspo): the words she puts attitude on are set in italic serif. A word is emphasised if she holds it (stretched), it is on the reaction list, or its loudness peak is 4+ dB above her average for the clip; never a small word (the, a, of...), at most about one word in four."""
    emph=[False]*len(flat)
    db=[None]*len(flat)
    try:
        import numpy as np, wave
        words=json.load(open(wj)) if os.path.exists(wj) else []
        w_=wave.open(stem_wav); sr=w_.getframerate(); ch=w_.getnchannels()
        a=np.frombuffer(w_.readframes(w_.getnframes()),dtype=np.int16).astype(float)
        if ch>1: a=a.reshape(-1,ch).mean(1)
        def level(w):
            seg=a[int(w['start']*sr):int(max(w['end'],w['start']+0.08)*sr)]
            return 20*np.log10(np.sqrt((seg**2).mean())+1e-6) if len(seg) else -90
        levs=[level(w) for w in words]; avg=float(np.mean(levs)) if levs else 0
        # map caption words to transcript words by order inside the caption window
        win=[(w,l) for w,l in zip(words,levs) if s['ss']-0.5<=w['start']<=s['ss']+s['d']*s.get('speed',1)+0.5]
        j=0
        for i,tk in enumerate(flat):
            for k in range(j,len(win)):
                if _norm(win[k][0]['word'])==_norm(tk): db[i]=win[k][1]-avg; j=k+1; break
    except Exception as e:
        pass
    for i,w in enumerate(flat):
        n=_norm(w)
        if n in STOP or len(n)<3: continue
        if held[i] or n in EMPH or (db[i] is not None and db[i]>=4.0): emph[i]=True
    cap=max(1,len(flat)//4)
    if sum(emph)>cap:   # keep the strongest
        ranked=sorted([i for i in range(len(flat)) if emph[i]],key=lambda i:(-(held[i]>0),-(db[i] if db[i] is not None else 0)))
        keep=set(ranked[:cap]); emph=[i in keep for i in range(len(flat))]
    return emph
def big_caption_layers(tag,text,c,s,wj):
    """One large word at a time in the middle of the frame (Inter Tight bold, lower case as spoken, tight); emphasis words in Fraunces italic. Words replace each other. Held words are stretched (looove)."""
    text=wrap(text).replace('|',' '); flat=text.split(); n=len(flat)
    times,held=word_times(text,c,s,wj)
    emph=emphasis_words([w.strip(',.?!;:') for w in flat],times,held,s,wj.replace('.words.json','.wav'),wj)
    disp=[]
    for i,w in enumerate(flat):
        core=w.rstrip(',.?!;:'); tail=w[len(core):]
        core=stretch_word(core.lower() if not core.isupper() else core,held[i]) if held[i] else (core[0].lower()+core[1:] if core[:1].isupper() and core not in ('I',"I'm","I've","I'll") else core)
        disp.append(core+tail)
    if any(emph): print('emphasis words: '+', '.join(disp[i] for i in range(n) if emph[i]))
    cells=''.join('<div class="cell"><div class="w"><span class="%s">%s</span></div></div>'%('ital' if emph[i] else 'sans',html.escape(disp[i])) for i in range(n))
    name='bw_%s'%tag
    pth=os.path.join(W,name+'.html'); page='<!doctype html><html><head><meta charset="utf-8">%s<style>html,body{margin:0;width:1080px;background:transparent}%s</style></head><body>%s</body></html>'%(BIG_FONTS,BIG_CSS,cells)
    sheet=os.path.join(W,name+'.png')
    if not (os.path.exists(pth) and os.path.exists(sheet) and open(pth).read()==page):
        open(pth,'w').write(page)
        subprocess.run([CH,'--headless=new','--disable-gpu','--hide-scrollbars','--default-background-color=00000000','--force-device-scale-factor=1','--window-size=1080,%d'%(BIG_H*n),'--virtual-time-budget=8000','--screenshot='+sheet,'file://'+pth],stderr=subprocess.DEVNULL)
    from PIL import Image
    im=Image.open(sheet); layers=[]
    end=min(times[-1]+0.7,c['to'])
    for i in range(n):
        q=os.path.join(W,'%s_%d.png'%(name,i)); im.crop((0,i*BIG_H,1080,(i+1)*BIG_H)).save(q)
        a=times[i]; b=times[i+1] if i<n-1 else max(end,a+0.4)
        layers.append((q,a,b,'big',i==n-1))
    return layers
def _norm(x): return ''.join(c for c in x.lower() if c.isalnum())

_WAVC={}
ONSET_STATS=[]
def _env(wav):
    """loudness envelope of a wav: 20ms frames every 10ms, in dB"""
    if wav in _WAVC: return _WAVC[wav]
    import numpy as np, wave
    w=wave.open(wav); sr=w.getframerate(); ch=w.getnchannels()
    a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(float)
    if ch>1: a=a.reshape(-1,ch).mean(1)
    hop=int(sr*0.01); fl=int(sr*0.02); n=max((len(a)-fl)//hop,1)
    e=np.array([20*np.log10(np.sqrt((a[i*hop:i*hop+fl]**2).mean())+1e-3) for i in range(n)])
    _WAVC[wav]=(e,0.01); return _WAVC[wav]
def refine_onset(wav,t,maxshift=0.6):
    """Words must not appear before she says them (Matt, 19 Nov 2026: "sometimes words pop up before Laura says it"). Whisper's word start can sit up to half a second early, in the pause before the word (measured: "So" at 1.3s, said at 1.9s). Moves the start LATER only, to the first moment within 0.6s where the sound rises 10 dB above the local quiet level; if she is already speaking at the transcript time, it stays."""
    import numpy as np
    e,h=_env(wav); i0=int(t/h)
    if i0>=len(e)-1: return t
    lo=max(0,i0-30); hi=min(len(e),i0+int(maxshift/h)+30)
    floor=float(np.percentile(e[lo:hi],20)); thr=floor+10
    if e[i0]>=thr: return t
    for i in range(i0,min(len(e),i0+int(maxshift/h))):
        if e[i]>=thr: return i*h
    return t
def word_times(text,c,s,wj):
    """When is each word of this caption spoken? Matches the caption's words to the transcript inside the caption's time window (word start minus 0.05s so a word is there as it is said); falls back to spreading the words evenly across the caption."""
    toks=text.replace('|',' ').split(); n=len(toks)
    words=json.load(open(wj)) if wj and os.path.exists(wj) else []
    a,b=s['ss']+c['from']-0.3,s['ss']+c['to']+0.3
    win=[w for w in words if a<=w['start']<=b]
    times=[];held=[];j=0
    for tk in toks:
        k=next((i for i in range(j,len(win)) if _norm(win[i]['word'])==_norm(tk)),None)
        if k is None: times=None;break
        st0=win[k]['start']; st1=st0
        try:
            wavp=wj.replace('.words.json','.wav')
            if os.path.exists(wavp) and cfg.get('refine_onsets',True): st1=refine_onset(wavp,st0)
        except Exception: pass
        ONSET_STATS.append(st1-st0)
        times.append(st1-s['ss']-0.03); j=k+1
        wk=win[k]; held.append(0)
        if cfg.get('held_words',True) and _norm(tk) in HOLD and 'end' in wk:
            try:
                dur=wk['end']-wk['start']; run=voiced_run(wj.replace('.words.json','.wav'),wk['start'])
                if dur>=0.45 and run>=0.4: held[-1]=max(1,min(6,round((min(dur,run)-0.25)/0.12)))
                elif dur>=0.9 and _norm(tk) in INTERJ: held[-1]=max(1,min(5,round((min(dur,1.0)-0.25)/0.12)))   # long in the transcript but breathy (no steady pitch): trust the transcript length
            except Exception: pass
    if not times:
        step=(c['to']-c['from']-0.4)/max(n,1); times=[c['from']+i*step for i in range(n)]
    if len(held)!=len(times): held=[0]*len(times)
    out=[];prev=c['from']
    for t in times: t=max(t,prev,c['from']); out.append(round(t,2)); prev=t+0.12
    return out,held
def word_caption_layers(tag,text,c,s,wj):
    """Word by word, each word fading up, the box growing with the sentence (option B, fade up, from the Caption Lab). A stretched word (looove) then GROWS letter by letter in time with her voice (Matt, 19 Nov 2026). Pictures per word j: GROW (box widened, word j invisible), WORD (only word j, fades up), SETTLED(m) (box, word j showing m extra letters, m = 0..held). All laid out with words 0..j only."""
    text=wrap(text); lines=[l.split() for l in text.split('|')]; flat=[w for l in lines for w in l]; n=len(flat)
    times,held=word_times(text,c,s,wj)
    if any(held): print('held words (letter by letter): '+', '.join('%s x%d'%(flat[i],held[i]) for i in range(n) if held[i]))
    def sw(g,m): return stretch_word(flat[g],m) if m else flat[g]
    def cell(j,mode,m=0):
        out='<div class="cell"><div class="w">';idx=0
        for l in lines:
            first=idx
            if first>j: break
            spans=[]
            for i,w in enumerate(l):
                g=first+i
                if g>j: break
                txt=sw(g,held[g]) if g<j else sw(g,m if mode=='settled' else 0)
                if mode=='word': vis=(g==j)
                elif mode=='grow': vis=(g<j)
                else: vis=True
                spans.append('<span class="%s">%s</span>'%('s' if vis else 'h',html.escape(txt)))
            out+='<div class="%s">%s</div>'%('b t' if mode=='word' else 'b',' '.join(spans)); idx+=len(l)
        return out+'</div></div>'
    keys=[]
    for j in range(n):
        keys+=[(j,'grow',0),(j,'word',0)]+[(j,'settled',m) for m in range(held[j]+1)]
    cells=[cell(*k) for k in keys]; where={k:i for i,k in enumerate(keys)}
    body=''.join(cells)
    name='wc_%s'%tag
    p=os.path.join(W,name+'.html'); page='<!doctype html><html><head><meta charset="utf-8">%s<style>html,body{margin:0;width:1080px;background:transparent}%s</style></head><body>%s</body></html>'%(FONTS,WORD_CSS,body)
    sheet=os.path.join(W,name+'.png')
    if not (os.path.exists(p) and os.path.exists(sheet) and open(p).read()==page):
        open(p,'w').write(page)
        subprocess.run([CH,'--headless=new','--disable-gpu','--hide-scrollbars','--default-background-color=00000000','--force-device-scale-factor=1','--window-size=1080,%d'%(BAND_H*len(cells)),'--virtual-time-budget=8000','--screenshot='+sheet,'file://'+p],stderr=subprocess.DEVNULL)
    from PIL import Image
    im=Image.open(sheet); parts={}
    for k,i in where.items():
        q=os.path.join(W,'%s_%d.png'%(name,i)); im.crop((0,i*BAND_H,1080,(i+1)*BAND_H)).save(q); parts[k]=q
    end=min(times[-1]+0.6+held[-1]*0.12,c['to'])
    layers=[]; FA=0.26
    for j in range(n):
        a=times[j]; last=(j==n-1); nxt=times[j+1] if not last else max(end,a+FA+0.05+held[j]*0.12)
        hn=held[j]
        layers.append((parts[(j,'grow',0)],a,a+FA,'box',False))
        layers.append((parts[(j,'word',0)],a,a+FA+0.02,'word',False))
        if hn==0:
            layers.append((parts[(j,'settled',0)],a+FA,nxt if not last else c['to']-0.02,'box',last))
        else:
            step=0.12
            if a+0.30+hn*step>nxt-0.05: step=max((nxt-0.05-a-0.30)/hn,0.04)
            lt=[a+0.30+k*step for k in range(hn)]            # when letter k+1 appears
            layers.append((parts[(j,'settled',0)],a+FA,lt[0],'box',False))
            for k in range(hn):
                b=lt[k+1] if k+1<hn else (nxt if not last else c['to']-0.02)
                layers.append((parts[(j,'settled',k+1)],lt[k],b,'box',last and k==hn-1))
    return layers
clips=os.path.abspath(cfg['clips']); FAD=0.15; X=0.3
names=[]
_tc=0.0
for i,s in enumerate(cfg['segments']):
    s=dict(s,_t0=round(_tc,2)); _tc+=s['d']-0.3
    ov=[]
    wov=[]
    style=cfg.get('caption_style','words')   # 'words' = word by word, fade up, box grows (default, approved 19 Nov 2026); 'box' = whole line at once
    stem0=s['clip'].rsplit('.',1)[0]
    for j,c in enumerate(s.get('captions',[])):
        if style=='words': wov+=word_caption_layers('%d_%d'%(i,j),c['text'],c,s,os.path.join(W,stem0+'.words.json'))
        elif style=='big': wov+=big_caption_layers('%d_%d'%(i,j),c['text'],c,s,os.path.join(W,stem0+'.words.json'))
        else: ov.append((caption('c%d_%d'%(i,j),c['text']),c['from'],c['to']))
    h=s.get('headline')
    if h and style=='big' and h.get('kind')!='finale' and not cfg.get('headline_with_big',False) and s.get('captions'):
        first=min(c_['from'] for c_ in s['captions'])
        if first<2.5:
            print('headline skipped in segment %d: with big words there is no intro overlay unless more than 2.5s of silence comes before she speaks (she speaks at %.1fs)'%(i,first)); h=None
    if h:
        png=finale('h%d'%i,h['line1'],h['line2'],h.get('caps','@RIVERFOX_EVENTS')) if h.get('kind')=='finale' else top('h%d'%i,h['line1'],h['line2'])
        ov.append((png,h['from'],h['to']))
    spd=s.get('speed',1); d=s['d']; src=os.path.join(clips,s['clip'])
    cmd=['ffmpeg','-v','error','-y','-ss',str(s['ss']),'-t',str(d*spd),'-i',src]
    if s.get('audio'):
        cmd+=['-ss',str(s['ss']),'-t',str(d),'-i',os.path.join(W,s['clip'].rsplit('.',1)[0]+'.wav')]
    else: cmd+=['-f','lavfi','-t',str(d),'-i','anullsrc=r=48000:cl=stereo']
    fc=['[0:v]setpts=PTS/%s,fps=30,%s[v0]'%(spd,V)]; last='v0'
    zp=zoom_plan(s); ze=zp[0] if zp else None; fp=zp[1] if zp else None
    if ze:
        ay=s.get('anchor_y',0.4)
        if fp:  # hard cut to a tighter crop centred on the face (target: face in the upper part of the frame)
            pts,t0,pz=fp
            # NB: crop's iw/ih stay at the un-zoomed size, so the scaled size is written out: PW*pz, PH*pz
            cxe="if(gte(t,%s),clip((%s)*%s-%d/2,0,%s),0)"%(t0,lerp_expr(pts,1),PW*pz,PW,PW*pz-PW); cye="if(gte(t,%s),clip((%s)*%s-%s*%d,0,%s),0)"%(t0,lerp_expr(pts,2),PH*pz,0.38,PH,PH*pz-PH)
        else: cxe="(%d*(%s)-%d)/2"%(PW,ze,PW); cye="(%d*(%s)-%d)*%s"%(PH,ze,PH,ay)
        fc.append("[v0]scale=w='trunc(%d*(%s)/2)*2':h='trunc(%d*(%s)/2)*2':eval=frame:flags=bicubic,crop=%d:%d:x='%s':y='%s',setsar=1[vz]"%(PW,ze,PH,ze,PW,PH,cxe,cye)); last='vz'

    for k,(p,a,b) in enumerate(ov):
        cmd+=['-loop','1','-framerate','30','-t',str(d),'-i',p]; n=2+k
        fc.append("[%d:v]%sformat=rgba,fade=in:st=%s:d=%s:alpha=1,fade=out:st=%s:d=%s:alpha=1[o%d]"%(n,"scale=%d:%d,"%(PW,PH) if DRAFT else "",a,FAD,round(b-FAD,2),FAD,k))
        fc.append("[%s][o%d]overlay=0:0:enable='between(t,%s,%s)':shortest=1[v%d]"%(last,k,a,b,k+1)); last='v%d'%(k+1)
    nin=2+len(ov)
    sc='scale=%d:%d,'%(PW,PH//8*0+int(240*PH/1920)) if False else ''
    for q,(p,a_,b_,kind,final) in enumerate(wov):
        cmd+=['-loop','1','-framerate','30','-t',str(d),'-i',p]
        bh=BIG_H if kind=='big' else BAND_H
        pre=("scale=%d:%d,"%(PW,int(bh*PH/1920)) if DRAFT else "")+"format=rgba"
        yy=(BIG_Y if kind=='big' else BAND_Y)*PH/1920
        if kind=='big':
            fc.append("[%d:v]%s,fade=in:st=%s:d=0.06:alpha=1[ww%d]"%(nin,pre,a_,q))
            fc.append("[%s][ww%d]overlay=0:%s:enable='between(t,%s,%s)':shortest=1[wv%d]"%(last,q,round(yy,1),a_,b_,q))
        elif kind=='word':
            fc.append("[%d:v]%s,fade=in:st=%s:d=0.22:alpha=1[ww%d]"%(nin,pre,a_,q))
            fc.append("[%s][ww%d]overlay=0:'%s+%s*(1-min((t-%s)/0.26,1))':enable='between(t,%s,%s)':shortest=1[wv%d]"%(last,q,round(yy,1),round(7*PH/1920,1),a_,a_,b_,q))
        else:
            fo=(",fade=out:st=%s:d=0.15:alpha=1"%round(b_-0.15,2)) if final else ""
            fc.append("[%d:v]%s%s[ww%d]"%(nin,pre,fo,q))
            fc.append("[%s][ww%d]overlay=0:%s:enable='between(t,%s,%s)':shortest=1[wv%d]"%(last,q,round(yy,1),a_,b_,q))
        last='wv%d'%q; nin+=1
    fc.append('[%s]format=yuv420p[vo]'%last)
    mute=list(s.get('mute',[]))
    if s.get('audio') and cfg.get('clean_audio',True):
        stem=s['clip'].rsplit('.',1)[0]; wj=os.path.join(W,stem+'.words.json')
        if os.path.exists(wj):
            auto=noise_windows(os.path.join(W,stem+'.wav'),s['ss'],d,json.load(open(wj)))
            short=[];longer=[]
            for w in auto:
                if w[1]-w[0]>0.55: longer.append(w); continue
                vs=voiced_share(os.path.join(W,stem+'.wav'),s['ss']+w[0]*s.get('speed',1),s['ss']+w[1]*s.get('speed',1))
                (longer if (vs is not None and vs>=0.2) else short).append(w)   # 20% or more voiced frames: it may be speech, leave it
            if short: print('replaced noise with room tone in segment %d (%s @%s): %s'%(i,s['clip'],s['ss'],short))
            if longer: print('CHECK BY EAR, left alone (longer than 0.55s, or it sounds voiced: might be speech the transcript missed) in segment %d (%s @%s): %s'%(i,s['clip'],s['ss'],longer))
            mute+=short
        else: print('WARNING: no',wj,'- noise not checked for',s['clip'])
    mf=''
    if mute and s.get('audio'):
        stem1=s['clip'].rsplit('.',1)[0]; wavp=os.path.join(W,stem1+'.wav')
        fillp=os.path.join(W,'fill_%s_%d.wav'%(stem1,i))
        fill_with_room_tone(stem1,s['ss'],d,mute,fillp)
        k=cmd.index(wavp); cmd[k]=fillp; cmd[k-4]='0'
    fc.append('[1:a]aformat=sample_rates=48000:channel_layouts=stereo,apad,atrim=0:%s,asetpts=N/SR/TB%s[ao]'%(d,mf))
    key=hashlib.md5(('r22'+str(cfg.get('refine_onsets',True))+str(cfg.get('headline_with_big',False))+CAPBG+CAPFG+str(cfg.get('caption_style','words'))+json.dumps(s,sort_keys=True)+str(DRAFT)+str(cfg.get('hq'))+str(cfg.get('grade',True))+str(cfg.get('clean_audio',True))).encode()).hexdigest()[:10]
    out=os.path.join(W,'seg_%s%s.mp4'%('d_' if DRAFT else '',key)); names.append(out)
    if os.path.exists(out): print('segment %d unchanged: reused'%i); continue  # only changed segments are re-rendered
    cmd+=['-filter_complex',';'.join(fc),'-map','[vo]','-map','[ao]','-c:v','libx264','-crf','28' if DRAFT else '16','-preset','ultrafast' if DRAFT else 'fast','-c:a','aac','-b:a','160k','-t',str(d),out]
    subprocess.run(cmd,check=True)
OUT=cfg['out'].replace('.mp4','-draft.mp4') if DRAFT else cfg['out']
cmd=['ffmpeg','-v','error','-y']
for n in names: cmd+=['-i',n]
L=cfg['segments'][0]['d']; lv='0:v'; la='0:a'; fv=[]; fa=[]
for i,s in enumerate(cfg['segments'][1:],1):
    fv.append('[%s][%d:v]xfade=transition=fade:duration=%s:offset=%s[xv%d]'%(lv,i,X,round(L-X,3),i)); lv='xv%d'%i
    fa.append('[%s][%d:a]acrossfade=d=%s[xa%d]'%(la,i,X,i)); la='xa%d'%i; L+=s['d']-X
fv.append('[%s]format=yuv420p[v]'%lv)
mus=cfg.get('music')
if mus:
    cmd+=['-ss',str(mus.get('start',0)),'-i',os.path.abspath(mus['file'])]; mi=len(cfg['segments'])
    vol=mus.get('volume',0.3); fo=round(L-2.5,2)
    fa.append("[%d:a]loudnorm=I=-22:TP=-2,aformat=sample_rates=48000:channel_layouts=stereo,afade=in:d=1.5,afade=out:st=%s:d=2.5,volume=%s,atrim=0:%s[mus]"%(mi,fo,vol,round(L,2)))
    fa.append("[%s]asplit=2[vo1][vo2];[mus][vo2]sidechaincompress=threshold=0.015:ratio=10:attack=15:release=600:makeup=1[duck];[vo1][duck]amix=inputs=2:duration=first:weights='1 1':normalize=0[mixa]"%la); la='mixa'
fa.append('[%s]afade=out:st=%s:d=0.3[afin]'%(la,round(L-0.3,2))); la='afin'
cmd+=['-filter_complex',';'.join(fv+fa),'-map','[v]','-map','[%s]'%la,'-c:v','libx264','-preset','ultrafast' if DRAFT else 'slow','-crf','30' if DRAFT else '15','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k' if DRAFT else '192k','-movflags','+faststart',OUT]
subprocess.run(cmd,check=True); print('done',round(L,1),'s ->',OUT)
if ONSET_STATS:
    sh=[x for x in ONSET_STATS if x>0.02]
    print('word timing: %d words, %d moved later (mean %.2fs, max %.2fs)'%(len(ONSET_STATS),len(sh),(sum(sh)/len(sh) if sh else 0),(max(sh) if sh else 0)))
if DRAFT: sys.exit(0)  # a draft is for review only: no preview copy, no cover, no loudness pass
# small copy for sending to a phone (Remote Control caps uploads at 30 MB); the master above is what goes in Drive and to Instagram
prev=cfg['out'].replace('.mp4','-preview.mp4')
subprocess.run(['ffmpeg','-v','error','-y','-i',cfg['out'],'-c:v','libx264','-preset','slow','-b:v','4000k','-maxrate','5000k','-bufsize','8000k','-c:a','aac','-b:a','128k','-movflags','+faststart',prev],check=True); print('preview ->',prev)
# Cover still (optional): "cover": {"clip":"c03.mp4","t":19.9,"line1":"Making a","line2":"Christmas&nbsp;garland.","out":"cover.jpg"}
c=cfg.get('cover')
if c:
    still=os.path.join(W,'cover_still.png')
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(c['t']),'-i',os.path.join(clips,c['clip']),'-frames:v','1','-vf',V,still],check=True)
    css='html,body{margin:0;width:1080px;height:1920px;overflow:hidden;background:url(cover_still.png) 0 0/1080px 1920px}.s{position:absolute;bottom:0;left:0;right:0;height:1000px;background:linear-gradient(rgba(20,16,12,0),rgba(20,16,12,.5))}.t{position:absolute;bottom:400px;left:0;right:0;text-align:center;color:#fff;text-shadow:0 2px 30px rgba(0,0,0,.4)}h1{font-family:Fraunces,serif;font-weight:400;font-size:%dpx;line-height:.95;letter-spacing:-.035em;margin:0}h1 em{font-style:italic;display:block}p{font-family:"DM Sans",sans-serif;font-weight:600;font-size:28px;letter-spacing:.18em;margin:40px 0 0}'
    p=os.path.join(W,'cover.html'); open(p,'w').write('<!doctype html><html><head><meta charset="utf-8">%s<style>%s</style></head><body><div class="s"></div><div class="t"><h1>%s<em>%s</em></h1><p>@RIVERFOX_EVENTS</p></div></body></html>'%(FONTS,css%c.get('size',150),c['line1'],c['line2']))
    png=os.path.join(W,'cover.png')
    subprocess.run([CH,'--headless=new','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1','--window-size=1080,1920','--virtual-time-budget=8000','--screenshot='+png,'file://'+p],stderr=subprocess.DEVNULL)
    subprocess.run(['ffmpeg','-v','error','-y','-i',png,'-q:v','2',c['out']],check=True); print('cover ->',c['out'])
