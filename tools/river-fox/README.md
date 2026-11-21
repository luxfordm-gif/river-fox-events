# River Fox content tools

Scripts the `river-fox` skill uses to turn Laura's photos and videos into finished posts. The skill (`~/.claude/skills/river-fox/`) says what to do; these are the tools it runs. The photo editing with OpenAI's image model is next door in `tools/photo-grade/`.

Run from a working folder for the job and set `WORK` to it, e.g. `WORK=~/river-fox-work/worplesdon`. Fonts load from Google Fonts, so a network connection is needed. Chrome must be installed on the Mac.

| Folder | What it does |
|---|---|
| `../photo-grade/` | Grades Laura's photos with the OpenAI image model (`npm run run`), exports every platform size (`npm run export`), makes the title overlay (`npm run overlay`) and the website large master (`npm run large`). Has its own README. |
| `text/thumb.cjs` | The thumbnail or cover: one big headline in Fraunces 500, the small handle at the bottom. Classic font only. |
| `text/mkcopy2.cjs` | Headline and finale text images for reels, inside the Instagram safe area (`HEADTOP`, `FINBOTTOM`, `HANDLETOP`, `WEIGHT`, `WIDTH` settings). |
| `text/wild_text.cjs` | The same text in the Wild font. |
| `captions/anim.cjs` | Animated captions as a PNG sequence: each word fades in as she says it, a held word spells long ("looove") and gets a big frame. Styles: `classic`, `wild`, `box` (pink boxes). |
| `timelapse/stabilise.py` | Evens out brightness and colour from frame to frame in a timelapse, using the gravel as the reference. |
| `cutout/` | Puts a title behind Laura so she walks in front of it (Apple Vision cut-out, `seg.swift`), the Wild card Story. |
| `reels/` | The reel build scripts (ffmpeg): `reel-F-pink-box-build.sh` (the default), `reel-F-wild-build.sh`, `reel-F-classic-build.sh`, `reel-E-timelapse-build.sh`. Edit one for a new job. |
| `audio/` | `extract.sh` pulls only the sound from clips; `transcribe.sh` sends audio to OpenAI whisper-1 (ask Matt first, every job). |
| `reference-board/board.cjs` | Makes the numbered reference board (one image of example frames and covers) that goes with a brand pack update prompt. Set `JOB` to the job folder and `WILD` to a wild card still. |
| `storyboard/` | Builds the stills-only storyboard page and the decisions page. Examples to copy from, not finished tools. |

The scripts came out of the Worplesdon job (20 Nov 2026) and still carry some of its values. Read a script before reusing it.
