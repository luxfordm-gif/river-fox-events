import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_KEY,
  classifyHref,
  installTracking,
  resetTrackingState,
  scrub,
  trackFormSent,
} from "@/lib/track";
import { whatsappHref } from "@/lib/whatsapp";

// A plain in-memory localStorage, so the consent check reads what each test sets.
const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
});
// Scroll is measured on the next frame; run it straight away in tests.
vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
  cb(0);
  return 0;
});

let gtag: ReturnType<typeof vi.fn>;
const accept = () => localStorage.setItem(CONSENT_KEY, "granted");
/** Every event sent, as [name, params]. */
const sent = () => gtag.mock.calls.map((c) => [c[1], c[2]] as [string, Record<string, unknown>]);
const named = (name: string) => sent().filter(([n]) => n === name).map(([, p]) => p);

const clickAll = () => {
  const links = document.querySelectorAll("a");
  links.forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
  links.forEach((a) => a.click());
};

beforeEach(() => {
  localStorage.removeItem(CONSENT_KEY);
  resetTrackingState();
  gtag = vi.fn();
  window.gtag = gtag;
  installTracking();
});

describe("link clicks", () => {
  it("names each kind of link", () => {
    expect(classifyHref(whatsappHref("Hi Laura"))).toBe("whatsapp_click");
    expect(classifyHref("tel:+447872114191")).toBe("phone_click");
    expect(classifyHref("mailto:riverfoxevents@gmail.com")).toBe("email_click");
    expect(classifyHref("https://www.instagram.com/riverfox_events/")).toBe("instagram_click");
    expect(classifyHref("/#enquire")).toBe("cta_click");
    expect(classifyHref("#enquire")).toBe("cta_click");
    expect(classifyHref("/childrens-parties/")).toBeNull();
  });

  it("sends page_path, location and section with every click", () => {
    accept();
    document.body.innerHTML = `
      <nav><a href="/our-work/">Our work</a><a href="/#enquire">Enquire now</a></nav>
      <section id="top"><h1>Parties</h1><a href="${whatsappHref("Hi")}">WhatsApp Laura now</a></section>
      <section id="services"><h2>Services</h2><a href="/childrens-parties/">Children's parties</a></section>
      <section id="enquire"><a href="tel:+447872114191">07872 114191</a></section>
      <footer><a href="/privacy/">Privacy</a></footer>`;
    clickAll();
    const page_path = window.location.pathname;
    expect(named("nav_click")).toEqual([
      expect.objectContaining({ page_path, location: "nav", link_text: "Our work", link_url: "/our-work/" }),
      expect.objectContaining({ page_path, location: "footer", link_url: "/privacy/" }),
    ]);
    expect(named("cta_click")).toEqual([
      expect.objectContaining({ location: "nav", link_text: "Enquire now", link_url: "/#enquire" }),
    ]);
    expect(named("whatsapp_click")).toEqual([expect.objectContaining({ location: "hero", section: "hero" })]);
    expect(named("phone_click")).toEqual([expect.objectContaining({ location: "form", section: "enquire" })]);
    // A link to another page from the body isn't a nav_click.
    expect(sent()).toHaveLength(5);
  });

  it("counts a page header that holds the h1 as the hero, not the nav", () => {
    accept();
    document.body.innerHTML = `<header><h1>Journal</h1><a href="/#enquire">Reserve your date</a></header>`;
    clickAll();
    expect(named("cta_click")).toEqual([expect.objectContaining({ location: "hero", section: "hero" })]);
  });

  it("uses a link's own report text and a block's own place name", () => {
    accept();
    document.body.innerHTML = `
      <section id="enquire"><div role="status" data-track-location="enquire-thank-you">
        <a href="${whatsappHref("Hi")}">WhatsApp Laura</a></div></section>
      <div data-track-location="menu"><a href="/journal/">Journal</a></div>
      <section id="instagram"><a href="https://www.instagram.com/riverfox_events/" data-track-text="Pink balloon arch">
        <img alt="" /><span class="sr-only">(opens Instagram, @riverfox_events)</span>Opens Instagram</a></section>`;
    clickAll();
    expect(named("whatsapp_click")).toEqual([
      expect.objectContaining({ location: "form", section: "enquire-thank-you" }),
    ]);
    expect(named("nav_click")).toEqual([expect.objectContaining({ location: "nav", section: "menu" })]);
    expect(named("instagram_click")).toEqual([
      expect.objectContaining({ link_text: "Pink balloon arch", location: "body", section: "instagram" }),
    ]);
  });

  it("counts a middle-click (new tab) but not a right-click", () => {
    accept();
    document.body.innerHTML = `<footer><a href="${whatsappHref("Hi")}">WhatsApp Laura</a></footer>`;
    const a = document.querySelector("a")!;
    a.dispatchEvent(new MouseEvent("auxclick", { bubbles: true, button: 2 }));
    expect(gtag).not.toHaveBeenCalled();
    a.dispatchEvent(new MouseEvent("auxclick", { bubbles: true, button: 1 }));
    expect(named("whatsapp_click")).toEqual([expect.objectContaining({ location: "footer" })]);
  });

  it("sends nothing before Accept, or after Decline", () => {
    document.body.innerHTML = `<footer><a href="tel:+447872114191">07872 114191</a></footer>`;
    clickAll();
    localStorage.setItem(CONSENT_KEY, "denied");
    clickAll();
    expect(gtag).not.toHaveBeenCalled();
  });
});

