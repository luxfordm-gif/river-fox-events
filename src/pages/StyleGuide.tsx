import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import "@/styles/style-guide.css";
import cssSource from "@/index.css?raw";
import xmasSource from "@/styles/christmas.css?raw";
import {
  blockTokens,
  contrast,
  hslToHex,
  parseHsl,
  parseTokenSheet,
  pxAt,
  resolveVars,
  tokenAt,
  type Token,
} from "@/lib/designTokens";
import { findGaps, type GapKind, type GapMark } from "@/lib/gapOverlay";
import { ENQUIRE_HREF, handleEnquireClick } from "@/lib/enquire";
import { whatsappHref } from "@/lib/whatsapp";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { findRoute } from "@/seo/routes";
import { applyMeta } from "@/seo/headTags";
import { findLocation } from "@/data/locations";
import { INSPIRATION_CHILDRENS } from "@/data/inspiration";

import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import Hero from "@/components/rfx/Hero";
import ServiceHero from "@/components/rfx/ServiceHero";
import PageHeader from "@/components/rfx/PageHeader";
import LocationHeroFan from "@/components/rfx/LocationHeroFan";
import ScrollStrip from "@/components/rfx/ScrollStrip";
import Experiences from "@/components/rfx/Experiences";
import Mission from "@/components/rfx/Mission";
import ServicesCards from "@/components/rfx/ServicesCards";
import { WHAT_WE_MAKE } from "@/data/balloonTiles";
import CPReveal from "@/components/rfx/CPReveal";
import LocationUSP from "@/components/rfx/LocationUSP";
import LocationGallery from "@/components/rfx/LocationGallery";
import About from "@/components/rfx/About";
import Process from "@/components/rfx/Process";
import CPPricing from "@/components/rfx/CPPricing";
import Testimonials from "@/components/rfx/Testimonials";
import LocationTrust from "@/components/rfx/LocationTrust";
import InspirationStrip from "@/components/rfx/InspirationStrip";
import InstagramFollow from "@/components/rfx/InstagramFollow";
import FAQ from "@/components/rfx/FAQ";
import ChildrensFAQ from "@/components/rfx/ChildrensFAQ";
import CPLocations from "@/components/rfx/CPLocations";
import Enquire from "@/components/rfx/Enquire";

import imgHero from "@/assets/river-fox-events-jungle-theme-fourever-wild-full-setup.webp";
import imgHeroMobile from "@/assets/river-fox-events-jungle-theme-safari-tablescape-elephant.webp";
import imgOccasions from "@/assets/river-fox-events-pastel-safari-anaya-two-wild-tablescape.webp";
import imgOccasionsHover from "@/assets/river-fox-events-pastel-safari-anaya-two-wild-marquee-close-up.webp";

/**
 * Hidden style guide (Matt, 2026-11-08): /style-guide/ is noindex, out of the
 * sitemap and linked from nowhere. Everything on it is live - the tokens are
 * read from src/index.css and christmas.css, and each section is the real
 * component with the props a real page passes - so it can't drift from the
 * site. Codes (C3, T5, R2, B1, P4, S12) are for Matt's notes.
 */

const SHEET = parseTokenSheet(cssSource);
const XMAS = blockTokens(xmasSource, ".rfx-xmas");

/* Screen widths each value is worked out at. */
const WIDTHS = [
  { w: 1920, label: "HD 1920" },
  { w: 1440, label: "1440" },
  { w: 1280, label: '13" 1280' },
  { w: 1024, label: "Tablet 1024" },
  { w: 768, label: "Tablet 768" },
  { w: 390, label: "Phone 390" },
  { w: 360, label: "Phone 360" },
];
const DESKTOP = 1440;

const fmt = (n: number | null) => (n === null ? "-" : `${Math.round(n * 10) / 10}`);

/* ---------- which pages use each component (read from the page source) ---------- */

