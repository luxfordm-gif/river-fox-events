import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const TOOL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REPO = path.resolve(TOOL, '..', '..');
export const ASSETS = path.join(REPO, 'src', 'assets');
export const STATE = path.join(TOOL, 'state');

/** Read KEY=value lines without loading everything into process.env (the Invicta .env has its own caps). */
function readEnv(file) {
  if (!fs.existsSync(file)) return {};
  const out = {};
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}
const local = readEnv(path.join(TOOL, '.env'));
// The API key is shared with the Invicta photo editor, so nothing needs setting up on this machine.
const invicta = readEnv(path.join(os.homedir(), 'Projects', 'invicta-photo-editor', '.env'));
const env = (k, d) => process.env[k] || local[k] || d;

export const config = {
  openaiKey: process.env.OPENAI_API_KEY || local.OPENAI_API_KEY || invicta.OPENAI_API_KEY || '',
  model: env('OPENAI_IMAGE_MODEL', 'gpt-image-2.5-sunburst'),
  quality: env('OPENAI_IMAGE_QUALITY', 'high'),
  maxSpendUsd: Number(env('MAX_SPEND_USD', 8)),
  concurrency: Number(env('CONCURRENCY', 3)),
  maxRetries: Number(env('MAX_RETRIES', 3)),
  webpQuality: Number(env('WEBP_QUALITY', 82)),
  // the API accepts any WxH in multiples of 16 up to ~3.7 MP without going "experimental"
  maxPixels: 3_600_000,
  minPixels: 655_360,
};

// One shared finish, so every photo on the site looks like it came from the same shoot.
const HOUSE_LOOK = `House look (the whole website shares it, so match it closely): high-end editorial event photography, like a styling feature in a wedding or interiors magazine.
- Bright and airy: mid-tones sit light, the room or street feels full of soft daylight. Shadows are open and detailed, never murky or crushed; highlights are bright but not blown.
- Clean, true whites: white walls, boards and tablecloths read as clean soft white, with a neutral-to-very-slightly-warm daylight balance. No orange, yellow, green, blue or grey cast.
- Soft, natural contrast and true, rich colour: balloons and florals look vivid and accurate but never neon or oversaturated.
- Crisp, professional-camera detail on the styling (balloons, lettering, florals, foliage, tableware), with real texture kept. Any background blur that is already in the photo stays as it is.`;

export const PROMPTS = {
  // the default: weak exposure, colour casts, soft focus
  grade: `Retouch this event-styling photo for the River Fox Events website. It must remain the same real photograph: same framing, same moment, same direction of light.
${HOUSE_LOOK}
Correct exposure and white balance to reach that look: lift murky shadows, recover highlights, neutralise colour casts from indoor lighting or grey weather. If it was shot on a dull, grey day, make it look like a bright, softly overcast day with clean even light; do not add sunshine, blue sky, sun flares or shadows that were not there.
Make the styling crisp and in focus, and remove noise and compression blockiness. No HDR look, no halos, no glow, no plastic or airbrushed surfaces.
Keep every balloon, prop, sign, flower, plate and piece of furniture exactly where it is and exactly its colour. The balloon and decor colours are the client's chosen palette: do not change their hue.
Reproduce all lettering, names and numbers exactly as photographed. Do not rewrite, add or remove any text.
If there are people, keep their faces, expressions and bodies exactly as they are.
Do not add, remove, move or invent anything. Do not change the venue, the buildings, the windows, the sky or the background. No added text, logos or watermarks.`,
  // for photos that already look good: a light polish towards the house look
  gentle: `Lightly finish this event-styling photo for the River Fox Events website. It already looks good, so it must look like the same photograph with only a subtle professional polish.
${HOUSE_LOOK}
Move it only a little towards that look: correct any slight colour cast, keep the exposure and mood close to the original. Remove noise and compression blockiness and give clean, natural sharpness to the styling. No HDR look, no halos, no extra contrast; keep real texture.
Keep every balloon, prop, sign, flower and piece of furniture exactly where it is and exactly its colour. Reproduce all lettering, names and numbers exactly as photographed. If there are people, keep their faces exactly as they are.
Do not add, remove, move or invent anything. No added text, logos or watermarks.`,
};

// Until the gallery PR is merged, the photo list and files can be read from its branch: SOURCE_REF=origin/<branch>
const SOURCE_REF = env('SOURCE_REF', '');
function readRepoFile(rel) {
  const abs = path.join(REPO, rel);
  if (fs.existsSync(abs)) return fs.readFileSync(abs);
  if (!SOURCE_REF) throw new Error(`Missing ${rel} (merge the gallery PR, or set SOURCE_REF=origin/<branch>)`);
  return execFileSync('git', ['show', `${SOURCE_REF}:${rel}`], { cwd: REPO, maxBuffer: 64 << 20 });
}
export const readSource = (src) => readRepoFile(`src/assets/${src}`);

/**
 * The photos are every `source:` in src/data/gallery.ts (what /our-work/ shows).
 * photos.json only holds the exceptions: { trial: [names], photos: { "<name>": { preset, note, skip } } },
 * keyed by file name without folder or extension (the same key scripts/gallery-images.mjs uses).
 */
export const keyOf = (src) => path.basename(src, path.extname(src));
export function loadPhotos() {
  const data = readRepoFile('src/data/gallery.ts').toString('utf8');
  const sources = [...new Set([...data.matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1]))];
  const over = JSON.parse(fs.readFileSync(path.join(TOOL, 'photos.json'), 'utf8'));
  // `extra`: photos elsewhere on the site (e.g. the Christmas page) that can be graded and reviewed;
  // `apply` only rebuilds the gallery, so these never reach a page by accident.
  const extra = (over.extra || []).filter((src) => !sources.includes(src));
  const photos = [...sources.map((src) => ({ src, gallery: true })), ...extra.map((src) => ({ src, gallery: false }))]
    .map((p) => ({ ...p, key: keyOf(p.src), ...(over.photos?.[keyOf(p.src)] || {}) }));
  return { photos, trial: over.trial || [] };
}
export function promptFor(photo) {
  const base = PROMPTS[photo.preset || 'grade'];
  if (!base) throw new Error(`Unknown preset "${photo.preset}" for ${photo.key}`);
  return photo.note ? `${base}\nSpecific to this photo: ${photo.note.trim()}` : base;
}
