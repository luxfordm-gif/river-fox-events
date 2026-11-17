/**
 * "How it works" scenarios (Matt, 2026-11-17). Each page shows one example
 * party in the three steps: step 1 is a short WhatsApp-style chat, step 2 the
 * hand-drawn concept Laura sends, step 3 the finished event. The sketch, the
 * photo and the chat all describe the same party, so a scenario is one record.
 *
 * - Sketches: src/assets/how-it-works/<name>-600.webp and -1100.webp (3:2).
 * - Photos: gallery photos where they exist (one image, one alt), otherwise
 *   the service photo with the alt it already has in inspiration.ts.
 * - Chat: placeholder enquiry text. No weekdays, so dates never go stale.
 *
 * Which page uses which scenario is set on the page (see SCENARIOS below);
 * the town pages rotate through TOWN_SCENARIOS by their place in TOWNS.
 */
import { galleryPhoto } from "@/data/gallery";
import { INSPIRATION_CHILDRENS } from "@/data/inspiration";

import berryPhoto from "@/assets/services/childrens-parties/berry-first-birthday-strawberry-balloon-backdrop.webp";
import unicornPhoto from "@/assets/services/childrens-parties/rainbow-unicorn-party-pastel-sequin-backdrop.webp";
import rodeoPhoto from "@/assets/services/childrens-parties/rudys-rodeo-cowboy-party-backdrop.webp";

import dino600 from "@/assets/how-it-works/dinosaur-party-concept-sketch-600.webp";
import dino1100 from "@/assets/how-it-works/dinosaur-party-concept-sketch-1100.webp";
import berry600 from "@/assets/how-it-works/berry-first-birthday-concept-sketch-600.webp";
import berry1100 from "@/assets/how-it-works/berry-first-birthday-concept-sketch-1100.webp";
import unicorn600 from "@/assets/how-it-works/rainbow-unicorn-party-concept-sketch-600.webp";
import unicorn1100 from "@/assets/how-it-works/rainbow-unicorn-party-concept-sketch-1100.webp";
import rodeo600 from "@/assets/how-it-works/rodeo-cowboy-party-concept-sketch-600.webp";
import rodeo1100 from "@/assets/how-it-works/rodeo-cowboy-party-concept-sketch-1100.webp";
import fifty600 from "@/assets/how-it-works/50th-sequin-wall-concept-sketch-600.webp";
import fifty1100 from "@/assets/how-it-works/50th-sequin-wall-concept-sketch-1100.webp";
import restaurant600 from "@/assets/how-it-works/restaurant-entrance-arch-concept-sketch-600.webp";
import restaurant1100 from "@/assets/how-it-works/restaurant-entrance-arch-concept-sketch-1100.webp";
import pastel600 from "@/assets/how-it-works/pastel-entrance-arch-concept-sketch-600.webp";
import pastel1100 from "@/assets/how-it-works/pastel-entrance-arch-concept-sketch-1100.webp";

export type ChatLine = { side: "them" | "me"; text: string };

export type Picture = { src: string; srcSet?: string; alt: string };

export type Scenario = {
  id: string;
  /** Step 1: the enquiry chat. The incoming call from Laura is added after it. */
  chat: ChatLine[];
  /** Step 2: the hand-drawn concept. */
  sketch: Picture;
  /** Step 3: the finished event. */
  photo: Picture;
};

/** Laura's reply is the same in every chat. */
const REPLY: ChatLine = { side: "me", text: "Lovely. Send me the date and venue and I'll give you a call." };

const sketch = (small: string, large: string, alt: string): Picture => ({
  src: large,
  srcSet: `${small} 600w, ${large} 1100w`,
  alt,
});

const gallery = (source: string): Picture => {
  const p = galleryPhoto(source);
  return { src: p.src, srcSet: p.srcSet, alt: p.alt };
};

/** A service photo that isn't in the Our work gallery, with the alt it already has. */
const inspiration = (src: string): Picture => ({
  src,
  alt: INSPIRATION_CHILDRENS.find((i) => i.src === src)?.alt ?? "",
});

