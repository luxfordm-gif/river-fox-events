import type { Article, ArticleSummary } from "./types";
import { lazyPage } from "@/lib/lazyPage";

// Each article's text downloads only when that article is opened (speed
// pass, 2026-11-13); the journal list and related cards need just the
// details below. Article.tsx starts the download before the page shows.
const LollipopRebrandBody = lazyPage(() => import("./lollipop-balloons-to-river-fox-events"));
const BeyondTheBalloonArchBody = lazyPage(() => import("./beyond-the-balloon-arch"));
const FromDesignToDeliveryBody = lazyPage(() => import("./from-design-to-delivery"));
const ChildrensPartyThemes2026Body = lazyPage(() => import("./childrens-party-themes-2026"));
const TwoWildSafariSecondBirthdayBody = lazyPage(() => import("./two-wild-safari-second-birthday"));
const GardenMilestoneStylingSurreyBody = lazyPage(() => import("./garden-milestone-styling-surrey"));
const WillyWonkaFifthBirthdaySavannaBody = lazyPage(() => import("./willy-wonka-fifth-birthday-savanna"));
const DylanChristeningFirstBirthdayBody = lazyPage(() => import("./dylan-christening-first-birthday"));
const BabyShowerThemes2026Body = lazyPage(() => import("./baby-shower-themes-2026"));
const ChristmasDecorationsSurreyBody = lazyPage(() => import("./christmas-decorations-surrey"));
const ShimmerWallHireSurreyBody = lazyPage(() => import("./shimmer-wall-hire-surrey"));
const HiringAnEventStylistSurreyBody = lazyPage(() => import("./hiring-an-event-stylist-surrey"));
const FiftiethBirthdayDecorationsSurreyBody = lazyPage(() => import("./50th-birthday-decorations-surrey"));
const BalloonBackdropIdeasHomePartiesBody = lazyPage(() => import("./balloon-backdrop-ideas-home-parties"));
const BalloonArchGarlandOrWallBody = lazyPage(() => import("./balloon-arch-garland-or-wall"));
const QuestionsToAskABalloonDecoratorBody = lazyPage(() => import("./questions-to-ask-a-balloon-decorator"));
const ChristmasBalloonDecorationsSurreyBody = lazyPage(() => import("./christmas-balloon-decorations-surrey"));

import lollipopCard from "@/assets/luxury-event-stylist-surrey-river-fox-events.webp";
import beyondTheArchCard from "@/assets/luxury-party-styling-occasions-surrey.webp";
import designToDeliveryCard from "@/assets/journal/from-design-to-delivery/dinosaur-party-styling-surrey-finished.webp";
import childrensThemesCard from "@/assets/jungle-themed-childrens-party-styling-surrey.webp";
import twoWildCard from "@/assets/journal/two-wild-safari-second-birthday/two-wild-safari-feature-backdrop-concept-horley-surrey.webp";
import gardenMilestoneCard from "@/assets/journal/garden-milestone-styling-surrey/garden-milestone-balloon-arch.webp";
import willyWonkaCard from "@/assets/willy-wonka-savanna-chocolate-arch-surrey.webp";
import dylanChristeningCard from "@/assets/journal/dylan-christening-first-birthday/dylan-christening-arched-welcome-panel-balloon-garland.webp";
import babyShowerThemesCard from "@/assets/baby-shower-baby-in-bloom-arch-surrey.webp";
import christmasDecorationsCard from "@/assets/journal/christmas-decorations-surrey/christmas-doorway-garland-pink-studio-east-molesey.webp";
import hiringStylistCard from "@/assets/river-fox-events-pastel-birthday-reeva-entrance-arch.webp";
import fiftiethCard from "@/assets/services/milestones/50th-birthday-pink-light-up-numbers-teal-garland.webp";
import shimmerWallCard from "@/assets/journal/christmas-decorations-surrey/gold-sequin-wall-black-gold-balloons-office-party.webp";
import backdropIdeasCard from "@/assets/services/milestones/gina-13th-birthday-navy-gold-kitchen-backdrop.webp";
import archGarlandWallCard from "@/assets/river-fox-events-naming-ceremony-harvey-arch-side-angle.webp";
import balloonQuestionsCard from "@/assets/services/milestones/baby-in-bloom-barn-twin-arches-dusty-blue.webp";
import christmasBalloonsCard from "@/assets/journal/christmas-decorations-surrey/merry-christmas-panel-silver-navy-balloon-garland.webp";

