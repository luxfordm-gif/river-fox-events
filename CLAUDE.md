# River Fox Events — project conventions

Site for **Laura** at River Fox Events (luxury event styling, Surrey). Live at `riverfoxevents.co.uk`. Matt is non-technical and runs the project — favour pragmatic over pure, walk through changes step by step, never assume tooling familiarity.

## Stack & build

- **Vite + React 18 + TypeScript + Tailwind + shadcn/ui.** Use **npm**, not bun (bun lockfiles were intentionally removed).
- `npm run build` runs `vite build` → `scripts/prerender.mjs` → `scripts/postbuild.mjs`. The postbuild step is what writes per-route static HTML, the sitemap and robots.txt — never edit those output files directly.
- Hosting: Netlify (apex `riverfoxevents.co.uk` primary, www redirects). DNS on Cloudflare in DNS-only / grey-cloud mode so Netlify can issue Let's Encrypt SSL.

## Repo layout — one canonical local copy

The active local repo is **`~/Documents/river-fox-events/`** only. A duplicate Lovable-synced clone at `~/Documents/Claude/lauras site/` was deleted on 2026-05-02 — don't recreate it. If Laura/Matt re-engage Lovable, point Lovable at the same GitHub repo, never let it spin up a parallel folder.

`_salvaged-from-old-folder/` (gitignored) holds three unsorted asset files rescued from the deleted clone. Matt hasn't reviewed them yet; they're not wired up anywhere.

## SEO — `src/seo/routes.ts` is the single source of truth

Per-route titles and descriptions live in `src/seo/routes.ts`. The postbuild step reads that file and injects the right `<title>`, meta, OG/Twitter and JSON-LD into each prerendered HTML file. **Edit `routes.ts`, then run the build — don't hand-edit `dist/` HTML.**

Targets:

- **Title:** ≤ 60 chars (Google truncates beyond that on desktop; mobile is tighter). Always end `| River Fox Events`. Front-load the keyword + location. Each page's title must be visibly distinct from the others — no two pages should share their first 4–5 words.
- **Meta description:** 150–160 chars. Front-load keyword + location. Same uniqueness rule — don't open two pages with the same phrase. Avoid generic openings like "Bespoke X across Surrey…" repeated verbatim across pages; vary the entry angle (trust signal, specific service, named clients, an outcome).
- **H1:** distinct per page. Don't fall back to the "[Service] stylist, based in Surrey." pattern — it makes pages feel near-identical to both crawlers and humans.
- **Hero sub-copy (the paragraph below the H1):** also distinct per page, ideally with a different opening word from the H1.
- **URLs:** Netlify serves trailing-slash URLs (`/childrens-parties/`). Keep canonicals consistent with that.

**Banned / capped vocabulary** (applies to titles, metas, H1s and hero sub-copy):

- "Bespoke" — banned from all titles. Max once per meta description.
- "Luxury" — max twice across all page titles site-wide.
- "From £460" — appears in a maximum of 6 page metas site-wide.
- Banned filler phrases (never use): "If you're looking for…", "Look no further…", "We pride ourselves on…", "Our team of experts…", "the perfect party".

**Uniqueness rule — applies to titles, metas, H1s, hero sub-copy and image alt text.** Before writing new copy for a page, skim existing pages and make sure the first ~5 words of the new draft don't echo any other page. This protects against duplicate-content signals and keeps the writing feeling considered rather than templated.

## Location pages

Location data lives in `src/data/locations/<slug>.tsx` and is built via the `makeLocation()` helper in `_makeLocation.tsx`. Each location must have a unique `uniqueSeoTitle`, `uniqueSeoDescription`, `uniqueHeroSub` and `uniqueWhatWeDoBody`. Location pages are the highest collision risk — there are 20+ of them and they share structure, so the copy has to work harder to feel distinct.

**Local prose section rules:**

- 200 words max per location's prose section.
- Town name appears max 3 times in the prose section, and 8–10 times max across the whole page body (including nav, hero, headings, FAQs).
- Each paragraph contains exactly **one** real local entity (a venue, a road, a postcode, a landmark) — never two or three stacked together.
- No sentence may match a sentence on another location page. Reword, don't copy-paste with the town name swapped.

## Images

- **Format: WebP.** Compress and convert before committing. JPG/PNG only for original/source assets that haven't been processed yet.
- **Focal point matters.** When an image will be cropped or scaled (hero strips, gallery tiles, OG cards), the core subject must stay centred in the frame at every breakpoint. Analyse the image first, then choose `object-position` / aspect ratio so a downscaled or square crop still leads with the subject.
- **One image = one filename + one alt text.** The rule is per *image file*, not per *placement*. Each unique image gets a content-descriptive filename (`cobham-balloon-arch-pastel.webp`, `safari-second-birthday-cake-table.webp`) and one alt string that describes what's in the photo. No two different image files in the project may share a filename. It's fine for the same file to be referenced from many pages — that's still one filename, one alt.
- **Alt text describes what's actually in the image** — not the page topic, and never the brand name (the brand is already in `<title>` and JSON-LD). Two different image files shouldn't open their alt text with the same 5 words. Bad: "Children's party styling in Surrey by River Fox Events…" repeated across multiple files. Good: each alt opens with what makes that specific photo specific (the cake table, the balloon installation, the venue, the colour palette).
- **Per-page OG images.** The global fallback is `public/social-share.jpg`; journal articles and key pages should override with `ogImage` in `routes.ts` pointing to a per-page `.webp` in `public/og/`.

