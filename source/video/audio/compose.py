"""Original soundtrack for the Study Hub pitch video, synced to its frame timings.

Key: D minor, 100 BPM, progression Dm - Bb - F - C. Every melodic note is a tone
of the chord sounding at that moment, in equal temperament (A4 = 440 Hz).
Run: python3 audio/compose.py  ->  public/soundtrack.wav
"""
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve

SR = 44100
FPS = 30
VIDEO_END = 1945 / FPS  # 64.83 s
N = int(SR * (VIDEO_END + 0.2))
rng = np.random.default_rng(7)

# ---------- timing taken from src/Composition.tsx ----------
SCENE_LEN = [180, 210, 150, 210, 180, 165, 210, 250, 210, 180, 180]
XF = 18
starts = [0]
for d in SCENE_LEN[:-1]:
    starts.append(starts[-1] + d - XF)
S = [s / FPS for s in starts]  # scene start times (s)
# 0 cover, 1 problem, 2 need, 3 product, 4 today, 5 vision, 6 how,
# 7 roadmap, 8 model, 9 ask, 10 close

BPM = 100
BEAT = 60 / BPM
BAR = 4 * BEAT
T0 = 0.2  # grid starts as the title rises

CHORDS = [  # voiced triads, MIDI notes (voice-led around D4)
    [62, 65, 69],  # Dm: D F A
    [62, 65, 70],  # Bb: D F Bb
    [60, 65, 69],  # F:  C F A
    [60, 64, 67],  # C:  C E G
]
ROOTS = [38, 34, 41, 36]  # D2, Bb1, F2, C2


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def bar_of(t):
    return int(np.floor((t - T0) / BAR))


def chord_at(t):
    return CHORDS[bar_of(t) % 4]


def section(t):
    if t < S[1]:
        return "intro"
    if t < S[5]:
        return "A"
    if t < S[6]:
        return "break"
    if t < S[8]:
        return "B"
    if t < S[10]:
        return "A"
    return "outro"


# ---------- buses ----------
def bus():
    return np.zeros((2, N))


pad_bus, bass_bus, drum_bus, lead_bus, fx_bus, send = (bus() for _ in range(6))


def place(b, t, sig, pan=0.0, gain=1.0, rev=0.0):
    i = int(round(t * SR))
    if i >= N:
        return
    if sig.ndim == 1:
        a = (pan + 1) * np.pi / 4
        sig = np.vstack([sig * np.cos(a), sig * np.sin(a)]) * np.sqrt(2)
    n = min(sig.shape[1], N - i)
    b[:, i : i + n] += sig[:, :n] * gain
    if rev:
        send[:, i : i + n] += sig[:, :n] * gain * rev


def tvec(dur):
    return np.arange(int(dur * SR)) / SR


def adsr(n, a, r, sus=1.0):
    e = np.full(n, sus)
    na, nr = int(a * SR), int(r * SR)
    na = min(na, n)
    e[:na] = np.linspace(0, sus, na)
    if nr and nr < n:
        e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def lp(x, fc, order=2):
    return sosfilt(butter(order, fc, "low", fs=SR, output="sos"), x)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


# ---------- instruments ----------
def saw(f, dur, cutoff):
    t = tvec(dur)
    out = np.zeros_like(t)
    for n in range(1, int(min(9000 / f, 48)) + 1):
        out += np.sin(2 * np.pi * f * n * t + rng.uniform(0, 2 * np.pi)) / n * np.exp(-n * f / cutoff)
    return out


_pad_cache = {}


def pad_chord(notes, dur, cutoff):
    key = (tuple(notes), round(dur, 3), cutoff)
    if key not in _pad_cache:
        L = np.zeros(int(dur * SR))
        R = np.zeros_like(L)
        for m in notes:
            for cents, pan in ((-9, -0.7), (0, 0.0), (9, 0.7)):
                v = saw(midi(m) * 2 ** (cents / 1200), dur, cutoff)
                a = (pan + 1) * np.pi / 4
                L += v * np.cos(a)
                R += v * np.sin(a)
        e = adsr(len(L), 0.7, 1.3)
        _pad_cache[key] = np.vstack([L * e, R * e]) * 0.05
    return _pad_cache[key]


def sub(m, dur, drive=2.2, a=0.008, r=0.12):
    t = tvec(dur)
    f = midi(m)
    x = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t)
    x = np.tanh(drive * x) / np.tanh(drive)  # grit so the bass reads on small speakers
    return x * adsr(len(t), a, r)


def kick(gain=1.0):
    t = tvec(0.55)
    f = 44 + 120 * np.exp(-t * 32)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 6.5)
    click = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t * 300) * 0.25
    return np.tanh(1.6 * (body + click)) * gain


