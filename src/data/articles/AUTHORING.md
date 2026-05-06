# Journal authoring guide — River Fox Events

Rules for writing any new article in `src/data/articles/`. Claude must follow this every time it drafts, edits, or reviews journal copy. Mark reviews before anything is committed.

---

## 0. Article categories

Every article belongs to one of four categories. The category dictates what Claude can and can't say.

### Trends & insight *(default for weekly articles)*
Synthesises what's happening in the industry — what people are asking for this season, what design moves are gaining ground, where the wider luxury event market is heading. Framed through Laura's design lens.

- **Allowed:** broad observations grounded in real industry signal (competitor scans, search trends, named publications), Laura's design opinion on those trends, advice for hosts thinking about their own celebration.
- **Not allowed:** specific event claims that imply Laura styled something she didn't. No "I just finished a 50th in Cobham where we…" unless she actually did.
- **Examples in repo:** `beyond-the-balloon-arch.tsx`, `childrens-party-themes-2026.tsx`.

### Process pieces *(secondary weekly option)*
How Laura actually works — render boards, sourcing, install mornings, the questions she asks at the brief stage. Genuine method, not invented method.

- **Allowed:** how Laura's workflow runs, why she does things a particular way, what hosts can expect.
- **Not allowed:** fabricated processes or steps Laura doesn't actually follow.
- **Examples in repo:** `from-design-to-delivery.tsx`.

### Case studies *(opportunistic, not weekly)*
A specific event Laura has styled, with real photos. The strongest pieces in the journal but rate-limited — only write one when there's a genuine event to anchor it.

- **Allowed:** the actual brief, real venue name, real palette, real install detail, real photos.
- **Not allowed:** composite or invented events. If the event hasn't happened, don't write it as if it has.
- **Examples in repo:** `two-wild-safari-second-birthday.tsx`.

### Brand pieces *(rare)*
The rebrand, studio milestones, business-level reflections. Use sparingly.

- **Examples in repo:** `lollipop-balloons-to-river-fox-events.tsx`.

### The fabrication rule (applies to all categories)

Claude must not put words in Laura's mouth that imply experience she may not have had. Specifically:

- "I'm seeing more requests for X" — only if grounded in cited industry signal, OR flagged to Mark with "is this true for Laura right now?" before drafting.
- "I styled a [specific event] last [month]" — only in case studies, with real photos.
- "Most of my clients are asking for…" — never. Too specific to assert without Laura's input.

When in doubt, swap a personal claim for an industry observation: *"I'm noticing across Surrey stylists that…"* is safer than *"I'm noticing in my own bookings that…"* unless Mark has confirmed the latter.

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