const PAGE_SRC = import.meta.glob("/src/pages/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const COMPONENT_SRC = import.meta.glob("/src/components/rfx/*.tsx", { query: "?raw", import: "default", eager: true }) as Record<string, string>;
const PAGE_NAMES: Record<string, string> = {
  Index: "Home",
  ChildrensParties: "Children's parties",
  Milestones: "Milestones",
  CorporateAndBrand: "Corporate & brand",
  BalloonInstallations: "Balloons",
  ChristmasDoorways: "Christmas garlands",
  LocationPage: "Town pages",
  OurWork: "Our work",
  Journal: "Journal",
  Article: "Articles",
  Contact: "Contact",
  Privacy: "Privacy",
  Welcome: "Welcome",
  NotFound: "404",
};
const baseName = (path: string) => path.split("/").pop()!.replace(".tsx", "");
const usedOn = (component: string) => {
  const re = new RegExp(`rfx/${component}"`);
  const pages = Object.entries(PAGE_SRC)
    .filter(([p, src]) => baseName(p) !== "StyleGuide" && re.test(src))
    .map(([p]) => PAGE_NAMES[baseName(p)] ?? baseName(p));
  const inside = Object.entries(COMPONENT_SRC)
    .filter(([, src]) => re.test(src))
    .map(([p]) => `inside ${baseName(p)}`);
  return [...pages, ...inside].join(", ") || "not used on any page";
};

/* ---------- colours ---------- */

/* One swatch per real colour. Tokens that only point at another colour
   (the component-library names, hairlines, Christmas overrides) are listed
   under the colour they point at, not drawn as colours of their own. */
type Colour = { id: string; label: string; name: string; value: string; note: string; hsl: [number, number, number, number]; aliases: string[]; variant?: { label: string; hsl: [number, number, number, number] } };

const rootValue = (name: string) => SHEET.tokens.find((t) => t.name === name)?.value;
const xmasValue = (name: string) => XMAS.find((x) => x.name === name)?.value;
const ALIAS = /^var\((--[\w-]+)\)(?:\s*\/\s*([\d.]+))?$/;

/** Follow an alias chain to the token that holds the actual value. */
const terminal = (value: string, lookup: (n: string) => string | undefined) => {
  let name: string | undefined;
  let alpha: number | undefined;
  for (let i = 0; i < 5; i++) {
    const ref = ALIAS.exec(value);
    if (!ref) break;
    name = ref[1];
    if (ref[2]) alpha = Number(ref[2]);
    const next = lookup(ref[1]);
    if (next === undefined) return null;
    value = next;
  }
  return name ? { name, alpha } : null;
};

const ownColours = (tokens: Token[], prefix = "") =>
  tokens
    .map((t) => ({ t, hsl: parseHsl(t.value) }))
    .filter((x): x is { t: Token; hsl: [number, number, number, number] } => !!x.hsl)
    .map(({ t, hsl }) => {
      // Comments start with the plain name: "Background Light · white-cream ..."
      const [label, ...rest] = t.note.includes(" · ") ? t.note.split(" · ") : [t.name, t.note];
      return { id: "", label, name: prefix + t.name, value: t.value, note: rest.join(" · "), hsl, aliases: [] as string[] } as Colour;
    });

const brandOwn = ownColours(SHEET.tokens);
const xmasOwn = ownColours(XMAS).map((c) => (c.name.startsWith("--xmas") ? c : { ...c, name: `${c.name} (Christmas)` }));

const attach = (tokens: Token[], lookup: (n: string) => string | undefined, label: (n: string) => string) => {
  for (const t of tokens) {
    const end = terminal(t.value, lookup);
    if (!end) continue;
    const target =
      xmasOwn.find((c) => c.name === end.name && lookup === xmasLookup) ?? brandOwn.find((c) => c.name === end.name);
    target?.aliases.push(`${label(t.name)}${end.alpha !== undefined ? ` at ${Math.round(end.alpha * 100)}%` : ""}`);
  }
};
const xmasLookup = (n: string) => xmasValue(n) ?? rootValue(n);
attach(SHEET.tokens, rootValue, (n) => n);
attach(XMAS, xmasLookup, (n) => `${n} (Christmas)`);

/* A hover state, or the on-dark version of a text colour, is drawn as the
   right half of its main colour's swatch rather than as a colour of its own. */
const fold = (list: Colour[], partName: string, mainName: string, label: string) => {
  const part = list.find((c) => c.name === partName);
  const main = list.find((c) => c.name === mainName);
  if (part && main) main.variant = { label, hsl: part.hsl };
  return list.filter((c) => c !== part);
};
const brandShown = fold(fold(brandOwn, "--accent-hover", "--accent", "hover"), "--text-on-dark", "--text-primary", "on dark");
const xmasShown = fold(xmasOwn, "--xmas-btn-hover", "--xmas-gold", "hover");

const ROLE: [string, RegExp, string][] = [
  ["Backgrounds", /^--background/, ""],
  ["Text", /^--text/, ""],
  ["Accent", /^--accent/, "One peach: the fill for buttons, and a darker version for words, because the fill is too pale to read."],
  ["Form errors", /^--destructive/, ""],
];
let colourCount = 0;
const numbered = (list: Colour[]) => list.map((c) => ({ ...c, id: `C${++colourCount}` }));

const COLOUR_GROUPS: { title: string; intro: string; colours: Colour[] }[] = [
  ...ROLE.map(([title, re, intro]) => ({ title, intro, colours: numbered(brandShown.filter((c) => re.test(c.name))) })),
  {
    title: "Christmas edition (Frost & gold)",
    intro: "Christmas door garlands page only.",
    colours: numbered(xmasShown),
  },
];

/* Text on each background: [row, colour on light backgrounds, colour on Background Dark] */
const THEMES: [string, string][] = [
  ["Background", "--background"],
  ["Background Light", "--background-light"],
  ["Warm", "--background-warm"],
  ["Blush", "--background-blush"],
  ["Background Dark", "--background-dark"],
];
const TEXT_ROWS: [string, string, string | null][] = [
  ["Primary", "--text-primary", "--text-on-dark"],
  ["Neutral", "--text-neutral", null],
  ["Dimmed", "--text-dimmed", "--text-dimmed"],
  ["Journal body", "--text-journal", null],
];
const tokenHsl = (name: string) => {
  const end = terminal(`var(${name})`, rootValue);
  return parseHsl(rootValue(end?.name ?? name) ?? "");
};

const CREAM = parseHsl(rootValue("--background") ?? "")!;

/* ---------- text styles ---------- */

/* Grouped as Matt asked (2026-11-08): Display, Headings, Quote, Body. The
   name and use of each style come from its size token's comment. */
/* One line for every display, heading and quote style, so the sizes can be
   compared at a glance (Matt, 2026-11-08). */
const HEADING_SAMPLE = <>Styled in <em className="t-accent">Surrey.</em></>;
/* The same two lines for every body style, so line height is visible. */
const BODY_SAMPLE = <>Balloon arches, backdrops and name signs,<br />set up before your guests arrive.</>;

const TYPE_GROUPS: { title: string; intro: string; styles: { name: string; sample: ReactNode }[] }[] = [
  {
    title: "Display",
    intro: "The hero headline on the home and service pages.",
    styles: [{ name: "t-display", sample: HEADING_SAMPLE }],
  },
  {
    title: "Headings",
    intro: "Heading 1 is the page title, Heading 2 every section title, then down in size. Phones and tablets share one scale: each heading grows with the screen from its phone size and never shrinks as the screen widens. On phones (below 768px) Headings 1 to 3 get line height 1.1 so two-line titles aren't cramped.",
    styles: [
      { name: "t-h1", sample: HEADING_SAMPLE },
      { name: "t-h2", sample: HEADING_SAMPLE },
      { name: "t-h3", sample: HEADING_SAMPLE },
      { name: "t-h4", sample: HEADING_SAMPLE },
      { name: "t-h5", sample: HEADING_SAMPLE },
      { name: "t-h6", sample: HEADING_SAMPLE },
    ],
  },
  {
    title: "Quote",
    intro: "Pull quotes in journal articles. Reviews use Body: serif is never for long reading.",
    styles: [{ name: "t-quote", sample: HEADING_SAMPLE }],
  },
  {
    title: "Body",
    intro: "DM Sans for everything you read. Label is the medium-weight one for buttons and nav; Overline is the small mono capitals.",
    styles: [
      { name: "t-lead", sample: BODY_SAMPLE },
      { name: "t-body", sample: BODY_SAMPLE },
      { name: "t-small", sample: BODY_SAMPLE },
      { name: "t-meta", sample: BODY_SAMPLE },
      { name: "t-label", sample: BODY_SAMPLE },
      { name: "t-overline", sample: BODY_SAMPLE },
    ],
  },
];

/** "Heading 2 · every section title" from the style's size token comment. */
const styleName = (cls: string) => {
  const sizeVar = /var\((--[\w-]+)\)/.exec(SHEET.textStyles[cls]?.["font-size"] ?? "")?.[1];
  const note = SHEET.tokens.find((t) => t.name === sizeVar)?.note ?? "";
  const [label, ...rest] = note.includes(" · ") ? note.split(" · ") : [cls, note];
  return { label, use: rest.join(" · ") };
};

const familyName = (v?: string) => {
  const resolved = v ? resolveVars(SHEET, v, DESKTOP) : "";
  return /"([^"]+)"/.exec(resolved)?.[1] ?? (resolved || "-");
};

