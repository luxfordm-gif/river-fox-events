---
name: edit-laura-videos
description: Colour grade Laura's River Fox Events videos in the house look, cut several clips into one short video, open it on a strong still (so that's the thumbnail) and close it on the River Fox end card (pink, Laura's stacked logo, a two-line serif hook, a line of capitals, the web address). Exports for Google Business, Instagram Reels, Stories or Facebook. Use when Matt says "edit Laura's video for Google Business" (or for Instagram, Facebook), or asks to grade, edit, cut, join, trim or "tidy up" videos or reels of Laura's work, add an end card or end frame to a video, or pick a video thumbnail. Photos go to edit-laura-photos instead.
---

> **History only (23 Nov 2026).** Any size, font, colour, position or safe area written below is a record of what was done at the time, not a rule. Brand and social rules live in the Brand Pack canvas; the tools' values are in `tools/river-fox/brand-pack.json`.

# Edit Laura's videos

> **Filing and naming (Matt, 20 Nov):** a campaign piece is a folder `NN - Video - <short name>` (01 = newest) with an orange Finder tag; archives are `_Archive`; one folder per piece directly in the campaign. See `river-fox-photo-job`. **This skill and `instagram-story` are to be merged into one video skill** (Matt: "surely they should be one"); until then, use `instagram-story` for captioned Reels and Stories and this one for grading and joining clips, and ask about the end card: `instagram-story` says no end card.

Matt is non-technical and often on his phone. Run everything yourself with `ffmpeg` (installed on his Mac), narrate
briefly, and show results as contact sheets and the finished file (SendUserFile), never as commands for him to paste.
He dictates, so "door gun and insulation" means door garland installation and "garden still" means garland still.

First made for the Christmas door garland at TRUE Medispa, 14 November 2026 (Matt approved the grade, cut, end card
and opening still). The end card is in the River Fox Brand Pack artifact (claude.ai/artifact/RyuZawfyZziQPy6xGJ5hhF), page
"Google Business", artboard "Video · End card".
**The live Brand Pack artifact is the authority for social rules** (there is no brand PDF). Check it before each job;
if its end card page or its colours, type or logo rules change, follow the pack and update `end-card/card.html` to match.

**Instagram Stories and Reels with Laura's spoken words captioned** have their own skill: `instagram-story` (style approved 18 Nov 2026, transcription, build script). Use it instead of this one for those; this one stays for Google Business and end-card videos.

## 1. Look before cutting

- Copy the clips into a scratchpad folder (never edit the originals). `ffprobe` each for length, size and frame rate.
- Contact sheet per clip: `ffmpeg -i clip.mp4 -vf "fps=2,scale=160:-1,tile=8x2" -frames:v 1 sheet.png`, then Read it.
- Note what to cut: shaky starts, the street, bags, bins, people's faces, anything off-brand.
- WhatsApp shrinks video (about 480x850). It can be enlarged to 720p cleanly, but say once that the originals from
  Laura's phone would be sharper.

## 2. Grade (the house look, matched to the photos: bright and airy, true whites, open shadows)

```
G="colortemperature=temperature=6100:mix=0.45,curves=master='0/0.03 0.25/0.31 0.5/0.58 0.8/0.86 1/1',eq=contrast=1.04:saturation=1.10:gamma=1.04"
P="$G,scale=720:1280:flags=lanczos,unsharp=5:5:0.7,setsar=1,format=yuv420p"
```

Built for an overcast day (grey and slightly blue). Test on one frame first, original and graded side by side
(`split[o][g];[g]$G[gg];[o][gg]hstack`), and check the white baubles and walls stay white, not cream. Sunny or
warm-lit footage needs less warmth: lower `mix`, or drop `colortemperature`. For 1080p sources scale to 1080:1920.

## 3. Cut

- Tell a simple story: wide (the whole piece), in to the detail, back out. Match cuts where one clip ends on
  detail and the next starts on detail. Crossfade 0.5s between clips.
- **Open on the best still** (the thumbnail). Google Business, and most players, take the video's first frame as
  the thumbnail and don't let you choose one. Grade a few candidate frames into a grid, pick the one that shows the
  whole piece in context (the garland framing the door, warm light behind), hold it 1.2s and crossfade 0.4s into
  the first clip. No fade from white or black at the start: that makes a blank thumbnail. Also save that still as
  a JPG in case Matt wants it as a photo.
- No sound unless Matt asks: phone audio is street noise, and Google Business videos play muted.
- Close on the end card (section 4): crossfade 0.7s, hold about 3.5s.

Example (still, clip b 0-8.2s, clip a 0-5.4s, card):

```
ffmpeg -loop 1 -framerate 30 -t 1.2 -i thumb.png -i b.mp4 -i a.mp4 -loop 1 -framerate 30 -t 4 -i card.png \
 -filter_complex "[0:v]setsar=1,format=yuv420p[s];[1:v]trim=0:8.2,setpts=PTS-STARTPTS,fps=30,$P[v0];[2:v]trim=0:5.4,setpts=PTS-STARTPTS,fps=30,$P[v1];[3:v]scale=720:1280:flags=lanczos,setsar=1,format=yuv420p[c];[s][v0]xfade=transition=fade:duration=0.4:offset=0.8[sa];[sa][v1]xfade=transition=fade:duration=0.5:offset=8.5[ab];[ab][c]xfade=transition=fade:duration=0.7:offset=13.2,format=yuv420p[v]" \
 -map "[v]" -an -c:v libx264 -profile:v high -preset slow -crf 18 -movflags +faststart out.mp4
```

Each xfade offset is the running length so far minus that fade's duration. End every chain with
`format=yuv420p` (fades otherwise switch to a format the high profile can't encode).

## 4. End card

`end-card/card.html` (1080x1920; `end-card/example-door-garlands.png` is the approved example):

- Ground Laura's pink `#F7EEE9`. **Every word in logo brown `#5D554B`**, the same colour as the logo. Matt
  rejected near-black text under the brown logo: it stood out against it.
- Laura's stacked logo, made fresh each time from Drive: `Brand › Logo › Black › Stacked outlined.svg` with
  `sed 's/#181818/#5D554B/g'`, saved as `logo.svg` next to `card.html`.
- Hook in Fraunces 400, two lines, about five words, first upright, second italic, ending with a full stop
  ("Your door, / *dressed for Christmas.*"). One line of DM Sans 600 capitals under it saying what and where
  ("Christmas door garlands, / installed across Surrey"). RIVERFOXEVENTS.CO.UK at the foot.
- Words follow Laura's voice: no exclamation marks, no em dashes, name the real thing, nothing she doesn't supply.
  Join the last two words of each line with `&nbsp;`.
- Fill the `{{...}}` placeholders, then render with the system Chrome (fonts load from Google, so allow time):

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1080,1920 --virtual-time-budget=8000 \
  --screenshot=$PWD/card.png "file://$PWD/card.html"
```

Read the PNG before using it: check the fonts are Fraunces and DM Sans (not a fallback) and nothing is off-centre.
Phone screenshots of the video can crop the sides; that's the screenshot, not the video.

## 5. Export and check

| Where | Size | Limits |
|---|---|---|
| Google Business | 720x1280 or 1080x1920 portrait | up to 30s, 75 MB, 720p or higher |
| Instagram Reel / Story, Facebook Reel | 1080x1920 | keep text 64px clear of the sides |

Before sending: `ffprobe` the length and size, make a contact sheet of the whole video (`fps=2`) and Read it, check
the first frame is the still, then save to `~/Downloads/River Fox - <what> - <where>.mp4` and SendUserFile it.
For Google Business, also file it in Drive `Social › Google Business › Posts › NN - Images - <short name>` (01 = newest, renumber the others up) (the synced folder
under `~/Library/CloudStorage/GoogleDrive-*/.shortcut-targets-by-id/*/River Fox Events/`). If a folder for the same
job already exists (photos and post text from google-business-post), add it there, numbered after the photos in
that folder's naming style: `5-true-medispa-door-garland-video-portrait.mp4`. Otherwise make
`YYYY-MM-DD - What` (the date of the post).
