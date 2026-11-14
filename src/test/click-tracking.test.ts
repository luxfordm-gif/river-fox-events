import { beforeEach, describe, expect, it, vi } from "vitest";
import { CONSENT_KEY, classifyHref, installClickTracking, trackLead } from "@/lib/track";
import { whatsappHref } from "@/lib/whatsapp";

// A plain in-memory localStorage, so the consent check reads what each test sets.
const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
  clear: () => store.clear(),
});

describe("click tracking", () => {
  beforeEach(() => localStorage.removeItem(CONSENT_KEY));

  it("names each kind of contact link", () => {
    expect(classifyHref(whatsappHref("Hi Laura"))).toBe("whatsapp_click");
    expect(classifyHref("tel:+447872114191")).toBe("phone_click");
    expect(classifyHref("mailto:riverfoxevents@gmail.com")).toBe("email_click");
    expect(classifyHref("https://www.instagram.com/riverfox_events/")).toBe("instagram_click");
    expect(classifyHref("/#enquire")).toBe("enquire_click");
    expect(classifyHref("#enquire")).toBe("enquire_click");
    expect(classifyHref("/childrens-parties/")).toBeNull();
  });

  it("sends a named event with the button's words and place", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    localStorage.setItem(CONSENT_KEY, "granted");
    document.body.innerHTML = `
      <section id="xmas-hero"><a href="${whatsappHref("Hi")}">WhatsApp Laura now</a></section>
      <footer><a href="tel:+447872114191">07872 114191</a></footer>
      <a href="/journal/">Journal</a>`;
    installClickTracking();

    const links = document.querySelectorAll("a");
    links.forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
    links.forEach((a) => a.click());

    expect(gtag).toHaveBeenCalledTimes(2);
    expect(gtag).toHaveBeenCalledWith("event", "whatsapp_click", expect.objectContaining({
      link_text: "WhatsApp Laura now",
      link_location: "xmas-hero",
    }));
    expect(gtag).toHaveBeenCalledWith("event", "phone_click", expect.objectContaining({
      link_location: "footer",
    }));
  });

  it("uses a link's own report text and a block's own place name", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    localStorage.setItem(CONSENT_KEY, "granted");
    document.body.innerHTML = `
      <section id="enquire"><div role="status" data-track-location="enquire-thank-you">
        <a href="${whatsappHref("Hi")}">WhatsApp Laura</a></div></section>
      <section id="instagram"><a href="https://www.instagram.com/riverfox_events/" data-track-text="Pink balloon arch">
        <img alt="" /><span class="sr-only">(opens Instagram, @riverfox_events)</span>Opens Instagram</a></section>`;
    installClickTracking();
    const links = document.querySelectorAll("a");
    links.forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
    links.forEach((a) => a.click());
    expect(gtag).toHaveBeenCalledWith("event", "whatsapp_click", expect.objectContaining({
      link_location: "enquire-thank-you",
    }));
    expect(gtag).toHaveBeenCalledWith("event", "instagram_click", expect.objectContaining({
      link_text: "Pink balloon arch",
      link_location: "instagram",
    }));
  });

  it("counts a middle-click (new tab) but not a right-click", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    localStorage.setItem(CONSENT_KEY, "granted");
    document.body.innerHTML = `<footer><a href="${whatsappHref("Hi")}">WhatsApp Laura</a></footer>`;
    installClickTracking();
    const a = document.querySelector("a")!;
    a.dispatchEvent(new MouseEvent("auxclick", { bubbles: true, button: 2 }));
    expect(gtag).not.toHaveBeenCalled();
    a.dispatchEvent(new MouseEvent("auxclick", { bubbles: true, button: 1 }));
    expect(gtag).toHaveBeenCalledWith("event", "whatsapp_click", expect.objectContaining({
      link_location: "footer",
    }));
  });

  it("sends nothing before Accept, or after Decline", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    document.body.innerHTML = `<footer><a href="tel:+447872114191">07872 114191</a></footer>`;
    installClickTracking();
    const a = document.querySelector("a")!;
    a.addEventListener("click", (e) => e.preventDefault());
    a.click();
    localStorage.setItem(CONSENT_KEY, "denied");
    a.click();
    expect(gtag).not.toHaveBeenCalled();
  });
});

describe("generate_lead", () => {
  const garlandForm = (property: string, garland: string) => {
    document.body.innerHTML = `
      <form name="christmas-doorway">
        <input type="hidden" name="form-name" value="christmas-doorway" />
        <select name="property"><option selected>${property}</option></select>
        <select name="garland"><option selected>${garland}</option></select>
      </form>`;
    return document.querySelector("form")!;
  };

  beforeEach(() => localStorage.removeItem(CONSENT_KEY));

  it("is not sent before Accept", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    expect(trackLead(garlandForm("Home", "Faux"))).toBe(false);
    expect(gtag).not.toHaveBeenCalled();
  });

  it("carries form, page, home or business and garland after Accept", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    localStorage.setItem(CONSENT_KEY, "granted");
    trackLead(garlandForm("Business", "Fresh spruce"));
    expect(gtag).toHaveBeenCalledTimes(1);
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", {
      form_name: "christmas-doorway",
      page_path: window.location.pathname,
      customer_type: "business",
      garland: "Fresh spruce",
    });
  });

  it("counts a corporate enquiry as business and leaves garland out", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    localStorage.setItem(CONSENT_KEY, "granted");
    document.body.innerHTML = `
      <form name="enquire">
        <input type="hidden" name="form-name" value="enquire" />
        <select name="type"><option selected>Corporate / brand event</option></select>
      </form>`;
    trackLead(document.querySelector("form")!);
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", {
      form_name: "enquire",
      page_path: window.location.pathname,
      customer_type: "business",
    });
  });
});
