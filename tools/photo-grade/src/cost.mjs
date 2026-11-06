// Cost model. Verified against developers.openai.com/api/docs/pricing on 2026-10-12.
// Per-token rates (USD per 1M tokens) for the Images API. Cached-input rates only apply to the Responses API, so ignored.
export const TOKEN_RATES = {
  'gpt-image-2.5-sunburst': { imageIn: 8, textIn: 5, imageOut: 30 },
  'gpt-image-2.5-flare':    { imageIn: 8, textIn: 5, imageOut: 30 },
  'gpt-image-2':            { imageIn: 8, textIn: 5, imageOut: 30 },
  'gpt-image-1.5':          { imageIn: 8, textIn: 5, imageOut: 32 },
  'gpt-image-1':            { imageIn: 10, textIn: 5, imageOut: 40 },
  'gpt-image-1-mini':       { imageIn: 2.5, textIn: 2, imageOut: 8 },
};
// Published legacy per-image OUTPUT prices (USD) — used only as a pre-call estimate when usage is unknown.
export const LEGACY_PER_IMAGE = {
  'gpt-image-2':   { low: 0.005, medium: 0.041, high: 0.165 },
  'gpt-image-1.5': { low: 0.013, medium: 0.05, high: 0.2 },
  'gpt-image-1':   { low: 0.016, medium: 0.063, high: 0.25 },
  'gpt-image-1-mini': { low: 0.006, medium: 0.015, high: 0.052 },
};

export function ratesFor(model) {
  const base = model.replace(/-\d{4}-\d{2}-\d{2}$/, '');
  return TOKEN_RATES[base] || TOKEN_RATES['gpt-image-2.5-sunburst'];
}

/** Cost from the usage block returned by the API. */
export function costFromUsage(model, usage) {
  if (!usage) return null;
  const r = ratesFor(model);
  const imgIn = usage.input_tokens_details?.image_tokens ?? 0;
  const txtIn = usage.input_tokens_details?.text_tokens ?? Math.max(0, (usage.input_tokens ?? 0) - imgIn);
  const out = usage.output_tokens ?? 0;
  return Number(((imgIn * r.imageIn + txtIn * r.textIn + out * r.imageOut) / 1e6).toFixed(6));
}

/** Conservative pre-call estimate (used for the spending cap before we know the real usage). */
export function estimateCost(model, quality, size = '1536x1024', observedAvg = null) {
  if (observedAvg) return observedAvg;
  const base = model.replace(/-\d{4}-\d{2}-\d{2}$/, '');
  const legacy = LEGACY_PER_IMAGE[base]?.[quality];
  // Output-only table + ~0.05 for a high-fidelity input image. For 2.5 models (no table) assume gpt-image-2 ×1.5 for xhigh/max.
  if (legacy) return legacy + 0.05;
  const q = { low: 0.005, medium: 0.041, high: 0.165, xhigh: 0.25, max: 0.4, auto: 0.165 }[quality] ?? 0.165;
  const [w, h] = size.split('x').map(Number);
  const scale = Math.max(1, (w * h) / (1536 * 1024));
  return q * scale + 0.05;
}
