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
 * page. Mark whatsapp_click and phone_click as key events in Google
 * Analytics, then import them into Google Ads as conversions.
 *
 * gtag respects the cookie banner's consent setting (index.html), so this
 * sends nothing the banner hasn't allowed.
 */

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

/** What the visitor tapped: a photo link sends the photo's description
 *  (which Instagram post), anything else the words on it as seen (not
 *  screen-reader extras), falling back to the full text when it's folded
 *  away (a closed FAQ) and then the link's label. */
function linkText(a: HTMLAnchorElement): string {
  const text =
    a.querySelector("img")?.getAttribute("alt") ||
    tidy(a.innerText) ||
    tidy(a.textContent) ||
    a.getAttribute("aria-label");
  return tidy(text).slice(0, 100);
}

let installed = false;

/** Start listening. Safe to call more than once; does nothing without a browser. */
export function installClickTracking() {
  if (installed || typeof document === "undefined") return;
  installed = true;
  document.addEventListener(
    "click",
    (e) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const event = classifyHref(a.getAttribute("href") || "");
      if (!event || typeof window.gtag !== "function") return;
      window.gtag("event", event, {
        link_text: linkText(a),
        link_location: linkLocation(a),
        link_url: a.href,
        // Send straight away: WhatsApp, phone and email links leave the page.
        transport_type: "beacon",
      });
    },
    { capture: true },
  );
}