const dinosaur: Scenario = {
  id: "dinosaur",
  chat: [
    { side: "them", text: "Hi Laura, my son Ayaan is turning 5 in June." },
    { side: "them", text: "He's obsessed with dinosaurs. Can you style his party?" },
    REPLY,
    { side: "them", text: "14 June, at home in Cobham." },
  ],
  sketch: sketch(dino600, dino1100, "Dinosaur party concept drawing with labelled balloon garlands, wooden crates and cardboard dinosaurs"),
  photo: gallery("journal/from-design-to-delivery/dinosaur-party-styling-surrey-finished.webp"),
};

const berry: Scenario = {
  id: "berry",
  chat: [
    { side: "them", text: "Hi Laura, my daughter Mila is turning 1 in July." },
    { side: "them", text: "I'd love something with strawberries. Can you style her party?" },
    REPLY,
    { side: "them", text: "12 July, at home in Weybridge." },
  ],
  sketch: sketch(berry600, berry1100, "Berry first birthday concept drawing of an arch with red and pink balloons and strawberry details"),
  photo: inspiration(berryPhoto),
};

const unicorn: Scenario = {
  id: "unicorn",
  chat: [
    { side: "them", text: "Hi Laura, my daughter Ava is turning 6 in August." },
    { side: "them", text: "She loves unicorns and rainbows. Can you style her party?" },
    REPLY,
    { side: "them", text: "23 August, at home in Esher." },
  ],
  sketch: sketch(unicorn600, unicorn1100, "Unicorn and rainbow party concept drawing with a pastel balloon arch, shimmer wall and clouds"),
  photo: inspiration(unicornPhoto),
};

const rodeo: Scenario = {
  id: "rodeo",
  chat: [
    { side: "them", text: "Hi Laura, my son Rudy is turning 3 in September." },
    { side: "them", text: "He wants a cowboy party with a horse. Can you style it?" },
    REPLY,
    { side: "them", text: "20 September, at home in Guildford." },
  ],
  sketch: sketch(rodeo600, rodeo1100, "Cowboy rodeo party concept drawing with a horse, rope, hay and a sage, yellow and pink balloon garland"),
  photo: inspiration(rodeoPhoto),
};

const fifty: Scenario = {
  id: "fifty",
  chat: [
    { side: "them", text: "Hi Laura, my husband turns 50 in October." },
    { side: "them", text: "He loves navy and gold. Can you style his party?" },
    REPLY,
    { side: "them", text: "18 October, at the golf club in Cobham." },
  ],
  sketch: sketch(fifty600, fifty1100, "50th birthday concept drawing with a gold sequin wall, light-up 50 numbers and a navy and gold garland"),
  photo: gallery("services/milestones/50th-birthday-gold-sequin-wall-navy-garland.webp"),
};

const restaurant: Scenario = {
  id: "restaurant",
  chat: [
    { side: "them", text: "Hi Laura, we're reopening our restaurant in the spring." },
    { side: "them", text: "We'd like a statement entrance. Can you style it?" },
    REPLY,
    { side: "them", text: "12 March, at our restaurant in Reigate." },
  ],
  sketch: sketch(restaurant600, restaurant1100, "Restaurant opening concept drawing with a black and gold balloon arch over a glass entrance"),
  photo: gallery("services/corporate/restaurant-entrance-garland-black-gold-balloons.webp"),
};

const pastelArch: Scenario = {
  id: "pastel-arch",
  chat: [
    { side: "them", text: "Hi Laura, my daughter Reeva is turning 2 in May." },
    { side: "them", text: "I'd love a pastel balloon arch over the front door." },
    REPLY,
    { side: "them", text: "17 May, at home in Esher." },
  ],
  sketch: sketch(pastel600, pastel1100, "Pastel entrance arch concept drawing with a balloon arch framing a front door and a welcome sign"),
  photo: gallery("river-fox-events-pastel-birthday-reeva-entrance-arch.webp"),
};

/** The scenario each page type uses. The home page and the default are the dinosaur party. */
export const SCENARIOS = { dinosaur, berry, unicorn, rodeo, fifty, restaurant, pastelArch } as const;

/** Town pages take these in turn, by their place in TOWNS, so neighbouring towns differ. */
export const TOWN_SCENARIOS: Scenario[] = [dinosaur, berry, unicorn];

/** The scenario for the town at this position in TOWNS. */
export const scenarioForTown = (index: number): Scenario => TOWN_SCENARIOS[Math.max(0, index) % TOWN_SCENARIOS.length];
