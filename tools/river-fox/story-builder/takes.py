#!/usr/bin/env python3
"""Best take of a repeated line (Matt, 19 Nov 2026: "If she repeats, do the best line. I can tell Laura she can just keep talking, and it will pick the best bit.").
Usage: python3 takes.py <work>/<clip>.words.json [min_pause=0.8]
Splits the transcript into sentences wherever she pauses >= min_pause seconds, groups sentences that are nearly the same words (difflib similarity >= 0.6) and, for each group of repeats, recommends ONE take:
  - drops takes that stop short (fewer than 70% of the longest take's words: a false start),
  - drops takes with a filler (um, er, uh, erm) or an immediate restart ("I'm I'm"),
  - of what is left, prefers the LAST take (people usually improve), then the one with the fewest long pauses inside it.
Prints the groups with start/end seconds so the storyboard can use the chosen take's times. Nothing is cut automatically: Matt/Claude put the chosen take into story.json as a segment."""
import json,sys,difflib
words=json.load(open(sys.argv[1])); pause=float(sys.argv[2]) if len(sys.argv)>2 else 0.8
norm=lambda x:''.join(c for c in x.lower() if c.isalnum())
sents=[];cur=[]
for w in words:
    if cur and w['start']-cur[-1]['end']>=pause: sents.append(cur);cur=[]
    cur.append(w)
if cur: sents.append(cur)
def text(s): return ' '.join(norm(w['word']) for w in s)
groups=[]
for s in sents:
    if len(s)<3: continue
    for g in groups:
        if difflib.SequenceMatcher(None,text(g[0]),text(s)).ratio()>=0.6: g.append(s);break
    else: groups.append([s])
FILL={'um','er','uh','erm','umm'}
def clean(s):
    ws=[norm(w['word']) for w in s]
    if any(w in FILL for w in ws): return False
    return not any(ws[i]==ws[i+1] and len(ws[i])>1 for i in range(len(ws)-1))
def inner_pauses(s): return sum(1 for a,b in zip(s,s[1:]) if b['start']-a['end']>0.5)
n_rep=0
for g in groups:
    if len(g)<2: continue
    n_rep+=1
    longest=max(len(s) for s in g)
    ok=[s for s in g if len(s)>=0.7*longest and clean(s)] or [max(g,key=len)]
    pick=sorted(ok,key=lambda s:(inner_pauses(s),-g.index(s)))[0]
    print('REPEATED LINE (%d takes): "%s"'%(len(g),' '.join(w['word'] for w in g[0])))
    for k,s in enumerate(g,1):
        mark='  <- BEST' if s is pick else ''
        print('   take %d  %.1fs to %.1fs  (%d words%s)%s'%(k,s[0]['start'],s[-1]['end'],len(s),'' if clean(s) else ', filler or restart',mark))
if not n_rep: print('No repeated lines found (nothing to choose between).')
