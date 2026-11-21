#!/usr/bin/env python3
"""Make graded still images from clips for Instagram Stories (1080x1920, with a headline) and Posts (1080x1440, plain).
Usage: python3 stills.py stills.json   (see SKILL.md). Same grade and type styles as story.py."""
import json,subprocess,sys,os
cfg=json.load(open(sys.argv[1])); W=os.path.abspath(cfg.get('work','work')); O=os.path.abspath(cfg['out']); os.makedirs(W,exist_ok=True); os.makedirs(O,exist_ok=True)
clips=os.path.abspath(cfg['clips']); CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
FONTS='<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@600&family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&display=block" rel="stylesheet">'
BASE='html,body{margin:0;width:1080px;height:1920px;background:transparent;overflow:hidden}'
def shot(name,body,css):
    p=os.path.join(W,name+'.html'); open(p,'w').write('<!doctype html><html><head><meta charset="utf-8">%s<style>%s%s</style></head><body>%s</body></html>'%(FONTS,BASE,css,body))
    subprocess.run([CH,'--headless=new','--disable-gpu','--hide-scrollbars','--default-background-color=00000000','--force-device-scale-factor=1','--window-size=1080,1920','--virtual-time-budget=8000','--screenshot=%s/%s.png'%(W,name),'file://'+p],stderr=subprocess.DEVNULL); return os.path.join(W,name+'.png')
TOP_CSS='.s{position:absolute;top:0;left:0;right:0;height:900px;background:linear-gradient(rgba(20,16,12,.42),rgba(20,16,12,0))}.t{position:absolute;top:300px;left:0;right:0;text-align:center;color:#fff;text-shadow:0 2px 24px rgba(0,0,0,.35)}h1{font-family:Fraunces,serif;font-weight:400;font-size:124px;line-height:.98;letter-spacing:-.035em;margin:0}h1 em{font-style:italic;display:block}p{font-family:"DM Sans",sans-serif;font-weight:600;font-size:28px;letter-spacing:.18em;margin:34px 0 0}'
FIN_CSS='.s{position:absolute;bottom:0;left:0;right:0;height:1000px;background:linear-gradient(rgba(20,16,12,0),rgba(20,16,12,.5))}.t{position:absolute;bottom:400px;left:0;right:0;text-align:center;color:#fff;text-shadow:0 2px 30px rgba(0,0,0,.4)}h1{font-family:Fraunces,serif;font-weight:400;font-size:260px;line-height:.9;letter-spacing:-.04em;margin:0}h2{font-family:Fraunces,serif;font-weight:400;font-style:italic;font-size:132px;line-height:.98;letter-spacing:-.035em;margin:10px 0 0}p{font-family:"DM Sans",sans-serif;font-weight:600;font-size:28px;letter-spacing:.18em;margin:44px 0 0}'
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
        png=shot('h%d'%i,'<div class="s"></div><div class="t"><h1>%s</h1><h2>%s</h2><p>%s</p></div>'%(h['line1'],h['line2'],h.get('caps','')),FIN_CSS) if h.get('kind')=='finale' else shot('h%d'%i,'<div class="s"></div><div class="t"><h1>%s<em>%s</em></h1></div>'%(h['line1'],h['line2']),TOP_CSS)
        subprocess.run(['ffmpeg','-v','error','-y','-i',base,'-i',png,'-filter_complex','[0][1]overlay=0:0','-q:v','2',os.path.join(O,n+' - Story headline (1080x1920).jpg')],check=True)
print('done ->',O)
