import { describe, expect, it, vi } from "vitest";
import { classifyHref, installClickTracking } from "@/lib/track";
import { whatsappHref } from "@/lib/whatsapp";

describe("click tracking", () => {
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
});