const styleSpec = (name: string) => {
  const d = SHEET.textStyles[name] ?? {};
  const at = (prop: string, w: number) => (d[prop] ? resolveVars(SHEET, d[prop], w) : undefined);
  return {
    family: familyName(d["font-family"]),
    weight: at("font-weight", DESKTOP) ?? "-",
    sizeToken: d["font-size"]?.replace(/^var\((--[\w-]+)\)$/, "$1"),
    rows: WIDTHS.map(({ w, label }) => {
      const size = at("font-size", w);
      const px = size ? pxAt(size, w) : null;
      const lh = at("line-height", w);
      const lhNum = lh && /^[\d.]+$/.test(lh) ? Number(lh) : null;
      return {
        label,
        size: px === null ? size ?? "-" : `${fmt(px)}px`,
        lh: lhNum === null ? lh ?? "-" : `${lhNum} (${fmt(px === null ? null : px * lhNum)}px)`,
        ls: at("letter-spacing", w) ?? "0",
      };
    }),
  };
};

/* ---------- corners, buttons, spacing ---------- */

const CORNERS = [
  { token: "--radius-large", cls: "rounded-large", use: "Cards, panels, photos, videos, the map" },
  { token: "--radius-small", cls: "rounded-small", use: "Buttons, form fields, badges, tags" },
  { token: "--radius-round", cls: "rounded-full", use: "Pills, dots, circles" },
  { token: "--radius-panel", cls: "rfx-panel", use: "Rounded full-width section panels (home About)" },
];