/**
 * Master list of articles. Order = newest first.
 *
 * To add a new article:
 *   1. Create `src/data/articles/<slug>.tsx` exporting the body component.
 *   2. Add a `const XBody = lazyPage(() => import("./<slug>"));` line at
 *      the top (so its text downloads only on its own page) and an entry below.
 *   3. Add the route to `src/seo/routes.ts` so it prerenders + appears
 *      in the sitemap.
 *   4. (Optional) Add the previous article's slug to this one's
 *      `relatedSlugs`, and vice versa.
 */
/* Every article, scheduled ones included. Use `ARTICLES` below. */
export const ALL_ARTICLES: Article[] = [
  {
    slug: "balloon-backdrop-ideas-home-parties",
    title: "Balloon backdrop ideas for parties at home",
    subtitle:
      "A kitchen wall, a living room corner, a conservatory, the hallway or the lawn: where a balloon backdrop fits at home, and how to size it to the room.",
    teaser:
      "Seven ways to give a party at home one place to gather, from a navy and gold kitchen panel to a blush hoop by the window, each taken from a setup I've styled.",
    metaDescription:
      "Seven balloon backdrop ideas for parties at home in Surrey, from a navy and gold kitchen panel to light-up numbers in a living room and a picnic on the lawn.",
    // Scheduled: hidden on the live site until this date (see isPublished below).
    publishedAt: "2026-12-03",
    readMinutes: 5,
    relatedSlugs: ["garden-milestone-styling-surrey", "50th-birthday-decorations-surrey", "childrens-party-themes-2026"],
    cardImage: backdropIdeasCard,
    ogImage: "/og/balloon-backdrop-ideas-home-parties.webp",
    category: "Trends",
    Body: BalloonBackdropIdeasHomePartiesBody,
  },
  {
    slug: "balloon-arch-garland-or-wall",
    title: "Arch, garland or wall: which suits your room?",
    subtitle:
      "How to choose between a balloon arch, a garland and a balloon wall by room size, ceiling height and where your guests gather, plus what makes an arch look full.",
    teaser:
      "What an arch, a garland, a balloon wall, a hoop and a number stack each do best, which suits homes, halls, marquees and gardens, and how to tell a full arch from a thin one.",
    metaDescription:
      "Choosing between a balloon arch, garland or balloon wall in Surrey? How room size, ceiling height and where guests gather decide it, with advice from Laura.",
    // Scheduled: hidden on the live site until this date (see isPublished below).
    publishedAt: "2026-11-26",
    readMinutes: 6,
    relatedSlugs: ["beyond-the-balloon-arch", "shimmer-wall-hire-surrey", "50th-birthday-decorations-surrey"],
    cardImage: archGarlandWallCard,
    cardImagePosition: "45% 50%",
    ogImage: "/og/balloon-arch-garland-or-wall.webp",
    category: "Guides",
    Body: BalloonArchGarlandOrWallBody,
  },
  {
    slug: "questions-to-ask-a-balloon-decorator",
    title: "Questions to ask a balloon decorator before you book",
    subtitle:
      "What the quote should cover, how far ahead to book, colour matching, your venue, and how long balloons really last indoors, outdoors and in the wind.",
    teaser:
      "Eight questions worth asking any balloon decorator before you say yes, from set-up and takedown to heat, wind and helium, each with Laura's honest answer.",
    metaDescription:
      "Booking a balloon decorator in Surrey? Eight questions to ask first, from what the quote covers to how long arches last indoors and outdoors, answered by Laura.",
    // Scheduled: hidden on the live site until this date (see isPublished below).
    publishedAt: "2026-11-19",
    readMinutes: 5,
    relatedSlugs: ["hiring-an-event-stylist-surrey", "garden-milestone-styling-surrey", "beyond-the-balloon-arch"],
    cardImage: balloonQuestionsCard,
    cardImagePosition: "center 35%",
    ogImage: "/og/questions-to-ask-a-balloon-decorator.webp",
    category: "Guides",
    Body: QuestionsToAskABalloonDecoratorBody,
  },
  {
    slug: "christmas-balloon-decorations-surrey",
    title: "Christmas balloons for offices, shops and venues",
    subtitle:
      "Balloon garlands and arches for the entrance, backdrops for the office party, and pieces for shop floors and counters, with how to get them booked for December.",
    teaser:
      "Entrance arches, Merry Christmas panels and counter garlands for offices, shops and venues, with real office party pieces and how to book in time for December.",
    metaDescription:
      "Christmas balloon decorations for Surrey offices, shops, salons and venues: entrance arches, Merry Christmas panels and party backdrops, set up before you open.",
    // Scheduled: hidden on the live site until this date (see isPublished below).
    publishedAt: "2026-11-12",
    readMinutes: 5,
    relatedSlugs: ["christmas-decorations-surrey", "shimmer-wall-hire-surrey", "hiring-an-event-stylist-surrey"],
    cardImage: christmasBalloonsCard,
    cardImagePosition: "center 40%",
    ogImage: "/og/christmas-balloon-decorations-surrey.webp",
    category: "Guides",
    Body: ChristmasBalloonDecorationsSurreyBody,
  },
  {
    slug: "50th-birthday-decorations-surrey",
    title: "Styling a 50th that feels like them",
    subtitle:
      "How to choose a colour story for a 50th, the pieces that do the most work, and how I style it at home, in a restaurant or at a hotel.",
    teaser:
      "Two real 50ths, one in navy and gold and one in hot pink and teal, and what they show about choosing colours, numbers and backdrops for the room.",
    metaDescription:
      "Ideas for 50th birthday decorations in Surrey, from navy and gold sequin walls to hot pink light-up numbers, designed by Laura and set up before guests arrive.",
    publishedAt: "2026-11-09",
    readMinutes: 5,
    relatedSlugs: [
      "shimmer-wall-hire-surrey",
      "garden-milestone-styling-surrey",
      "hiring-an-event-stylist-surrey",
    ],
    cardImage: fiftiethCard,
    ogImage: "/og/50th-birthday-decorations-surrey.webp",
    category: "Guides",
    Body: FiftiethBirthdayDecorationsSurreyBody,
  },
  {
    slug: "shimmer-wall-hire-surrey",
    title: "Shimmer wall hire, styled around your room",
    subtitle:
      "Where a shimmer or sequin wall works best, how I frame it with balloons and light-up numbers, and what's included from set-up to taking it all down.",
    teaser:
      "A shimmer wall gives a party one place to gather and a backdrop for every photo. Real walls from an office Christmas party and a unicorn party, and the look that suits a 50th.",
    metaDescription:
      "Shimmer wall and sequin wall hire in Surrey for milestone birthdays, children's parties and office Christmas parties, framed with balloons and set up for you.",
    publishedAt: "2026-11-07",
    readMinutes: 5,
    relatedSlugs: [
      "christmas-decorations-surrey",
      "hiring-an-event-stylist-surrey",
      "beyond-the-balloon-arch",
    ],
    cardImage: shimmerWallCard,
    ogImage: "/og/shimmer-wall-hire-surrey.webp",
    category: "Guides",
    Body: ShimmerWallHireSurreyBody,
  },
  {
    slug: "hiring-an-event-stylist-surrey",
    title: "What's included when you hire an event stylist",
    subtitle:
      "One person from the first idea to the clear-up: the moodboard and render, set-up before guests arrive, taking it all down, and what it costs.",
    teaser:
      "What actually happens when you book an event stylist, from the moodboard and render to install morning, pack-down and pricing, with a real render-to-room example.",
    metaDescription:
      "Hiring an event stylist in Surrey? Here's what's included, from the render and palette to set-up and pack-down, what it costs and why one person does it all.",
    publishedAt: "2026-11-05",
    readMinutes: 5,
    relatedSlugs: [
      "from-design-to-delivery",
      "shimmer-wall-hire-surrey",
      "two-wild-safari-second-birthday",
    ],
    cardImage: hiringStylistCard,
    ogImage: "/og/hiring-an-event-stylist-surrey.webp",
    category: "Guides",
    Body: HiringAnEventStylistSurreyBody,
  },
  {
    slug: "christmas-decorations-surrey",
    title: "Christmas decorations, from front door to dance floor",
    subtitle:
      "Doorway garlands for homes and shops, sequin walls and balloon garlands for the office party, and how to book before the season fills up.",
    teaser:
      "Where Christmas decorating makes the biggest difference - the front door, the shop entrance and the party room - with real doorways and work parties from last season.",
    metaDescription:
      "Christmas party decorations in Surrey, from fresh or faux doorway garlands for homes and shops to sequin walls and LED balloons for the office Christmas party.",
    publishedAt: "2026-11-03",
    readMinutes: 5,
    relatedSlugs: [
      "shimmer-wall-hire-surrey",
      "garden-milestone-styling-surrey",
      "beyond-the-balloon-arch",
    ],
    cardImage: christmasDecorationsCard,
    ogImage: "/og/christmas-decorations-surrey.webp",
    category: "Trends",
    Body: ChristmasDecorationsSurreyBody,
    endCta: {
      heading: (
        <>
          Dress your door{" "}
          <em className="t-accent">for Christmas.</em>
        </>
      ),
      body: "Fresh spruce from early November, or faux whenever you're ready. Send a photo of your door and your postcode, and I'll come back with a quote.",
      label: "Reserve your date",
      href: "/christmas-door-garlands/#enquire",
    },
  },
  {
    slug: "baby-shower-themes-2026",
    title: "Baby shower themes shaping 2026",
    subtitle:
      "From neutral and sage palettes to Little Sunshine and Adventure Awaits - the baby shower themes shaping 2026, and the styling that carries them.",
    teaser:
      "The ten baby shower themes I'm expecting to see across 2026, from calm neutrals and sage to Little Sunshine, Adventure Awaits and Baby in Bloom, and how I'd style each.",
    metaDescription:
      "Ten baby shower themes for 2026, from neutral and sage palettes to Little Sunshine and Adventure Awaits. Balloon installations and backdrops across Surrey.",
    publishedAt: "2026-08-08",
    readMinutes: 6,
    relatedSlugs: [
      "dylan-christening-first-birthday",
      "garden-milestone-styling-surrey",
      "from-design-to-delivery",
    ],
    cardImage: babyShowerThemesCard,
    ogImage: "/og/og-baby-shower-bloom.webp",
    category: "Trends",
    Body: BabyShowerThemes2026Body,
  },
  {
    slug: "dylan-christening-first-birthday",
    title: "Dylan's Christening & First Birthday",
    subtitle:
      "A combined christening and first birthday near Walton-on-Thames - a sky-blue and chrome-gold balloon hoop set beside a personalised arched welcome backdrop.",
    teaser:
      "Two milestones, one day. Dylan's combined christening and first birthday near Walton-on-Thames - a balloon hoop, a personalised backdrop and the animals from his invite.",
    metaDescription:
      "Dylan's combined christening and first birthday near Walton-on-Thames - a sky-blue and chrome-gold balloon hoop with a personalised backdrop, styled by Laura.",
    publishedAt: "2026-05-29",
    readMinutes: 4,
    relatedSlugs: [
      "willy-wonka-fifth-birthday-savanna",
      "two-wild-safari-second-birthday",
      "from-design-to-delivery",
    ],
    cardImage: dylanChristeningCard,
    ogImage: "/og/dylan-christening-first-birthday.webp",
    category: "Case study",
    Body: DylanChristeningFirstBirthdayBody,
  },
  {
    slug: "willy-wonka-fifth-birthday-savanna",
    title: "Savanna's Willy Wonka fifth birthday",
    subtitle:
      "A Willy Wonka fifth in a Surrey home - purple-and-gold ticket panel, painted cocoa-bar plinth and one carefully designed threshold.",
    teaser:
      "A themed fifth doesn't have to mean shop-bought. Savanna's Willy Wonka party - designed around the child, not the theme.",
    metaDescription:
      "Savanna's Willy Wonka fifth birthday in Surrey - purple-and-gold ticket arch, lollipop swirls and a personalised cocoa-bar plinth. Case study from Laura.",
    publishedAt: "2026-05-19",
    readMinutes: 4,
    relatedSlugs: [
      "childrens-party-themes-2026",
      "two-wild-safari-second-birthday",
      "from-design-to-delivery",
    ],
    cardImage: willyWonkaCard,
    ogImage: "/og/willy-wonka-fifth-birthday-savanna.webp",
    category: "Case study",
    Body: WillyWonkaFifthBirthdaySavannaBody,
  },
  {
    slug: "garden-milestone-styling-surrey",
    title: "Summer garden parties, done right",
    subtitle:
      "What makes a garden party feel effortless - reading the planting, planning the practical bits, and styling so everything belongs in the garden.",
    teaser:
      "Long golden evenings and a relaxed lawn - the best garden parties only look effortless. Laura on palette, zones, power and British-weather planning.",
    metaDescription:
      "How to style a summer garden party in Surrey so it feels part of the garden, not dropped on top - palette, zones, power, weather and the prep, from Laura.",
    publishedAt: "2026-05-08",
    readMinutes: 6,
    relatedSlugs: ["beyond-the-balloon-arch", "childrens-party-themes-2026", "from-design-to-delivery"],
    cardImage: gardenMilestoneCard,
    ogImage: "/og/garden-milestone-styling-surrey.webp",
    category: "Trends",
    Body: GardenMilestoneStylingSurreyBody,
  },
  {
    slug: "two-wild-safari-second-birthday",
    title: "Two Wild: a safari second birthday in Horley",
    subtitle:
      "How a 'Two Wild' celebration at Horley Community Centre moved from two concept renders to a finished room.",
    teaser:
      "Amiya's 'Two Wild' second birthday at Horley Community Centre - designed across two render boards, sourced over three weeks, installed in six hours.",
    metaDescription:
      "Behind the scenes of Amiya's 'Two Wild' safari second birthday at Horley Community Centre - concept renders to finished install. Pastel safari styling by Laura at River Fox Events.",
    publishedAt: "2026-05-02",
    readMinutes: 7,
    relatedSlugs: ["from-design-to-delivery", "childrens-party-themes-2026", "beyond-the-balloon-arch"],
    cardImage: twoWildCard,
    ogImage: "/og/two-wild-safari-second-birthday.webp",
    category: "Behind the scenes",
    Body: TwoWildSafariSecondBirthdayBody,
  },
  {
    slug: "childrens-party-themes-2026",
    title: "Six children's party themes shaping 2026",
    subtitle:
      "From Chateaucore to charm-bracelet stations - the briefs landing in our Surrey studio right now.",
    teaser:
      "Themes are still everything for a 4th or 6th - but the version of \"themed\" parents are asking for in 2026 is grown-up and personal. Here's the brief-bag.",
    metaDescription:
      "Six children's party themes Surrey parents are asking for in 2026 - Chateaucore, Bluey done well, soft maximalism, charm-bracelet stations, woodland and Toy Story 5. From Laura at River Fox Events.",
    publishedAt: "2026-05-01",
    readMinutes: 6,
    relatedSlugs: ["from-design-to-delivery", "two-wild-safari-second-birthday", "beyond-the-balloon-arch", "lollipop-balloons-to-river-fox-events"],
    cardImage: childrensThemesCard,
    ogImage: "/og/childrens-party-themes-2026.webp",
    category: "Trends",
    Body: ChildrensPartyThemes2026Body,
  },
  {
    slug: "from-design-to-delivery",
    title: "From design to delivery",
    subtitle:
      "How a dinosaur-themed celebration in Surrey moved from a hand-drawn render to a finished room.",
    teaser:
      "Every setup begins long before the day itself. Walking through Ayaan's dinosaur celebration - render, sourcing, install - to show how the sketch becomes the room.",
    metaDescription:
      "Behind the scenes of a Surrey children's party - from concept render to finished install. Laura on how design, sourcing and delivery come together at River Fox Events.",
    publishedAt: "2026-05-01",
    readMinutes: 6,
    relatedSlugs: ["two-wild-safari-second-birthday", "childrens-party-themes-2026", "beyond-the-balloon-arch", "lollipop-balloons-to-river-fox-events"],
    cardImage: designToDeliveryCard,
    ogImage: "/og/from-design-to-delivery.webp",
    category: "Behind the scenes",
    Body: FromDesignToDeliveryBody,
  },
  {
    slug: "beyond-the-balloon-arch",
    title: "Beyond the balloon arch",
    subtitle:
      "Why Surrey celebrations are trading entrance installations for layered tablescapes in 2026.",
    teaser:
      "The balloon arch ruled the entrance for a decade. In 2026, the same budget is moving onto the table - a note from Laura on what's changing and why.",
    metaDescription:
      "The balloon arch is no longer the headline. A note from Laura on layered tablescapes, ceiling drapery and the 2026 trends shaping Surrey celebrations.",
    publishedAt: "2026-05-01",
    readMinutes: 5,
    relatedSlugs: ["childrens-party-themes-2026", "from-design-to-delivery", "lollipop-balloons-to-river-fox-events"],
    cardImage: beyondTheArchCard,
    ogImage: "/og/beyond-the-balloon-arch.webp",
    category: "Trends",
    Body: BeyondTheBalloonArchBody,
  },
  {
    slug: "lollipop-balloons-to-river-fox-events",
    title: "Lollipop Balloons is now River Fox Events",
    subtitle:
      "A new name, the same hands. Same studio in Surrey. Same level of detail.",
    teaser:
      "After several years as Lollipop Balloons, we're stepping into a new name - and explaining why.",
    metaDescription:
      "Lollipop Balloons is now River Fox Events. Same designer (Laura), same Surrey studio, new name reflecting children's parties, milestones and corporate event styling.",
    publishedAt: "2026-05-01",
    readMinutes: 3,
    relatedSlugs: ["beyond-the-balloon-arch"],
    cardImage: lollipopCard,
    cardImagePosition: "center 60%",
    ogImage: "/og/lollipop-balloons-to-river-fox-events.webp",
    category: "Studio news",
    Body: LollipopRebrandBody,
  },
];

