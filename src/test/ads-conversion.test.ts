// @vitest-environment-options {"url": "https://riverfoxevents.co.uk/contact/"}
import { beforeEach, expect, it, vi } from "vitest";
import { ADS_CONVERSION, CONSENT_KEY, trackFormSent } from "@/lib/track";

/* The Google Ads conversion only counts on the live site (track.ts), so this
   file runs as if the page were riverfoxevents.co.uk. */

const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
});

const form = (spam = "") => {
  document.body.innerHTML = `<form name="contact">
    <input type="hidden" name="form-name" value="contact" />
    <input name="bot-field" value="${spam}" /></form>`;
  return document.querySelector("form")!;
};

let gtag: ReturnType<typeof vi.fn>;
beforeEach(() => {
  store.clear();
  gtag = vi.fn();
  window.gtag = gtag;
});

it("fires on the live site after a send, with or without Accept", () => {
  expect(window.location.hostname).toBe("riverfoxevents.co.uk");
  trackFormSent(form());
  // Without Accept only the conversion goes (Consent Mode makes it cookieless).
  expect(gtag.mock.calls).toEqual([["event", "conversion", { send_to: ADS_CONVERSION }]]);

  gtag.mockClear();
  localStorage.setItem(CONSENT_KEY, "granted");
  trackFormSent(form());
  expect(gtag.mock.calls.map((c) => c[1])).toEqual(["conversion", "generate_lead"]);
});

it("doesn't fire for a spam bot", () => {
  trackFormSent(form("spam"));
  expect(gtag).not.toHaveBeenCalled();
});
