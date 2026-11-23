# Images, conventions and journal articles

Moved word for word from CLAUDE.md on 2026-11-23 so CLAUDE.md stays short. Read this before working on anything it covers. Add new detail here, not in CLAUDE.md.

## Images

- **Format: WebP.** Compress and convert before committing. JPG/PNG only for original/source assets that haven't been processed yet.
- **Focal point matters.** When an image will be cropped or scaled (hero strips, gallery tiles, OG cards), the core subject must stay centred in the frame at every breakpoint. Analyse the image first, then choose `object-position` / aspect ratio so a downscaled or square crop still leads with the subject.
- **One image = one filename + one alt text.** The rule is per *image file*, not per *placement*. Each unique image gets a content-descriptive filename (`cobham-balloon-arch-pastel.webp`, `safari-second-birthday-cake-table.webp`) and one alt string that describes what's in the photo. No two different image files in the project may share a filename. It's fine for the same file to be referenced from many pages — that's still one filename, one alt.
- **Real events only** (brand book v2). Every photo on the site and social is a real event Laura styled, in the house grade (bright and airy: clean whites, open shadows, accurate colour; no heavy filters, orange skin or crushed blacks). Lead with what she supplies (balloons, backdrops, signage, light-up numbers, plinths, props); faux stems are texture, never the subject. AI-generated images are a last resort for journal articles only, never for the gallery, service pages or social, and never passed off as a real event. The graded set is in Google Drive › River Fox Events › Photos › Website photos (colour graded), in `01 Children's parties`, `02 Milestones`, `03 Corporate & brand` and `04 Christmas`.
- **Alt text describes what's actually in the image** — not the page topic, and never the brand name (the brand is already in `<title>` and JSON-LD). Two different image files shouldn't open their alt text with the same 5 words. Bad: "Children's party styling in Surrey by River Fox Events…" repeated across multiple files. Good: each alt opens with what makes that specific photo specific (the cake table, the balloon installation, the venue, the colour palette).
- **Never use `rishi-summer-party-bright-balloon-backdrop.webp`** (Rishi's Summer Party, turquoise/coral/lemon balloons with beach balls). Matt dislikes it (2026-11-08). Don't pick it for any new placement, strip, tile or OG image.
- **Favicon (Matt, 2026-11-14):** the RF monogram letters (no ring) in logo brown `#5D554B` on a logo pink `#F7EEE9` square, matching the Instagram "Highlight - RF monogram" cover. Files in `public/`: `favicon.svg`, `favicon.ico` (16/32/48), `apple-touch-icon.png` (180), `icon-192.png`. Letters come from Drive › Logo › Monogram.svg; they fill ~70% of the square's height so they sit inside Google's circular crop. Never the old grey version.
- **Per-page OG images.** The global fallback is `public/social-share.jpg`; journal articles and key pages should override with `ogImage` in `routes.ts` pointing to a per-page `.webp` in `public/og/`.
- **Where Laura's photos are.** About 370 of her photos are in `src/assets/` with one alt each in `src/data/gallery.ts`; reuse those (and their alt) first. Her Instagram (`@riverfox_events`, 554 posts in Nov 2026) is not fully mirrored: only 15 Christmas door photos are saved, in `src/assets/christmas/instagram/`. If a piece needs a post that isn't stored, name it and ask Matt to save it. The repo has no pastel balloon wall photo yet (the only one is a Halloween wall, off house style).

**Photo tool (`tools/photo-grade/`, 2026-11-14).** Grades Laura's photos with OpenAI's image model in the house look, checks every result against the original, and exports them at a named size (`npm run export -- --for=...`, sizes taken from the Drive documents in "Social, overlay and brand rules"). Photos that aren't on the site go in its git-ignored `state/inbox/`. Its README is the reference. One Claude Code skill drives it: `river-fox`, in `.claude/skills/river-fox/` (photos, video, captions, Google Business, filing). Its other tools are in `tools/river-fox/`. Never ask the model to crop, reframe or "boost" a second time (it redraws the whole image); crops and brightness are done locally by `export`.

**Compression & loading targets:**

- Hero images < 500 KB, gallery images < 200 KB, thumbnails < 100 KB.
- Lossy WebP at quality 75–85.
- `srcset` with at least 3 sizes so smaller viewports don't pull the desktop file.
- Below-fold images use `loading="lazy"`. The hero uses `loading="eager"` with `fetchpriority="high"`.
- **Alt text: max 125 characters per image.**

## Conventions

### "Reserve your date" / Enquire CTAs

The hero and article button label is **"Reserve your date"** (was "Start planning", then "Check your date"; changed to "Reserve your date" on 2026-11-03). Laura styles and decorates, she doesn't plan parties, and the enquire form leads with the event date. Don't use "planner" / "planning" wording to describe her service. The nav button reads **"Enquire now"** on every page.

**Exception: Christmas Door Garlands** (`src/pages/ChristmasDoorways.tsx`) labels its main hero button **"Enquire now"** (Matt, 2026-11-04). On phones only (below `md`) a second ghost button **"WhatsApp Laura now"** sits under it, opening WhatsApp with a pre-filled quote message (Matt, 2026-11-06). The old "Watch our ad" hero button was removed on 2026-11-06 - the films live in the "Watch the Christmas campaign." section. Don't change it back to "Reserve your date". Every enquire link on this page (hero, garland options, nav) uses `href="#enquire"` (the nav via `<Nav enquireHref="#enquire" />`) so none points at the home page form.

The Enquire form (`<section id="enquire">`) only renders on a few pages — Index, Children's Parties, Milestones, Corporate & Brand, location pages, and Christmas Door Garlands (which has its own booking form with the same id). Other pages (Journal, articles, 404, Welcome, Contact) reuse the shared Nav and Footer, which both link to the enquire section.

**Always route Reserve your date / Enquire CTAs through `handleEnquireClick` from `@/lib/enquire`**, with `href={ENQUIRE_HREF}` (`/#enquire`):

```tsx
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";

<a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent">
  Reserve your date <span>→</span>
</a>
```

The handler smooth-scrolls to `#enquire` when it's on the current page, and otherwise navigates to `/#enquire` so the home page enquire form gets focus. Bare `<a href="#enquire">` looks fine on home but is silently broken on every page that doesn't render the Enquire section — don't use it.

## Journal articles

When writing, editing, or reviewing any article in `src/data/articles/`, read **`src/data/articles/AUTHORING.md`** first — it defines Laura's voice, the aesthetic gate (auto-reject vs discouraged vs auto-include), the article structure (TL;DR → prose → pull quote → "Why I love this part" → `— Laura` sign-off), image specs, and the SEO package required.

For the competitor-research workflow when starting a new article, see **`src/data/articles/NEW-ARTICLE.md`**.

**Scheduled articles (2026-11-09).** An article can be dated in the future: set its `publishedAt` in `src/data/articles/index.tsx` **and** the same date as `publishAt` on its route in `routes.ts` (`src/test/scheduled-articles.test.ts` fails if they differ). Netlify production builds leave it out of its page, the journal list, related links and the sitemap until that date (UK time); deploy previews and local builds show everything, so Matt can read drafts. `.github/workflows/publish-scheduled-articles.yml` pushes an empty commit to `main` at 06:15 UTC on any day an article is due, which makes Netlify rebuild. Keep the articles array in date order (newest first): the journal lists them in array order, not by date. Aim for about one article a week.
