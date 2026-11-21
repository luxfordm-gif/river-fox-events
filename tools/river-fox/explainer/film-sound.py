"""Makes the sound effects track (out/film/sfx.wav) from out/film/events.json,
which film.mjs writes: [sound, time in seconds, loudness, pitch]. Every sound is
made from scratch here, so there is nothing to license."""
import json, math, random, struct, sys, wave

SR = 48000
random.seed(7)
events = json.load(open("out/film/events.json"))
DUR = float(sys.argv[1])
buf = [0.0] * int(SR * DUR)


def add(at, samples, gain=1.0):
    s = int(at * SR)
    for i, v in enumerate(samples):
        if 0 <= s + i < len(buf):
            buf[s + i] += v * gain


def blip(f0, f1, dur, decay=6.0):
    out, ph, n = [], 0.0, int(SR * dur)
    for i in range(n):
        k = i / n
        ph += 2 * math.pi * (f0 + (f1 - f0) * k) / SR
        out.append(math.sin(ph) * math.exp(-decay * k) * min(1, i / 60))
    return out


def click(dur=0.03, bright=0.75, decay=9):
    out, prev, n = [], 0.0, int(SR * dur)
    for i in range(n):
        x = random.uniform(-1, 1)
        out.append((x - prev * bright) * math.exp(-decay * i / n))
        prev = x
    return out


def layer(n, parts):
    out = [0.0] * int(SR * n)
    for at, g, samples in parts:
        for i, v in enumerate(samples):
            j = int(at * SR) + i
            if j < len(out):
                out[j] += v * g
    return out


def whoosh(dur=0.45, lo=0.02, hi=0.25):
    out, y, n = [], 0.0, int(SR * dur)
    for i in range(n):
        k = i / n
        y += (lo + (hi - lo) * math.sin(math.pi * k)) * (random.uniform(-1, 1) - y)
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


def make(kind, pitch):
    if kind == "pop":
        f = pitch or 700
        return blip(f, f * 1.7, 0.07, 5)
    if kind == "blip":
        return blip(700, 1100, 0.09, 4)
    if kind == "tick":
        return blip(1300, 1600, 0.05, 5)
    if kind == "key":
        return layer(0.06, [(0, 1, click(0.02, 0.6)), (0, 0.5, blip(300, 200, 0.04, 6))])
    if kind == "thud":
        return layer(0.2, [(0, 1, blip(210, 95, 0.16, 5)), (0.02, 0.2, blip(880, 1320, 0.06, 5))])
    if kind == "shutter":
        return layer(0.3, [(0, 1, click()), (0.012, 0.5, click()), (0.085, 0.85, click()), (0.1, 0.4, click()),
                           (0, 0.7, blip(170, 90, 0.12, 5)), (0.085, 0.5, blip(170, 90, 0.12, 5))])
    if kind == "whoosh":
        return whoosh(0.45)
    if kind == "bigwhoosh":
        return whoosh(0.9, 0.01, 0.18)
    if kind == "chime":
        return chime()
    if kind == "sparkle":
        return layer(0.9, [(i * 0.07, 0.5, blip(f, f, 0.5, 7)) for i, f in enumerate([1568, 2093, 2637, 3136])])
    if kind == "inflate":
        return blip(180, 520, 1.1, 0.3)
    if kind == "balloonpop":
        return layer(0.4, [(0, 1, click(0.12, 0.2, 7)), (0, 0.9, blip(240, 60, 0.2, 5))])
    raise SystemExit("unknown sound " + kind)


cache = {}
for kind, at, gain, *rest in events:
    pitch = rest[0] if rest else 0
    key = (kind, pitch)
    if key not in cache:
        cache[key] = make(kind, pitch)
    add(at, cache[key], gain)

peak = max(abs(v) for v in buf) or 1
with wave.open("out/film/sfx.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, v / peak * 0.8)) * 32767)) for v in buf))
print("made out/film/sfx.wav")
