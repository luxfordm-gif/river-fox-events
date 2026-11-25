#!/usr/bin/env python3
"""Checks a finished reel before it is filed. Run it on every video, draft or final:

   python3 check.py VIDEO [--text safe/hl.png safe/fin_h.png ...] [--at 3,30.5] [--story] [--out sheet.jpg]

It prints a report and writes one picture (the sheet) to read before filing:
  - frame 0, the frame either side of every cut, the middle of every shot and the last frame, each with the safe-area lines drawn in red
  - every shot's length; a shot shorter than half a second is a stray frame and FAILS
  - for each text image given with --text, the measured edges of its lettering against the safe area; outside FAILS
  - where sound starts and stops
--at adds frames at those seconds (use the moments text is on screen). --story uses the Stories safe area.
Exits 1 if anything failed, so a build script can stop on it. Needs ffmpeg and numpy.

Safe area, on a 1080x1920 frame: read from ../brand-pack.json (the pack's safe areas)."""
import argparse, json, os, re, subprocess, sys
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('video')
ap.add_argument('--text', nargs='*', default=[])
ap.add_argument('--at', default='')
ap.add_argument('--story', action='store_true')
ap.add_argument('--out')
ap.add_argument('--jump', type=float, default=0.5, help='how much of the picture must change between two frames to count as a cut (0 to 1)')
a = ap.parse_args()

# The safe area comes from ../brand-pack.json (the pack's safe areas), never from numbers written here.
_S = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'brand-pack.json')))['safeArea']['story' if a.story else 'reel']
X0, X1, Y0, Y1 = _S['x0'], _S['x1'], _S['y0'], _S['y1']
MIN_SHOT = 15          # frames; anything shorter is a stray frame
fails, notes = [], []


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, **kw)


info = json.loads(run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries',
                       'stream=width,height,r_frame_rate,nb_read_frames:format=duration,size,bit_rate', '-of', 'json', a.video]).stdout)
st, fm = info['streams'][0], info['format']
W, H, N = st['width'], st['height'], int(st['nb_read_frames'])
num, den = map(int, st['r_frame_rate'].split('/'))
fps = num / den
print(f"{os.path.basename(a.video)}\n  {W}x{H}, {N} frames at {fps:.2f} a second, {float(fm['duration']):.2f} s, "
      f"{int(fm['size']) / 1e6:.1f} MB, {int(fm['bit_rate']) / 1e6:.1f} Mbps")
if (W, H) not in ((1080, 1920), (540, 960), (2160, 3840)):
    notes.append(f'size {W}x{H} is not 9:16 at a usual size')