/* Scheduled articles (Matt, 2026-11-09): an article dated after today stays
   off the live site (journal list, its page, related links) until that date.
   Deploy previews and local builds show everything. The date check runs at
   build time; .github/workflows/publish-scheduled-articles.yml rebuilds the
   site each morning an article is due. */
const HIDE_SCHEDULED = typeof __HIDE_SCHEDULED__ !== "undefined" && __HIDE_SCHEDULED__;
const BUILD_DATE = typeof __BUILD_DATE__ !== "undefined" ? __BUILD_DATE__ : "";
export const isPublished = (a: Pick<Article, "publishedAt">) =>
  !HIDE_SCHEDULED || a.publishedAt <= BUILD_DATE;

export const ARTICLES: Article[] = ALL_ARTICLES.filter(isPublished);

export const findArticle = (slug: string): Article | undefined =>
  ARTICLES.find((a) => a.slug === slug);

export const summariseArticle = (a: Article): ArticleSummary => {
  // strip the Body component out so summary can be passed to client
  // components without dragging the full article tree along
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { Body, ...summary } = a;
  return summary;
};

export const findRelated = (slug: string): ArticleSummary[] => {
  const article = findArticle(slug);
  if (!article?.relatedSlugs?.length) return [];
  return article.relatedSlugs
    .map((s) => findArticle(s))
    .filter((a): a is Article => Boolean(a))
    .map(summariseArticle);
};

export type { Article, ArticleSummary };
