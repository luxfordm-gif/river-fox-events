---
name: edit-laura-photos
description: Colour grade, brighten and sharpen Laura's River Fox Events photos with the project's OpenAI photo tool (tools/photo-grade), check every result, and export them at the right shape and size for where they're going (Google Business, Instagram, Facebook, stories, Pinterest, website gallery, cards, heroes, link previews). Use whenever Matt asks to edit, grade, colour correct, brighten, "boost", resize or crop Laura's photos for social or the website, or tidy them up, whether they're on the website, from her Instagram, or new ones he's dropped in, and as the editing step inside other River Fox skills (google-business-post). Also use when he asks whether the photo tool works or how to use it.
---

# Edit Laura's photos

> **For a whole job (a folder of new photos), use `river-fox-photo-job`**: it asks for the location and wording, grades with this tool, makes the website and social sets, puts text on the best photo per format and files everything. This skill stays the reference for the grading tool itself.

The River Fox repo has a photo tool, `tools/photo-grade/`, that sends a photo to OpenAI's image model with one
fixed brief, the **house look** (bright and airy, clean true whites, open shadows, accurate colour, crisp detail),
then checks the result against the original. It's the same look as every graded photo on the website, so anything
edited this way matches the site. Full reference: `tools/photo-grade/README.md`. Read it if anything here is unclear.

Matt is non-technical and often on his phone: run every command yourself, narrate briefly, and show results as
images (SendUserFile), never as terminal steps for him to paste.

## Before you start

- Work in the River Fox checkout this session is in (`~/Projects/river-fox-events`, or its worktree). The tool
  must have the `inbox` and `export` features (`ls tools/photo-grade/src/export.mjs`); if not, `git fetch` and
  check `origin/main`, and tell Matt the tool update isn't merged yet.
- `cd tools/photo-grade`; if `node_modules/` is missing, `npm install`.
- The OpenAI key is found automatically (the main River Fox folder's `tools/photo-grade/.env`). Never print it.
- Costs about $0.08 a photo. `npm run status` shows the running spend against the cap (`MAX_SPEND_USD`, default
  $20, set in that `.env`). If a run would pass the cap, stop and ask Matt before raising it.

## 1. Put the photos where the tool finds them

- **Website photos** (anything under `src/assets/`): nothing to do, the tool already lists them. Use their names.
- **Anything else** (Instagram, WhatsApp, new shoots): save into `tools/photo-grade/state/inbox/<job>/`, one folder
  per job named `YYYY-MM-DD-short-subject` (the date of the event or post). Give each file a descriptive,
  unique name that says what's in it (`true-medispa-garland-awards-window-close-angle.webp`): the name is the
  photo's key and must not clash with any other photo. Look at every photo before naming it (make a contact
  sheet with sharp and Read it). `state/` is git-ignored: inbox photos never reach the site or the repo.

## 2. Decide what not to send

- **Faces that matter** (Laura, clients, children, staff): don't grade. The model redraws the whole image, faces
  included. Add `"skip": true` for that photo in `photos.json`; export uses the original instead.
- **Video poster frames** and the `rishi-summer-party-bright-balloon-backdrop` photo: never.
- Already graded (`npm run status`, or the job is already in `state/manifest.json`): don't pay twice.

## 3. Write a note for anything the model might "improve"

In `tools/photo-grade/photos.json` under `"photos"`, keyed by file name without extension:
`{ "note": "..." }`, or `"preset": "gentle"` for a photo that already looks good. Always add a note when a photo has:
- **Lettering**: shop signs, window posters, awards, names, numbers, or a caption laid over the photo. Say
  "Copy ... exactly as photographed, letter for letter" and name each piece of text.
- **A specific colour** that must not move (muted terracotta balloons, a pink shopfront, a navy door).
- **A soft background, a view through a window, a dusky light**: say to keep it exactly as it is.
- A grey day: "A shopfront on a grey day. Keep the building, street and reflections exactly as they are."

## 4. Grade

```
npm run run -- --only=<job or names> --dry-run     # what will be graded and the cost
npm run run -- --only=<job or names>               # run in the background if more than a few photos
```

## 5. Check every result yourself before showing anyone

