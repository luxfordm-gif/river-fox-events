import { describe, expect, it } from "vitest";
import { christmasLine, defaultLine, pageLines } from "@/data/announcementBar";
import { christmasOn, lineFor, splitLine, targetFor } from "@/lib/announcementBar";

describe("announcement bar lines", () => {
  it("shows the Christmas line on home and the garlands page only while christmasMode is on", () => {
    expect(lineFor("/", true)).toBe(christmasLine);
    expect(lineFor("/christmas-door-garlands/", true)).toBe(christmasLine);
    expect(lineFor("/", false)).toBe(defaultLine);
    expect(lineFor("/christmas-door-garlands/", false)).toBe(defaultLine);
    expect(lineFor("/childrens-parties/", true)?.text).toMatch(/^Planning a birthday\?/);
  });

  it("switches Christmas mode off by itself on 3 January 2027 (UK time)", () => {
    expect(christmasOn(new Date("2026-12-25T12:00:00Z"))).toBe(true);
    expect(christmasOn(new Date("2027-01-02T23:30:00Z"))).toBe(true);
    expect(christmasOn(new Date("2027-01-03T00:30:00Z"))).toBe(false);
    expect(christmasOn(new Date("2027-02-01T12:00:00Z"))).toBe(false);
  });

  it("uses the default line for every page that isn't listed", () => {
    for (const p of ["/our-work/", "/journal/", "/journal/some-post/", "/party-styling-cobham/", "/commercial-christmas-decorations/"]) {
      expect(lineFor(p, false)).toBe(defaultLine);
      expect(lineFor(p, true)).toBe(defaultLine);
    }
  });

  it("has no bar on Contact or the hidden pages", () => {
    expect(lineFor("/contact/")).toBeNull();
    expect(lineFor("/contact")).toBeNull();
    expect(lineFor("/style-guide/")).toBeNull();
  });

  it("sends a /contact/ tap to the page's own form when it has one", () => {
    expect(targetFor(defaultLine, "/childrens-parties/", true)).toEqual({ href: "/childrens-parties/#enquire", samePage: true });
    expect(targetFor(defaultLine, "/our-work/", false)).toEqual({ href: "/contact/", samePage: false });
    expect(targetFor(pageLines["/balloon-installations/"]!, "/balloon-installations/", true).href).toBe("/our-work/");
    expect(targetFor(christmasLine, "/", true)).toEqual({ href: "/christmas-door-garlands/#enquire", samePage: false });
    expect(targetFor(christmasLine, "/christmas-door-garlands/", true).samePage).toBe(true);
  });

  it("splits each line into a lead-in and an underlined link", () => {
    const all = [christmasLine, defaultLine, ...Object.values(pageLines).filter(Boolean)] as { text: string }[];
    for (const l of all) {
      const s = splitLine(l.text);
      expect(s.lead).toMatch(/[.?]$/);
      expect(s.link.length).toBeGreaterThan(3);
      expect(s.arrow).toBe(true);
    }
    expect(splitLine("Got a date in mind? Check we're free ›")).toEqual({ lead: "Got a date in mind?", link: "Check we're free", arrow: true });
  });
});
