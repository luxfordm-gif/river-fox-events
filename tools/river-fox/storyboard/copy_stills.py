#!/usr/bin/env python3
"""Stills for Matt's round-3 notes: lighter headline fade, stacked headline option, smaller finale, one fixed handle."""
import subprocess, os
V = os.environ.get('WORK', os.getcwd())
os.chdir(V); os.makedirs('copy3', exist_ok=True)
def run(*a): subprocess.run(a, check=True)
run('node', 'mkcopy2.cjs', 'hl-two', 'copy3/hl_two.png', 'A Worplesdon', 'welcome.')
run('node', 'mkcopy2.cjs', 'hl-stack', 'copy3/hl_stack.png', 'A', 'Worplesdon', 'welcome.')
run('node', 'mkcopy2.cjs', 'finale', 'copy3/finale.png', 'Ta-da.', "Your door's sorted.", 'A GARLAND ARCH AND WREATH')
run('node', 'mkcopy2.cjs', 'handle', 'copy3/handle.png')
TL = "colortemperature=temperature=7000:mix=0.6,curves=master='0/0.06 0.12/0.30 0.35/0.62 0.65/0.87 1/1',colorbalance=rs=-0.03:bs=0.04:rm=-0.04:bm=0.03,eq=contrast=1.04:saturation=1.12:gamma=1.18,split[g1][g2];[g2]huesaturation=colors=r+y:saturation=-0.6[d];[g1]crop=iw:1000:0:0[top];[d][top]overlay=0:0,unsharp=5:5:0.8"
G = "colortemperature=temperature=6800:mix=0.5,curves=master='0/0.03 0.2/0.29 0.5/0.6 0.8/0.89 1/1':green='0/0 0.5/0.49 1/1',eq=contrast=1.10:saturation=1.22:gamma=1.08,unsharp=5:5:0.7"
# base frames: the build (timelapse, graded and cropped) and the closing shot
run('ffmpeg', '-v', 'error', '-y', '-ss', '3', '-i', 'src/timelapse_stable.mp4', '-filter_complex', f'[0:v]{TL},crop=946:1683:0:0,scale=1080:1920:flags=lanczos[o]', '-map', '[o]', '-frames:v', '1', 'copy3/base_tl.png')
run('ffmpeg', '-v', 'error', '-y', '-ss', '52', '-i', 'src/timelapse_stable.mp4', '-filter_complex', f'[0:v]{TL},crop=946:1683:0:0,scale=1080:1920:flags=lanczos[o]', '-map', '[o]', '-frames:v', '1', 'copy3/base_tl_end.png')
run('ffmpeg', '-v', 'error', '-y', '-ss', '3', '-i', 'src/clip1.mp4', '-vf', f'{G},scale=1080:1920:flags=lanczos', '-frames:v', '1', 'copy3/base_c1.png')
def comp(base, layers, out):
    ins = ['-i', base]
    for l in layers: ins += ['-i', l]
    fc = '[0:v]' + ''.join(f'[{i+1}:v]overlay' + (f'[x{i}];[x{i}]' if i < len(layers) - 1 else '') for i in range(len(layers)))
    run('ffmpeg', '-v', 'error', '-y', *ins, '-filter_complex', fc, '-frames:v', '1', out)
comp('copy3/base_tl.png', ['copy3/hl_two.png'], 'copy3/still_hl_two.png')
comp('copy3/base_tl.png', ['copy3/hl_stack.png'], 'copy3/still_hl_stack.png')
comp('copy3/base_c1.png', ['copy3/finale.png', 'copy3/handle.png'], 'copy3/still_finale_porch.png')
comp('copy3/base_tl_end.png', ['copy3/finale.png', 'copy3/handle.png'], 'copy3/still_finale_end.png')
from PIL import Image
names = ['still_hl_two', 'still_hl_stack', 'still_finale_porch', 'still_finale_end']
sheet = Image.new('RGB', (4 * 546, 960), 'white')
for i, n in enumerate(names):
    sheet.paste(Image.open(f'copy3/{n}.png').convert('RGB').resize((540, 960)), (i * 546, 0))
sheet.save('copy3/sheet.jpg', quality=90); print('ok')
