# Gallery photo grade (OpenAI Images API)

Colour grade, exposure and sharpness pass for the photos on `/our-work/`, using the same approach as the
Invicta photo editor (`~/Projects/invicta-photo-editor`): each photo goes to OpenAI's image-edit model
with a fixed retouching prompt, the result is checked against the original, and nothing reaches the site
until it has been reviewed.

Laura's originals in `src/assets/` are never changed. The tool writes graded PNGs, and
`scripts/gallery-images.mjs --graded=<dir>` makes the page's 400/700/1000/1400 copies from them.

## Setup (once)

1. `npm install` in this folder.
2. The key ("River Fox automation", from https://platform.openai.com/api-keys) lives in
   `~/Documents/river-fox-events/tools/photo-grade/.env` as `OPENAI_API_KEY=...`. A worktree reads it from
   there through git, so it is set up once per Mac; a `.env` in the worktree's own `tools/photo-grade/`
   overrides it. If neither has a key, the tool falls back to the Invicta editor's key.
   `.env` and `state/` are git-ignored.
3. `apply` also runs the house grade (`scripts/grade-photos.py`) for photos not on the AI grade, which needs
   `python3 -m pip install --user pillow numpy`.

## Commands (run in `tools/photo-grade/`)

| Command | What it does |
|---|---|
| `npm run audit` | Scores every photo on the site (exposure, colour cast, softness, noise, resolution), worst first, into `state/audit.json` |
| `npm run trial` | Grades only the photos listed under `trial` in `photos.json` |
| `npm run run -- --dry-run` | Lists what a full run would grade and the cost estimate |
| `npm run run` | Grades every gallery photo still to do; resumable, stops at `MAX_SPEND_USD` (default $8) |
| `npm run status` | Done / failed / pending, flags, spend |
| `npm run review` | Rebuilds `state/review/index.html` (every photo before and after) |
| `npm run apply -- --ai=all` | AI grade for every graded photo, house grade for the rest, then remakes the gallery copies |
| `npm run apply -- --ai=name1,name2` | Same, but only the named photos take the AI grade |
| `npm run export -- --only=<job> --for=<target>` | Post-ready copies of graded photos at the right size for where they're going (see below) |

Flags: `--only=name1,name2` limits a run; `--force` re-grades even if done.
Before the gallery PR is merged, prefix a command with `SOURCE_REF=origin/<branch>` to read the photo list and files from that branch.

## Photos that aren't on the site (Instagram, Google Business, social)

Put them in `state/inbox/<job>/`, one folder per job named `YYYY-MM-DD-short-subject` (e.g.
`2026-11-13-true-medispa-door-garland`), with descriptive file names (the name is the photo's key). The tool
finds them automatically: `npm run run -- --only=<job>` grades them, the review page shows them, and `apply`
never touches them. `state/` is git-ignored, so nothing here reaches the website or the repo.
Per-photo notes still go in `photos.json` under the file name, as for site photos (signage, captions, colours).

## Export: the right size for where it's going

`npm run export -- --only=<job> --for=<target>` makes copies of the graded photos on this Mac, with no API call.
Name the target and it knows the shape, size and format (`npm run export -- --list` prints them):

| `--for` | Shape and size | Format |
|---|---|---|
| `google-business` (default) | 4:3, 1200x900 | JPG |
| `instagram` | Portrait 3:4, 1080x1440 (the tallest Instagram keeps; fills the grid tile) | JPG |
| `instagram-square` | Square 1080x1080 | JPG |
| `facebook` | Portrait 4:5, 1440x1800 (Meta's Feed guide) | JPG |
| `story` | 9:16, 1080x1920 (stories, reel covers) | JPG |
| `pinterest` | 2:3, 1000x1500 | JPG |
| `full` | Whole photo, 1080 wide | JPG |
| `website` | Own shape, 400 / 700 / 1000 / 1400 wide, `<name>-<width>.webp` (as `scripts/gallery-images.mjs`) | WebP |
| `website-card` | Wide 838x462 crop, 420 / 640 / 838 wide | WebP |
| `website-hero` | 16:9, 960 / 1440 / 1920 wide | WebP |
| `website-hero-phone` | 9:16, 480 / 720 wide | WebP |
| `share` | 1200x630 link preview (`public/og/`) | WebP |

Several at once: `--for=instagram,facebook,story` (one subfolder each, named as the Drive's campaign folders are:
`Instagram post 3x4 (1080x1440)`, `Facebook post 4x5 (1440x1800)`, `Instagram story 9x16 (1080x1920)`).
Sizes and every overlay, review-post and social layout rule come from the newest Brand book, Social brand pack and
Automation build brief in Drive (Brand › Brand book, Automation; never their Archive folders). If they change, the
targets here follow. `--out=<folder>` writes the images
straight into a folder, e.g. the synced Google Drive one; the check sheet (`sheet.jpg`, one row per target) and the
receipt data (`export.json`: files, sizes, quality, brightness lifts) always go to `state/exports/<job>/`.

- **Why these sizes** (checked against each platform's own help pages, 14 Nov 2026): Google publishes no post
  size (only 720x720 for profile photos), and posts show in a centre-cropped 4:3 frame, so we make the 4:3 crop
  ourselves. Instagram keeps 1.91:1 to 3:4 at 1080 wide, so 1080x1440 is the tallest and fills the grid tile.
  Facebook's Feed guide asks for 4:5 at 1440x1800. Pinterest's specs say 2:3, 1000x1500.
- **Crops** keep the photo's full width and start low (each target has its own default, override with
  `--top=0..1`), so a shop sign above a doorway drops out and the garland fills the frame. A target taller than the
  photo keeps the full height and is centred (`--left=0..1`). Wide targets (hero, card, share) cut from a tall
  photo can only show part of it: use a landscape photo for those where there is one.
- **Brightness is evened** across the photos in one job: any photo darker than the brightest is lifted to match,
  by at most 6%, never darkened. `--no-even` turns it off.
- **Website sizes** match what the site's srcsets import (measured 2026-11-14). Gallery sets keep the site's
  qualities and are never enlarged; heroes, cards and share images are made at their exact sizes (an enlarged
  file is marked in `export.json`). Quality steps down to fit the size budget, never below 66. For photos already
  on the site, `apply` is the way in; these targets are for new photos being added.
- Photos not graded (skipped for faces) export from the original, marked in `export.json`.

Don't ask the model to crop, reframe or "boost" a second time: it redraws the whole image, so reframing invents
scenery and a second pass drifts further from the real photo. Crops and brightness are done here instead.

## The photo list and per-photo settings

The photos are every `source:` in `src/data/gallery.ts`, so a photo added to the gallery is picked up
automatically. `photos.json` holds only the exceptions, keyed by file name without folder or extension:

```json
{ "photos": { "<name>": { "preset": "gentle", "note": "Keep the blue glow on the numbers.", "skip": true } } }
```

- `grade` (default): fixes exposure, colour casts and soft focus, pulling the photo to the house look.
- `gentle`: for photos that already look good; a light polish towards the house look.
- `note`: an extra instruction for that photo, added to the end of the prompt.
- `skip`: leave the photo on the house grade.
- `extra` (top level): photos elsewhere on the site, e.g. the Christmas page, to grade and review. `apply` ignores them.

Both prompts share one **house look** (`HOUSE_LOOK` in `src/config.mjs`): bright and airy, clean true whites,
open shadows, soft natural contrast, rich but accurate colour, crisp detail, existing background blur kept.
That shared description is what makes the photos read as one set. Change it there, not per photo.

Changing a photo's prompt or note makes the next `run` grade it again.

## Checks on every result (lessons from Invicta's "too AI" round)

Each result is compared with its original. The review page and `status` flag:
`scene drifted` (composition changed), `palette shifted` (balloon colours moved more than 6°, measured on
strongly coloured areas), `colour boosted`, `contrast heavy`, `waxy / texture lost`, `over-sharpened`.
A flag means look closely. Also check every name and number on signage: the model redraws the image, so
lettering is the most likely thing to come back wrong.

What the November 2026 review taught:
- Read the photo, not just the flags. A brightness lift can trip `scene drifted`; a real colour change
  (Kai's terracotta balloons turning orange) can slip under `palette shifted`.
- Write a note for anything the model might "improve": a dusky view through a window (it turned it into
  daylight), a soft background (it sharpened it away), muted balloon colours.
- Photos are sent at the output size. Small originals (under ~1 MP) still get the most invented detail;
  look closely at those.
- Leave out photos with faces that matter (Laura's portrait): the model redraws the whole image.

Cost: about $0.05-0.10 a photo at `high` quality (Invicta averaged $0.054), priced from the API's own usage figures.
