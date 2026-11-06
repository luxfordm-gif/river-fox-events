import OpenAI, { toFile } from 'openai';
import { config } from './config.mjs';
import { costFromUsage } from './cost.mjs';

let client;
function openai() {
  if (!config.openaiKey) throw new Error('No OPENAI_API_KEY found (tools/photo-grade/.env or ~/Projects/invicta-photo-editor/.env).');
  if (!client) client = new OpenAI({ apiKey: config.openaiKey, maxRetries: 0, timeout: 300_000 });
  return client;
}

/** One edit call at an explicit WxH. Returns { png, usage, costUsd, ms }. */
export async function editImage(pngBuffer, name, prompt, size) {
  const t0 = Date.now();
  const params = {
    model: config.model,
    image: await toFile(pngBuffer, name.replace(/\.[^.]+$/, '') + '.png', { type: 'image/png' }),
    prompt,
    n: 1,
    size,
    quality: config.quality,
    output_format: 'png',
    background: 'opaque',
  };
  if (/^gpt-image-1(\.5)?$/.test(config.model)) params.input_fidelity = 'high';
  const res = await openai().images.edit(params);
  const b64 = res.data?.[0]?.b64_json;
  if (!b64) throw new Error('No image data in response');
  return { png: Buffer.from(b64, 'base64'), usage: res.usage || null, costUsd: costFromUsage(config.model, res.usage), ms: Date.now() - t0 };
}

export function isTransient(e) {
  if (/no credits|insufficient_quota|billing|exceeded your current quota/i.test(e?.message || '')) return false;
  const s = Number(e?.status ?? e?.code);
  return [408, 409, 429, 500, 502, 503, 504].includes(s) || /ECONNRESET|ETIMEDOUT|timeout|socket hang up|fetch failed/i.test(e?.message || '');
}
