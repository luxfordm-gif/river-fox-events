#!/usr/bin/env python3
"""Storyboard v4: STILLS ONLY, every amend applied. Frames are composited from the source footage (no new videos are built)."""
import subprocess, os, io, base64, html, glob
from PIL import Image
V = os.environ.get('WORK', os.getcwd())
os.chdir(V); os.makedirs('out3/fr', exist_ok=True)
TL = "colortemperature=temperature=7000:mix=0.6,curves=master='0/0.06 0.12/0.30 0.35/0.62 0.65/0.87 1/1',colorbalance=rs=-0.03:bs=0.04:rm=-0.04:bm=0.03,eq=contrast=1.04:saturation=1.12:gamma=1.18,split[g1][g2];[g2]huesaturation=colors=r+y:saturation=-0.6[d];[g1]crop=iw:1000:0:0[top];[d][top]overlay=0:0,unsharp=5:5:0.8,crop=946:1683:0:0,scale=1080:1920:flags=lanczos"
G = "colortemperature=temperature=6800:mix=0.5,curves=master='0/0.03 0.2/0.29 0.5/0.6 0.8/0.89 1/1':green='0/0 0.5/0.49 1/1',eq=contrast=1.10:saturation=1.22:gamma=1.08,unsharp=5:5:0.7,scale=1080:1920:flags=lanczos"
HL, FIN, HANDLE = 'copy3/hl_two.png', 'copy3/finale.png', 'copy3/handle.png'
CAP1, CAP2 = 'out2/R-reels/cap1.png', 'out2/R-reels/cap2.png'   # Laura's two caption boxes, in the top third, clear of her face

def frame(out, kind, src_t, overlays):
    base = {'tl': ('src/timelapse_stable.mp4', TL), 'c1': ('src/clip1.mp4', G), 'c2': ('src/clip2.mp4', G), 'c4': ('src/clip4.mp4', G), 'c5': ('src/clip5.mp4', G)}[kind]
    ins = ['-ss', f'{src_t:.2f}', '-i', base[0]]
    for o in overlays: ins += ['-i', o]
    fc = f'[0:v]{base[1]}[b0]'
    for i, o in enumerate(overlays): fc += f';[b{i}][{i+1}:v]overlay[b{i+1}]'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', fc, '-map', f'[b{len(overlays)}]', '-frames:v', '1', out], check=True)

def spec(opt, t):
    """what is on screen at time t of reel E, D or F: (source kind, source time, overlays)"""
    if opt == 'E':
        if t < 27.1: k, s = 'tl', min(t * 2, 54.1)
        else: k, s = 'tl', 54.1
        ov = []
        if 0.6 <= t <= 5.0: ov.append(HL)
        if t >= 26.4: ov += [FIN, HANDLE]
        return k, s, ov
    off = 0.0 if opt == 'D' else 6.4          # F opens on Laura; D opens on the timelapse
    if opt == 'F' and t < 6.4:
        ov = [CAP1] if t <= 4.6 else [CAP2]
        return 'c5', t, ov
    if opt == 'D' and 18.0 <= t < 24.4:
        lt = t - 18.0; return 'c5', lt, [CAP1] if lt <= 4.6 else [CAP2]
    tl_end = 18.0 + off
    if t < tl_end:
        tt = t - off; ov = [HL] if 0.6 <= tt <= 5.0 else []
        return 'tl', tt * 3, ov
    if opt == 'D': p = t - 24.4
    else: p = t - 24.4
    if t < 28.4: return 'c2', 1.0 + (t - 24.4), []
    if t < 33.4: return 'c4', 0.0 + (t - 28.4), []
    return 'c1', 0.3 + (t - 33.4), [FIN, HANDLE] if t >= 34.0 else []

REELS = [('E', 30.1), ('D', 38.4), ('F', 38.4)]
for opt, dur in REELS:
    os.makedirs(f'out3/fr/{opt}', exist_ok=True)
    for f in glob.glob(f'out3/fr/{opt}/*.png'): os.remove(f)
    i = 0; t = 0.8
    while t < dur:
        k, s, ov = spec(opt, t)
        frame(f'out3/fr/{opt}/f{i:02d}.png', k, s, ov)
        i += 1; t += 2.5
    print(opt, i, 'frames')

