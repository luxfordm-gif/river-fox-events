#!/usr/bin/env python3
"""Evens out a timelapse's brightness and colour from frame to frame, using the gravel (which never changes) as the reference.
   python3 stabilise.py src/timelapse.mp4 src/timelapse_stable.mp4
Pass 1 reads a small copy and measures the median R, G, B of the gravel area on every frame. Pass 2 multiplies each full frame by gains that
bring that gravel colour to the clip's overall median (lightly smoothed over 5 frames). Output is near-lossless H.264, same size and rate."""
import subprocess, sys, json
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
info = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height,r_frame_rate,nb_frames', '-of', 'json', src]))['streams'][0]
W, H = info['width'], info['height']; fr = info['r_frame_rate']; n = int(info['nb_frames'])
sw, sh = W // 8, H // 8
Y0, Y1 = int(1150 / 8), int(1900 / 8)          # gravel rows, below the porch, ladder and bag

# pass 1: measure
p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-vf', f'scale={sw}:{sh}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
meds = []
while True:
    b = p.stdout.read(sw * sh * 3)
    if len(b) < sw * sh * 3: break
    a = np.frombuffer(b, np.uint8).reshape(sh, sw, 3)[Y0:Y1]
    meds.append(np.median(a.reshape(-1, 3), axis=0))
meds = np.array(meds, dtype=np.float64)
k = 5
pad = np.pad(meds, ((k // 2, k // 2), (0, 0)), mode='edge')
sm = np.stack([np.convolve(pad[:, c], np.ones(k) / k, mode='valid') for c in range(3)], axis=1)
target = np.median(sm, axis=0)
gains = np.clip(target / sm, 0.7, 1.5)
print(f'frames measured {len(meds)}; gravel RGB median before: min {sm.min(0).round(0)} max {sm.max(0).round(0)}; target {target.round(1)}')
print(f'gain range R {gains[:,0].min():.2f}-{gains[:,0].max():.2f}  G {gains[:,1].min():.2f}-{gains[:,1].max():.2f}  B {gains[:,2].min():.2f}-{gains[:,2].max():.2f}')
np.save(dst + '.gains.npy', gains)

# pass 2: apply to full frames
rd = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
wr = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', fr, '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst], stdin=subprocess.PIPE)
i = 0; fb = W * H * 3
row_w = np.clip((np.arange(H) - 120) / 140.0, 0, 1).astype(np.float32)[:, None]   # sky rows (top) get brightness only, house and gravel get full colour correction
while True:
    b = rd.stdout.read(fb)
    if len(b) < fb: break
    g = gains[min(i, len(gains) - 1)].astype(np.float32)
    gm = np.float32(g.mean())
    gr = (row_w * g[None, :] + (1 - row_w) * gm)[:, None, :]
    a = np.frombuffer(b, np.uint8).reshape(H, W, 3).astype(np.float32) * gr
    wr.stdin.write(np.clip(a, 0, 255).astype(np.uint8).tobytes())
    i += 1
wr.stdin.close(); wr.wait()
print('wrote', dst, i, 'frames')
