# SEO, location pages and schema

Moved word for word from CLAUDE.md on 2026-11-23 so CLAUDE.md stays short. Read this before working on anything it covers. Add new detail here, not in CLAUDE.md.

## SEO — `src/seo/routes.ts` is the single source of truth

Per-route titles and descriptions live in `src/seo/routes.ts`. The postbuild step reads that file and injects the right `<title>`, meta, OG/Twitter and JSON-LD into each prerendered HTML file. **Edit `routes.ts`, then run the build — don't hand-edit `dist/` HTML.**

Targets:

- **Title patterns (Matt, 2026-11-10):** service pages `[Service] in Surrey | River Fox Events` (except `Commercial Christmas Decorations | River Fox Events`, kept under 60 characters), town pages `Party Styling in [Town] | River Fox Events` (town as the page copy writes it: "Walton-on-Thames"), Contact `Contact Laura | River Fox Events`, journal posts `[Post title] | River Fox Events` (post titles read like post titles; don't force title case on them). Titles live only in `routes.ts`; town and article pages re-apply that same string after load, and `src/test/page-titles.test.ts` checks the patterns. The town pages sharing "Party Styling in" is deliberate, so the uniqueness rule below doesn't apply to them.
- **Title:** ≤ 60 chars (Google truncates beyond that on desktop; mobile is tighter). Always end `| River Fox Events`. Front-load the keyword + location. Each page's title must be visibly distinct from the others — no two pages should share their first 4–5 words.
- **Meta description:** 150–160 chars. Front-load keyword + location. Same uniqueness rule — don't open two pages with the same phrase. Avoid generic openings like "Bespoke X across Surrey…" repeated verbatim across pages; vary the entry angle (trust signal, specific service, named clients, an outcome).
- **H1:** distinct per page. Don't fall back to the "[Service] stylist, based in Surrey." pattern — it makes pages feel near-identical to both crawlers and humans.
- **Hero sub-copy (the paragraph below the H1):** also distinct per page, ideally with a different opening word from the H1.
- **URLs:** Netlify serves trailing-slash URLs (`/childrens-parties/`). Keep canonicals consistent with that, and **every internal link must use the trailing slash** too (a test enforces it). Unknown addresses get `dist/404.html` with a real 404 status via the last rule in `public/_redirects`; don't put the old `/* /index.html 200` SPA fallback back, it makes Google see "soft 404s".

**Banned / capped vocabulary** (applies to titles, metas, H1s and hero sub-copy):

- "Bespoke" — banned from all titles. Max once per meta description. Free in body copy (it is Laura's own word).
- "Luxury" — max twice across all page titles site-wide.
- "From £300" — appears in a maximum of 6 page metas site-wide.
- Banned filler phrases (never use): "If you're looking for…", "Look no further…", "We pride ourselves on…", "Our team of experts…", "the perfect party".
- Banned praise words (brand book v2, on the website, in Google Ads and in any text designed onto an image or video): "stunning", "amazing", "wow factor", "show-stopping". Also no emojis, no exclamation marks there, no "IP" / "licensed" / "unlicensed" for character themes (name the theme: "a Wonka party"). **Client review quotes are exempt:** reviews are shown word for word, never edited, even when they say "stunning" or "amazing". Review cards cap a quote at `--review-lines` (7) with an ellipsis so cards stay even; the words aren't changed, the full text stays in the page, and the whole card opens the review on Google (Matt, 2026-11-13).
- **Words people search for come first** in headings, descriptions and captions (SEO work, November 2026): balloon decorations, balloon arch, balloon garland, balloon wall, number stack, kids party decorations, milestone birthday decorations, 50th birthday decorations, shimmer wall / sequin wall hire, party styling in [town], corporate event styling, Christmas door garlands. The home title is `Party & Event Styling in Surrey | River Fox Events`.

**Client-locked copy rules (Laura, 2026-05-21).** These apply everywhere — body copy, hero copy, SEO metas, alt text, FAQs, location pages:

- **Em dashes (—) are banned.** Use a hyphen (-) instead. The entire `src/` tree was converted on 2026-05-21; don't reintroduce them.
- **"Design-led" is banned** (too industry, not consumer-friendly). Use **"thoughtfully styled"** in body copy and **"bespoke"** in SEO metas.
- **"From scratch" is banned.** Use **"individually designed"**.
- **"Elevated"** — use as little as possible. Allowed sparingly, never as the headline word.
- **Bullet points start with a capital letter** (sentence case), even when the list finishes a lead-in sentence ending in a colon (Matt, 2026-11-09). `src/test/sentence-case-bullets.test.ts` fails the test run if a `<li>` opens with a lowercase letter. The space between bullets in articles is the `--gap-list-item` token.

**Uniqueness rule — applies to titles, metas, H1s, hero sub-copy and image alt text.** Before writing new copy for a page, skim existing pages and make sure the first ~5 words of the new draft don't echo any other page. This protects against duplicate-content signals and keeps the writing feeling considered rather than templated.

## Location pages

**Town page sections (2026-11-16).** The hero is the same as the service pages: `t-display` headline, then sub-copy, buttons and the shared `TrustLine` (stars, Google reviews, 400+ events, 8 years). "Recent celebrations" is `LocationPhotoGrid`: ten photos in three rows (rows of two on phones), each row's photos sized by shape so every row ends at the same edge with nothing cropped, and each opens the `/our-work/` viewer (`Tile` and `Viewer` live in `src/components/rfx/PhotoViewer.tsx`, shared with Our work). The town's own picks come first, matched to the gallery by alt text; the rest are topped up from the children's parties gallery, never Rishi's Summer Party or Halloween shots. The long sticky `LocationGallery` is now only the Balloons page's. "Recent clients include" uses `.text-to-content` (48 / 40 phone) before the logos. **Brighton & Hove was removed on 2026-11-16** (Laura doesn't work there): its old URLs 301 to Lewes.

**Wide photo wall and "Show more" (2026-11-16).** `LocationPhotoGrid` takes `wide`, which runs the photos almost edge to edge (`.container-wide`, margin `--gutter-wide`, max `--container-wide`); the town pages and the home page use it, and the heading stays in the normal column. The home page's "Recent work" also passes `pageRows` and `topUp={false}`: hand-picked photos, shuffled on every load, whole rows then "Show more". The Balloons page's "Recent work" was removed on 2026-11-18 (Matt): its tiles open in the photo viewer, so they already work as the photo wall, and the page ends the tiles with a "See our work" button. "Show more" is always `ShowMoreButton` (the ghost button; the Journal uses it too). The Balloons page's "I'm asked for most" is 16 tiles in `src/data/balloonTiles.ts` (16 so desktop's four across end on a full row; names in sentence case and short, two lines at most in a phone card). On phones the tiles are the cards described under "Service tile cards" below.

Location data lives in `src/data/locations/<slug>.tsx` and is built via the `makeLocation()` helper in `_makeLocation.tsx`. Each location must have a unique `uniqueSeoDescription`, `uniqueHeroSub` and `uniqueWhatWeDoBody`. Location pages are the highest collision risk — there are 20+ of them and they share structure, so the copy has to work harder to feel distinct.

**Local prose section rules:**

- 200 words max per location's prose section.
- Town name appears max 3 times in the prose section, and 8–10 times max across the whole page body (including nav, hero, headings, FAQs).
- Each paragraph contains exactly **one** real local entity (a venue, a road, a postcode, a landmark) — never two or three stacked together.
- No sentence may match a sentence on another location page. Reword, don't copy-paste with the town name swapped.

## Schema (JSON-LD)

Every page must ship valid JSON-LD covering the schema types relevant to it: `LocalBusiness` and `Organization` site-wide, `Service` on each service line (children's parties, milestones, corporate), `FAQPage` wherever an FAQ block is present, `BreadcrumbList` on any non-home page, and `Review` / `AggregateRating` once real reviews are wired in (don't fabricate). The shared business + service blocks are emitted by `scripts/postbuild.mjs` from `src/seo/routes.ts` — extend that file rather than hand-writing JSON-LD into individual templates.

**Validate before deploying any new page or schema change** against [Google's Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/). Fix every error and warning before merging.