# wild card, white lettering, provisional gap 3 (aTop 260): four moments
W = 'out2/W-wildcard/'; SS = 1.8
os.makedirs('out3/fr/W', exist_ok=True)
GRW = "hqdn3d=1.5:1.5:3:3,colortemperature=temperature=6100:mix=0.45,curves=master='0/0.03 0.25/0.33 0.5/0.6 0.8/0.87 1/1',eq=contrast=1.05:saturation=1.15:gamma=1.06,scale=1080:1920:flags=lanczos,unsharp=5:5:0.8,setsar=1"
for j, (t, ci) in enumerate([(1.0, 0), (3.4, 1), (5.6, 2), (9.9, 4)]):
    n = round(t * 30) + 1
    fc = f"[0:v]{GRW},split[v1][v2];[1:v]scale=1080:1920,format=gray,gblur=sigma=1.2[m];[v2][m]alphamerge[p];[v1][2:v]overlay[a];[a][p]overlay[b];[b][3:v]overlay"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(SS + t), '-i', 'out2/../cl/n18_start.mp4', '-i', f'{W}mt/f_{n:04d}.png', '-i', f'{W}gaps/title_3.png', '-i', f'{W}cap_white_{ci}.png', '-filter_complex', fc, '-frames:v', '1', f'out3/fr/W/f{j:02d}.png'], check=True)
print('wild card done')

def b64(path, w=420, q=76):
    im = Image.open(path).convert('RGB'); im = im.resize((w, int(w * im.height / im.width)))
    b = io.BytesIO(); im.save(b, 'JPEG', quality=q); return base64.b64encode(b.getvalue()).decode()
def fig(path, alt, cap=''):
    return f'<figure><img alt="{html.escape(alt)}" src="data:image/jpeg;base64,{b64(path)}"><figcaption>{html.escape(cap)}</figcaption></figure>'
def strip(files, title, caps=None):
    f = ''.join(fig(p, (caps[i] if caps else f'Frame {i+1}'), (caps[i].split(' - ')[0] if caps else f'{i*2.5+0.8:.1f}s')) for i, p in enumerate(files))
    return f'<div class="strip" data-title="{html.escape(title)}">{f}</div>'
def timecodes(opt): return [f'{opt} at {i*2.5+0.8:.1f} s' for i in range(len(glob.glob(f"out3/fr/{opt}/*.png")))]

reel_info = {
 'E': ('E', 'Timelapse, with text', '30 s', 'Your pick. Just the build, with the headline on the gravel at the start and "Ta-da." at the end.', [('0:00-0:05', 'Headline on the gravel.'), ('0:05-0:27', 'The build at 2x.'), ('0:27-0:30', 'The finished arch holds, with "Ta-da." and the handle.')]),
 'D': ('D', 'Timelapse, then Laura, then the garland', '38 s', 'The timelapse goes straight into Laura talking. Then the sweep along the garland, the baubles, and the finished porch.', [('0:00-0:18', 'Timelapse at 3x, with the headline from 0:01.'), ('0:18-0:24', 'Laura: "All finished and I love it. It\'s so beautiful." Captions at the top, clear of her face.'), ('0:24-0:28', 'The sweep along the garland to the door.'), ('0:28-0:33', 'The baubles, including the shiny one with Laura in it.'), ('0:33-0:38', 'The finished porch, with "Ta-da." and the handle.')]),
 'F': ('F', 'Laura opens, then the build', '38 s', 'Laura\'s line is the hook, then it shows how it was built.', [('0:00-0:06', 'Laura: "All finished and I love it." The hook. No headline.'), ('0:06-0:24', 'Timelapse at 3x, with the headline from 0:07.'), ('0:24-0:38', 'The sweep, the baubles, then the finished porch with "Ta-da."')]),
}
cards = ''
for opt, dur in REELS:
    L, name, d, line, beats = reel_info[opt]
    files = sorted(glob.glob(f'out3/fr/{opt}/*.png'))
    rows = ''.join(f'<tr><td class="tc">{a}</td><td>{html.escape(b)}</td></tr>' for a, b in beats)
    cards += f'<section class="opt"><header><span class="letter">{L}</span><div><h2>{name}</h2><p class="dur">{d}</p></div></header><p class="line">{html.escape(line)}</p>{strip(files, L + " - " + name, timecodes(opt))}<div class="tbl"><table><tbody>{rows}</tbody></table></div></section>'

# headline options + finale + handle
copy3 = [('copy3/still_hl_two.png', 'Headline, two lines'), ('copy3/still_hl_stack.png', 'Headline, stacked'), ('copy3/still_finale_porch.png', 'Finale on the porch'), ('copy3/still_finale_end.png', 'Finale on the timelapse')]
cards_copy = f'''<section class="opt"><header><span class="letter">T</span><div><h2>The text</h2><p class="dur">Headline, finale and handle, with your changes</p></div></header>
<p class="line">The fade behind the headline is lighter. "Ta-da." is smaller. The handle is small, low and always in the same place.</p>
{strip([c[0] for c in copy3], 'The text', [c[1] + ' - ' + c[1] for c in copy3])}
<div class="tbl"><table><tbody>
<tr><td class="tc">1</td><td>Headline in two lines: "A Worplesdon / welcome."</td></tr>
<tr><td class="tc">2</td><td>Headline stacked: "A", then "Worplesdon", then a smaller "welcome."</td></tr>
<tr><td class="tc">3, 4</td><td>"Ta-da. Your door's sorted." at about three-quarters of the last size, with the handle fixed small and low.</td></tr>
</tbody></table></div></section>'''