**Compression & loading targets:**

- Hero images < 500 KB, gallery images < 200 KB, thumbnails < 100 KB.
- Lossy WebP at quality 75–85.
- `srcset` with at least 3 sizes so smaller viewports don't pull the desktop file.
- Below-fold images use `loading="lazy"`. The hero uses `loading="eager"` with `fetchpriority="high"`.
- **Alt text: max 125 characters per image.**

## Schema (JSON-LD)

Every page must ship valid JSON-LD covering the schema types relevant to it: `LocalBusiness` and `Organization` site-wide, `Service` on each service line (children's parties, milestones, corporate), `FAQPage` wherever an FAQ block is present, `BreadcrumbList` on any non-home page, and `Review` / `AggregateRating` once real reviews are wired in (don't fabricate). The shared business + service blocks are emitted by `scripts/postbuild.mjs` from `src/seo/routes.ts` — extend that file rather than hand-writing JSON-LD into individual templates.

**Validate before deploying any new page or schema change** against [Google's Rich Results Test](https://search.google.com/test/rich-results) and the [Schema Markup Validator](https://validator.schema.org/). Fix every error and warning before merging.

## Conventions

### "Start planning" / Enquire CTAs

The Enquire form (`<section id="enquire">`) only renders on a few pages — Index, Children's Parties, Milestones, Corporate & Brand, location pages. Other pages (Journal, articles, 404, Welcome, Contact) reuse the shared Nav and Footer, which both link to the enquire section.

**Always route Start planning / Enquire CTAs through `handleEnquireClick` from `@/lib/enquire`**, with `href={ENQUIRE_HREF}` (`/#enquire`):

```tsx
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

<a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent">
  Start planning <span>→</span>
</a>
```

The handler smooth-scrolls to `#enquire` when it's on the current page, and otherwise navigates to `/#enquire` so the home page enquire form gets focus. Bare `<a href="#enquire">` looks fine on home but is silently broken on every page that doesn't render the Enquire section — don't use it.

## Maintenance & change process

Two kinds of copy live in two different places, and the update path differs:

1. **SEO copy (titles, metas) lives in `src/seo/routes.ts`.** Edit that file, then `npm run build` regenerates `dist/*/index.html` automatically. Never hand-edit `dist/`.
2. **Body copy and alt text live in components and data files** (`src/data/locations/*.tsx`, page components, `src/data/articles/`). Editing these triggers a Netlify rebuild on push; HTML always reflects source.

**Whenever body copy changes, or an image is swapped, also check:**

- Does the page's meta description still accurately summarise the body?
- Does the H1 still pair with the new hero copy?
- If an image was replaced, has its alt text been rewritten to describe the *new* image — not just left over from the old one?
- If the page's topic shifted, does its title still front-load the right keyword?
- If a page or schema type was added, run [Google's Rich Results Test](https://search.google.com/test/rich-results) before merging.

Run `npm run build` locally and spot-check `dist/<slug>/index.html` before pushing. Push to `main` deploys to Netlify automatically — there's no manual deploy step, so a broken push goes live.

## Journal articles

When writing, editing, or reviewing any article in `src/data/articles/`, read **`src/data/articles/AUTHORING.md`** first — it defines Laura's voice, the aesthetic gate (auto-reject vs discouraged vs auto-include), the article structure (TL;DR → prose → pull quote → "Why I love this part" → `— Laura` sign-off), image specs, and the SEO package required.

For weekly cadence and the competitor-research workflow, see **`src/data/articles/WEEKLY-BRIEF.md`**.

## Brand & business

- Brand: **River Fox Events** (formerly Lollipop Balloons). The `alternateName` is preserved in JSON-LD so historic links / brand searches flow through.
- Real contact: `07872 114191`, `riverfoxevents@gmail.com`, IG `@lollipop_balloonsx` (the rebrand `@riverfoxevents` handle isn't live yet, so all IG links point at the historic Lollipop Balloons account — don't "correct" them back). **Never** `hello@riverfoxevents.co.uk` — that address doesn't exist.
- Studio: 15 Apsley Rd, Horley, RH6 9RX.
- Pricing anchor: events from £460. Use this number consistently.
- Tone: calm, considered, design-led. Never punchy/salesy. Em dashes are fine, exclamation marks aren't.

## Working with Matt

- Explain what's happening as you go. Don't run silent for several tool calls — Matt is non-technical and reads the running narration to follow what you're doing.
- Confirm before destructive or shared-state actions (deleting files, force pushes, sending emails, changing DNS). One-time approval doesn't carry to next time.
- When updating SEO copy across multiple pages, present the proposed values in a table for review **before** writing any code. Matt wants to decide before edits land.

## Useful one-liners

```bash
# Quick title/meta/H1 audit on the live site
for p in / /childrens-parties/ /milestone-celebrations/ /corporate-brand-styling/; do
  curl -sL "https://riverfoxevents.co.uk$p" | \
    grep -iE '<title>|<meta name="description"' | head -2
  echo
done

# Local build + verify dist HTML matches expectations
npm run build && grep -h '<title>' dist/index.html dist/*/index.html
```
