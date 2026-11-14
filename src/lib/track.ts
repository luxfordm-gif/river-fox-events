/**
 * Google Analytics events for the whole site (Matt, 2026-11-11; extended in
 * the tracking audit, 2026-11-14).
 *
 * A few listeners on the whole page name what visitors do, so new buttons and
 * forms are covered without wiring each one:
 *
 *   whatsapp_click    any wa.me link
 *   phone_click       any tel: link
 *   email_click       any mailto: link
 *   instagram_click   any instagram.com link
 *   cta_click         any link to the enquiry form (#enquire, /#enquire):
 *                     Reserve your date, Enquire now, article links
 *   nav_click         any other link to a page of this site, in the nav,
 *                     the phone menu or the footer
 *   form_start        first time someone types or picks in a form
 *   form_extras_open  someone opens "Add more details" (once per form)
 *   form_abandon      someone started a form and left the page without
 *                     sending it (best effort: sent as the page is closed)
 *   scroll_depth      25, 50, 75 and 90 percent down the page, once each
 *   generate_lead     a form was sent (trackFormSent, after Netlify says OK)
 *
 * Every event carries page_path and location ("nav", "footer", "hero",
 * "form" or "body"). Clicks add link_text, link_url and section (the
 * section's id or heading, or a block's data-track-location, such as
 * "enquire-thank-you" or "contact-details"); a link can name its own text
 * with data-track-text. Form events add form_name and field names, never
 * what was typed.
 *
 * Privacy: every value passes through scrub(), which replaces email
 * addresses and phone numbers, and link_url never carries a WhatsApp
 * message, an email address or a number. Nothing a visitor types is sent.
 *
 * Consent: every event goes through trackEvent, which sends nothing until
 * the visitor has clicked Accept on the cookie banner (Matt, 2026-11-12).
 * The one exception is the Google Ads conversion in trackFormSent: it is sent
 * either way, and without Accept Consent Mode turns it into a cookieless
 * ping. The Google tag and its consent defaults are set up in index.html and
 * the banner. In development each event is logged to the console.
 */

/** Same key the cookie banner and index.html use for the visitor's choice. */
export const CONSENT_KEY = "rfx-consent";

/** Conversions only count on the live site, never on previews or locally. */
export const LIVE_HOST = "riverfoxevents.co.uk";
export const ADS_CONVERSION = "AW-18210626936/xqXACO264L0cEPi6wOtD";

/** True only once the visitor has clicked Accept on the cookie banner. */
export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

type Params = Record<string, string | number | undefined>;

export type Area = "nav" | "footer" | "hero" | "form" | "body";