const BUTTONS: { name: string; use: string; tone?: string; render: () => ReactNode }[] = [
  {
    name: "btn-solid-rf accent",
    use: "Main call to action: Reserve your date, Enquire now. Hover darkens the peach.",
    render: () => (
      <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent">
        Reserve your date <span className="t-icon">→</span>
      </a>
    ),
  },
  {
    name: "btn-solid-rf",
    use: "Charcoal solid button. Hover goes to black.",
    render: () => (
      <a href="/our-work/" className="btn-solid-rf">
        See our work <span className="t-icon">→</span>
      </a>
    ),
  },
  {
    name: "btn-ghost-rf",
    use: "Secondary action beside a solid button. Hover fills charcoal.",
    render: () => (
      <a href="/our-work/" className="btn-ghost-rf">
        See our work <span className="t-icon">→</span>
      </a>
    ),
  },
  {
    name: "btn-link-rf",
    use: "Text link with an underline and arrow, inside cards and sections.",
    render: () => (
      <a href="/childrens-parties/" className="btn-link-rf">
        Explore children's parties <span className="arr">→</span>
      </a>
    ),
  },
  {
    name: "Nav: Enquire now",
    use: "The nav's own smaller solid accent button.",
    tone: "on-alt",
    render: () => (
      <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent t-label !py-2 !px-4">
        Enquire now <span>→</span>
      </a>
    ),
  },
  {
    name: "On the dark surface",
    use: "Accent button on the deep green (footer, dark sections).",
    tone: "on-deep",
    render: () => (
      <a href={ENQUIRE_HREF} onClick={handleEnquireClick} className="btn-solid-rf accent">
        Reserve your date <span className="t-icon">→</span>
      </a>
    ),
  },
];

const SPACING_TOKENS = [
  "--section-y", "--section-gap", "--gap-heading-text", "--gap-heading-content", "--gap-text-content", "--gap-inline", "--gap-label-title", "--gap-title-body", "--card-text-inset", "--panel-inset", "--gutter", "--container-max", "--hero-pad-top", "--hero-gap", "--hero-pad-bottom", "--page-pad-top", "--page-pad-bottom",
  // Added by the token migration (2026-11-13). New ones go on the end so P codes never shift.
  "--gap-paragraph", "--gap-stack", "--gap-text-action", "--gap-actions", "--gap-button-trust", "--gap-columns", "--gap-stacked", "--gap-cards", "--gap-media", "--gap-caption", "--gap-photos", "--gap-eyebrow", "--gap-divider", "--gap-list-item", "--gap-link-list", "--gap-icon", "--gap-form", "--gap-field", "--card-pad", "--article-gap", "--article-pad-x", "--list-indent", "--hero-ink-trim", "--measure-title", "--measure-lead", "--nav-height", "--nav-pad-x", "--nav-link-gap", "--menu-offset", "--menu-pad", "--menu-item-pad", "--menu-rule-gap", "--menu-section-gap", "--btn-compact-pad", "--tap-target",
];

/* A spacing token's value at a width, in px: references to other tokens are
   worked out first, and two-part values ("12px 4px") show both parts. */
const spacingAt = (name: string, w: number): string => {
  const raw = tokenAt(SHEET, name, w);
  if (!raw) return "-";
  const v = resolveVars(SHEET, raw, w).trim();
  if (/\dch$/.test(v)) return v;
  const parts = v.match(/(?:[^\s(]+|\([^)]*\))+(?:\([^)]*\))?/g) ?? [v];
  const isSingle = parts.length === 1 || /^(clamp|calc|min|max)\(/.test(v);
  return isSingle ? fmt(pxAt(v, w)) : parts.map((x) => fmt(pxAt(x, w))).join(" / ");
};

/* ---------- the live sections ---------- */

const cobham = findLocation("cobham")!;

type Section = { id: string; title: string; component: string; note?: string; render: () => ReactNode };