# wild card
wfiles = sorted(glob.glob('out3/fr/W/*.png'))
gaps = [(f'out2/W-wildcard/gaps/still_{k}.png', f'Gap {k}') for k in range(1, 6)]
gap_imgs = ''
for k in range(1, 6):
    im = Image.open(f'out2/W-wildcard/gaps/still_{k}.png').convert('RGB').crop((0, 170, 1080, 760))
    b = io.BytesIO(); im.resize((540, 295)).save(b, 'JPEG', quality=78)
    gap_imgs += f'<figure><img alt="Gap {k}" src="data:image/jpeg;base64,{base64.b64encode(b.getvalue()).decode()}"><figcaption>Gap {k}</figcaption></figure>'
cards_w = f'''<section class="opt"><header><span class="letter">W</span><div><h2>Wild card: "Making a wreath."</h2><p class="dur">White lettering, from the 18 Nov wreath clip</p></div></header>
<p class="line">Heavy soft Fraunces behind Laura, in warm white. She moves in front of the letters. I have used gap 3 for now.</p>
{strip(wfiles, 'Wild card', ['Title clear - 0:01', 'Second line - 0:03', 'Her head in front - 0:05', 'Last line - 0:10'])}
<p class="line" style="margin-top:6px">Which gap between "Making a" and "wreath."? Tap to compare. 1 is the original, 5 was too tight.</p>
<div class="strip" data-title="Title gaps">{gap_imgs}</div></section>'''

# bonus stories: frames from the existing drafts
bonus = [('S1', 'Wholesalers', 'S-stories/S1-wholesalers-draft.mp4'), ('S2', 'Ribbon aisle', 'S-stories/S2-ribbon-draft.mp4'), ('S3', 'It smells so good', 'S-stories/S3-smells-draft.mp4'), ('S4', 'Halfway through', 'S-stories/S4-halfway-draft.mp4')]
cards_s = ''
for sid, name, mp4 in bonus:
    d = f'out3/fr/{sid}'; os.makedirs(d, exist_ok=True)
    for f in glob.glob(d + '/*.png'): os.remove(f)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'out2/{mp4}', '-vf', 'fps=1/2.5,scale=540:-1', f'{d}/f%02d.png'], check=True)
    files = sorted(glob.glob(d + '/*.png'))
    cards_s += f'<section class="opt"><header><span class="letter">{sid}</span><div><h2>{name}</h2><p class="dur">Bonus Story</p></div></header>{strip(files, sid + " - " + name)}</section>'

amends = ['No music anywhere. Laura\'s own voice is on in her clips.', 'D: the lantern-and-wreath clip is gone. The timelapse goes straight into Laura, then the garland sweep and the baubles, then the finished porch.', 'F added: Laura\'s "I love it" opens the reel as the hook.', 'Headline: on the gravel, much bigger, with a lighter fade. A stacked version added to compare.', '"Ta-da." smaller. The River Fox handle is small, low and always in the same place.', 'Laura\'s captions are at the top of the frame, clear of her face.', 'Wild card: warm white lettering, and a choice of five gaps.', 'The four bonus Stories are marked as not part of the Worplesdon job.', 'Tap any frame to see it full screen, then swipe through.']
old = open('storyboard.html').read()
head = old[:old.index('<main>')]
extra = old[old.index('<style>\n.lb{'):]
body = f'''<main>
<div><h1>Worplesdon <em>storyboard</em></h1>
<p class="intro">Stills only, for you to review. Nothing here is a finished video. Every change you asked for is applied, built from the original footage.</p></div>
<section class="next"><h2>What I changed</h2><ul>{''.join(f'<li>{html.escape(a)}</li>' for a in amends)}</ul></section>
<h3 class="grp">The Worplesdon reels</h3>{cards}
{cards_copy}
<h3 class="grp">Wild card</h3>{cards_w}
<h3 class="grp">Bonus Stories from the 16 and 18 Nov footage (not part of Worplesdon)</h3>{cards_s}
<section class="next"><h2>What I need from you</h2><ul>
<li>Which headline: two lines (1) or stacked (2)?</li>
<li>Which gap for the wild card, 1 to 5?</li>
<li>Is "Ta-da." the right size now?</li>
<li>Which reel to take forward: E, D or F? My pick is F.</li>
<li>The wording. "A Worplesdon welcome." and "Your door's sorted." are mine.</li>
</ul></section>
</main>'''
open('storyboard.html', 'w').write(head + body + extra)
print(os.path.getsize('storyboard.html') // 1024, 'KB')
