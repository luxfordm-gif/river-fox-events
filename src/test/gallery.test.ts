import { describe, expect, it } from "vitest";
import { GALLERY, resolvePhoto } from "@/data/gallery";

const photos = GALLERY.flatMap((s) => s.events.flatMap((e) => e.photos));

describe("Our work gallery data", () => {
  it("every photo has its gallery copies (run node scripts/gallery-images.mjs if not)", () => {
    for (const p of photos) {
      const r = resolvePhoto(p);
      expect(r.srcSet, p.source).toMatch(/\d+w/);
      expect(r.width, p.source).toBeGreaterThan(0);
    }
  });

  it("uses each image file once, with one alt", () => {
    const seen = new Map<string, string>();
    for (const p of photos) {
      expect(seen.has(p.source), `${p.source} appears twice`).toBe(false);
      seen.set(p.source, p.alt);
    }
  });

  it("every event has 1-3 photos and a caption", () => {
    for (const s of GALLERY) {
      for (const e of s.events) {
        expect(e.title.trim().length, s.id).toBeGreaterThan(0);
        expect(e.photos.length, e.title).toBeGreaterThanOrEqual(1);
        expect(e.photos.length, e.title).toBeLessThanOrEqual(3);
      }
    }
  });

  it("keeps to Laura's copy rules (no em dashes, no exclamation marks)", () => {
    const text = GALLERY.flatMap((s) => [
      s.label, s.titleLead, s.titleAccent, s.link.label,
      ...s.events.flatMap((e) => [e.title, e.place ?? "", ...e.photos.map((p) => p.alt)]),
    ]);
    for (const t of text) {
      expect(t, t).not.toMatch(/[—!]/);
    }
  });
});