const SECTIONS: Section[] = [
  { id: "S1", title: "Home hero", component: "Hero", render: () => <Hero /> },
  { id: "S22", title: "Mission line", component: "Mission", note: "Home, under the hero. Words darken one by one as it scrolls up", render: () => <Mission /> },
  {
    id: "S2",
    title: "Service hero",
    component: "ServiceHero",
    note: "Shown with the Children's parties content",
    render: () => (
      <ServiceHero
        image={imgHero}
        imageAlt="Fourever Wild jungle party setup with white safari jeep, balloon garland, giraffe, zebra and lion cub by a bamboo backdrop"
        mobileImage={imgHeroMobile}
        mobileImageAlt="Jungle tablescape with an elephant centrepiece, monstera runner, giraffe-print plates and safari balloons"
        headingId="sg-service-hero-heading"
        whatsappHref={whatsappHref("Hi Laura, I'd love to talk about styling my child's party. My date and postcode are ")}
        lines={[<>Themed children's parties,</>, <em className="t-accent">fully styled.</em>]}
        sub={<>Balloon arches, themed backdrops and painted name signs, set up across Surrey before your guests arrive and cleared away afterwards.</>}
      />
    ),
  },
  {
    id: "S3",
    title: "Inner page header",
    component: "PageHeader",
    note: "Shown with the Journal content",
    render: () => (
      <PageHeader
        divider
        title="Journal"
        intro="Notes from the studio - trends, behind-the-scenes, and the thinking behind the celebrations we style."
      />
    ),
  },
  {
    id: "S4",
    title: "Town hero photos",
    component: "LocationHeroFan",
    note: "Cobham's photos. Desktop fans three photos; phones get the ScrollStrip instead",
    render: () => (
      <section className="relative overflow-hidden pb-16">
        <div className="md:hidden">
          <ScrollStrip images={cobham.hero.fanImages} />
        </div>
        <LocationHeroFan images={cobham.hero.fanImages} />
      </section>
    ),
  },
  { id: "S5", title: "Our services (three cards, rotating photos)", component: "Experiences", note: "The one services section. Layouts: centre (home, Balloons), stacked (town pages), split (Welcome)", render: () => <Experiences align="centre" /> },
  {
    id: "S6",
    title: "Photo tiles",
    component: "ServicesCards",
    note: "Balloon page \"What we make\"",
    render: () => (
      <ServicesCards
        sectionId="sg-tiles"
        headingId="sg-tiles-heading"
        items={WHAT_WE_MAKE}
        heading={<>What we <em className="t-accent">make.</em></>}
      />
    ),
  },
  {
    id: "S7",
    title: "Photo and text reveal",
    component: "CPReveal",
    note: "Children's parties content",
    render: () => (
      <CPReveal
        id="sg-reveal"
        imageSide="right"
        image={imgOccasions}
        alt="Pastel safari Two Wild table for Anaya's second birthday, with pink place settings, a foliage runner and a light-up two"
        hoverImage={imgOccasionsHover}
        hoverAlt="Close-up of the pink light-up two marquee at Anaya's pastel safari birthday, with sage and pink balloons"
        tone="ph-warm"
        headline={<>More than a party, <em className="t-accent">a memory in the making.</em></>}
      >
        <p>I design celebrations that transform your home or venue into something your child and every guest will remember long after the day is done.</p>
        <p>Every River Fox Events party is individually designed, tailored to your child, your space and the atmosphere you want to create.</p>
      </CPReveal>
    ),
  },
  { id: "S8", title: "Town introduction", component: "LocationUSP", note: "Cobham's copy", render: () => <LocationUSP cityName={cobham.cityName} body={cobham.uspBody} /> },
  {
    id: "S9",
    title: "Sticky photo gallery",
    component: "LocationGallery",
    note: "Cobham's gallery",
    render: () => (
      <LocationGallery
        id="sg-gallery"
        eyebrow={cobham.gallery.eyebrow}
        heading={cobham.gallery.heading}
        intro={cobham.gallery.intro}
        mainImage={cobham.gallery.mainImage}
        mainImageAlt={cobham.gallery.mainImageAlt}
        images={cobham.gallery.images}
      />
    ),
  },
  { id: "S10", title: "About Laura", component: "About", render: () => <About /> },
  { id: "S11", title: "How it works", component: "Process", render: () => <Process /> },
  { id: "S12", title: "Pricing", component: "CPPricing", note: "Service-page version (heading only)", render: () => <CPPricing footnote="" /> },
  { id: "S13", title: "Reviews (homepage)", component: "Testimonials", render: () => <Testimonials noDivider /> },
  { id: "S14", title: "Reviews (town and balloon pages)", component: "LocationTrust", render: () => <LocationTrust /> },
  { id: "S15", title: "Inspiration strip", component: "InspirationStrip", render: () => <InspirationStrip id="sg-inspiration" accent="your party." images={INSPIRATION_CHILDRENS} /> },
  { id: "S16", title: "Instagram follow", component: "InstagramFollow", render: () => <InstagramFollow /> },
  { id: "S17", title: "FAQ (homepage)", component: "FAQ", render: () => <FAQ /> },
  { id: "S18", title: "FAQ (service and town pages)", component: "ChildrensFAQ", note: "Children's parties questions", render: () => <ChildrensFAQ headingId="sg-faq-heading" /> },
  { id: "S19", title: "Areas we cover", component: "CPLocations", render: () => <CPLocations /> },
  { id: "S20", title: "Enquiry form", component: "Enquire", render: () => <Enquire /> },
  { id: "S21", title: "Footer", component: "Footer", render: () => <Footer /> },
];

const FOUNDATIONS = [
  { href: "#sg-colours", label: "Colours" },
  { href: "#sg-type", label: "Type" },
  { href: "#sg-corners", label: "Corners" },
  { href: "#sg-buttons", label: "Buttons" },
  { href: "#sg-spacing", label: "Spacing" },
];

/* ---------- pieces ---------- */

const BlockHead = ({ code, title, children }: { code: string; title: string; children?: ReactNode }) => (
  <div className="sg-block-head">
    <span className="t-overline text-ink-soft">{code}</span>
    <h2 className="t-h2 text-ink">{title}</h2>
    {children && <p className="t-lead text-ink-soft">{children}</p>}
  </div>
);

/** Labelled band above a live section, with that section's spacing measured
 *  at the current screen width (for the spacing-token notes). */
const SectionBand = ({ section }: { section: Section }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [measure, setMeasure] = useState("");

  useLayoutEffect(() => {
    const run = () => {
      const band = ref.current;
      const el = band?.nextElementSibling?.firstElementChild as HTMLElement | null;
      if (!el) return;
      const cs = getComputedStyle(el);
      const box = el.querySelector(".container-rfx") as HTMLElement | null;
      const bs = box ? getComputedStyle(box) : null;
      // Which spacing token each value matches at this width, if any.
      const probe = document.createElement("div");
      probe.style.cssText = "position:absolute;visibility:hidden;padding-top:var(--section-y);padding-left:var(--gutter)";
      document.body.appendChild(probe);
      const sectionY = parseFloat(getComputedStyle(probe).paddingTop);
      const gutter = parseFloat(getComputedStyle(probe).paddingLeft);
      probe.remove();
      const tag = (v: number) => (v === 0 ? "none" : Math.abs(v - sectionY) < 1 ? "Section padding" : "off-token");
      const pt = parseFloat(cs.paddingTop);
      const pb = parseFloat(cs.paddingBottom);
      const g = bs ? parseFloat(bs.paddingLeft) : null;
      const parts = [
        `padding top ${pt} (${tag(pt)}) · bottom ${pb} (${tag(pb)})`,
        g !== null ? `side gutter ${g}${Math.abs(g - gutter) < 1 ? "" : " (off-token)"} · max width ${bs!.maxWidth}` : "",
      ].filter(Boolean);
      setMeasure(`At ${window.innerWidth}px wide: ${parts.join(" · ")}`);
    };
    run();
    window.addEventListener("resize", run);
    return () => window.removeEventListener("resize", run);
  }, []);

  return (
    <div ref={ref} className="sg-band" id={`sg-${section.id.toLowerCase()}`}>
      <div className="container-rfx sg-band-inner">
        <span className="sg-id">{section.id}</span>
        <span className="t-h6 text-ink">{section.title}</span>
        <span className="t-meta text-ink-soft">
          <span className="sg-code">{section.component}.tsx</span> · used on {usedOn(section.component)}
          {section.note ? ` · ${section.note}` : ""}
        </span>
        <span className="t-meta text-ink-faint w-full">{measure}</span>
      </div>
    </div>
  );
};

const KIND_SHORT: Record<GapKind, string> = { heading: "heading", text: "text", image: "image", button: "button", block: "group" };

const gapTone = (m: GapMark) =>
  m.padding ? "is-pad" : m.from === "block" && m.to === "block" ? "is-group" : m.from === "image" || m.to === "image" ? "is-image" : m.from === "heading" ? "is-heading" : m.from === "button" || m.to === "button" ? "is-button" : "is-text";

/** Marks every vertical gap in the live section above it, with its size at
 *  the current screen width and a code (S7·g3) for notes. */
const GapLayer = ({ sectionId }: { sectionId: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [marks, setMarks] = useState<GapMark[]>([]);

  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) return;
    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setMarks(findGaps(root)));
    };
    run();
    const ro = new ResizeObserver(run);
    ro.observe(root);
    window.addEventListener("load", run);
    const late = window.setTimeout(run, 1500); // fonts and lazy photos settle
    return () => {
      ro.disconnect();
      window.removeEventListener("load", run);
      window.clearTimeout(late);
      cancelAnimationFrame(frame);
    };
  }, []);

  let n = 0;
  return (
    <div ref={ref} className="sg-gap-layer" aria-hidden="true">
      {marks.map((m, i) => {
        const code = m.padding ? `${sectionId}·pad-${m.padding}` : `${sectionId}·g${++n}`;
        const label = m.padding
          ? `section padding ${m.padding} ${Math.round(m.height)}`
          : `${KIND_SHORT[m.from]} → ${KIND_SHORT[m.to]} ${Math.round(m.height)}${m.shared ? " · shared" : ""}`;
        return (
          <div key={i} className={`sg-gap ${gapTone(m)}`} style={{ top: m.top, left: m.left, width: m.width, height: m.height }}>
            <span className="sg-gap-label">
              <b>{code}</b> {label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const GAPS_KEY = "sg-show-gaps";
const readGaps = () => {
  try {
    return localStorage.getItem(GAPS_KEY) !== "0";
  } catch {
    return true;
  }
};

const Dock = ({ gaps, onGaps }: { gaps: boolean; onGaps: (on: boolean) => void }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("");

  useEffect(() => {
    const targets = [...FOUNDATIONS.map((f) => f.href.slice(1)), ...SECTIONS.map((s) => `sg-${s.id.toLowerCase()}`)];
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = "";
      for (const id of targets) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.35) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Keep the current chip in view inside the bar.
  useEffect(() => {
    const track = trackRef.current;
    const chip = track?.querySelector<HTMLElement>(".sg-chip.is-active");
    if (!track || !chip) return;
    track.scrollTo({ left: chip.offsetLeft - track.clientWidth / 2 + chip.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="sg-dock" aria-label="Style guide sections">
      <div className="sg-dock-track" ref={trackRef}>
        <button
          type="button"
          className={`sg-chip t-label ${gaps ? "is-active" : ""}`}
          aria-pressed={gaps}
          onClick={() => onGaps(!gaps)}
        >
          Gaps {gaps ? "on" : "off"}
        </button>
        <span className="sg-dock-label t-overline">Foundations</span>
        {FOUNDATIONS.map((f) => (
          <a key={f.href} href={f.href} className={`sg-chip t-label ${active === f.href.slice(1) ? "is-active" : ""}`}>
            {f.label}
          </a>
        ))}
        <span className="sg-dock-label t-overline">Sections</span>
        {SECTIONS.map((s) => {
          const id = `sg-${s.id.toLowerCase()}`;
          return (
            <a key={s.id} href={`#${id}`} className={`sg-chip t-label ${active === id ? "is-active" : ""}`}>
              <span className="sg-id">{s.id}</span>
              {s.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

/* ---------- page ---------- */

const StyleGuide = () => {
  useFadeUp();
  useNavScroll();
  const [gaps, setGaps] = useState(readGaps);
  const toggleGaps = (on: boolean) => {
    setGaps(on);
    try {
      localStorage.setItem(GAPS_KEY, on ? "1" : "0");
    } catch {
      /* storage blocked: the switch still works for this visit */
    }
  };

  useEffect(() => {
    const route = findRoute("/style-guide");
    if (route) applyMeta(route);
    // Belt and braces: the prerendered file already carries noindex.
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";
  }, []);

  return (
    <div className="min-h-screen page-paper text-foreground nav-solid sg-page nav-paper">
      <Nav />
      <main>
        <header className="container-rfx pb-14" style={{ paddingTop: "var(--page-pad-top)" }}>
          <p className="t-overline text-ink-soft mb-4">Hidden page · not in menus, sitemap or search</p>
          <h1 className="t-h1 text-ink">
            Style <em className="t-accent">guide.</em>
          </h1>
          <p className="t-lead text-ink-soft mt-5 max-w-[720px]">
            Every colour, text style, corner and button the site uses, read live from the stylesheet,
            followed by each reusable section drawn by its real component. Use the names and codes (Heading 2, C3,
            R2, B1, S12·g3) in your notes. The bar at the bottom jumps between them.
          </p>
        </header>

        {/* Colours */}
        <section id="sg-colours" className="sg-block">
          <div className="container-rfx">
            <BlockHead code="C · Colours" title="Colour tokens">
              Every colour on the site, and where it's used.
            </BlockHead>
            {COLOUR_GROUPS.map((g) => (
              <div key={g.title} className="sg-group">
                <div className="sg-subhead">
                  <h3 className="t-h6 text-ink">{g.title}</h3>
                  {g.intro && <p className="t-small text-ink-soft">{g.intro}</p>}
                </div>
                <div className="sg-colours">
                  {g.colours.map((c) => {
                    const [h, s, l, a] = c.hsl;
                    return (
                      <div key={c.id} className="sg-colour">
                        <div className={`sg-swatch ${a < 1 ? "is-alpha" : ""}`}>
                          <span style={{ background: `hsl(${h} ${s}% ${l}% / ${a})` }} />
                          {c.variant && (
                            <span
                              className="sg-swatch-variant"
                              style={{
                                background: `hsl(${c.variant.hsl[0]} ${c.variant.hsl[1]}% ${c.variant.hsl[2]}%)`,
                                color: `hsl(var(${c.variant.hsl[2] > 50 ? "--text-primary" : "--text-on-dark"}))`,
                              }}
                            >
                              <span className="t-meta">{c.variant.label}</span>
                            </span>
                          )}
                        </div>
                        <div className="sg-colour-body">
                          <p className="t-body text-ink">
                            <b>{c.label}</b> <span className="t-meta text-ink-faint">{hslToHex(h, s, l)}</span>
                          </p>
                          {c.note && <p className="t-small text-ink-soft">{c.note}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {g.title === "Text" && (
                  <div className="sg-table-wrap mt-12">
                    <div className="sg-themes" role="table" aria-label="Text colours on each background">
                      <span />
                      {THEMES.map(([label]) => (
                        <span key={label} className="t-overline text-ink-soft">{label}</span>
                      ))}
                      {TEXT_ROWS.map(([row, light, dark]) => (
                        <div key={row} className="contents">
                          <span className="t-small text-ink"><b>{row}</b></span>
                          {THEMES.map(([label, bg]) => {
                            const fg = bg === "--background-dark" ? dark : light;
                            const b = tokenHsl(bg)!;
                            const f = fg ? tokenHsl(fg) : null;
                            return (
                              <div key={label} className="sg-theme-cell" style={{ background: `hsl(var(${bg}))` }}>
                                {f ? (
                                  <>
                                    <span className="t-body" style={{ color: `hsl(var(${fg}))` }}>Styled in Surrey</span>
                                  </>
                                ) : (
                                  <span className="t-meta" style={{ color: "hsl(var(--text-dimmed))" }}>not used here</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Type */}
        <section id="sg-type" className="sg-block">
          <div className="container-rfx">
            <BlockHead code="Type" title="Text styles">
              Fourteen styles in four groups. Each sample is drawn at your current screen width; the
              table gives the size at each width. Fraunces for display, headings and quotes; DM Sans
              for body; DM Mono for overlines.
            </BlockHead>
            {TYPE_GROUPS.map((g) => (
              <div key={g.title} className="sg-group">
                <div className="sg-subhead">
                  <h3 className="t-h4 text-ink">{g.title}</h3>
                  <p className="t-small text-ink-soft">{g.intro}</p>
                </div>
                {g.styles.map((t) => {
                  const spec = styleSpec(t.name);
                  const { label, use } = styleName(t.name);
                  return (
                    <div key={t.name} className="sg-type-row">
                      <div className="sg-type-meta">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="t-body text-ink"><b>{label}</b></span>
                          <span className="sg-code t-meta">.{t.name}</span>
                        </div>
                        <p className="t-small text-ink-soft">{use}</p>
                        <p className="t-meta text-ink-faint">
                          {spec.family} · weight {spec.weight}
                        </p>
                      </div>
                      <div className="sg-type-sample">
                        <p className={`${t.name} text-ink`}>{t.sample}</p>
                        <div className="sg-table-wrap mt-4">
                          <table className="sg-spec">
                            <thead>
                              <tr>
                                <th>Width</th>
                                {spec.rows.map((r) => <th key={r.label}>{r.label}</th>)}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <th>Size</th>
                                {spec.rows.map((r) => <td key={r.label}>{r.size}</td>)}
                              </tr>
                              <tr>
                                <th>Line height</th>
                                {spec.rows.map((r) => <td key={r.label}>{r.lh}</td>)}
                              </tr>
                              <tr>
                                <th>Spacing</th>
                                {spec.rows.map((r) => <td key={r.label}>{r.ls}</td>)}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="sg-group">
              <div className="sg-subhead">
                <h3 className="t-h4 text-ink">Accent words</h3>
                <p className="t-small text-ink-soft">
                  Not a style of its own: <span className="sg-code">.t-accent</span> turns words inside any heading
                  italic, in Accent Dark.
                </p>
              </div>
              <p className="t-h2 text-ink">Styled in <em className="t-accent">Surrey.</em></p>
            </div>
          </div>
        </section>

        {/* Corners */}
        <section id="sg-corners" className="sg-block">
          <div className="container-rfx">
            <BlockHead code="R · Corners" title="Corner tokens">
              Phones (below 768px) get slightly tighter card and photo corners.
            </BlockHead>
            <div className="sg-corners">
              {CORNERS.map((c, i) => {
                const desk = tokenAt(SHEET, c.token, DESKTOP);
                const phone = tokenAt(SHEET, c.token, 390);
                return (
                  <div key={c.token} className="sg-corner">
                    <div className={`sg-corner-box ${c.cls}`} />
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="sg-id">R{i + 1}</span>
                      <span className="sg-code t-small">{c.cls}</span>
                    </div>
                    <p className="t-meta text-ink">
                      Desktop {desk}{phone !== desk ? ` · phone ${phone}` : " · same on phone"}
                    </p>
                    <p className="t-meta text-ink-soft">{c.use}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section id="sg-buttons" className="sg-block">
          <div className="container-rfx">
            <BlockHead code="B · Buttons" title="Buttons">
              All buttons use the Label text style and the Small corner. On hover the label rolls to an identical line; the button never changes size.
            </BlockHead>
            <div className="sg-buttons">
              {BUTTONS.map((b, i) => (
                <div key={b.name} className={`sg-button-card ${b.tone ?? ""}`}>
                  <div>{b.render()}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="sg-id">B{i + 1}</span>
                    <span className="sg-code t-small">{b.name}</span>
                  </div>
                  <p className={`t-meta ${b.tone === "on-deep" ? "text-ink-faint" : "text-ink-soft"}`}>{b.use}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Spacing */}
        <section id="sg-spacing" className="sg-block">
          <div className="container-rfx">
            <BlockHead code="P · Spacing" title="Spacing tokens">
              Section padding, the heading-to-body gap, side gutters and content width are tokens.
              Each section label below measures its padding at your screen width and marks anything
              not on a token as "off-token", ready for your notes.
            </BlockHead>
            <div className="sg-legend mb-10">
              <p className="t-small text-ink-soft max-w-[720px]">
                With <b>Gaps on</b> (bottom bar), every live section below shows its vertical gaps in
                pixels at your current screen width, each with a code for notes, e.g. "S7·g2 should be
                32". Measured from the visible text, so a heading's descender room isn't counted.
                "shared" means the gap comes from a spacing token (Heading to text, Heading to content, Text to content, Title to text).
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="sg-gap-key is-heading">heading → text</span>
                <span className="sg-gap-key is-text">text → next element</span>
                <span className="sg-gap-key is-group">group → group (main rows)</span>
                <span className="sg-gap-key is-image">image ↔ heading or text</span>
                <span className="sg-gap-key is-button">to or from a button</span>
                <span className="sg-gap-key is-pad">section padding</span>
              </div>
            </div>
            <div className="sg-table-wrap">
              <table className="sg-spec">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Token</th>
                    {WIDTHS.map((w) => <th key={w.label}>{w.label}</th>)}
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {SPACING_TOKENS.map((name, i) => {
                    const t = SHEET.tokens.find((x) => x.name === name);
                    return (
                      <tr key={name}>
                        <td><span className="sg-id">P{i + 1}</span></td>
                        <td>
                          <b className="text-ink">{t?.note.includes(" · ") ? t.note.split(" · ")[0] : name}</b>{" "}
                          <span className="sg-code text-ink-faint">{name}</span>
                        </td>
                        {WIDTHS.map(({ w, label }) => <td key={label}>{spacingAt(name, w)}</td>)}
                        <td className="text-ink-soft">{t?.note.includes(" · ") ? t.note.split(" · ").slice(1).join(" · ") : t?.value}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Live sections */}
        {SECTIONS.map((s) => (
          <div key={s.id}>
            <SectionBand section={s} />
            <div className="relative">
              {s.render()}
              {gaps && <GapLayer sectionId={s.id} />}
            </div>
          </div>
        ))}
      </main>
      <Dock gaps={gaps} onGaps={toggleGaps} />
    </div>
  );
};

export default StyleGuide;
