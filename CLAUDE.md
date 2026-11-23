# River Fox Events — project conventions

Site for **Laura** at River Fox Events (luxury event styling, Surrey). Live at `riverfoxevents.co.uk`. Matt is non-technical and runs the project — favour pragmatic over pure, walk through changes step by step, never assume tooling familiarity.

## Start here: the Claude Brain (Matt, 2026-11-23)

At the start of a session read two short files in Google Drive > My Drive > Claude Brain: **`how-i-work.md`** (how Matt likes to work) and **`river-fox.md`** (the project's current state: workstreams, decisions, open items). On Matt's Mac the folder is `~/Library/CloudStorage/GoogleDrive-luxfordm@gmail.com/My Drive/Claude Brain/`.

**"Update the brain" means update `river-fox.md` only**, and only the sections that changed. Never create a wrap-up, status or handover file for this project, and never a second brain file (no `brand-rules.md`).

## Read the right doc first

This file is kept short on purpose: it loads into every session. The detail lives in `docs/claude/`, moved there word for word on 2026-11-23. Before working on an area, read its doc. New rules go in the matching doc, not here.

| Working on | Read |
|---|---|
| Brand pack, brand book, social posts, review cards, Laura's voice, business facts, prices | `docs/claude/brand-and-social.md` |
| Titles, metas, H1s, banned words, location pages, schema | `docs/claude/seo.md` |
| Fonts, colours, spacing, corners, shadows, motion, components | `docs/claude/design-system.md` |
| Images and alt text, CTAs and conventions, journal articles | `docs/claude/content-and-images.md` |
| Stack, build, hosting, redirects, analytics, before-you-push checks | `docs/claude/build-and-process.md` |

Social, photo and video jobs follow the `river-fox` skill in `.claude/skills/river-fox/`.

## Always

- Use **npm**, not bun. A push to `main` goes live on Netlify straight away, so run `npm run build` and `npm run check:links` first.
- Titles and metas live only in `src/seo/routes.ts`. Never hand-edit `dist/`.
- No hard-coded font sizes, colours, spacing, corners, shadows, layers or timings: use the tokens in `src/index.css`. The tests fail if you don't.
- Every internal link ends with a trailing slash (a test enforces it).
- Website copy: no em dashes (use hyphens), no exclamation marks, no emojis, Laura writes as "I". Banned words and caps are in `docs/claude/seo.md`.
- Contact details: `07872 114191`, `riverfoxevents@gmail.com`, Instagram `@riverfox_events`. Never `hello@riverfoxevents.co.uk`.

## Working with Matt

- Explain what's happening as you go. Don't run silent for several tool calls — Matt is non-technical and reads the running narration to follow what you're doing.
- **Small social jobs (a review card, a resize): come back with the finished job filed in Drive and say where it is** (Matt, 2026-11-21). Don't stop to offer versions or ask what the notes already answer; make the sensible assumption, say what it was, and finish.
- Confirm before destructive or shared-state actions (deleting files, force pushes, sending emails, changing DNS). One-time approval doesn't carry to next time.
- When updating SEO copy across multiple pages, present the proposed values in a table for review **before** writing any code. Matt wants to decide before edits land.
