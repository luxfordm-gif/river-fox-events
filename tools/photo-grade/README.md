# Gallery photo grade (OpenAI Images API)

Colour grade, exposure and sharpness pass for the photos on `/our-work/`, using the same approach as the
Invicta photo editor (`~/Projects/invicta-photo-editor`): each photo goes to OpenAI's image-edit model
with a fixed retouching prompt, the result is checked against the original, and nothing reaches the site
until it has been reviewed.

Laura's originals in `src/assets/` are never changed. The tool writes graded PNGs, and
`scripts/gallery-images.mjs --graded=<dir>` makes the page's 400/700/1000/1400 copies from them.

## Setup (once)

1. `npm install` in this folder.
2. Put a key from https://platform.openai.com/api-keys in `tools/photo-grade/.env` as `OPENAI_API_KEY=...`.
   (Without it the tool falls back to the Invicta editor's key.) `.env` and `state/` are git-ignored.
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

Flags: `--only=name1,name2` limits a run; `--force` re-grades even if done.
Before the gallery PR is merged, prefix a command with `SOURCE_REF=origin/<branch>` to read the photo list and files from that branch.

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