const EMAIL = /[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[a-z]{2,}/gi;
const PHONE = /\+?\d[\d\s().-]{6,}\d/g;

/** Replace anything that looks like an email address or phone number. */
export function scrub(value: string): string {
  return value.replace(EMAIL, "email address").replace(PHONE, "phone number");
}

/** Send one GA4 event, only after Accept. Returns whether it was sent. */
export function trackEvent(name: string, params: Params = {}): boolean {
  const withPage: Params = {
    page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...params,
  };
  const clean = Object.fromEntries(
    Object.entries(withPage)
      .filter(([, v]) => v !== undefined && v !== "")
      .map(([k, v]) => [k, typeof v === "string" ? scrub(v).slice(0, 100) : v]),
  );
  const send = hasConsent() && typeof window !== "undefined" && typeof window.gtag === "function";
  if (import.meta.env.DEV) {
    console.log(`[track] ${name}${send ? "" : " (not sent: no consent)"}`, clean);
  }
  if (!send) return false;
  window.gtag!("event", name, clean);
  return true;
}

export type ClickEvent =
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "instagram_click"
  | "cta_click";

/** Which event a link's href belongs to, or null (nav_click is decided by
 *  where the link sits, in classifyLink). */
export function classifyHref(href: string): ClickEvent | null {
  const h = href.trim().toLowerCase();
  if (h.startsWith("tel:")) return "phone_click";
  if (h.startsWith("mailto:")) return "email_click";
  if (/^https?:\/\/(api\.)?(wa\.me|whatsapp\.com)\b/.test(h)) return "whatsapp_click";
  if (/^https?:\/\/(www\.)?instagram\.com\b/.test(h)) return "instagram_click";
  if (h.endsWith("#enquire")) return "cta_click";
  return null;
}

const tidy = (s: string | null | undefined) => (s || "").replace(/[→↗\s]+/g, " ").trim();

/** The page's title block: a section or header that holds the h1. */
const heroOf = (el: Element) => {
  const block = el.closest("section, header");
  return block && block.querySelector("h1") ? block : null;
};

/** Which of the five areas of the page an element sits in. */
export function areaOf(el: Element): Area {
  if (el.closest("footer")) return "footer";
  if (el.closest("nav, [data-track-location='menu']")) return "nav";
  if (el.closest("form, #enquire")) return "form";
  if (heroOf(el)) return "hero";
  return "body";
}

/** The finer place: "nav", "footer", "hero", a block's data-track-location,
 *  a section's id, or failing that its heading. */
export function sectionOf(el: Element): string {
  if (el.closest("footer")) return "footer";
  if (el.closest("nav")) return "nav";
  const marked = el.closest("[data-track-location]");
  if (marked) return marked.getAttribute("data-track-location")!;
  if (heroOf(el)) return "hero";
  const section = el.closest("section");
  if (!section) return "page";
  if (section.id) return section.id;
  const heading = tidy(section.querySelector("h2, h3")?.textContent);
  return heading ? heading.toLowerCase().slice(0, 60) : "page";
}

/** What the visitor tapped: the link's own data-track-text if it has one,
 *  else a photo link sends the photo's description (which Instagram post),
 *  anything else the words on it as seen (not screen-reader extras), falling
 *  back to the full text when it's folded away (a closed FAQ) and then the
 *  link's label. */
function linkText(a: HTMLAnchorElement): string {
  const text =
    a.getAttribute("data-track-text") ||
    a.querySelector("img")?.getAttribute("alt") ||
    tidy(a.innerText) ||
    tidy(a.textContent) ||
    a.getAttribute("aria-label");
  return tidy(text).slice(0, 100);
}

/** Where a link goes, without a WhatsApp message, an email address or a
 *  phone number: "tel:", "mailto:", "https://wa.me/", or a path. */
export function safeUrl(a: HTMLAnchorElement): string {
  const href = (a.getAttribute("href") || "").trim();
  const scheme = /^(tel|mailto|sms):/i.exec(href);
  if (scheme) return `${scheme[1].toLowerCase()}:`;
  try {
    const u = new URL(a.href);
    if (u.origin === window.location.origin) return u.pathname + u.hash;
    if (classifyHref(href) === "whatsapp_click") return `${u.origin}/`;
    return u.origin + u.pathname;
  } catch {
    return "";
  }
}

/** The event for a link, or null for links we don't track. */
export function classifyLink(a: HTMLAnchorElement): ClickEvent | "nav_click" | null {
  const byHref = classifyHref(a.getAttribute("href") || "");
  if (byHref) return byHref;
  const area = areaOf(a);
  if ((area === "nav" || area === "footer") && a.origin === window.location.origin) return "nav_click";
  return null;
}

/* ---------- Forms ---------- */

type FormState = { fields: Set<string>; last: string; extras: boolean };
const started = new Map<HTMLFormElement, FormState>();
const finished = new WeakSet<HTMLFormElement>();

/** The visible lead form an element belongs to (not Netlify's hidden copies). */
function formOf(el: Element | null): HTMLFormElement | null {
  const form = el?.closest?.("form[name]") as HTMLFormElement | null;
  return form && !form.hidden ? form : null;
}

function formName(form: HTMLFormElement): string {
  const hidden = form.querySelector<HTMLInputElement>('input[name="form-name"]');
  return hidden?.value || form.getAttribute("name") || "unknown";
}

/** Form events share these: the form's name and where it is. */
const formParams = (form: HTMLFormElement): Params => ({
  form_name: formName(form),
  location: "form",
  section: sectionOf(form),
});

function onFieldInput(e: Event) {
  const field = e.target as HTMLInputElement | null;
  const form = formOf(field);
  if (!form || !field?.name || field.name === "bot-field" || field.type === "hidden") return;
  const state = started.get(form) ?? { fields: new Set<string>(), last: "", extras: false };
  started.set(form, state);
  if (state.fields.size === 0) {
    // The field's name ("date", "postcode"), never what was typed in it.
    trackEvent("form_start", { ...formParams(form), field_name: field.name });
  }
  state.fields.add(field.name);
  state.last = field.name;
}

/** "Add more details" buttons carry data-form-extras; count the first open. */
function onExtrasClick(target: Element) {
  const button = target.closest("[data-form-extras]");
  if (!button || button.getAttribute("aria-expanded") === "true") return;
  const form = formOf(button);
  if (!form) return;
  const state = started.get(form) ?? { fields: new Set<string>(), last: "", extras: false };
  if (state.extras) return;
  state.extras = true;
  // Opening it alone doesn't make the form "started" for form_abandon:
  // onPageHide skips forms with no fields filled.
  started.set(form, state);
  trackEvent("form_extras_open", formParams(form));
}

function onPageHide() {
  started.forEach((state, form) => {
    if (finished.has(form) || state.fields.size === 0) return;
    finished.add(form);
    trackEvent("form_abandon", {
      ...formParams(form),
      last_field: state.last,
      fields_filled: state.fields.size,
      transport_type: "beacon",
    });
  });
}

/**
 * Call once a lead form's Netlify submission has succeeded (enquire,
 * christmas-doorway, contact), before the form is reset. Sends the Google
 * Ads conversion (live site only) and GA4 generate_lead, and stops the form
 * counting as abandoned. A filled-in hidden "bot-field" is a spam bot:
 * Netlify quietly drops those, so nothing is counted.
 *
 * customer_type is "home" or "business": the garland form asks directly; the
 * party forms count a corporate event as business. garland is only on the
 * garland form.
 */
export function trackFormSent(form: HTMLFormElement) {
  finished.add(form);
  const data = new FormData(form);
  const get = (k: string) => {
    const v = data.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  if (get("bot-field")) return false;
  if (typeof window.gtag === "function" && window.location.hostname === LIVE_HOST) {
    window.gtag("event", "conversion", { send_to: ADS_CONVERSION });
  }
  const property = get("property").toLowerCase();
  const customerType = property
    ? property === "business" ? "business" : "home"
    : /corporate|brand/i.test(get("type")) ? "business" : "home";
  return trackEvent("generate_lead", {
    ...formParams(form),
    customer_type: customerType,
    garland: get("garland") || undefined,
  });
}

/* ---------- Scroll depth ---------- */

const SCROLL_MARKS = [25, 50, 75, 90];
const scrollSent = new Set<number>();
let scrollQueued = false;

function measureScroll() {
  scrollQueued = false;
  const doc = document.documentElement;
  const height = doc.scrollHeight;
  if (height <= window.innerHeight) return;
  const percent = ((window.scrollY + window.innerHeight) / height) * 100;
  for (const mark of SCROLL_MARKS) {
    // Only marked once it's really sent, so a visitor who accepts cookies
    // half way down still counts from there.
    if (percent >= mark && !scrollSent.has(mark) && trackEvent("scroll_depth", { percent: mark, location: "body" })) {
      scrollSent.add(mark);
    }
  }
}

function onScroll() {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(measureScroll);
}

/* ---------- Clicks ---------- */

function onLinkClick(e: MouseEvent) {
  const target = e.target as Element | null;
  if (!target?.closest) return;
  if (e.type === "click") onExtrasClick(target);
  const a = target.closest("a[href]") as HTMLAnchorElement | null;
  if (!a) return;
  const event = classifyLink(a);
  if (!event) return;
  trackEvent(event, {
    location: areaOf(a),
    section: sectionOf(a),
    link_text: linkText(a),
    link_url: safeUrl(a),
    // Send straight away: most of these links leave the page.
    transport_type: "beacon",
  });
}

let installed = false;

/** Start listening. Safe to call more than once; does nothing without a browser. */
export function installTracking() {
  if (installed || typeof document === "undefined") return;
  installed = true;
  document.addEventListener("click", onLinkClick, { capture: true });
  // Middle-click opens the link in a new tab without a "click" event.
  document.addEventListener(
    "auxclick",
    (e) => {
      if (e.button === 1) onLinkClick(e);
    },
    { capture: true },
  );
  // Typing fires "input"; dropdowns, dates and photo uploads fire "change".
  document.addEventListener("input", onFieldInput, { capture: true });
  document.addEventListener("change", onFieldInput, { capture: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pagehide", onPageHide);
}

/** For tests: forget forms and scroll marks, as a new page load would. */
export function resetTrackingState() {
  started.clear();
  scrollSent.clear();
}
