# Journal authoring guide — River Fox Events

Rules for writing any new article in `src/data/articles/`. Claude must follow this every time it drafts, edits, or reviews journal copy. Mark reviews before anything is committed.

---

## 1. Voice — Laura, in first person

Laura writes the articles. Claude is ghost-writing *as her*, not about her.

- **First person, quietly authoritative.** "I want the family to be able to read it in seconds." Not "we" — Laura speaks as the designer.
- **Short, specific, occasionally fragmentary.** "Beautiful bones, very little atmosphere." Sentences earn their length.
- **Sensory detail over adjectives.** Name the actual thing — "pink scallop-edge plates, a soft zebra-print salad plate on top" — not how nice it was.
- **Trade-craft language used naturally.** Sightlines, scale, the brief, sourcing, install morning, sign-off, render board. Trust the reader to keep up.
- **Em dashes welcome. Exclamation marks never.**
- **Quiet expertise, never sales.** Explain *why* a choice was made; don't say it was excellent.

### Banned vocabulary

Filler phrases — never use:
- "If you're looking for…"
- "Look no further…"
- "We pride ourselves on…"
- "Our team of experts…"
- "The perfect party"
- "Stunning", "amazing", "wow factor", "show-stopping"

Capped vocabulary (per `CLAUDE.md`):
- "Bespoke" — banned from titles, max once per meta description
- "Luxury" — max twice across all page titles site-wide
- "From £460" — appears in max 6 page metas site-wide

---

## 2. Aesthetic gate — what Laura will and won't write about

This is a two-tier filter. Some things are off-limits entirely. Others are allowed, but only when Laura has actually done them and the design holds up — they shouldn't be the *default* topic each week.

**Auto-reject — never write about these:**
- Soft play setups
- Mascot or costume-character appearances ("Spiderman comes to your party")
- Disco lights, smoke machines, club-style lighting rigs
- Phone parties / mobile gaming truck parties
- Plastic novelty tat, party-shop bunting, off-the-shelf themed kits
- Anything cheap-feeling, punchy, or novelty-led

**Discouraged but allowed — only when Laura has actually styled it and the result is genuinely beautiful:**
- Character themes (Bluey, Mario Bros, Paw Patrol, Disney, etc.) — Laura has done these and can do them well, but they're not the brand's default territory. Lead with the *design moves* (palette, scale, restraint) rather than the IP.
- Neon palettes / brighter colour schemes — Laura has done these. Treat them as range-extension pieces, not the house style.

For both: **only proceed if there's a real, photographed event to write about.** Don't invent or trend-chase into these zones. Aim for no more than 1 in every 6 articles to fall into the "discouraged but allowed" bucket — the journal should still read predominantly as pastel, considered, milestone-led.

**Auto-include — the house style:**
- Pastel and neutral palettes
- Large-scale installs (4m+ backdrops, banquet tables of 10+)
- Tablescape-led design
- Milestone moments — christenings, big birthdays, anniversaries, baby showers, corporate
- Considered florals, render-led process pieces
- Named real venues in Surrey / South East / London

If a proposed topic falls in the auto-reject list, propose a different one. If it falls in the discouraged list, flag it explicitly to Mark with the reason it's worth making an exception for, and let him decide.

---

## 3. Article structure — the pattern Mark likes

Every article follows this shape. Use the existing components in `src/components/article/`.

```
1. <ArticleTLDR>
   ↳ 4 bullets, each a complete thought.
   ↳ Last bullet is often the philosophy line that gets reused as the pull quote.

2. <ArticleProse> — opening
   ↳ 1–2 short paragraphs. Set the brief in human terms.
   ↳ Name the venue. Signal the design tension.

3. <ArticleImage> — hero
   ↳ Detailed alt text (≤125 chars, describes what's in the photo)
   ↳ Caption that adds context the alt can't.

4. <ArticleProse> — section 1 with <h2>
   ↳ One design decision per section.

5. <ArticlePullQuote>
   ↳ One line. Lifts the philosophy from the TL;DR.

6. <ArticleImage> — supporting
7. <ArticleProse> — section 2 with <h2>

8. <ArticleCta variant="inline" label="..." />
   ↳ Quiet, mid-article. Not a hard sell.

9. <ArticleProse> — delivery / method section with <h2>

10. <ArticleProse> — "Why I love this part" with <h2>
    ↳ Laura's personal reflection. WHAT THIS PROJECT TAUGHT HER, or why this kind of work matters to her.
    ↳ Closes with a soft invitation: "tell me what you have in mind" → /#enquire
    ↳ Final line is always: — *Laura*
```

