# River Fox content tools

Scripts the `river-fox` skill uses to turn Laura's photos and videos into finished posts. The skill (`.claude/skills/river-fox/` in this repo) says what to do; these are the tools it runs. The photo editing with OpenAI's image model is next door in `tools/photo-grade/`.

Run from a working folder for the job and set `WORK` to it, e.g. `WORK=~/river-fox-work/worplesdon`. **The working folder is kept, on the Mac, not in Drive and not in a temporary folder** (the reel scripts refuse one): it holds Laura's clips, the text images, the caption frames and `plates/`, the picture with no text on it, so a later re-cut is never made from a finished video. **No brand value is written in a tool.** Sizes, fonts, weights, colours, fades and safe areas are in one file, `brand-pack.json`, and each block there names the Brand Pack canvas board it was copied from. When the canvas changes, change that file, not the tools. (Not yet moved over: `story-builder/` and `storyboard/`, the older Reel builder and example pages, which still carry their own values.)

Fonts load from Google Fonts, so a network connection is needed. Chrome must be installed on the Mac.

| Folder | What it does |
|---|---|
| `../photo-grade/` | Grades Laura's photos with the OpenAI image model (`npm run run`), exports every platform size (`npm run export`), makes the title overlay (`npm run overlay`) and the website large master (`npm run large`). Has its own README. |
| `brand-pack.json` | The one config file: every value the tools draw with, and the canvas board each came from. Values marked `toolOwn` are choices the canvas leaves open. |
| `text/thumb.cjs` | The thumbnail or cover: the two-line headline and the small handle, as the canvas's two cover boards draw them. Prints the fade, the hook's word count and whether it was treated as long or short, every size and position, and refuses a hook that does not fit. |
| `text/mkcopy2.cjs` | Headline and finale text images for reels (`HEADTOP`, `FINBOTTOM`, `HANDLETOP`, `WEIGHT`, `WIDTH` settings; the defaults come from `brand-pack.json`). It measures where the lettering really sits, prints it, and will not write a file whose lettering is outside the Instagram safe area. |
| `text/wild_text.cjs` | The same text in the Wild font. |
| `captions/anim.cjs` | Animated captions as a PNG sequence: each word fades in as she says it, a held word spells long ("looove") and gets a big frame. Styles: `classic`, `wild`, `box` (pink boxes). |
| `timelapse/stabilise.py` | Evens out brightness and colour from frame to frame in a timelapse, using the gravel as the reference. |
| `cutout/` | Puts a title behind Laura so she walks in front of it (Apple Vision cut-out, `seg.swift`), the Wild card Story. |
| `reels/check.py` | **Run on every finished video, draft or final, before filing.** Prints every shot's length (a stray frame fails), each text image's edges against the safe area (outside fails) and where sound starts and stops, and writes a sheet to read: frame 0, the frame either side of every cut, the middle of every shot, the last frame, all with the safe lines drawn. The reel scripts run it themselves. |
| `reels/` | The reel build scripts (ffmpeg). `reel-F-build.sh` builds the captioned reel in any caption style (`STYLE=box`, the default, `wild` or `classic`; the three old script names still work). It cuts every shot to an exact frame count, saves a no-text copy in `plates/` and runs `check.py`. `reel-E-timelapse-build.sh` is the time-lapse on its own; it shows the last frame first and only builds with `FINISHED=yes`, because the finale text sits on that frame. Edit the shot lengths at the top for a new job. |
| `audio/` | `extract.sh` pulls only the sound from clips; `transcribe.sh` sends audio to OpenAI whisper-1 (ask Matt first, every job). |
| `reference-board/board.cjs` | Makes the numbered reference board (one image of example frames and covers) that goes with a brand pack update prompt. Set `JOB` to the job folder and `WILD` to a wild card still. |
| `review/review.cjs` | Review cards in the pack's review template, at the Instagram and Google Business sizes. Give it `size`, `quote`, `name` and `out`; it picks the short or long setting itself and refuses text too close to an edge. |
| `storyboard/` | Builds the stills-only storyboard page and the decisions page. Examples to copy from, not finished tools. |

The scripts came out of the Worplesdon job (20 Nov 2026) and still carry some of its values. Read a script before reusing it.
