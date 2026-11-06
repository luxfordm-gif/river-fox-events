"""House colour grade for the Our work gallery.

Every gallery photo gets the same treatment so the page reads as one set:
the photo's white balance and brightness are nudged towards a shared target,
then the same gentle contrast, colour and sharpening are applied. Nothing is
generated or repainted, so balloons, lettering and rooms stay exactly as
photographed. The source files in src/assets/ are never changed: graded
versions are written to a separate folder and scripts/gallery-images.mjs
builds the page's copies from them.

usage (needs Pillow + numpy; Claude runs this locally):
    python3 scripts/grade-photos.py <out-dir> <source> [<source> ...]
Each output is <out-dir>/<source file name>.png
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

LUMA = np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)

# Shared targets for the whole set.
TARGET_MEDIAN = 0.50     # mid-tone brightness the set is pulled towards
EXPOSURE_PULL = 0.6      # 0 = leave brightness, 1 = match target exactly
GAMMA_LIMITS = (0.80, 1.25)
WB_STRENGTH = 0.55       # how far to neutralise colour casts
WB_MAX_GAIN = 0.08       # never shift a channel more than 8%
WARMTH = 0.012           # tiny warm bias to sit with the site's cream
TARGET_SAT = 0.30        # set-wide colour level
SAT_PULL = 0.5
SAT_LIMITS = (0.97, 1.10)
CONTRAST = 1.05


def grade(img: Image.Image) -> Image.Image:
    a = np.asarray(img.convert("RGB")).astype(np.float32) / 255.0

    # 1. White balance, measured only on near-neutral areas (white walls,
    #    grey floors) so a pink or blue colour scheme - even a pale pastel panel - is never
    #    mistaken for a cast. Photos without enough neutral area are left as
    #    shot. Capped and only partly applied.
    lum = a @ LUMA
    mx, mn = a.max(axis=2), a.min(axis=2)
    sat = (mx - mn) / np.maximum(mx, 1e-4)
    neutral = (lum > 0.30) & (lum < 0.92) & (sat < 0.08)
    if neutral.mean() > 0.03:
        means = a[neutral].mean(axis=0)
        gains = means.mean() / np.maximum(means, 1e-4)
        gains = 1 + np.clip((gains - 1) * WB_STRENGTH, -WB_MAX_GAIN, WB_MAX_GAIN)
    else:
        gains = np.ones(3, dtype=np.float32)
    gains = gains * np.array([1 + WARMTH, 1.0, 1 - WARMTH], dtype=np.float32)
    a = np.clip(a * gains, 0, 1)

    # 2. Levels from the photo's own black and white points (same for all
    #    channels so colours don't shift).
    lum = a @ LUMA
    lo, hi = np.percentile(lum, [0.4, 99.7])
    if hi - lo > 0.25:
        a = np.clip((a - lo) / (hi - lo), 0, 1)

    # 3. Exposure: move the median brightness part-way to the shared target.
    med = float(np.median(a @ LUMA))
    if 0.02 < med < 0.98:
        want = med + (TARGET_MEDIAN - med) * EXPOSURE_PULL
        gamma = np.log(want) / np.log(med)
        gamma = float(np.clip(gamma, *GAMMA_LIMITS))
        a = np.power(a, gamma)

    out = Image.fromarray((np.clip(a, 0, 1) * 255 + 0.5).astype(np.uint8))

    # 4. Same contrast for everything, then colour pulled towards the set level.
    out = ImageEnhance.Contrast(out).enhance(CONTRAST)
    hsv = np.asarray(out.convert("HSV")).astype(np.float32) / 255.0
    sat = float(hsv[..., 1].mean())
    if sat > 0.02:
        factor = 1 + ((TARGET_SAT / sat) - 1) * SAT_PULL
        out = ImageEnhance.Color(out).enhance(float(np.clip(factor, *SAT_LIMITS)))

    # 5. Light sharpen (gallery copies are downsized afterwards).
    return out.filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=3))


if __name__ == "__main__":
    out_dir = Path(sys.argv[1])
    out_dir.mkdir(parents=True, exist_ok=True)
    for src in sys.argv[2:]:
        p = Path(src)
        grade(Image.open(p)).save(out_dir / (p.stem + ".png"))
        print("graded", p.name)
