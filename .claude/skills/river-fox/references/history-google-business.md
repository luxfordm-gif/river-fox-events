---
name: google-business-post
description: Turn Laura's latest Instagram post into a ready-to-publish Google Business Profile post for River Fox Events. Fetches her newest photo post from @riverfox_events, grades the photos (edit-laura-photos skill), writes the post in Laura's own words, saves the images and post text to Google Drive, and sends Matt a receipt. Use when Matt says "Google Business post", "GBP post", "post her latest to Google", "make a Google post from her Instagram", or similar.
---

> **History only (23 Nov 2026).** Any size, font, colour, position or safe area written below is a record of what was done at the time, not a rule. Brand and social rules live in the Brand Pack canvas; the tools' values are in `tools/river-fox/brand-pack.json`.

# Google Business post from Laura's latest Instagram

Six steps, done end to end without asking Matt to run anything. He is often on his phone: narrate in a line as
you go, send images with SendUserFile, finish with the receipt (step 6). Don't post to Google yourself: Matt
publishes it. This skill only reads Instagram and writes to Drive.

## 0. Read the newest rules

Before anything else, read the live Brand Pack artifact and `docs/voice.md` (there is no brand PDF). (The Automation
folder was retired on 21 Nov 2026.)
They are the only source for sizes and review posts; filing is in the river-fox-photo-job skill. If they say
something different from this skill, they win: follow them and tell Matt this skill needs updating.

## 1. Find her latest photo post

Use the built-in browser (`mcp__Claude_Browser__*`), no login needed.
- Open `https://www.instagram.com/riverfox_events/`. On the cookie banner choose **Decline optional cookies**.
  Close any "Never miss a post" pop-up with its **Close** button (find "Close"); don't click Log in.
- **Pinned posts sit first and are out of date order.** Read the grid instead of trusting position:
  ```js
  [...document.querySelectorAll('main a[href*="/p/"], main a[href*="/reel/"]')].slice(0, 12).map(a => ({
    href: a.getAttribute('href'), alt: (a.querySelector('img')?.alt || '').slice(0, 140),
    icons: [...a.querySelectorAll('svg[aria-label]')].map(s => s.getAttribute('aria-label')) }))
  ```
  Each alt reads "Photo/Video by ... on <Month D, YYYY>". The latest **photo** post (`/p/`, not a reel) by date is
  the one. If two share a date, the one earlier in the grid (after the pinned ones) is newer. Skip reels and
  review/quote graphics (alt "May be an image of text" with no event in it): take the latest post that shows an event.
  Tell Matt which post you picked, its date, and anything you skipped.
- If Matt names a post or subject instead ("the wreath one"), use that post. He dictates: "reef" means wreath,
  which for Laura usually means a door garland; "las vagus" is Las Vegas.