describe("privacy", () => {
  it("scrubs email addresses and phone numbers", () => {
    expect(scrub("Mail riverfoxevents@gmail.com now")).toBe("Mail email address now");
    expect(scrub("Call 07872 114191")).toBe("Call phone number");
    expect(scrub("+44 7872 114191")).toBe("phone number");
    expect(scrub("Light-up 21 and a 40th")).toBe("Light-up 21 and a 40th");
  });

  it("never sends a number, an email address or a WhatsApp message", () => {
    accept();
    document.body.innerHTML = `<footer>
      <a href="mailto:riverfoxevents@gmail.com">riverfoxevents@gmail.com</a>
      <a href="tel:+447872114191">07872 114191</a>
      <a href="${whatsappHref("Hi Laura, my postcode is RH6 9RX")}">WhatsApp Laura</a></footer>`;
    clickAll();
    const all = JSON.stringify(sent());
    expect(all).not.toMatch(/gmail|7872|114191|postcode|RH6|Hi%20Laura/);
    expect(named("email_click")[0]).toMatchObject({ link_text: "email address", link_url: "mailto:" });
    expect(named("phone_click")[0]).toMatchObject({ link_text: "phone number", link_url: "tel:" });
    expect(named("whatsapp_click")[0]).toMatchObject({ link_url: "https://wa.me/" });
  });
});