# cuts: a frame where most of the picture differs from the frame before it.
# Measured on the Worplesdon reels (Nov 2026): 67 to 84 per cent of the picture changes at a hard cut; the busiest moments
# that are not cuts (a fast zoom, the time-lapse's own jumps) change at most 33 per cent. A slow fade would not be found.
# (ffmpeg's own scene detector was tried first and called the fast bauble zoom two stray frames.)
gw, gh = 54, 96
raw = run(['ffmpeg', '-v', 'error', '-i', a.video, '-vf', f'scale={gw}:{gh}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-']).stdout
g = np.frombuffer(raw, np.uint8)[:(len(raw) // (gw * gh)) * gw * gh].reshape(-1, gh, gw).astype(np.int16)
changed = (np.abs(g[1:] - g[:-1]) > 24).mean(axis=(1, 2))          # changed[n-1] = share of the picture that moved between frames n-1 and n
cuts = [int(n) + 1 for n in np.where(changed > a.jump)[0]]
edges = [0] + cuts + [N]
print('\nShots')
for i in range(len(edges) - 1):
    s, e = edges[i], edges[i + 1]
    flag = ''
    if e - s < MIN_SHOT:
        flag = '   FAIL: a stray frame' if e - s <= 2 else '   FAIL: shorter than half a second'
        fails.append(f'shot {i + 1} is only {e - s} frame(s) long, at frame {s} ({s / fps:.2f} s)')
    print(f'  {i + 1}. frames {s} to {e - 1}  ({s / fps:.2f} to {e / fps:.2f} s, {(e - s) / fps:.2f} s){flag}')
if cuts and cuts[0] / fps < 4:
    notes.append(f'first cut is at {cuts[0] / fps:.2f} s, inside the first 4 seconds (fine only after a short opening close-up)')

# text images: where the lettering sits
if a.text:
    print(f'\nText (safe area x {X0} to {X1}, y {Y0} to {Y1})')
for t in a.text:
    raw = run(['ffmpeg', '-v', 'error', '-i', t, '-vf', 'scale=1080:1920', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-']).stdout
    im = np.frombuffer(raw, np.uint8).reshape(1920, 1080, 4)
    ys, xs = np.where((im[..., 3] > 200) & (im[..., :3].min(-1) > 200))
    if not len(xs):
        print(f'  {os.path.basename(t)}: no lettering found'); continue
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    out = [s for s, bad in (('left', x0 < X0), ('right', x1 > X1), ('top', y0 < Y0), ('bottom', y1 > Y1)) if bad]
    print(f"  {os.path.basename(t)}: x {x0} to {x1}, y {y0} to {y1}, {x1 - x0 + 1} wide" + (f"   FAIL: outside on the {' and '.join(out)}" if out else '   inside'))
    if out:
        fails.append(f"{os.path.basename(t)} is outside the safe area on the {' and '.join(out)}")

# sound: where it starts and stops
err = run(['ffmpeg', '-v', 'error', '-i', a.video, '-af', 'aresample=44100,asetnsamples=4410,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level:file=-', '-vn', '-f', 'null', '-']).stdout.decode()
lv = [(float(t), -200.0 if 'inf' in v else float(v)) for t, v in re.findall(r'pts_time:([0-9.]+)\s*\n.*RMS_level=(\S+)', err)]
spans, cur = [], None
for t, v in lv:
    if v > -50:
        cur = [t, t + 0.1] if cur is None else [cur[0], t + 0.1]
    elif cur and t - cur[1] > 0.3:
        spans.append(cur); cur = None
if cur: spans.append(cur)
print('\nSound')
print('  ' + ('; '.join(f'{s:.1f} to {e:.1f} s' for s, e in spans) if spans else ('silent throughout' if lv else 'no sound track')))

# the sheet
want = {0: 'first frame', N - 1: 'last frame'}
for c in cuts:
    want.setdefault(c - 1, 'last before a cut'); want.setdefault(c, 'first after a cut')
for i in range(len(edges) - 1):
    want.setdefault((edges[i] + edges[i + 1]) // 2, 'middle of a shot')
for t in filter(None, a.at.split(',')):
    want.setdefault(min(N - 1, round(float(t) * fps)), 'asked for')
frames = sorted(want)
out = a.out or os.path.splitext(a.video)[0] + ' - check.jpg'
sx, sy = W / 1080, H / 1920
box = lambda x, y, w, h: f'drawbox=x={x}:y={y}:w={w}:h={h}:color=red:t=fill'
lw = max(1, round(2 * sx))
lines = ','.join([box(round(X0 * sx), 0, lw, 'ih'), box(round(X1 * sx), 0, lw, 'ih'), box(0, round(Y0 * sy), 'iw', lw), box(0, round(Y1 * sy), 'iw', lw)])
cols = min(8, len(frames)); rows = -(-len(frames) // cols)
sel = '+'.join(f'eq(n\\,{f})' for f in frames)
r = run(['ffmpeg', '-v', 'error', '-y', '-i', a.video, '-vf', f"select='{sel}',{lines},scale=270:480,tile={cols}x{rows}:padding=6:color=white", '-fps_mode', 'passthrough', '-frames:v', '1', '-q:v', '3', out])
if r.returncode:
    print(r.stderr.decode()); fails.append('could not write the sheet')
print(f'\nSheet: {out}\n  {cols} across, left to right then down:')
for i, f in enumerate(frames):
    print(f'  {i + 1:>2}. frame {f} ({f / fps:.2f} s)  {want[f]}')

print()
for n in notes: print('NOTE:', n)
for f in fails: print('FAIL:', f)
print('Read the sheet before filing: the first frame, both sides of every cut, and any text against the red lines.')
print('RESULT:', 'FAILED' if fails else 'no automatic failures')
sys.exit(1 if fails else 0)
