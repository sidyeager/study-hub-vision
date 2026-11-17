"""Mix "Covert Affair" by Kevin MacLeod (incompetech.com, CC BY 4.0) to the pitch video.

Clean mix: no added effects. The track's near-silent beat (55.7-55.9 s) sits on the
cut into "How it works", and its bass restarts (56.0 s) as "Nothing skips review" rises;
keys and trumpet follow half a second later.
Run from the project root: python3 audio/music_mix.py -> out/music-mix.wav
"""
import subprocess
import wave

import numpy as np

SR = 44100
FPS = 30
VIDEO_END = 1945 / FPS
SCENE_LEN = [180, 210, 150, 210, 180, 165, 210, 250, 210, 180, 180]
starts = [0]
for d in SCENE_LEN[:-1]:
    starts.append(starts[-1] + d - 18)
S = [s / FPS for s in starts]

TRACK = "audio/music/Covert Affair.mp3"
SYNC_IN_TRACK = 56.0  # bass restarts after the pause
SYNC_IN_VIDEO = S[6] + 6 / FPS  # "Nothing skips review" starts rising
OFFSET = SYNC_IN_TRACK - SYNC_IN_VIDEO

raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-ss", f"{OFFSET:.4f}", "-t", f"{VIDEO_END + 0.5:.4f}",
     "-i", TRACK, "-ac", "2", "-ar", str(SR), "-f", "s16le", "-"],
    capture_output=True, check=True).stdout
music = np.frombuffer(raw, dtype=np.int16).reshape(-1, 2).T.astype(np.float64) / 32768
N = music.shape[1]

env = np.ones(N)
fi = int(1.2 * SR)
env[:fi] = np.sin(np.linspace(0, np.pi / 2, fi)) ** 2  # smooth fade-in
a, b = int((VIDEO_END - 2.2) * SR), int(VIDEO_END * SR)
env[a:b] = np.cos(np.linspace(0, np.pi / 2, b - a)) ** 2  # fade out with the picture
env[b:] = 0
music *= env

with wave.open("out/music-mix.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((np.clip(music, -1, 1).T * 32767).astype(np.int16).tobytes())
print(f"track offset {OFFSET:.2f}s; sync at video {SYNC_IN_VIDEO:.2f}s; wrote out/music-mix.wav")