The `— Laura` sign-off and the "Why I love this part" section are the soul of the journal. Don't skip them. Don't rename them. Don't make them generic.

---

## 4. Length & rhythm

- **Target: 900–1300 words** of body prose (excluding TL;DR and captions).
- **Paragraphs: 2–4 sentences max.** Break often.
- **Sections: 3–5 `<h2>` headings**, including the closing "Why I love this part".
- **One named local entity per paragraph max.** Town name appears max 3 times in the prose, 8–10 times across the whole page (per CLAUDE.md location-page rules — apply same discipline here).

---

## 5. Internal links

Each article should link out to:
- **2× service pages** (`/childrens-parties/`, `/milestone-celebrations/`, `/corporate-brand-styling/`) where naturally relevant.
- **1× location page** if the article is set somewhere with a matching location page (e.g. an event in Cobham → link to `/party-styling-cobham/`).
- **1× CTA to `/#enquire`** in the final paragraph (in addition to the inline `<ArticleCta>`).

Use `<a href="/#enquire">` in MDX-style content. Components handle the smooth-scroll behaviour.

---

## 6. Images

Per `CLAUDE.md`:
- **Format: WebP.** Compressed before commit.
- **Hero < 500 KB, supporting < 200 KB.** Lossy quality 75–85.
- **Filenames** describe content, not page: `cobham-balloon-arch-pastel.webp`, not `journal-image-1.webp`.
- **Alt text ≤ 125 chars.** Describes what's in the photo. Never opens with the same 5 words as another image's alt. Never starts with the brand name.
- **Per-page OG image** in `public/og/[article-slug].webp` (1200×630), referenced from `src/seo/routes.ts`.

### When using AI image generation
- **Hero:** 1600×900 landscape. Subject centred so a square or 4:3 crop still leads with the subject.
- **Thumbnail:** 800×800 (square) — composed independently, not just a hero crop.
- **OG:** 1200×630 — composed for social preview cards.
- Visual style anchor (paste into every image prompt):
  > "Photorealistic editorial event styling photography, soft natural daylight, pastel and neutral palette, considered composition, balloon installations and tablescapes in real UK venue interiors, no people or faces, no text, no logos, shot on medium format with shallow depth of field."

---

## 7. SEO package — required for every article

Before the article ships, deliver these alongside the React component:

- **Slug** — kebab-case, descriptive, ≤ 5 words. Example: `dusty-pink-fortieth-cobham`.
- **Title** — ≤ 60 chars, ends `| River Fox Events`. Front-load keyword.
- **Meta description** — 150–160 chars. Front-load keyword + location. Vary opening across journal — never two articles starting with the same 5 words.
- **`src/seo/routes.ts` entry** — for the postbuild step to pick up.
- **JSON-LD `Article` schema** — wired in routes.ts.
- **OG image** — per-page, see section 6.

Validate every new entry against [Google Rich Results Test](https://search.google.com/test/rich-results) before merging.

---

## 8. Pre-flight checklist (Claude runs this before handing the draft to Mark)

- [ ] Voice — re-read; any "we", "stunning", "perfect", or exclamation marks? Strip them.
- [ ] Aesthetic gate — does every reference (theme, palette, prop) pass? If not, swap.
- [ ] Structure — TL;DR, hero image, pull quote, inline CTA, "Why I love this part", `— Laura` sign-off all present?
- [ ] Length — 900–1300 words of prose?
- [ ] Internal links — 2 service + 1 location (where relevant) + 1 enquire CTA?
- [ ] Image alt — ≤ 125 chars, describes the photo, no brand-name openers?
- [ ] SEO package — slug, title, meta, routes.ts entry, OG image, JSON-LD?
- [ ] Uniqueness — first 5 words of title and meta don't match any other page on the site?
- [ ] Build — `npm run build` runs clean and `dist/journal/[slug]/index.html` looks right?

If any box is unchecked, fix before showing Mark.