For each photo, Read `state/compare/<name>.jpg` (before | after) and check:
- Every word and number matches the original, letter for letter.
- Nothing added, removed or moved; balloon and bauble colours unchanged; faces (if any slipped through) unchanged.
- Flags from the run: `scene drifted` is often just the brightness lift (look); `palette shifted`, `colour boosted`,
  `contrast heavy`, `waxy`, `over-sharpened` mean look closely.

If one is wrong, tighten its note and re-grade it once with `--force`. If it's still wrong, leave it ungraded and
say so. Then send Matt the before | after sheets (SendUserFile, display render) and say what you checked.

## 6. Use the results

- **Anywhere else, export for where it's going.** `npm run export -- --only=<job> --for=<target>`: the target
  fixes the shape, size and format, so never pick sizes by hand. Work out the target from what Matt says; if he
  doesn't say, ask where the photos are going.

  | He says | `--for` | Makes |
  |---|---|---|
  | Google Business, GBP, Google post | `google-business` | 4:3 1200x900 JPG |
  | Instagram post | `instagram` | 3:4 1080x1440 JPG |
  | Instagram square | `instagram-square` | 1080x1080 JPG |
  | Facebook post | `facebook` | 4:5 1440x1800 JPG |
  | Story, reel cover | `story` | 9:16 1080x1920 JPG |
  | Pinterest | `pinterest` | 2:3 1000x1500 JPG |
  | Just the photo, uncropped | `full` | 1080 wide JPG |
  | Website gallery or page photo (new) | `website` | WebP 400/700/1000/1400 set |
  | Website card or tile | `website-card` | WebP 838x462 crop, 420/640/838 |
  | Website hero | `website-hero,website-hero-phone` | WebP 16:9 960/1440/1920 + 9:16 480/720 |
  | Link preview / OG image | `share` | WebP 1200x630 |

  Several at once with commas (one subfolder each, named like `Instagram post 3x4 (1080x1440)`). It evens brightness across the job (darker photos lifted to the brightest, max 6%),
  crops low so shop signs drop out, and writes `sheet.jpg` (check by eye, one row per target) and `export.json`
  (files, sizes, lifts: use it for receipts) to `state/exports/<job>/`. `--out=<folder>` puts the images straight
  into a folder, e.g. the synced Google Drive. If a crop loses the subject, re-export with `--top=0..1` (where the
  crop starts) and look again. Wide targets (hero, card, share) from a tall photo only show part of it: prefer a
  landscape photo for those and say so. `npm run export -- --list` prints every target.
- **Photos already on the website**: `npm run apply` swaps graded photos into `src/assets/` and remakes the gallery
  copies. Only after Matt has signed off on the before | afters, then follow the repo's CLAUDE.md (build,
  `npm test`, PR). New photos for the site: export with a `website*` target into `src/assets/`, then the same rules
  apply (one descriptive name and one alt text per image, `src/data/gallery.ts` for the gallery).

## The rules live in Google Drive (Matt, 2026-11-14)

Before any social task (posts, covers, overlays, review posts, where to file things), read the newest file of each
in Drive › River Fox Events, never one in an `_Archive` folder:
- `Brand › Brand book`: the newest "Brand book" and "Social brand pack" PDFs (read them with the Google Drive
  connector's `read_file_content`; search the folder newest first).

They are the only source for overlays, review posts, social layout, sizes and filing. Check for a newer version each
time, whatever its number. Don't copy their rules into this skill, CLAUDE.md or any other file. If a size in them
differs from the export targets, the documents win: tell Matt the tool needs updating. Google Business posts are a
plain edited photo, no text on the image, filed in `Social › Google Business › Posts › NN - Images - <short name>` (01 = newest, renumber the others up).
On Matt's Mac the River Fox folder is synced at
`~/Library/CloudStorage/GoogleDrive-luxfordm@gmail.com/.shortcut-targets-by-id/15xXTgs2DbOgYjchcf10XYQBGHprCfmOs/River Fox Events/`;
export straight into the right folder with `--out`, and never make a new top-level folder.

## Don't

- Ask the model to crop, reframe, recentre or "boost" a second time. It redraws the whole image, so reframing
  invents scenery that wasn't there (the brand book: real events only) and a second pass drifts further from the
  real photo. Crops and brightness are done locally by `export`.
- Edit Laura's own face, ever.
- Put inbox or Instagram photos into `src/assets/` unless Matt wants them on the website.
