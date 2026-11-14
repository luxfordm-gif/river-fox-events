/**
 * Click tracking for contact links (Matt, 2026-11-11).
 *
 * One listener on the whole page names every contact click and sends it to
 * Google Analytics, so new buttons are covered without wiring each one:
 *
 *   whatsapp_click   any wa.me link (hero "WhatsApp Laura now", footer, Contact)
 *   phone_click      any tel: link
 *   email_click      any mailto: link
 *   instagram_click  any instagram.com link
 *   enquire_click    any link to the enquiry form (#enquire, /#enquire)
 *
 * Each event carries link_text (the button's words) and link_location
 * ("nav", "footer", or the id of the section it sits in), and GA adds the
 * page. A link can name its own report text with data-track-text, and a
 * block can name its place with data-track-location (the thank-you panels
 * are "enquire-thank-you", the Contact page list "contact-details"). A
 * middle-click (open in a new tab) counts as a click too (Matt, 2026-11-14). Mark whatsapp_click and phone_click as key events in Google
 * Analytics, then import them into Google Ads as conversions.
 *
 * Every event here goes through trackEvent, which sends nothing until the
 * visitor has clicked Accept on the cookie banner (Matt, 2026-11-12). The
 * Google tag itself and its consent defaults are set up in index.html and
 * the banner; this file doesn't touch them. In development each event is
 * logged to the console so it can be checked.
 */

/** Same key the cookie banner and index.html use for the visitor's choice. */
export const CONSENT_KEY = "rfx-consent";

/** True only once the visitor has clicked Accept on the cookie banner. */
export function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

type Params = Record<string, string | number | undefined>;

/** Send one GA4 event, only after Accept. Returns whether it was sent. */
export function trackEvent(name: string, params: Params = {}): boolean {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));
  const send = hasConsent() && typeof window !== "undefined" && typeof window.gtag === "function";
  if (import.meta.env.DEV) {
    console.log(`[track] ${name}${send ? "" : " (not sent: no consent)"}`, clean);
  }
  if (!send) return false;
  window.gtag!("event", name, clean);
  return true;
}

/**
 * GA4 generate_lead, called once after a lead form's Netlify submission
 * succeeds (enquire, christmas-doorway, contact). customer_type is "home" or
 * "business": the garland form asks directly; the party forms count a
 * corporate event as business. garland is only on the garland form.
 */
export function trackLead(form: HTMLFormElement) {
  const data = new FormData(form);
  const get = (k: string) => {
    const v = data.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  const property = get("property").toLowerCase();
  const customerType = property
    ? property === "business" ? "business" : "home"
    : /corporate|brand/i.test(get("type")) ? "business" : "home";
  return trackEvent("generate_lead", {
    form_name: get("form-name") || form.getAttribute("name") || "unknown",
    page_path: window.location.pathname,
    customer_type: customerType,
    garland: get("garland") || undefined,
  });
}

export type ClickEvent =
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "instagram_click"
  | "enquire_click";

/** Which event a link's href belongs to, or null for links we don't track. */
export function classifyHref(href: string): ClickEvent | null {
  const h = href.trim().toLowerCase();
  if (h.startsWith("tel:")) return "phone_click";
  if (h.startsWith("mailto:")) return "email_click";
  if (/^https?:\/\/(api\.)?(wa\.me|whatsapp\.com)\b/.test(h)) return "whatsapp_click";
  if (/^https?:\/\/(www\.)?instagram\.com\b/.test(h)) return "instagram_click";
  if (h.endsWith("#enquire")) return "enquire_click";
  return null;
}

const tidy = (s: string | null | undefined) => (s || "").replace(/[→↗\s]+/g, " ").trim();

/** Where on the page the link sits: "nav", "footer", "hero" (the section
 *  with the page title), a section's id, or failing that its heading. */
export function linkLocation(el: Element): string {
  if (el.closest("footer")) return "footer";
  if (el.closest("nav, header")) return "nav";
  const marked = el.closest("[data-track-location]");
  if (marked) return marked.getAttribute("data-track-location")!;
  const section = el.closest("section");
  if (!section) return "page";
  if (section.querySelector("h1")) return "hero";
  if (section.id) return section.id;
  const heading = tidy(section.querySelector("h2, h3")?.textContent);
  return heading ? heading.toLowerCase().slice(0, 60) : "page";
}

/** What the visitor tapped: the link's own data-track-text if it has one,
 *  else a photo link sends the photo's description
 *  (which Instagram post), anything else the words on it as seen (not
 *  screen-reader extras), falling back to the full text when it's folded
 *  away (a closed FAQ) and then the link's label. */
function linkText(a: HTMLAnchorElement): string {
  const text =
    a.getAttribute("data-track-text") ||
    a.querySelector("img")?.getAttribute("alt") ||
    tidy(a.innerText) ||
    tidy(a.textContent) ||
    a.getAttribute("aria-label");
  return tidy(text).slice(0, 100);
}

let installed = false;

function onLinkClick(e: MouseEvent) {
  const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a) return;
  const event = classifyHref(a.getAttribute("href") || "");
  if (!event) return;
  trackEvent(event, {
    link_text: linkText(a),
    link_location: linkLocation(a),
    link_url: a.href,
    // Send straight away: WhatsApp, phone and email links leave the page.
    transport_type: "beacon",
  });
}

/** Start listening. Safe to call more than once; does nothing without a browser. */
export function installClickTracking() {
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
}
