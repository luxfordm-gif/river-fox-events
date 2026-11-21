"""Makes the sound effects for the motion test (out/motion-sfx.wav): balloon pops,
camera shutter, whooshes, soft thuds and a finishing chime. All made from
scratch here, so there is nothing to license. Times match motion.html."""
import math, random, struct, wave

SR = 48000
DUR = 14.5
FLASH = [1.9, 2.8, 3.6]; VIDEO = 4.3; GATHER = 5.0; DROP = [6.7, 7.2, 7.7, 8.2]; TO_DRIVE = 9.2; SYNC = 10.2; DONE = 12.7
random.seed(7)
buf = [0.0] * int(SR * DUR)


def add(at, samples, gain=1.0):
    s = int(at * SR)
    for i, v in enumerate(samples):
        if 0 <= s + i < len(buf):
            buf[s + i] += v * gain


def blip(f0, f1, dur, decay=6.0):
    out, ph = [], 0.0
    n = int(SR * dur)
    for i in range(n):
        k = i / n
        ph += 2 * math.pi * (f0 + (f1 - f0) * k) / SR
        out.append(math.sin(ph) * math.exp(-decay * k) * min(1, i / 60))
    return out


def click(dur=0.03, bright=0.75):
    out, prev = [], 0.0
    n = int(SR * dur)
    for i in range(n):
        x = random.uniform(-1, 1)
        hp = x - prev * bright
        prev = x
        out.append(hp * math.exp(-9 * i / n))
    return out


def shutter():
    out = [0.0] * int(SR * 0.3)
    for at, g in [(0, 1.0), (0.012, 0.5), (0.085, 0.85), (0.1, 0.4)]:
        for i, v in enumerate(click()):
            out[int(at * SR) + i] += v * g
    for i, v in enumerate(blip(170, 90, 0.12, 5)):
        out[i] += v * 0.7
        out[int(0.085 * SR) + i] += v * 0.5
    return out


def whoosh(dur=0.45, lo=0.02, hi=0.25):
    out, y = [], 0.0
    n = int(SR * dur)
    for i in range(n):
        k = i / n
        a = lo + (hi - lo) * math.sin(math.pi * k)
        y += a * (random.uniform(-1, 1) - y)
        out.append(y * math.sin(math.pi * k) ** 1.5)
    return out


def chime():
    n = int(SR * 1.6)
    out = [0.0] * n
    for f, g, at in [(1046.5, 0.5, 0), (1568, 0.4, 0.09), (2093, 0.3, 0.18)]:
        for i in range(n - int(at * SR)):
            tt = i / SR
            out[int(at * SR) + i] += g * math.sin(2 * math.pi * f * tt) * math.exp(-3.2 * tt) * min(1, i / 200)
    return out


for i in range(11):
    add(0.15 + i * 0.07 + 0.12, blip(520 + i * 45, 900 + i * 45, 0.07, 5), 0.16)
for f in FLASH:
    add(f, shutter(), 0.6)
    add(f + 0.08, whoosh(0.5), 0.5)
add(VIDEO, blip(700, 1100, 0.09, 4), 0.25)
add(VIDEO + 0.02, whoosh(0.5), 0.5)
add(GATHER, whoosh(0.9, 0.01, 0.18), 0.8)
for d in DROP:
    add(d, whoosh(0.42), 0.55)
    add(d + 0.4, blip(210, 95, 0.16, 5), 0.6)
    add(d + 0.42, blip(880, 1320, 0.06, 5), 0.12)
add(TO_DRIVE, whoosh(0.9, 0.01, 0.18), 0.8)
for i in range(5):
    add(SYNC + 0.3 + i * 0.44, blip(1200 + i * 90, 1500 + i * 90, 0.05, 5), 0.1)
add(DONE, chime(), 0.55)

peak = max(abs(v) for v in buf) or 1
with wave.open("out/motion-sfx.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, v / peak * 0.8)) * 32767)) for v in buf))
print("made out/motion-sfx.wav")
