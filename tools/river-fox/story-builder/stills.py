#!/usr/bin/env python3
"""Make graded still images from clips for Instagram Stories (1080x1920, with a headline) and Posts (1080x1440, plain).
Usage: python3 stills.py stills.json   (see SKILL.md). Same grade as story.py; headline and closing text come from ../text/mkcopy2.cjs."""
import json,subprocess,sys,os
cfg=json.load(open(sys.argv[1])); W=os.path.abspath(cfg.get('work','work')); O=os.path.abspath(cfg['out']); os.makedirs(W,exist_ok=True); os.makedirs(O,exist_ok=True)
clips=os.path.abspath(cfg['clips']); CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FONTS='<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@600&family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&display=block" rel="stylesheet">'
BASE='html,body{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden}'
def shot(name,body,css):
    p=os.path.join(W,name+'.html'); open(p,'w').write('<!doctype html><html><head><meta charset="utf-8">%s<style>%s%s</style></head><body>%s</body></html>'%(FONTS,BASE,css,body))
    subprocess.run([CH,'--headless=new','--disable-gpu','--hide-scrollbars','--default-background-color=00000000','--force-device-scale-factor=1','--window-size=1080,1920','--virtual-time-budget=8000','--screenshot=%s/%s.png'%(W,name),'file://'+p],stderr=subprocess.DEVNULL); return os.path.join(W,name+'.png')
# Headline and closing text are made by ../text/mkcopy2.cjs, the one tool that follows the Brand Pack's board
# "Headline and closing text on video" (by way of ../brand-pack.json). No type is set here. It refuses text outside the
# safe area, so a run stops rather than file one that breaks the pack.
MK=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','text','mkcopy2.cjs')
def mk(name,mode,args):
    out=os.path.join(W,name+'.png'); subprocess.run(['node',MK,mode,out]+args,check=True); return out
def top(name,l1,l2): return mk(name,'hl-two',[l1,l2])
def finale(name,l1,l2,caps): return mk(name,'finale',[l1,l2]+([caps] if caps else []))
DN="hqdn3d=0.5:0.5:1.5:1.5," if cfg.get("hq") else "hqdn3d=1.5:1.5:3:3,"
G=DN+"colortemperature=temperature=6100:mix=0.45,curves=master='0/0.03 0.25/0.33 0.5/0.6 0.8/0.87 1/1',eq=contrast=1.05:saturation=1.15:gamma=1.06,"
V=(G if cfg.get('grade',True) else '')+"scale=1080:1920:flags=lanczos,unsharp=5:5:"+("0.4" if cfg.get("hq") else "0.8")+",setsar=1"
for i,s in enumerate(cfg['stills']):
    base=os.path.join(W,'%s_plain.png'%s['name'])
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(s['t']),'-i',os.path.join(clips,s['clip']),'-frames:v','1','-vf',V,base],check=True)
    n='%02d %s'%(i+1,s['name'])
    if s.get('post',True):  # plain 3:4 post, no text; focus 0=top 1=bottom of the frame
        y=int(s.get('focus',0.4)*(1920-1440))
        subprocess.run(['ffmpeg','-v','error','-y','-i',base,'-vf','crop=1080:1440:0:%d'%y,'-q:v','2',os.path.join(O,n+' - Post (1080x1440).jpg')],check=True)
    h=s.get('headline')
    if not h: subprocess.run(['ffmpeg','-v','error','-y','-i',base,'-q:v','2',os.path.join(O,n+' - Story (1080x1920).jpg')],check=True)  # no headline: the plain Story is the only Story file
    if h:  # story with headline
        png=finale('h%d'%i,h['line1'],h['line2'],h.get('caps','')) if h.get('kind')=='finale' else top('h%d'%i,h['line1'],h['line2'])
        subprocess.run(['ffmpeg','-v','error','-y','-i',base,'-i',png,'-filter_complex','[0][1]overlay=0:0','-q:v','2',os.path.join(O,n+' - Story headline (1080x1920).jpg')],check=True)
print('done ->',O)
