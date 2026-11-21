#!/usr/bin/env python3
"""Storyboard: a plain list of beats made from a story.json, to show Matt BEFORE any render (he asked for it on 19 Nov 2026: "you also didn't storyboard what you were going to do before we did the edit").
Usage: python3 storyboard.py story.json [labels.json]
labels.json (optional) maps a clip file name to a short human label, e.g. {"PXL_..115906299.TS.mp4": "Laura in the car"}.
Prints one line per beat: start time, what is on screen, what Laura says, text on screen, framing. Then the totals and any rule it would break."""
import json,sys,os
cfg=json.load(open(sys.argv[1]))
labels=json.load(open(sys.argv[2])) if len(sys.argv)>2 else {}
t=0.0; rows=[]; warn=[]
prev_clip=None
for i,s in enumerate(cfg['segments']):
    d=s['d']; spd=s.get('speed',1)
    name=labels.get(s['clip'],os.path.splitext(os.path.basename(s['clip']))[0])
    says=' / '.join(c['text'].replace('|',' ') for c in s.get('captions',[])) or ('(voice only, no captions)' if s.get('audio') else '(silent, sped up %sx)'%spd if spd!=1 else '(silent)')
    text=[]
    h=s.get('headline')
    if h: text.append('headline "%s %s"'%(h['line1'].replace('&nbsp;',' '),h['line2'].replace('&nbsp;',' ')))
    frame='wide'
    if s.get('zoom') is False: frame='wide, no cut-in (set by hand)'
    elif 'punch_at' in s: frame='wide, then tighter crop on her face at %.1fs (set by hand)'%s['punch_at']
    elif s.get('audio') and t>=4 and d>=4: frame='wide; a tighter crop only if the tool finds a reaction after a pause'
    elif s.get('audio'): frame='wide (first 4 seconds of the video, or a clip under 4 seconds: no cut-in)'
    rows.append((t,d,name,says,'; '.join(text) or '-',frame))
    if prev_clip==s['clip'] and not s.get('captions') and not s.get('audio'): warn.append('beats %d and %d use the same clip back to back: change the angle'%(i,i+1))
    prev_clip=s['clip']; t+=d-0.3
print('STORYBOARD  (%s, %.1fs, style: %s)\n'%(os.path.basename(cfg.get('out','reel')),t+0.3,cfg.get('caption_style','words')))
for n,(t0,d,name,says,text,frame) in enumerate(rows,1):
    print('%2d  %4.0fs  %-34s %s'%(n,t0,name[:34],'%.1fs'%d))
    print('       says:    %s'%says)
    if text!='-': print('       on screen: %s'%text)
    print('       framing: %s'%frame)
if warn: print('\nCHECK: '+'\nCHECK: '.join(warn))
print('\nEnds on: %s. No end card. Captions: %s, %s.'%(rows[-1][2],cfg.get('caption_style','words'),'fade up'))
