# Weekly journal article brief

Paste this whole document at the start of a new Claude session each week. It tells Claude what to research, how to pick a topic, and what to produce. The companion file `AUTHORING.md` (in this folder) defines tone, structure, and SEO standards — Claude must read both.

---

## Goal

Publish one new journal article per week to grow organic search traffic and signal that River Fox Events is an active, considered design studio. Each article should:
- Rank for one specific long-tail keyword
- Earn internal links from at least one service or location page
- Be genuinely worth reading (not SEO filler)

---

## Step 1 — Competitor research (last 30 days only)

**Direct local competitors — scan weekly:**
- Mimi & Lu Events — https://www.mimiandlu.co.uk
- The Luxe Occasion — https://www.theluxeoccasion.com
- The Party Productions — https://thepartyproductions.co.uk
- Scarlet Events — https://www.scarletevents.com
- Mix Masters Events — https://www.mixmastersevents.co.uk

**Aspirational / national benchmark — scan monthly, not weekly:**
- @bubblegumballoons (IG)
- @theballoonquarter (IG)
- @lovebubbleballoons (IG)
- Balloonista — https://www.balloonista.com

**For each, pull:**
- Posts / articles published in the last 30 days
- Engagement signal (likes, comments, saves where visible)
- Themes, palettes, venue types, design moves

**Output a table:** 8–10 themes ranked by signal strength, each tagged "passes RFE aesthetic gate? Y/N" using the rules in `AUTHORING.md` §2.

---

## Step 2 — Topic pick

From the Y-tagged themes, recommend ONE topic that:
- Fits Laura's aesthetic (pastel, neutral, considered, big-event, named-venue)
- Has clear search intent (someone is actually Googling for this)
- Ties naturally to a service page (`/childrens-parties/`, `/milestone-celebrations/`, `/corporate-brand-styling/`) for internal linking
- Hasn't already been covered in `src/data/articles/`

**Deliver before drafting:**
- Topic in one sentence
- Target keyword + 2 secondary keywords
- 3 title options (≤ 60 chars each, ending `| River Fox Events`)
- 1-paragraph synopsis of the angle Laura would take

**Mark approves the topic and title before any article is drafted.**

---

## Step 3 — Draft the article

Once Mark approves the topic, follow `AUTHORING.md` in full. Specifically:
- Voice rules (§1) — Laura, first person
- Aesthetic gate (§2) — every reference must pass
- Structure (§3) — TL;DR → prose → image → pull quote → prose → inline CTA → method section → "Why I love this part" → `— Laura`
- Length (§4) — 900–1300 words of prose
- Internal links (§5) — 2 service + 1 location (where relevant) + enquire CTA

---

## Step 4 — Generate images

Per `AUTHORING.md` §6. Three images per article:
- Hero (1600×900) — for the article body
- Thumbnail (800×800) — for the journal index card
- OG (1200×630) — for social preview

**Image prompt anchor — paste into every ChatGPT image generation request:**

> "Photorealistic editorial event styling photography, soft natural daylight, pastel and neutral palette, considered composition, balloon installations and tablescapes in real UK venue interiors, no people or faces, no text, no logos, shot on medium format with shallow depth of field. [Then add the specific scene description for this article.]"

**Always specify:**
- Palette in concrete colour names ("dusty pink, sage, butter gold, cream") — not "pastel"
- The venue type ("Surrey country house orangery" / "London townhouse dining room")
- The hero element ("a 12-seat banquet table dressed for a 40th birthday, low florals, tapered candles, balloon clusters integrated into the runner")

Save outputs as WebP under 500 KB (hero/OG) or 200 KB (thumbnail). Filenames describe content, not page.

---

## Step 5 — SEO package & routes.ts entry

Per `AUTHORING.md` §7. Before handing the draft to Mark, prepare:
- Slug, title, meta description
- `src/seo/routes.ts` entry with `ogImage` set to the per-page WebP
- JSON-LD `Article` schema fields
- A note confirming uniqueness against existing entries

---

## Step 6 — Hand to Mark for review

Show Mark, in order:
1. The competitor research table (§1)
2. The recommended topic + 3 title options (§2)
3. **Wait for sign-off**
4. The full draft article (§3)
5. The proposed images (§4)
6. The SEO package (§5)

**Do not commit anything until Mark approves the full package.**

After Mark approves: write the file to `src/data/articles/[slug].tsx`, update `routes.ts`, run `npm run build`, spot-check `dist/journal/[slug]/index.html`, then push to main.

---

## Cadence reminder

- Topic + research: Monday
- Draft + images: Tuesday/Wednesday
- Mark reviews: Thursday
- Edit + ship: Friday

If a week is light on competitor signal worth borrowing, write a method/process piece from Laura's recent work instead — those are often the strongest articles anyway (see `two-wild-safari-second-birthday.tsx` and `from-design-to-delivery.tsx`).