def clap():
    t = tvec(0.35)
    n = rng.standard_normal(len(t))
    e = np.zeros_like(t)
    for d in (0, 0.011, 0.022):
        e += (t >= d) * np.exp(-np.clip(t - d, 0, None) * 38)
    e += (t >= 0.03) * np.exp(-np.clip(t - 0.03, 0, None) * 11) * 0.5
    return bp(n, 900, 5000) * e * 0.5


def hat(open_=False):
    t = tvec(0.25 if open_ else 0.06)
    return hp(rng.standard_normal(len(t)), 7500, 4) * np.exp(-t * (14 if open_ else 70)) * 0.25


def pluck(m, dur=1.4, bright=1.0):
    t = tvec(dur)
    f = midi(m)
    mod = np.sin(2 * np.pi * f * 2 * t) * 1.6 * bright * np.exp(-t * 7)  # soft FM bell
    x = np.sin(2 * np.pi * f * t + mod) + 0.25 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 6)
    return x * np.exp(-t * 3.2) * adsr(len(t), 0.003, 0.05)


def boom(gain=1.0):
    t = tvec(2.6)
    f = 30 + 34 * np.exp(-t * 2.2)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    noise = lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 5) * 0.6
    return np.tanh(1.8 * (body + noise)) * gain


def thump(gain=1.0):
    t = tvec(0.9)
    f = 38 + 50 * np.exp(-t * 18)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 5) * gain


def whoosh(dur=0.7):
    t = tvec(dur)
    n = rng.standard_normal(len(t))
    lo = bp(n, 300, 1800)
    hi = bp(n, 2500, 9000)
    k = (t / dur) ** 2
    x = lo * (1 - k) + hi * k
    return x * (t / dur) ** 2.2 * 0.5


def riser(dur):
    t = tvec(dur)
    n = rng.standard_normal(len(t))
    # time-varying lowpass sweep, done in blocks
    out = np.zeros_like(n)
    block = 2048
    for i in range(0, len(n), block):
        fc = 300 + 9000 * ((i / len(n)) ** 2)
        out[i : i + block] = lp(n[i : i + block + 512], fc)[: len(n[i : i + block])]
    tone = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2 * t / dur)) / SR) * 0.15
    return (out * 0.5 + tone) * (t / dur) ** 2.5


# ---------- arrangement ----------
# Pads: progression until the outro, brighter in the breakdown.
k = 0
while True:
    t = T0 + k * BAR
    if t >= S[10]:
        break
    sec = section(t)
    cutoff = 3600 if sec == "break" else (1500 if sec == "intro" else 2400)
    g = 1.25 if sec == "break" else (0.8 if sec == "intro" else 1.0)
    place(pad_bus, t, pad_chord(chord_at(t), BAR + 1.3, cutoff), gain=g, rev=0.45)
    k += 1

# Bass: drone in intro and breakdown, rhythmic in grooves.
k = 0
while True:
    t = T0 + k * BAR
    if t >= S[10]:
        break
    root = ROOTS[bar_of(t) % 4]
    sec = section(t)
    if sec in ("intro", "break"):
        place(bass_bus, t, sub(root, BAR + 0.05, drive=1.6, a=0.4, r=0.4), gain=0.75)
    else:
        for b, ln in ((0, 1.4), (1.5, 0.45), (2, 1.4), (3.5, 0.45)):
            tt = t + b * BEAT
            if section(tt) in ("A", "B"):
                place(bass_bus, tt, sub(root, ln * BEAT), gain=0.95)
    k += 1

# Drums on the 16th grid.
kick_times = []
step = BEAT / 4
i = 0
while True:
    t = T0 + i * step
    if t >= S[10] + 0.05:
        break
    sec = section(t)
    pos = i % 16
    if sec == "A":
        if pos in (0, 6, 8):
            place(drum_bus, t, kick(1.0)); kick_times.append(t)
        if pos in (4, 12):
            place(drum_bus, t, clap(), gain=0.8, rev=0.25)
        if pos % 2 == 0:
            place(drum_bus, t, hat(), pan=0.25, gain=1.0 if pos % 4 == 2 else 0.55)
    elif sec == "B":
        roadmap = t >= S[7]
        if pos % 4 == 0:
            place(drum_bus, t, kick(1.05)); kick_times.append(t)
        if pos in (4, 12):
            place(drum_bus, t, clap(), gain=0.85, rev=0.25)
        if roadmap or pos % 2 == 0:
            place(drum_bus, t, hat(), pan=-0.25, gain=0.9 if pos % 4 == 2 else 0.45)
        if pos == 14:
            place(drum_bus, t, hat(True), pan=0.3, gain=0.6)
    i += 1

# Sidechain: pads and bass duck under each kick.
duck = np.ones(N)
tt = np.arange(int(0.35 * SR)) / SR
shape = 1 - 0.65 * np.exp(-tt / 0.09)
for t in kick_times:
    a = int(t * SR)
    n = min(len(shape), N - a)
    duck[a : a + n] = np.minimum(duck[a : a + n], shape[:n])
pad_bus *= duck
bass_bus *= duck

