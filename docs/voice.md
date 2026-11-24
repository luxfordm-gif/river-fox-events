# River Fox voice rules

**This is the only place the voice rules are written** (Matt, 2026-11-24). `CLAUDE.md`, the `river-fox` skill and the journal guide (`src/data/articles/AUTHORING.md`) point here instead of repeating them. Change a voice rule here and nowhere else.

What lives where: the repo owns the website's design and these voice rules. The look of social and print (covers, posts, review cards, video text, safe areas, posters) lives only in the "River Fox Brand Pack" artifact (`https://claude.ai/artifact/RyuZawfyZziQPy6xGJ5hhF`), which is also the brand book. There is no brand PDF to read.

## 1. Which voice where

| Where | Voice |
|---|---|
| Website, Google Ads, and any text designed onto an image or video (covers, headlines, closing text, review card labels) | **The calm voice** (sections 2 to 4). No exclamation marks, no emojis, none of the banned words. |
| Google Business posts | **Halfway.** A little more playful than the website, not as full-on as her social feed: warm and friendly, first person, at most one exclamation mark, at most one emoji (or none), no drawn-out words, a clear ask and the page link. |
| Instagram and Facebook captions | **Laura's own social voice, playful** (section 5). Emojis, an exclamation mark or two, "stunning" and "wow" allowed: they are her words. |

Text designed onto images and video stays in the calm voice on every channel, even when the caption under it is playful. No casual or lowbrow phrasing on it ("Your door's sorted" was rejected; the finale line became "Christmas has arrived.", Matt 2026-11-21): no slang (sorted, nailed it, banging).

## 2. Laura's voice, seven rules

1. First person, "I" not "we". Laura speaks as the designer. Fixed labels like "See our work" are the only exception, plus genuine business-voice pieces such as the rebrand announcement.
2. Warm and flowing full sentences, not clipped. A short sentence is fine for rhythm, but the fragmentary style ("Beautiful bones, very little atmosphere.") is the cool, detached tone Laura asked to move away from (mid-2026).
3. Start with the host's worry and answer it ("Many parents assume they need to hire a venue, but…").
4. Name the real thing ("pink scallop-edge plates, a soft zebra-print salad plate on top"). Warmth never replaces detail: carry both. No generic filler ("truly unforgettable", "bringing the magic to life") with nothing concrete underneath.
5. Plain words first; explain any trade term. Sightlines, scale, the brief, sourcing, install morning and render board are welcome, lightly, glossed so a non-trade reader follows.
6. Hyphens, not em dashes.
7. Explain why, don't sell. Quiet expertise, gently shared; reassure rather than sell.

Overall tone: calm, considered, thoughtfully styled. Never punchy or salesy. Warmth is welcome: "celebrations that feel personal", "I'd love to hear from you", "truly unique to each family", "it's always a privilege", "I always want to reassure parents that…", provided real, specific detail sits underneath.

Laura styles and decorates; she doesn't plan parties. Never describe her service with "planner" or "planning" wording (search-led titles under test are the SEO exception, see `CLAUDE.md`). Never describe her as a florist.

## 3. Punctuation and form

- **Em dashes (—) are banned** (Laura, 2026-05-21). Use a hyphen (-). The whole `src/` tree was converted that day; don't reintroduce them.
- **No exclamation marks and no emojis** in the calm voice. Laura's own drafts sometimes use them; strip them from website copy.
- **Curly quote marks and apostrophes (’ “ ”), never straight ones** (Matt, 2026-11-21) in every piece of text set onto an image or video and in written captions and the Copy doc. The review tool converts them itself.
- **Bullet points start with a capital letter** (sentence case), even after a lead-in ending in a colon ("A shimmer wall from me can include:" then "A balloon garland…") (Matt, 2026-11-09). `src/test/sentence-case-bullets.test.ts` enforces it on the website.

## 4. Banned and replaced words

Apply to the calm voice everywhere: body copy, hero copy, SEO metas, alt text, FAQs, town pages, Google Ads and text on images and video.

- **Praise words, never:** "stunning", "amazing", "wow factor", "show-stopping".
- **Filler phrases, never:** "If you're looking for…", "Look no further…", "We pride ourselves on…", "Our team of experts…", "the perfect party".
- **Character themes:** never "IP", "licensed", "unlicensed", "licensing", or any framing that contrasts a custom-built prop with a "licensed" one. Name the theme ("a Wonka party"); custom props are "painted in-studio" or "built in-studio".
- **"Design-led" is banned** (too industry). Use "thoughtfully styled" in body copy and "bespoke" in SEO metas (Laura, 2026-05-21).
- **"From scratch" is banned.** Use "individually designed".
- **"Elevated":** as little as possible, never as the headline word.
- **"Bespoke"** is Laura's own word and free in body copy. Its limits in titles and metas are SEO rules, in `CLAUDE.md`.

**Client review quotes are exempt.** They are the client's words: shown word for word on the website, even when they say "stunning" or "amazing". On review images, clear spelling and grammar slips are fixed but nothing is reworded (the `river-fox` skill's Review cards section has the check).

## 5. Instagram and Facebook captions

Laura's own voice, from all 324 of her Instagram posts (Matt, 2026-11-21). In her last year (123 posts): 93% use emojis (about 2 to 3 a post), 72% use an exclamation mark (about 1 to 2), captions about 450 characters.

- Shape: a short playful hook with an emoji ("Today's doorway", "It's tiiiiime!!", "For my next trick...."), two or three warm sentences about what she made and why, a plain ask ("DM me a photo of your doorway together with your postcode"), often a note on how few dates are left, then the hashtags.
- Favourite words: love, little, beautiful, perfect, magic. "Stunning" and "wow" are allowed here.
- Mostly "I"; keep "I".
- Facebook carries the same captions as Instagram, so one caption serves both; the Facebook version says "message me" instead of "DM me" and may add the website link.
- Never on any channel: florist or planner words, the old business name. (Hashtags are not a voice rule: they come only from the Hashtag bank sheet.)
- Read her recent captions before writing new ones, and match how she writes. Laura's own copy stays as she wrote it.

Caption layout (line breaks) and hashtags are part of the Brand Pack's "Captions and hashtags" board and the Hashtag bank sheet, not this file.