describe("forms", () => {
  const enquireForm = () => {
    document.body.innerHTML = `
      <form name="enquire" hidden><input name="name" /></form>
      <section id="enquire">
        <form name="enquire">
          <input type="hidden" name="form-name" value="enquire" />
          <input name="bot-field" />
          <input name="name" />
          <input name="email" />
          <select name="type"><option>Children's party</option><option selected>Corporate / brand event</option></select>
          <button type="button" data-form-extras aria-expanded="false">+ Add more details</button>
        </form>
      </section>`;
    return document.querySelector<HTMLFormElement>('form:not([hidden])')!;
  };
  const type = (form: HTMLFormElement, name: string, value: string) => {
    const field = form.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
    field.value = value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  };

  it("sends form_start once, with the field's name and never what was typed", () => {
    accept();
    const form = enquireForm();
    type(form, "name", "Jane Smith");
    type(form, "email", "jane@example.com");
    expect(named("form_start")).toEqual([
      { page_path: window.location.pathname, form_name: "enquire", location: "form", section: "enquire", field_name: "name" },
    ]);
    expect(JSON.stringify(sent())).not.toMatch(/Jane|example/);
  });

  it("ignores the hidden spam field and Netlify's hidden copy of the form", () => {
    accept();
    const form = enquireForm();
    type(form, "bot-field", "spam");
    const hiddenCopy = document.querySelector<HTMLFormElement>("form[hidden]")!;
    type(hiddenCopy, "name", "x");
    expect(named("form_start")).toEqual([]);
  });

  it("sends form_extras_open the first time Add more details opens", () => {
    accept();
    const form = enquireForm();
    const button = form.querySelector("button")!;
    button.click();
    button.setAttribute("aria-expanded", "true");
    button.click(); // closing
    button.setAttribute("aria-expanded", "false");
    button.click(); // opening again
    expect(named("form_extras_open")).toEqual([
      expect.objectContaining({ form_name: "enquire", location: "form" }),
    ]);
  });

  it("sends form_abandon on leaving a started form, not after a send", () => {
    accept();
    const form = enquireForm();
    form.querySelector("button")!.click();
    window.dispatchEvent(new Event("pagehide"));
    expect(named("form_abandon")).toEqual([]); // opened, nothing typed
    type(form, "name", "Jane");
    type(form, "email", "jane@example.com");
    window.dispatchEvent(new Event("pagehide"));
    window.dispatchEvent(new Event("pagehide"));
    expect(named("form_abandon")).toEqual([
      expect.objectContaining({ form_name: "enquire", location: "form", last_field: "email", fields_filled: 2 }),
    ]);

    resetTrackingState();
    gtag.mockClear();
    const again = enquireForm();
    type(again, "name", "Jane");
    trackFormSent(again);
    window.dispatchEvent(new Event("pagehide"));
    expect(named("form_abandon")).toEqual([]);
  });

  it("sends generate_lead after a send, and no Ads conversion off the live site", () => {
    accept();
    const form = enquireForm();
    expect(trackFormSent(form)).toBe(true);
    expect(sent()).toEqual([
      [
        "generate_lead",
        { page_path: window.location.pathname, form_name: "enquire", location: "form", section: "enquire", customer_type: "business" },
      ],
    ]);
  });

  it("counts nothing when the hidden spam field is filled", () => {
    accept();
    const form = enquireForm();
    form.querySelector<HTMLInputElement>('[name="bot-field"]')!.value = "spam";
    expect(trackFormSent(form)).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("reads home or business and the garland on the garland form", () => {
    accept();
    document.body.innerHTML = `
      <section id="enquire"><form name="christmas-doorway">
        <input type="hidden" name="form-name" value="christmas-doorway" />
        <select name="property"><option selected>Home</option></select>
        <select name="garland"><option selected>Fresh spruce</option></select>
      </form></section>`;
    trackFormSent(document.querySelector("form")!);
    expect(named("generate_lead")).toEqual([
      expect.objectContaining({ form_name: "christmas-doorway", customer_type: "home", garland: "Fresh spruce" }),
    ]);
  });

  it("is not sent before Accept", () => {
    const form = enquireForm();
    type(form, "name", "Jane");
    trackFormSent(form);
    expect(gtag).not.toHaveBeenCalled();
  });
});

describe("scroll_depth", () => {
  const scrollTo = (y: number) => {
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
    window.dispatchEvent(new Event("scroll"));
  };

  beforeEach(() => {
    Object.defineProperty(document.documentElement, "scrollHeight", { value: 4000, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  });

  it("sends 25, 50, 75 and 90 once each", () => {
    accept();
    scrollTo(0); // 20%
    scrollTo(1300); // 52.5%
    scrollTo(1300);
    scrollTo(3000); // 95%
    scrollTo(0);
    scrollTo(3200);
    expect(named("scroll_depth").map((p) => p.percent)).toEqual([25, 50, 75, 90]);
    expect(named("scroll_depth")[0]).toEqual({ page_path: window.location.pathname, percent: 25, location: "body" });
  });

  it("counts from where the visitor is once they accept", () => {
    scrollTo(1300);
    expect(gtag).not.toHaveBeenCalled();
    accept();
    scrollTo(1400);
    expect(named("scroll_depth").map((p) => p.percent)).toEqual([25, 50]);
  });
});
