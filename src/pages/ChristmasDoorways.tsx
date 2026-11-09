import { useEffect, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import Nav from "@/components/rfx/Nav";
import Footer from "@/components/rfx/Footer";
import HeroGarland from "@/components/rfx/HeroGarland";
import LocationHeroFan from "@/components/rfx/LocationHeroFan";
import ScrollStrip from "@/components/rfx/ScrollStrip";
import InstagramStrip from "@/components/rfx/InstagramStrip";
import SnowCap from "@/components/rfx/SnowCap";
import StoryVideos, { type Story } from "@/components/rfx/StoryVideos";
import ChildrensFAQ from "@/components/rfx/ChildrensFAQ";
import bow160 from "@/assets/christmas/burgundy-velvet-bow-160.webp";
import bow320 from "@/assets/christmas/burgundy-velvet-bow-320.webp";
import { useFadeUp, useNavScroll } from "@/hooks/useRiverFox";
import { handleEnquireClick } from "@/lib/enquire";
import { findRoute } from "@/seo/routes";
import {
  applyMeta,
  breadcrumbSchema,
  removeJsonLd,
  routeServiceSchema,
  upsertJsonLd,
} from "@/seo/headTags";
import "@/styles/christmas.css";

import door420 from "@/assets/christmas/black-front-door-gold-ribbon-garland-red-brick-420.webp";
import door640 from "@/assets/christmas/black-front-door-gold-ribbon-garland-red-brick-640.webp";
import door838 from "@/assets/christmas/black-front-door-gold-ribbon-garland-red-brick-838.webp";
import goldDetail420 from "@/assets/christmas/gold-star-pine-cone-bauble-spruce-detail-420.webp";
import goldDetail640 from "@/assets/christmas/gold-star-pine-cone-bauble-spruce-detail-640.webp";
import goldDetail838 from "@/assets/christmas/gold-star-pine-cone-bauble-spruce-detail-838.webp";
import shop420 from "@/assets/christmas/salon-shopfront-red-bauble-corner-garland-420.webp";
import shop640 from "@/assets/christmas/salon-shopfront-red-bauble-corner-garland-640.webp";
import shop838 from "@/assets/christmas/salon-shopfront-red-bauble-corner-garland-838.webp";
import redDetail420 from "@/assets/christmas/red-baubles-eucalyptus-spruce-detail-420.webp";
import redDetail640 from "@/assets/christmas/red-baubles-eucalyptus-spruce-detail-640.webp";
import redDetail838 from "@/assets/christmas/red-baubles-eucalyptus-spruce-detail-838.webp";
import igNavy from "@/assets/christmas/instagram/navy-door-jewel-bauble-arch-wreath.webp";
import igSalon from "@/assets/christmas/instagram/glass-salon-true-red-corner-garland.webp";
import igPillars from "@/assets/christmas/instagram/brick-pillars-red-gold-garlands-sage-door.webp";
import igReigate from "@/assets/christmas/instagram/reigate-restaurant-red-gold-garland-blue-doors.webp";
import igBlueDoor from "@/assets/christmas/instagram/blue-door-spruce-garland-silver-white-baubles.webp";
import igPilates from "@/assets/christmas/instagram/pink-pilates-studio-garland-blush-red-baubles.webp";
import igCream from "@/assets/christmas/instagram/cream-door-brick-porch-jewel-garland.webp";
import igMedispa from "@/assets/christmas/instagram/medispa-entrance-frosted-white-silver-garland.webp";
import igWhiteDoor from "@/assets/christmas/instagram/white-door-wreath-pink-plum-garland.webp";
import igLaura from "@/assets/christmas/instagram/laura-reigate-restaurant-doorway-garland.webp";
import igGeorgian from "@/assets/christmas/instagram/georgian-door-gold-champagne-garland.webp";
import igPinkShop from "@/assets/christmas/instagram/pink-shopfront-red-white-window-garland.webp";
import igDetail from "@/assets/christmas/instagram/pink-doorframe-red-silver-bauble-detail.webp";
import igLedge from "@/assets/christmas/instagram/restaurant-window-ledge-red-bauble-garland.webp";
import igPillar from "@/assets/christmas/instagram/pink-studio-pillar-garland-detail.webp";
import imgRestaurant from "@/assets/christmas/blue-restaurant-doorway-red-bauble-garland.webp";
import imgJewel from "@/assets/christmas/jewel-tone-bauble-arch-white-porch.webp";
import imgBondi from "@/assets/journal/christmas-decorations-surrey/christmas-doorway-garland-pink-studio-east-molesey.webp";
import imgGarland800 from "@/assets/christmas/lush-garland-velvet-bows-red-gold-baubles-800.webp";
import imgGarland1200 from "@/assets/christmas/lush-garland-velvet-bows-red-gold-baubles-1200.webp";
import imgGarland1440 from "@/assets/christmas/lush-garland-velvet-bows-red-gold-baubles-1440.webp";

import adWonky from "@/assets/christmas/video/christmas-ad-wonky-garland.mp4";
import adWonkyPoster from "@/assets/christmas/video/christmas-ad-wonky-garland-poster.webp";
import adTree from "@/assets/christmas/video/christmas-ad-diy-tree.mp4";
import adTreePoster from "@/assets/christmas/video/christmas-ad-diy-tree-poster.webp";
import adSnowball from "@/assets/christmas/video/christmas-ad-snowball.mp4";
import adSnowballPoster from "@/assets/christmas/video/christmas-ad-snowball-poster.webp";
import adLadder from "@/assets/christmas/video/christmas-ad-ladder-in-the-rain.mp4";
import adLadderPoster from "@/assets/christmas/video/christmas-ad-ladder-in-the-rain-poster.webp";
import adSwitchOn from "@/assets/christmas/video/christmas-ad-big-switch-on.mp4";
import adSwitchOnPoster from "@/assets/christmas/video/christmas-ad-big-switch-on-poster.webp";
import adDog from "@/assets/christmas/video/christmas-ad-dog-and-squirrel.mp4";
import adDogPoster from "@/assets/christmas/video/christmas-ad-dog-and-squirrel-poster.webp";
import adCarols from "@/assets/christmas/video/christmas-ad-carol-singers.mp4";
import adCarolsPoster from "@/assets/christmas/video/christmas-ad-carol-singers-poster.webp";
import fanSwitchOn from "@/assets/christmas/video/family-porch-garland-lights-switch-on.webp";
import fanLadder from "@/assets/christmas/video/porch-garland-sliding-off-stepladder.webp";
import fanSnowball from "@/assets/christmas/video/porch-garland-falling-onto-woman-below.webp";
import fanDog from "@/assets/christmas/video/woman-running-after-dragged-lit-garland.webp";
import adThumb360 from "@/assets/christmas/video/cream-house-door-lit-jewel-bauble-garland-360.webp";
import adThumb540 from "@/assets/christmas/video/cream-house-door-lit-jewel-bauble-garland-540.webp";
import adThumb720 from "@/assets/christmas/video/cream-house-door-lit-jewel-bauble-garland-720.webp";

/* Christmas ad: Laura's Instagram story videos, played full screen from one
   thumbnail tile in the inspiration section. Videos only load once the tile
   is tapped. */
const AD_STORIES: Story[] = [
  { src: adWonky, poster: adWonkyPoster, label: "A homemade porch garland sags and ends up on the step, then a styled doorway glows with baubles" },
  { src: adTree, poster: adTreePoster, label: "A DIY garland gets no further than a string outline and a few spruce cuttings" },
  { src: adSnowball, poster: adSnowballPoster, label: "A child's snowball knocks the porch garland down onto a woman standing beneath it" },
  { src: adLadder, poster: adLadderPoster, label: "Hanging a garland from a stepladder in the rain goes wrong" },
  { src: adSwitchOn, poster: adSwitchOnPoster, label: "A family gathers for the garland lights switch-on, and it fizzles out with a spark" },
  { src: adDog, poster: adDogPoster, label: "A passing dog chases a squirrel and its lead pulls the lit garland down" },
  { src: adCarols, poster: adCarolsPoster, label: "Carol singers scatter as the porch garland falls behind them, leaving song sheets and baubles on the path" },
];
const AD_THUMB = {
  src: adThumb540,
  srcSet: `${adThumb360} 360w, ${adThumb540} 540w, ${adThumb720} 720w`,
  alt: "Black front door with a jewel bauble wreath, framed by a lit spruce arch of multicoloured baubles at dusk",
};
const AD_ANCHOR = "christmas-ad";
/* Stills from the DIY mishaps that fan out behind the tile, left to right;
   each opens its own film. All seven films share one porch, so each still is
   a close crop with its moment on the side that shows when fanned (left
   cards: left edge, right cards: right edge). Decorative, so no alt text. */
const AD_FAN = [
  { src: fanSwitchOn, story: 4 },
  { src: fanLadder, story: 3 },
  { src: fanSnowball, story: 2 },
  { src: fanDog, story: 5 },
];

/* Hero WhatsApp button (phones): message pre-filled, they add a postcode. */
const WHATSAPP_HREF =
  "https://wa.me/447872114191?text=Hi%20Laura%2C%20I%27d%20like%20a%20quote%20for%20a%20Christmas%20door%20garland.%20My%20postcode%20is%20";
const WHATSAPP_HREF_BUSINESS =
  "https://wa.me/447872114191?text=Hi%20Laura%2C%20I%27d%20like%20a%20quote%20for%20Christmas%20decorations%20for%20my%20business.%20My%20postcode%20is%20";

/* Hero fan, left to right. On phones the same three run as a scroll strip. */
const FAN = [
  {
    src: imgJewel,
    alt: "Jewel-toned baubles in pink, teal and purple on a spruce arch over a white house porch",
    objectPosition: "6% 30%",
  },
  {
    src: imgBondi,
    alt: "Frosted fir garland with red, blush and white baubles and candy canes framing a pink pilates studio doorway",
    objectPosition: "50% 50%",
  },
  {
    src: imgRestaurant,
    alt: "Blue shopfront doorway with a spruce garland of large red and champagne baubles running up the frame",
    objectPosition: "82% 50%",
  },
] as const;

/* The business version leads with shopfronts (same files, same alt text). */
const FAN_BUSINESS = [
  {
    src: igSalon,
    alt: "Glass salon frontage with a spruce corner garland weighed down with true-red baubles",
    objectPosition: "30% 50%",
  },
  {
    src: igReigate,
    alt: "Blue restaurant double doors in Reigate edged with red and gold bauble garlands",
    objectPosition: "50% 50%",
  },
  {
    src: imgBondi,
    alt: "Frosted fir garland with red, blush and white baubles and candy canes framing a pink pilates studio doorway",
    objectPosition: "50% 50%",
  },
] as const;

/* Garland types, in the order they sit under the cutout. Titles double as
   the booking form's "Garland" option values. */
const GARLAND_OPTIONS = [
  {
    title: "Fresh spruce",
    note: "Naturally festive",
    popular: true,
    body: "Nothing captures Christmas like the scent of fresh spruce. Installed from early November, it lasts into January.",
    link: "Enquire about fresh spruce",
  },
  {
    title: "Faux",
    note: "Beautiful all season",
    body: "A beautifully full garland, installed whenever you wish and enjoyed year after year.",
    link: "Enquire about faux garlands",
  },
];

/* FAQ answers also go out as FAQPage structured data (ChildrensFAQ). */
const AREAS_FAQ = {
    q: "Which areas do you cover?",
    a: "All of Surrey. I dress doorways in Cobham, Esher, Weybridge, Oxshott, Walton-on-Thames, Kingston, Twickenham, East Molesey, Kingswood, Tadworth, Banstead, Epsom, Leatherhead, Dorking, Reigate, Redhill, Guildford, Oxted and Horley, where my studio is, and the villages in between. If your town isn't listed, send your postcode and I'll confirm.",
    aNode: (
      <>
        All of Surrey. I dress doorways in <a href="/party-styling-cobham/" className="text-link">Cobham</a>,{" "}
        <a href="/party-styling-esher/" className="text-link">Esher</a>, <a href="/party-styling-weybridge/" className="text-link">Weybridge</a>,{" "}
        <a href="/party-styling-oxshott/" className="text-link">Oxshott</a>,{" "}
        <a href="/party-styling-walton-on-thames/" className="text-link">Walton-on-Thames</a>, Kingston,
        Twickenham, East Molesey, Kingswood, Tadworth, Banstead,{" "}
        <a href="/party-styling-epsom/" className="text-link">Epsom</a>, Leatherhead,{" "}
        <a href="/party-styling-dorking/" className="text-link">Dorking</a>, <a href="/party-styling-reigate/" className="text-link">Reigate</a>,
        Redhill, <a href="/party-styling-guildford/" className="text-link">Guildford</a>,{" "}
        <a href="/party-styling-oxted/" className="text-link">Oxted</a> and Horley, where my studio is, and the
        villages in between. If your town isn't listed, send your postcode and
        I'll confirm.
      </>
    ),
};

const FRESH_OR_FAUX_FAQ = {
  q: "What's the difference between fresh spruce and faux?",
  a: "Fresh spruce brings the scent and natural foliage of a real Christmas tree, and lasts through the festive season into January. Faux is beautifully full, can go up whenever you wish, and can be enjoyed year after year.",
};

const TAKEDOWN_FAQ = {
  q: "Is the January takedown included?",
  a: "Takedown is an optional extra. Add it when you book, or let me know before Christmas, and I'll come back in January to take everything down and leave your doorway as I found it.",
};

const FAQS_HOME = [
  AREAS_FAQ,
  {
    q: "Do you travel outside Surrey?",
    a: "Often, yes. I regularly travel into south-west London and the neighbouring Home Counties for the right doorway. Mention your postcode when you enquire and I'll let you know.",
  },
  {
    q: "When should I book my Christmas doorway?",
    a: "Christmas garlands are a seasonal favourite, and installation dates are limited. I recommend enquiring as early as possible.",
  },
  {
    q: "When will my garland go up?",
    a: "Faux garlands can be installed whenever you wish. Fresh spruce is installed from early November and lasts beautifully through the festive season and into January. We'll agree the date when you book.",
  },
  {
    q: "Do you dress doorways for businesses as well as homes?",
    a: "Yes. I dress front doors and porches for homes, and entrances for shops, salons, restaurants, clinics and offices, styled to your paintwork or brand colours. For Christmas parties and displays inside, have a look at my Christmas decorations journal.",
    aNode: (
      <>
        Yes. I dress front doors and porches for homes, and{" "}
        <a href="/commercial-christmas-decorations/" className="text-link">
          entrances for shops, salons, restaurants, clinics and offices
        </a>
        , styled to your paintwork or brand colours. For Christmas parties and
        displays inside, have a look at my{" "}
        <a href="/journal/christmas-decorations-surrey/" className="text-link">
          Christmas decorations journal
        </a>
        .
      </>
    ),
  },
  FRESH_OR_FAUX_FAQ,
  {
    q: "Can you match my door, brick or brand colours?",
    a: "Always. Every doorway starts with your paintwork, so the baubles, ribbon and accents are chosen to suit your door, brickwork or brand rather than taken from a set design.",
  },
  {
    q: "What do you need from me for a quote?",
    a: "A photo of your door, rough measurements and your postcode. I'll come back with ideas, a colour palette and a quote.",
  },
  TAKEDOWN_FAQ,
];

/* Business version: the questions a shop, salon or restaurant asks first. */
const FAQS_BUSINESS = [
  {
    q: "Can you install around our opening hours?",
    a: "Yes. Tell me your opening hours when you enquire and I'll arrange the install around them, so your customers walk up to a finished entrance.",
  },
  {
    q: "Can you match our brand colours?",
    a: "Always. Every entrance starts with your shopfront and your brand, so the baubles, ribbon and accents are chosen to suit your paintwork, signage and colours rather than taken from a set design.",
  },
  {
    q: "Do you decorate inside as well as the entrance?",
    a: "Yes. Alongside entrance garlands I style Christmas balloon displays for salons and shop floors, and Christmas parties for teams, from sequin walls to balloon garlands. My corporate and brand styling page has more.",
    aNode: (
      <>
        Yes. Alongside entrance garlands I style Christmas balloon displays for
        salons and shop floors, and Christmas parties for teams, from sequin
        walls to balloon garlands. My{" "}
        <a href="/corporate-brand-styling/" className="text-link">
          corporate and brand styling
        </a>{" "}
        page has more.
      </>
    ),
  },
  AREAS_FAQ,
  {
    q: "When should we book?",
    a: "As early as you can. Install dates in late November and early December go first, and most businesses like their entrance dressed before the Christmas shopping weekends begin.",
  },
  FRESH_OR_FAUX_FAQ,
  {
    q: "What do you need from us for a quote?",
    a: "A photo of your entrance or shopfront, rough measurements and your postcode. Your brand colours help too. I'll come back with ideas, a colour palette and a quote.",
  },
  TAKEDOWN_FAQ,
];

/* Instagram strip: Laura's own doorway posts, homes and shopfronts
   alternating. */
const INSTAGRAM = [
  { src: igNavy, alt: "Navy front door beneath a spruce arch crowded with pink, purple, teal and gold baubles" },
  { src: igSalon, alt: "Glass salon frontage with a spruce corner garland weighed down with true-red baubles" },
  { src: igPillars, alt: "Brick porch pillars wound with red, gold and green garlands either side of a sage door" },
  { src: igReigate, alt: "Blue restaurant double doors in Reigate edged with red and gold bauble garlands" },
  { src: igBlueDoor, alt: "Blue front door framed in real spruce with blue, white and silver baubles" },
  { src: igPilates, alt: "Pink pilates studio doorway in East Molesey dressed in spruce with blush, white and red baubles" },
  { src: igCream, alt: "Cream front door under a brick porch, framed by spruce with jewel-toned baubles" },
  { src: igMedispa, alt: "Medispa entrance framed in frosted spruce with white and silver baubles" },
  { src: igWhiteDoor, alt: "White front door edged in a spruce garland of pink, plum, gold and red baubles" },
  { src: igLaura, alt: "Laura with arms out beside a blue restaurant doorway dressed in red and gold bauble garlands" },
  { src: igGeorgian, alt: "Georgian black door at number 16 framed in spruce with gold and champagne baubles and stars" },
  { src: igPinkShop, alt: "Pink shopfront with a spruce garland of red and white baubles running along the window base" },
  { src: igDetail, alt: "Detail of a spruce garland on a pink door frame with red, silver and gold baubles" },
  { src: igLedge, alt: "Restaurant window ledge lined with a spruce garland of red and cream baubles beside bistro chairs" },
  { src: igPillar, alt: "Pillar garland on a pink studio front mixing red, white and gold baubles with spruce" },
];

/* Business version: shopfronts, salons and restaurants only. */
const INSTAGRAM_BUSINESS = INSTAGRAM.filter((img) =>
  [igSalon, igReigate, igPilates, igMedispa, igLaura, igPinkShop, igLedge, igPillar, igDetail].includes(img.src)
);

/* "What we do" cards. Each has a wide shot and a close-up of the garland;
   the close-up fades in on hover, or on touch screens as the card reaches
   the middle of the screen. */
const srcSet = (a: string, b: string, c: string) => `${a} 420w, ${b} 640w, ${c} 838w`;

type Card = {
  img: string;
  srcSet?: string;
  alt: string;
  detail: string;
  detailSrcSet?: string;
  detailAlt: string;
  /** Crop for the close-up, when the default centre misses the garland. */
  detailPosition?: string;
  title: string;
  body: ReactNode[];
};

const CARD_HOME: Card = {
    img: door640,
    srcSet: srcSet(door420, door640, door838),
    alt: "Black Georgian front door with a spruce garland of gold ribbons, stars and baubles arching over the fanlight",
    detail: goldDetail640,
    detailSrcSet: srcSet(goldDetail420, goldDetail640, goldDetail838),
    detailAlt: "Gold star, frosted pine cone and gold bauble tucked into spruce with a gold ribbon bow",
    title: "Front doors and porches",
    body: [
      "From a generous sweep of greenery to a fully adorned doorway, each garland is styled around your home's character.",
      "Think lush foliage, statement baubles, rich ribbons and carefully chosen details, in a palette that feels just right for you.",
    ],
};

const CARD_BUSINESS: Card = {
    img: shop640,
    srcSet: srcSet(shop420, shop640, shop838),
    alt: "Salon shopfront with a spruce corner garland of red baubles and red berry sprays across the glass",
    detail: redDetail640,
    detailSrcSet: srcSet(redDetail420, redDetail640, redDetail838),
    detailAlt: "Deep red baubles, eucalyptus and warm fairy lights nestled in spruce beside a shop window",
    title: "Shops, salons and restaurants",
    body: [
      "Make a festive first impression with a dressed entrance that catches the eye and welcomes customers in.",
      "Classic Christmas colours or something more contemporary, each garland is matched to your brand for a memorable seasonal backdrop.",
    ],
};

/* Business version: shops and salons, then restaurants (entrances only,
   Matt 2026-11-09). Same files and alt text as elsewhere on the page. */
const CARD_SHOPS: Card = { ...CARD_BUSINESS, title: "Shops and salons" };

const CARD_RESTAURANTS: Card = {
  img: imgRestaurant,
  alt: "Blue shopfront doorway with a spruce garland of large red and champagne baubles running up the frame",
  detail: igLedge,
  detailAlt: "Restaurant window ledge lined with a spruce garland of red and cream baubles beside bistro chairs",
  detailPosition: "50% 85%",
  title: "Restaurants and cafés",
  body: [
    "Dress the doorway and the window ledge, so the garland greets diners on the pavement and frames the view from their table.",
    "Red and gold, frosted white or your own colours, styled to suit your shopfront and installed around service.",
  ],
};

/* On the home version the business card points on to the business page. */
const CARD_BUSINESS_HOME: Card = {
  ...CARD_BUSINESS,
  body: [
    ...CARD_BUSINESS.body,
    <>
      See{" "}
      <a href="/commercial-christmas-decorations/" className="text-link">
        Christmas decorations for businesses
      </a>
      .
    </>,
  ],
};

const CARDS_HOME = [CARD_HOME, CARD_BUSINESS_HOME];
const CARDS_BUSINESS = [CARD_SHOPS, CARD_RESTAURANTS];

/* Velvet bow used as a divider between white sections, sitting in the gap
   (the section it opens drops its top padding so the gap stays even). */
const BowDivider = () => (
  <img
    src={bow160}
    srcSet={`${bow160} 160w, ${bow320} 320w`}
    sizes="72px"
    alt=""
    aria-hidden="true"
    className="block mx-auto w-[60px] md:w-[72px] h-auto mb-14 md:mb-20"
    width={320}
    height={330}
    loading="lazy"
    decoding="async"
  />
);

/* Handwritten "Move the snow" note with an arrow curving down into the snow
   (styles in christmas.css; hidden with reduced motion, where snow stays still). */
const SnowHint = ({ className = "" }: { className?: string }) => (
  <div className={`xmas-snow-hint ${className}`} aria-hidden="true">
    <span>Move the snow</span>
    <svg width="40" height="66" viewBox="0 0 40 66" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5c15 1 27 11 25 30-.7 8-2.5 15-5 24" />
      {/* Arrowhead: an even V lined up with the end of the curve. */}
      <path d="M32.2 50.6L24 59.5l-3.4-11.6" />
    </svg>
  </div>
);

/* Section title. With `snow`, snow settles on top of the letters; the cursor
   pushes it off (SnowCap). */
const SectionTitle = ({ children, id, light, snow }: { children: ReactNode; id: string; light?: boolean; snow?: boolean }) => {
  return (
    <h2
      id={id}
      className={`t-h2 ${light ? "" : "text-primary"}`}
    >
      {snow ? (
        <span className="xmas-title-snow">
          <SnowCap mode="text" ground={light ? "dark" : "light"} />
          <span data-snow-text>{children}</span>
        </span>
      ) : (
        children
      )}
    </h2>
  );
};

const STEPS = [
  {
    n: "01",
    title: "Send me a photo",
    body: "Share a photo of your doorway, rough measurements and your postcode, and I'll come back with ideas and a personalised quote.",
  },
  {
    n: "02",
    title: "Settle on a design",
    body: "Together we'll choose the style, colours and details, then book in your installation date.",
  },
  {
    n: "03",
    title: "I'll bring it to life",
    body: "I'll arrive with everything needed, dress your doorway in place and clear away afterwards.",
  },
  {
    n: "04",
    title: "January takedown",
    extra: true,
    body: "After Christmas I'll carefully remove your garland and leave your doorway just as I found it. Add it when you book.",
  },
];

const STEPS_BUSINESS = [
  {
    n: "01",
    title: "Send me a photo",
    body: "Share a photo of your entrance, rough measurements, your postcode and your brand colours, and I'll come back with ideas and a quote.",
  },
  {
    n: "02",
    title: "Settle on a design",
    body: "Together we'll choose the style, colours and details, then book an install date around your opening hours.",
  },
  STEPS[2],
  STEPS[3],
];

/* One page, two versions: "home" is /christmas-door-garlands/, "business"
   is /commercial-christmas-decorations/, written for the shops, salons and
   restaurants the Christmas ads reach (Matt, 2026-11-09). Same design and
   booking form; the business version swaps the words, photos and order. */
type Variant = "home" | "business";

const ChristmasDoorways = ({ variant = "home" }: { variant?: Variant }) => {
  useFadeUp();
  useNavScroll();
  const [submitting, setSubmitting] = useState(false);
  const biz = variant === "business";
  const routePath = biz ? "/commercial-christmas-decorations" : "/christmas-door-garlands";
  const fan = biz ? FAN_BUSINESS : FAN;
  const cards = biz ? CARDS_BUSINESS : CARDS_HOME;

  useEffect(() => {
    const route = findRoute(routePath)!;
    applyMeta(route);

    const slug = routePath.slice(1);
    const serviceId = `rfx-jsonld-svc-${slug}`;
    const svc = routeServiceSchema(route);
    if (svc) upsertJsonLd(serviceId, svc);

    const breadcrumbId = `rfx-jsonld-bc-${slug}`;
    const breadcrumbs = breadcrumbSchema(route.path);
    if (breadcrumbs) upsertJsonLd(breadcrumbId, breadcrumbs);

    return () => {
      removeJsonLd(serviceId);
      removeJsonLd(breadcrumbId);
    };
  }, [routePath]);

  // Touch screens have no hover, so show the close-up as each card reaches
  // the middle band of the screen, and the wide shot again as it leaves.
  const cardsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = cardsRef.current;
    if (!root || !window.matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("is-swapped", e.isIntersecting)),
      { rootMargin: "-30% 0px -30% 0px" }
    );
    root.querySelectorAll(".xmas-swap").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSubmitting(true);
    try {
      // Multipart, because the door photo travels with it. Netlify Forms
      // accepts a FormData body as-is; the browser sets the boundary header.
      const data = new FormData(form);
      data.set("page", window.location.pathname);
      const res = await fetch("/", { method: "POST", body: data });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", { send_to: "AW-18210626936/xqXACO264L0cEPi6wOtD" });
      }
      toast.success("Thank you - I've got your door details. I'll be in touch within 1-2 working days with ideas and a quote. Laura");
      form.reset();
    } catch (err) {
      toast.error("Sorry - something went wrong. Please email Riverfoxevents@gmail.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rfx-xmas min-h-screen text-foreground nav-solid">
      <Nav enquireHref="#enquire" />
      <main>
        {/* Hero: garland drapes edge to edge above the headline, then the
            photo fan (scroll strip on phones), as on the location pages. */}
        <section aria-labelledby="xmas-hero-heading" className="rfx-hero pt-[76px] md:pt-[76px] pb-4 md:pb-6">
          <HeroGarland />
          <div className="container-rfx">
            <div className="mt-2 md:mt-4 mb-4 md:mb-9 flex flex-col items-center text-center">
              <p className="t-overline text-ink-soft">
                {biz ? "Christmas 2026 · For businesses" : "Christmas 2026 · Now booking"}
              </p>
              <h1
                id="xmas-hero-heading"
                className="t-display mt-5 max-w-none"
              >
                <span className="xmas-title-snow">
                  <SnowCap mode="text" />
                  {/* Always two lines from tablet up (Matt, 2026-11-08); phones wrap naturally. */}
                  {biz ? (
                    <span data-snow-text>Christmas decorations<br className="hidden md:inline" /> for your business.</span>
                  ) : (
                    <span data-snow-text>Christmas door garlands<br className="hidden md:inline" /> in Surrey.</span>
                  )}
                </span>
              </h1>
              <div className="mt-5 max-w-[46ch] md:max-w-[70ch] t-lead text-ink-soft space-y-4">
                {biz ? (
                  <>
                    <p>
                      Your entrance is the first thing customers see this
                      Christmas.
                    </p>
                    <p>
                      I dress shopfronts, salons, restaurants and offices
                      across Surrey with garlands matched to your brand,
                      installed by hand around your opening hours, with
                      optional January&nbsp;takedown.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      A garlanded doorway is one of the loveliest ways to
                      welcome Christmas.
                    </p>
                    <p>
                      Each garland is individually styled for your home or
                      business and installed by hand across Surrey, with optional
                      January&nbsp;takedown.
                    </p>
                  </>
                )}
              </div>
              {/* Enquire now everywhere; phones also get WhatsApp Laura now,
                  pre-filled so they only add a postcode (Matt, 2026-11-06).
                  Matching widths, stacked. */}
              <div className="mt-8 mx-auto grid gap-3 w-fit">
                <a href="#enquire" onClick={handleEnquireClick} className="btn-solid-rf accent justify-center">
                  Enquire now <span className="t-icon">→</span>
                </a>
                <a href={biz ? WHATSAPP_HREF_BUSINESS : WHATSAPP_HREF} className="btn-ghost-rf justify-center md:hidden">
                  WhatsApp Laura now
                </a>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <ScrollStrip images={[...fan]} />
          </div>
          <LocationHeroFan images={[fan[0], fan[1], fan[2]]} spreadOnHover />
        </section>

        {/* What we do */}
        <section className="rfx-section white" aria-labelledby="xmas-what-heading">
          <div className="container-rfx">
            <div className="max-w-[760px] mx-auto text-center fade-up">
              <SectionTitle id="xmas-what-heading" snow>
                {biz ? "A festive welcome," : "A little Christmas magic,"}{" "}
                <em className="t-accent">{biz ? "from the door in." : "right at your door."}</em>
              </SectionTitle>
              <p className="mt-6 t-lead text-ink-soft max-w-[54ch] mx-auto">
                {biz
                  ? "A dressed entrance draws people in from the street and tells them you're ready for Christmas, whether it's a shop door, a salon window or a restaurant doorway."
                  : "Whether it's the finishing touch to your family home or a festive welcome for your customers, a beautifully styled doorway sets the tone for the season."}
              </p>
            </div>

            <div ref={cardsRef} className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
              {cards.map((card) => (
                <article key={card.title} className="fade-up relative">
                  <SnowCap mode="edge" radius="media" />
                  {/* Laptop and up only: on narrower screens the intro text
                      above runs too wide for the note to sit beside it. */}
                  {card === cards[0] && <SnowHint className="xmas-snow-hint--card" />}
                  <div className="xmas-swap">
                    <img
                      src={card.img}
                      srcSet={card.srcSet}
                      sizes="(min-width: 768px) 46vw, calc(100vw - 64px)"
                      alt={card.alt}
                      className="w-full block object-cover aspect-[838/462]"
                      width={838}
                      height={462}
                      loading="lazy"
                      decoding="async"
                    />
                    <img
                      src={card.detail}
                      srcSet={card.detailSrcSet}
                      sizes="(min-width: 768px) 46vw, calc(100vw - 64px)"
                      alt={card.detailAlt}
                      className="xmas-swap__detail absolute inset-0 w-full h-full object-cover"
                      style={card.detailPosition ? { objectPosition: card.detailPosition } : undefined}
                      width={838}
                      height={462}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3 className="t-h4 text-primary mt-6">
                    {card.title}
                  </h3>
                  <div className="title-to-text t-small text-ink-soft max-w-[52ch] space-y-3">
                    {card.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {/* Fresh or faux: a garland cutout (transparent WebP, shadow from
                CSS), the section heading under it, then the two options. */}
            <div className="mt-20 md:mt-28 max-w-[1040px] mx-auto">
              <img
                src={imgGarland1200}
                srcSet={`${imgGarland800} 800w, ${imgGarland1200} 1200w, ${imgGarland1440} 1440w`}
                sizes="(min-width: 1140px) 1040px, calc(100vw - 64px)"
                alt="Evergreen garland with burgundy velvet bows, red and gold baubles, pine cones and warm fairy lights"
                className="xmas-cutout w-full h-auto block"
                width={1440}
                height={288}
                loading="lazy"
                decoding="async"
              />
              <div className="max-w-[760px] mx-auto text-center fade-up mt-8 md:mt-10">
                <p className="t-overline text-ink-soft">Garland options</p>
                <div className="mt-5">
                  <SectionTitle id="xmas-options-heading" snow>
                    Choose your{" "}
                    <em className="t-accent">Christmas garland.</em>
                  </SectionTitle>
                </div>
              </div>
              {/* Two equal cards; Most popular gets the gold border (Matt, 2026-11-07).
                  Each card is a flex stack so the Enquire links line up, and the
                  link stretches over the whole card, so the card itself is clickable. */}
              <div className="xmas-options mt-6 md:mt-14 mx-auto grid grid-cols-1 md:grid-cols-2 text-center">
                {GARLAND_OPTIONS.map((opt) => (
                  <div key={opt.title} className={`xmas-option fade-up flex flex-col items-center${opt.popular ? " is-popular" : ""}`}>
                    <SnowCap mode="edge" />
                    <p className="xmas-option__tag">
                      {opt.popular && <span className="xmas-tag">Most popular</span>}
                    </p>
                    <h3 className="t-h4 text-primary">
                      {opt.title}
                    </h3>
                    <p className="t-small italic text-accent-warm mt-1">{opt.note}</p>
                    {/* Keep to three lines max (Matt, 2026-11-04). */}
                    <p className="mt-4 t-small text-ink-soft max-w-[42ch] md:max-w-[40ch]">{opt.body}</p>
                    <div className="mt-auto pt-6">
                      <a
                        href="#enquire"
                        onClick={(e) => {
                          handleEnquireClick(e);
                          // Pre-select this garland in the booking form.
                          const select = document.querySelector<HTMLSelectElement>('form[name="christmas-doorway"] select[name="garland"]');
                          if (select) select.value = opt.title;
                        }}
                        className="xmas-option__link btn-link-rf text-primary"
                      >
                        {opt.link} <span className="arr">→</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Past doorways: Laura's Instagram, as an endless strip */}
        <section className="rfx-section white !pt-0" aria-labelledby="xmas-ig-heading">
          <div className="container-rfx">
            <BowDivider />
            <div className="max-w-[760px] mx-auto text-center fade-up">
              <SectionTitle id="xmas-ig-heading" snow>
                A little inspiration for{" "}
                <em className="t-accent">{biz ? "your Christmas entrance." : "your Christmas doorway."}</em>
              </SectionTitle>
              <p className="mt-6 t-lead text-ink-soft">
                {biz
                  ? "A few favourite shopfronts, salons and restaurants from Christmases past."
                  : "A few favourite doorways from Christmases past."}
              </p>
            </div>
          </div>
          <div className="mt-12 md:mt-14">
            <InstagramStrip images={biz ? INSTAGRAM_BUSINESS : INSTAGRAM} />
          </div>
        </section>

        {/* Christmas campaign: the ad films behind one tile. Stills from the
            DIY attempts fan out behind it on hover. */}
        {/* The films are about homes (DIY porch mishaps), so home version only. */}
        {!biz && AD_STORIES.length > 0 && (
          <section id={AD_ANCHOR} className="rfx-section white !pt-0 overflow-x-clip" aria-labelledby="xmas-ad-heading">
            <div className="container-rfx">
              <BowDivider />
              <div className="max-w-[760px] mx-auto text-center fade-up">
                <SectionTitle id="xmas-ad-heading" snow>
                  Watch the{" "}
                  <em className="t-accent">Christmas campaign.</em>
                </SectionTitle>
              </div>
              <div className="mt-12 md:mt-16 fade-up">
                <StoryVideos
                  stories={AD_STORIES}
                  thumb={AD_THUMB.src}
                  thumbSrcSet={AD_THUMB.srcSet}
                  thumbAlt={AD_THUMB.alt}
                  cta="Watch our Christmas ad"
                  hideCta
                  fan={AD_FAN}
                />
              </div>
            </div>
          </section>
        )}

        {/* Setup and takedown */}
        <section id="how-it-works" className="rfx-section white !pt-0" aria-labelledby="xmas-how-heading">
          <div className="container-rfx">
            <BowDivider />
            <div className="max-w-[760px] mx-auto text-center fade-up">
              <SectionTitle id="xmas-how-heading" snow>
                {biz ? "Your Christmas entrance," : "Your Christmas doorway,"}{" "}
                <em className="t-accent">taken care of.</em>
              </SectionTitle>
              <p className="mt-6 t-lead text-ink-soft max-w-[54ch] mx-auto">
                {biz
                  ? "From the first photo to the finished install, I'll work around your trading hours, so the only thing your customers notice is the garland."
                  : "From the first conversation to the finished installation, I'll take care of the details so you can simply enjoy your beautifully dressed doorway throughout the festive season."}
              </p>
            </div>
            <ol className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {(biz ? STEPS_BUSINESS : STEPS).map((s) => (
                <li key={s.n} className="fade-up border-t pt-6 relative" style={{ borderColor: "hsl(var(--text-primary) / 0.14)" }}>
                  <SnowCap mode="edge" radius={0} />
                  {/* Extra tag sits by the step number so step titles stay on
                      one line, even in the narrow 4-column layout. */}
                  <div className="flex items-center gap-3 h-[22px]">
                    <span className="t-overline text-ink-soft">{s.n}</span>
                    {s.extra && <span className="xmas-tag">Extra</span>}
                  </div>
                  <h3 className="t-h5 text-primary mt-3">
                    {s.title}
                  </h3>
                  <p className="title-to-text t-small text-ink-soft">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <ChildrensFAQ
          faqs={biz ? FAQS_BUSINESS : FAQS_HOME}
          headingId="xmas-faq-heading"
          heading={<>Your questions <em className="t-accent">answered.</em></>}
          paddingTop="clamp(40px, 6vw, 96px)"
          paddingBottom="clamp(150px, 12vw, 170px)"
        />

        {/* Booking form + contact */}
        <section id="enquire" className="rfx-section dark rfx-enquire relative" aria-labelledby="enquire-heading">
          {/* A deep drift of snow along the whole top edge, where the cream
              page meets the dark booking section (Matt, 2026-11-07). */}
          {/* overflow-x: clip keeps the canvas (which runs a little past
              both ends) from widening the page on phones. */}
          <div aria-hidden="true" className="absolute left-0 right-0 top-0 h-0" style={{ overflowX: "clip" }}>
            <SnowCap mode="edge" radius={0} scale={2.4} bleed />
          </div>
          {/* A handwritten nudge that the snow can be moved (hidden with
              reduced motion, where the snow stays still). */}
          <SnowHint />
          <div className="container-rfx">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
              <div className="pt-2 text-center lg:text-left flex flex-col items-center lg:items-stretch lg:sticky lg:top-28 lg:self-start">
                <SectionTitle id="enquire-heading" light snow>
                  Book your{" "}
                  <em className="t-accent">{biz ? "Christmas entrance." : "Christmas doorway."}</em>
                </SectionTitle>
                <p className="t-lead max-w-[460px] mt-7" style={{ color: "hsl(var(--text-dimmed))" }}>
                  {biz
                    ? "Send a photo of your entrance with rough measurements, your postcode and your brand colours, and I'll come back with ideas and a quote. Every entrance is dressed by hand, so I can only take a small number each December. If you'd rather call me, use this number: "
                    : "Send a photo of your door with rough measurements and your postcode, and I'll come back with ideas and a quote. Every doorway is dressed by hand, so I can only take a small number each December. If you'd rather call me, use this number: "}
                  <a href="tel:+447872114191" className="whitespace-nowrap text-link" style={{ color: "hsl(var(--text-on-dark))" }}>
                    07872&nbsp;114191
                  </a>
                  .
                </p>

              </div>

              <form
                className="form-wrap relative"
                name="christmas-doorway"
                method="POST"
                encType="multipart/form-data"
                data-netlify="true"
                data-netlify-honeypot="bot-field"
                onSubmit={onSubmit}
              >
                <SnowCap mode="edge" radius="card" ground="dark" />
                <input type="hidden" name="form-name" value="christmas-doorway" />
                <p className="hidden" aria-hidden="true">
                  <label>
                    Don't fill this out: <input name="bot-field" />
                  </label>
                </p>
                <div className="hidden md:block mb-5 text-left">
                  <h3 className="t-h4 text-primary">
                    {biz ? "Tell me about your entrance" : "Tell me about your door"}
                  </h3>
                </div>
                <div className="form-grid">
                  <label className="form-row">
                    <span className="lbl">Full name</span>
                    <input type="text" name="name" placeholder="Your full name" required />
                  </label>
                  <label className="form-row">
                    <span className="lbl">Email address</span>
                    <input type="email" name="email" placeholder="you@example.com" required />
                  </label>
                  <label className="form-row">
                    <span className="lbl">Phone number (optional)</span>
                    <input type="tel" name="phone" placeholder="07…" />
                  </label>
                  <label className="form-row">
                    <span className="lbl">Postcode</span>
                    <input type="text" name="postcode" placeholder="e.g. KT8 9AB" required />
                  </label>
                  <label className="form-row">
                    <span className="lbl">Home or business</span>
                    <select name="property" defaultValue={biz ? "Business" : "Home"}>
                      <option>Home</option>
                      <option>Business</option>
                    </select>
                  </label>
                  <label className="form-row">
                    <span className="lbl">Garland</span>
                    <select name="garland" defaultValue="Not sure yet">
                      <option>Fresh spruce</option>
                      <option>Faux</option>
                      <option>Not sure yet</option>
                    </select>
                  </label>
                  <label className="form-row full">
                    <span className="lbl">Install</span>
                    <select name="install" defaultValue="Early November">
                      <option>Early November</option>
                      <option>Late November</option>
                      <option>First week of December</option>
                      <option>Second week of December</option>
                      <option>Flexible</option>
                    </select>
                  </label>
                  <label className="form-row full">
                    <span className="lbl">{biz ? "Photo of your entrance (optional)" : "Photo of your door (optional)"}</span>
                    <input type="file" name="door-photo" accept="image/*" />
                  </label>
                  <label className="form-row full">
                    <span className="lbl">Colours or ideas</span>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder={biz ? "Your brand colours, your opening hours, or anything else" : "Colours you love, the paint colour of your door, or anything else"}
                    />
                  </label>
                  <label className="form-row full form-check">
                    <input type="checkbox" name="takedown" value="Yes" />
                    <span className="t-small text-ink">
                      Add January takedown
                    </span>
                    <span className="xmas-tag ml-auto">Extra</span>
                  </label>
                </div>
                <div className="flex justify-center lg:justify-end items-center mt-6">
                  {/* Full width on phones to match the fields above; natural width from sm up. */}
                  <button type="submit" disabled={submitting} className="btn-solid-rf accent w-full sm:w-auto justify-center disabled:opacity-60">
                    {submitting ? "Sending…" : "Request a quote"} <span>→</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ChristmasDoorways;