# Scene cuts: whoosh into each cut, thump on it; big booms on key moments.
place(fx_bus, T0, boom(1.0), rev=0.5)  # title
for i in range(1, 11):
    cut = S[i] + 0.15
    place(fx_bus, cut - 0.62, whoosh(0.7), gain=0.55, rev=0.3)
    if i in (6, 10):
        place(fx_bus, cut, boom(0.95), rev=0.5)
    else:
        place(fx_bus, cut, thump(0.7))
place(fx_bus, S[6] - 1.6, riser(1.75), gain=0.7, rev=0.3)  # breakdown into "How it works"

# Melodic sync points: chord tones only, ascending.
def chord_tones_up(t, count, base=72):
    tones = sorted({(m % 12) for m in chord_at(t)})
    out, m = [], base
    while len(out) < count:
        if m % 12 in tones:
            out.append(m)
        m += 1
    return out


# Need: "4.5 crore" counts up over scene frames 10-70.
t0, t1 = S[2] + 10 / FPS, S[2] + 70 / FPS
notes = chord_tones_up(t0, 8, base=62)
for j, m in enumerate(notes):
    tt = t0 + (t1 - t0) * (j / 7) ** 1.3
    place(lead_bus, tt, pluck(m, 1.2), pan=-0.4 + 0.8 * j / 7, gain=0.32, rev=0.4)
place(lead_bus, t1, pluck(notes[-1] + 12, 2.2, 1.4), gain=0.3, rev=0.6)

# Product: four features at scene frames 26, 38, 50, 62.
for j, f in enumerate((26, 38, 50, 62)):
    tt = S[3] + f / FPS
    m = chord_tones_up(tt, 4)[j]
    place(lead_bus, tt, pluck(m), pan=-0.3 + 0.2 * j, gain=0.34 if j < 3 else 0.42, rev=0.4)

# How it works: six nodes, Review (the 4th) accented.
for j in range(6):
    tt = S[6] + (24 + (j / 5) * 86) / FPS
    m = chord_tones_up(tt, 6)[j]
    accent = j == 3
    place(lead_bus, tt, pluck(m, 1.6, 1.3 if accent else 1.0), pan=-0.5 + 0.2 * j,
          gain=0.46 if accent else 0.3, rev=0.45)
    if accent:
        place(lead_bus, tt, pluck(m - 12, 1.6), gain=0.25, rev=0.4)

# Roadmap: five markers climb.
for j, f in enumerate((40, 80, 120, 160, 200)):
    tt = S[7] + f / FPS
    m = chord_tones_up(tt, 5, base=67)[j] + (12 if j == 4 else 0)
    place(lead_bus, tt, pluck(m, 1.8, 1.2), pan=-0.4 + 0.2 * j, gain=0.36, rev=0.5)
    place(fx_bus, tt, thump(0.35 + 0.08 * j))

# Outro: hold D minor (add 9) to the end, over a long sub.
end_len = VIDEO_END - S[10] + 0.2
final = [50, 57, 62, 65, 69, 76]  # D3 A3 D4 F4 A4 E5
place(pad_bus, S[10] + 0.15, pad_chord(final, end_len, 2600), gain=1.3, rev=0.6)
place(bass_bus, S[10] + 0.15, sub(26, end_len, drive=1.4, a=0.05, r=1.2), gain=0.9)
place(lead_bus, S[10] + 0.15, pluck(74, 3.0, 1.2), gain=0.3, rev=0.7)

# ---------- reverb and master ----------
irt = tvec(2.8)
ir = np.vstack([rng.standard_normal(len(irt)), rng.standard_normal(len(irt))])
ir *= np.exp(-irt / 0.75)
ir = np.vstack([lp(ir[0], 6000), lp(ir[1], 6000)])
ir /= np.abs(ir).sum(axis=1, keepdims=True) ** 0.5 * 30
wet = np.vstack([fftconvolve(send[0], ir[0])[:N], fftconvolve(send[1], ir[1])[:N]])

mix = (
    pad_bus * 1.9
    + bass_bus * 0.8
    + drum_bus * 0.85
    + lead_bus * 2.0
    + fx_bus * 0.7
    + wet * 0.9
)
mix = np.vstack([hp(mix[0], 26), hp(mix[1], 26)])

# Fade with the picture (last second).
fade = np.ones(N)
a, b = int((VIDEO_END - 1.0) * SR), int(VIDEO_END * SR)
fade[a:b] = np.linspace(1, 0, b - a) ** 1.5
fade[b:] = 0
mix *= fade

mix /= np.max(np.abs(mix)) + 1e-9
mix = np.tanh(1.3 * mix) / np.tanh(1.3)  # gentle glue
mix *= 0.89

out = (mix.T * 32767).astype(np.int16)
import wave

with wave.open("public/soundtrack.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())
print("scene starts (s):", [round(s, 2) for s in S])
print("wrote public/soundtrack.wav", round(N / SR, 2), "s")
