# River Fox Events website

The code for riverfoxevents.co.uk. Anything merged into `main` on GitHub goes live on Netlify automatically.

## What's in this folder

**The website itself**

| Folder | What it holds |
| --- | --- |
| `src/` | The site: pages, sections, copy, Laura's photos (`src/assets/`) and the automatic checks (`src/test/`) |
| `public/` | Files served exactly as they are: the brand book PDFs, social share images, redirects |
| `scripts/` | The steps that run after a build: page titles, sitemap, redirects, link checker |
| `tools/photo-grade/` | Matt's photo grading tool (has its own README) |
| `.github/` | Scheduled jobs on GitHub (publishing dated articles, the Christmas switch-back) |

**Settings files at the top level.** These have to sit at the top of the folder, because each tool looks for its own file there. Leave them where they are.

| File | Used by |
| --- | --- |
| `package.json`, `package-lock.json` | The list of tools and add-ons the site needs |
| `index.html` | The page shell every page is built into |
| `vite.config.ts` | Vite, which builds the site |
| `tailwind.config.ts`, `postcss.config.js` | The styling setup |
| `tsconfig*.json` | TypeScript (three files is the standard Vite setup) |
| `eslint.config.js` | The code tidiness checker |
| `vitest.config.ts` | The automatic checks |
| `components.json` | shadcn/ui, only used when adding a new ready-made component |
| `netlify.toml` | Netlify's build settings |
| `CLAUDE.md` | The project rules Claude follows (brand, copy, design system, SEO) |

**Made by the computer, safe to ignore**

| Folder | What it is |
| --- | --- |
| `node_modules/` | Downloaded add-ons. Rebuilt with `npm ci` |
| `dist/` | The finished site after a build. Rebuilt with `npm run build` |
| `.claude/` | Claude's settings and its working copies for each session |
| `.git/` | Git's history of every change |

**`archive/`** (on your Mac only, never uploaded): old files that aren't part of the site any more. Nothing reads from it, so anything in it can be deleted or moved back.

## Working on it

- `npm run dev` shows the site locally while you edit.
- `npm test` runs the automatic checks.
- `npm run build`, then `npm run check:links`, builds the site and checks every link before it goes live.
