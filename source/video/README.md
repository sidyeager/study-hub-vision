# Study Hub pitch video

A 65-second, 1920×1080 pitch video built with [Remotion](https://www.remotion.dev/) in the editorial style: Instrument Serif headlines, Plus Jakarta Sans text, and the app's rust, cream and charcoal colours.

## Run it

Needs Node.js 20.19+ or 22.13+.

```bash
npm install
```

```bash
npx remotion studio
```

```bash
npx remotion render StudyHubPitch out/study-hub-pitch.mp4
```

`remotion.config.ts` points Remotion at a Chromium path from the machine this was first built on. On another computer, delete the `Config.setBrowserExecutable(...)` line and Remotion will download its own browser.

## Files

| Path | What it is |
| --- | --- |
| `src/scenes.tsx` | The 11 scenes: cover, problem, need, product, today, vision, how it works, roadmap, model, ask, close |
| `src/components.tsx` | Masked text reveals, corner credits, headers, drifting background, film grain, phone frame |
| `src/theme.ts` | Colours, fonts and easing |
| `src/Composition.tsx` | Scene order, lengths and cross-fades; the soundtrack |
| `public/` | Fonts and two screenshots of the live app |
| `audio/music_mix.py` | Cuts "Covert Affair" to the video and syncs its pause to the "How it works" cut; writes `out/music-mix.wav` |
| `audio/compose.py` | An earlier, fully synthesized soundtrack (not used in the final video) |

## Rebuild the soundtrack

`src/Composition.tsx` expects `public/soundtrack.wav`, which is not stored here because it can be rebuilt:

```bash
pip install numpy scipy
```

```bash
mkdir -p out && python3 audio/music_mix.py
```

```bash
ffmpeg -i out/music-mix.wav -af "loudnorm=I=-14:TP=-2.5:LRA=11,alimiter=limit=0.75:level=false" -ar 48000 public/soundtrack.wav
```

## Credits

Music: "Covert Affair" by Kevin MacLeod (incompetech.com). Licensed under Creative Commons: By Attribution 4.0 License, http://creativecommons.org/licenses/by/4.0/