- **He names an event or sends a photo** ("her Toy Story party"): look on the website first. Search
  `src/data/gallery.ts`, `src/data/inspiration.ts` and `src/assets/` for it (name, theme, child's name). A site photo
  is usually already graded (`state/manifest.json`, status done): check its before | after and export it by its
  name, at no cost. Without an Instagram caption, take Laura's words from the matching service page and her journal
  articles. Photos Laura sent him directly (WhatsApp, email, Drive): save them into an inbox job folder and carry on
  from step 2's clean-photo check.
- Instagram shows only her 12 most recent posts without logging in. Older work: use the website's copy as above.
- **A post with no photo of the work** (a review quote card, a text graphic): stop, tell Matt there's nothing to
  post from it, and ask for the photos (2026-11-14: the Las Vegas wedding post was only a quote card).
- **Already done?** If `tools/photo-grade/state/inbox/` already has a folder for that post's date and subject, or
  the Drive folder in step 5 exists, say so and reuse it rather than paying to grade again.

## 2. Pull down the images

On the post page, read the caption (`get_page_text`: it's Laura's words, needed for step 4), then collect every
slide at full size:
```js
const seen = new Map(), grab = () => document.querySelectorAll('main ul img').forEach(i => {
  if (i.naturalWidth >= 1080) { const u = i.currentSrc || i.src, k = u.split('?')[0].split('/').pop(); if (!seen.has(k)) seen.set(k, u); } });
grab();
for (let n = 0; n < 20; n++) { const next = document.querySelector('button[aria-label="Next"]'); if (!next) break; next.click(); await new Promise(r => setTimeout(r, 900)); grab(); }
[...seen.values()].join('\n')
```
(Load the post at `?img_index=1` first so it starts from slide 1; the order returned is the slide order.) Write the
URLs into a small script in the scratchpad that `curl -sSf`s each into a new folder
`tools/photo-grade/state/inbox/<YYYY-MM-DD>-<short-subject>/` as `slide-1.webp`, `slide-2.webp` ... (post date,
not today). Make a contact sheet, look at every slide, then rename each to a descriptive unique name (what's in
it, the venue, the angle). Never put these in `src/assets/`.

**Keep only clean photos of the work.** Delete from the job folder (so they're not paid for) any slide that has
words, graphics, a logo or a watermark laid over it (her "4th year doing this gorgeous doorway!" style captions,
quote cards, before/after graphics), and any slide where a person's face is the subject. Google Business photos
must "represent reality" and posts with overlays read as ads and get rejected (step 4). Signage that's really
there in the scene (a shop sign above the door) is fine. If no clean slide is left, stop and tell Matt.

## 3. Grade them

Follow the **edit-laura-photos** skill for this job folder: notes for every sign, caption and colour; skip any slide
where faces matter; dry run, grade, check every before | after yourself. Send Matt the before | after sheets.
The export (`--for=google-business`: 4:3 1200x900 JPG, the frame Google shows posts in) happens in step 5,
straight into Drive.

## 4. Write the post, in Laura's words

Start from her Instagram caption and keep her phrases, facts and warmth; reshape it for Google:
- **First line** (all Google shows before "more"): what it is, with the words people search for first
  ("Christmas door garland ...", "Balloon arch ...", "50th birthday decorations ..."). One sentence.
- Then 2 to 3 short paragraphs: what she made (her colours and materials, named exactly), who it's for, and the
  ask. 600 to 1,000 characters; Google's limit is 1,500.
- **House rules** (`docs/voice.md`): first person "I"; no emojis, no exclamation marks, no hashtags; hyphens,
  never em dashes; none of "stunning", "amazing", "wow factor", "show-stopping", "the perfect party", "bespoke"
  more than once, "design-led", "from scratch", "planner/planning"; no flowers as the lead. Calm, never salesy.
- Facts only from her caption or the site: don't invent prices, places, dates or availability. Don't name a client
  or venue unless she did in her caption; offer it as an option instead. Flag anything time-sensitive ("only a few
  slots left") for Matt to check before posting.
- **Button: Learn more**, linking to the page that matches the post (trailing slash):
  | Post shows | Link |
  |---|---|
  | Door garland on a home | `https://riverfoxevents.co.uk/christmas-door-garlands/` |
  | Garland or Christmas decor on a shop, salon, restaurant, office | `https://riverfoxevents.co.uk/commercial-christmas-decorations/` |
  | Children's party | `https://riverfoxevents.co.uk/childrens-parties/` |
  | Birthday, anniversary, baby shower, wedding | `https://riverfoxevents.co.uk/milestone-celebrations/` |
  | Brand or corporate event | `https://riverfoxevents.co.uk/corporate-brand-styling/` |
  | Balloon arch, garland, wall, number stack | `https://riverfoxevents.co.uk/balloon-installations/` |
  Check the path still exists in `src/seo/routes.ts`.
- **Photo: pick the single best one**, after export, by looking at the crops on `sheet.jpg`. In order:
  1. The whole piece fits the frame (the top of the arch and both sides in frame, not cut off at the edges).
  2. The styling fills the frame: garland, balloons or backdrop larger than the shop front, street or room.
  3. Sharpest and cleanest grade: no flags from the grading run, lettering checked, nothing odd.
  4. Front-on or a gentle angle beats a steep one; daylight beats night.
  Say in a line why it won. Name a second choice only if Matt might want to add another photo.
- **No overlays on Google, ever.** No added text, logo, watermark, price, phone number or call to action on the
  image: Google's guidelines say photos should represent reality with no significant alterations, and tools that
  post to Google report overlays and watermarks as the usual reason posts are rejected. The words go in the post
  text and the button. Overlays and review posts are other jobs, made to the rules in the Drive documents (step 0).

## 5. Save to Google Drive

Folder: River Fox Events › Social › **Google Business › Posts** › `NN - Images - <subject>` (01 = newest, renumber the others up; the post date goes in the post copy, not the folder name; today's
date if the photo didn't come from an Instagram post). Only ever create that dated folder: Matt keeps the Drive
tidy (layout in the edit-laura-photos skill). `Google Business › Review posts` holds review cards only
(made as the front page's Review cards section says); don't put photo posts there. On Matt's Mac the River Fox Drive is synced at
`~/Library/CloudStorage/GoogleDrive-luxfordm@gmail.com/.shortcut-targets-by-id/15xXTgs2DbOgYjchcf10XYQBGHprCfmOs/River Fox Events/`,
so export straight into it:
```
npm run export -- --only=<job> --for=google-business --out="<that path>/Social/Google Business/Posts/01 - Images - <subject>"
```
Then Read `tools/photo-grade/state/exports/<job>/sheet.jpg`: if a crop loses the subject (a sign fills the frame,
the arch is cut badly), re-export with `--top=0..1` and look again. Send Matt the sheet.
If that path isn't there (cloud session), export without `--out` and upload the JPGs from
`state/exports/<job>/` with the Google Drive connector (`create_file`, `base64Content` as a
`sha256:<hash>:<absolute path>` file reference, `disableConversionToGoogleType: true`). Either way, save the post as a Google Doc in the same folder with the
Drive connector (`create_file` with `textContent`, `contentMimeType: text/plain`): the post text, then the button,
link and photo choice, then the things to check. Read the folder back to confirm every file landed. The River Fox
folder is shared with Laura, so she sees it too.
Campaign pieces (a Christmas film, a Christmas Google post) go in `Social › Campaigns › <campaign> › Google Business › NN - Images - <short name>` instead of the channel folder Inside a campaign name it `NN - Images - Google Business post` (numbering rule in `river-fox-photo-job`) and tag it blue in Finder; archive folders are `_Archive` (Matt, 20 Nov; details in `river-fox-photo-job`). (campaign folders are one dated folder per job, no `Images` folder, Matt 20 Nov); ask Matt if unsure whether a piece belongs to a campaign.

## 6. The receipt

End with this, short enough to read on a phone:

**Google Business post ready: <subject> (<post date>)**
- **Drive folder:** <link>
- **Photo to use:** <file> (1200x900), and in a few words why it's the best one
- **Button:** Learn more → <link>
- **Post text:** the full post, ready to copy.
- **Check before posting:** the time-sensitive claims, any client name to confirm, slides left out (captions,
  faces) and anything left ungraded, with why.
- **Cost:** $<this run> (running total $<spend> of $<cap>).
