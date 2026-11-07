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
const FAQS = [
  {
    q: "Which areas do you cover?",
    a: "All of Surrey. I dress doorways in Cobham, Esher, Weybridge, Oxshott, Walton-on-Thames, Kingston, Twickenham, East Molesey, Kingswood, Tadworth, Banstead, Epsom, Leatherhead, Dorking, Reigate, Redhill, Guildford, Oxted and Horley, where my studio is, and the villages in between. If your town isn't listed, send your postcode and I'll confirm.",
  },
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
    a: "Yes. I dress front doors and porches for homes, and entrances for shops, salons, restaurants, clinics and offices, styled to your paintwork or brand colours.",
  },
  {
    q: "What's the difference between fresh spruce and faux?",
    a: "Fresh spruce brings the scent and natural foliage of a real Christmas tree, and lasts through the festive season into January. Faux is beautifully full, can go up whenever you wish, and can be enjoyed year after year.",
  },
  {
    q: "Can you match my door, brick or brand colours?",
    a: "Always. Every doorway starts with your paintwork, so the baubles, ribbon and accents are chosen to suit your door, brickwork or brand rather than taken from a set design.",
  },
  {
    q: "What do you need from me for a quote?",
    a: "A photo of your door, rough measurements and your postcode. I'll come back with ideas, a colour palette and a quote.",
  },
  {
    q: "Is the January takedown included?",
    a: "Takedown is an optional extra. Add it when you book, or let me know before Christmas, and I'll come back in January to take everything down and leave your doorway as I found it.",
  },
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

/* "What we do" cards. Each has a wide shot and a close-up of the garland;
   the close-up fades in on hover, or on touch screens as the card reaches
   the middle of the screen. */
const srcSet = (a: string, b: string, c: string) => `${a} 420w, ${b} 640w, ${c} 838w`;

const CARDS = [
  {
    img: door640,
    srcSet: srcSet(door420, door640, door838),
    alt: "Black Georgian front door with a spruce garland of gold ribbons, stars and baubles arching over the fanlight",
    detail: goldDetail640,
    detailSrcSet: srcSet(goldDetail420, goldDetail640, goldDetail838),
    detailAlt: "Gold star, frosted pine cone and gold bauble tucked into spruce with a gold ribbon bow",
    title: "Front doors and porches",
    body: [
      "From a generous sweep of festive greenery to a beautifully adorned doorway, each garland is styled to complement your home's character.",
      "Think beautiful foliage, statement baubles, sumptuous ribbons and carefully chosen details, all brought together in a palette that feels just right for your home.",
    ],
  },
  {
    img: shop640,
    srcSet: srcSet(shop420, shop640, shop838),
    alt: "Salon shopfront with a spruce corner garland of red baubles and red berry sprays across the glass",
    detail: redDetail640,
    detailSrcSet: srcSet(redDetail420, redDetail640, redDetail838),
    detailAlt: "Deep red baubles, eucalyptus and warm fairy lights nestled in spruce beside a shop window",
    title: "Shops, salons and restaurants",
    body: [
      "Make a festive first impression with a beautifully dressed entrance that catches the eye and welcomes customers in.",
      "Whether you favour classic Christmas colours or something more contemporary, your garland can be styled to complement your brand and create a memorable seasonal backdrop.",
    ],
  },
];

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
      className={`font-serif-rf ${light ? "" : "text-primary"}`}
      style={{
        fontSize: "var(--fs-h2)",
        lineHeight: 0.98,
        fontWeight: 300,
        letterSpacing: "-0.03em",
      }}
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

const ChristmasDoorways = () => {
  useFadeUp();
  useNavScroll();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const route = findRoute("/christmas-door-garlands")!;
    applyMeta(route);

    const serviceId = "rfx-jsonld-svc-christmas-door-garlands";
    const svc = routeServiceSchema(route);
    if (svc) upsertJsonLd(serviceId, svc);

    const breadcrumbId = "rfx-jsonld-bc-christmas-door-garlands";
    const breadcrumbs = breadcrumbSchema(route.path);
    if (breadcrumbs) upsertJsonLd(breadcrumbId, breadcrumbs);

    return () => {
      removeJsonLd(serviceId);
      removeJsonLd(breadcrumbId);
    };
  }, []);

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
    <div className="rfx-xmas min-h-screen bg-background text-foreground nav-solid">
      <Nav enquireHref="#enquire" />
      <main>
        {/* Hero: garland drapes edge to edge above the headline, then the
            photo fan (scroll strip on phones), as on the location pages. */}
        <section aria-labelledby="xmas-hero-heading" className="rfx-hero pt-[76px] md:pt-[76px] pb-4 md:pb-6">
          <HeroGarland />
          <div className="container-rfx">
            <div className="mt-2 md:mt-4 mb-4 md:mb-9 flex flex-col items-center text-center">
              <p className="eyebrow">Christmas 2026 · Now booking</p>
              <h1
                id="xmas-hero-heading"
                className="font-serif-rf mt-5 max-w-[14ch] md:max-w-none"
                style={{
                  fontSize: "var(--fs-display)",
                  lineHeight: 0.96,
                  fontWeight: 400,
                  letterSpacing: "-0.038em",
                }}
              >
                <span className="xmas-title-snow">
                  <SnowCap mode="text" />
                  <span data-snow-text>Christmas door garlands in Surrey.</span>
                </span>
              </h1>
              <div className="mt-5 max-w-[46ch] md:max-w-[70ch] text-[17px] leading-[1.65] text-ink-soft space-y-4">
                <p>
                  A garlanded doorway is one of the loveliest ways to
                  welcome Christmas.
                </p>
                <p>
                  Each garland is individually styled for your home or
                  business and installed by hand across Surrey, with optional
                  January&nbsp;takedown.
                </p>
              </div>
              {/* Enquire now everywhere; phones also get WhatsApp Laura now,
                  pre-filled so they only add a postcode (Matt, 2026-11-06).
                  Matching widths, stacked. */}
              <div className="mt-8 mx-auto grid gap-3 w-fit">
                <a href="#enquire" onClick={handleEnquireClick} className="btn-solid-rf accent justify-center">
                  Enquire now <span style={{ fontSize: "1.35em", lineHeight: 1 }}>→</span>
                </a>
                <a href={WHATSAPP_HREF} className="btn-ghost-rf justify-center md:hidden">
                  WhatsApp Laura now
                </a>
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <ScrollStrip images={[...FAN]} />
          </div>
          <LocationHeroFan images={[FAN[0], FAN[1], FAN[2]]} spreadOnHover radius={16} />
        </section>

        {/* What we do */}
        <section className="rfx-section white" aria-labelledby="xmas-what-heading">
          <div className="container-rfx">
            <div className="max-w-[760px] mx-auto text-center fade-up">
              <SectionTitle id="xmas-what-heading" snow>
                A little Christmas magic,{" "}
                <em className="italic font-light text-accent-warm">right at your door.</em>
              </SectionTitle>
              <p className="mt-6 text-[16px] leading-[1.7] text-ink-soft max-w-[54ch] mx-auto">
                Whether it's the finishing touch to your family home or a
                festive welcome for your customers, a beautifully styled
                doorway sets the tone for the season.
              </p>
            </div>

            <div ref={cardsRef} className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
              {CARDS.map((card) => (
                <article key={card.title} className="fade-up relative">
                  <SnowCap mode="edge" radius={12} />
                  {/* Laptop and up only: on narrower screens the intro text
                      above runs too wide for the note to sit beside it. */}
                  {card === CARDS[0] && <SnowHint className="xmas-snow-hint--card" />}
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
                      width={838}
                      height={462}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <h3
                    className="font-serif-rf text-primary mt-6"
                    style={{ fontSize: "var(--fs-h3)", lineHeight: 1.18, fontWeight: 400, letterSpacing: "-0.018em" }}
                  >
                    {card.title}
                  </h3>
                  <div className="mt-2 text-[15.5px] leading-[1.7] text-ink-soft max-w-[52ch] space-y-3">
                    {card.body.map((para) => (
                      <p key={para}>{para}</p>
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
                <p className="eyebrow">Garland options</p>
                <div className="mt-5">
                  <SectionTitle id="xmas-options-heading" snow>
                    Choose your{" "}
                    <em className="italic font-light text-accent-warm">Christmas garland.</em>
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
                    {/* Phones get larger titles; the desktop columns keep the
                        tighter sizing. */}
                    <h3
                      className="font-serif-rf text-primary text-[28px] md:text-h4"
                      style={{ lineHeight: 1.15, fontWeight: 400 }}
                    >
                      {opt.title}
                    </h3>
                    <p className="font-serif-rf italic text-accent-warm text-[19px] md:text-[17px] leading-[1.3] mt-1">{opt.note}</p>
                    {/* Keep to three lines max (Matt, 2026-11-04). */}
                    <p className="mt-4 text-[15.5px] md:text-[15px] leading-[1.75] text-ink-soft max-w-[42ch] md:max-w-[40ch]">{opt.body}</p>
                    <div className="mt-auto pt-6">
                      <a
                        href="#enquire"
                        onClick={(e) => {
                          handleEnquireClick(e);
                          // Pre-select this garland in the booking form.
                          const select = document.querySelector<HTMLSelectElement>('form[name="christmas-doorway"] select[name="garland"]');
                          if (select) select.value = opt.title;
                        }}
                        className="xmas-option__link btn-link-rf text-[14px] text-primary"
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
                <em className="italic font-light text-accent-warm">your Christmas doorway.</em>
              </SectionTitle>
              <p className="mt-6 text-[16px] leading-[1.7] text-ink-soft">
                A few favourite doorways from Christmases past.
              </p>            </div>
          </div>
          <div className="mt-12 md:mt-14">
            <InstagramStrip images={INSTAGRAM} />
          </div>
        </section>

        {/* Christmas campaign: the ad films behind one tile. Stills from the
            DIY attempts fan out behind it on hover. */}
        {AD_STORIES.length > 0 && (
          <section id={AD_ANCHOR} className="rfx-section white !pt-0 overflow-x-clip" aria-labelledby="xmas-ad-heading">
            <div className="container-rfx">
              <BowDivider />
              <div className="max-w-[760px] mx-auto text-center fade-up">
                <SectionTitle id="xmas-ad-heading" snow>
                  Watch the{" "}
                  <em className="italic font-light text-accent-warm">Christmas campaign.</em>
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
                Your Christmas doorway,{" "}
                <em className="italic font-light text-accent-warm">taken care of.</em>
              </SectionTitle>
              <p className="mt-6 text-[16px] leading-[1.7] text-ink-soft max-w-[54ch] mx-auto">
                From the first conversation to the finished installation, I'll
                take care of the details so you can simply enjoy your
                beautifully dressed doorway throughout the festive season.
              </p>
            </div>
            <ol className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {STEPS.map((s) => (
                <li key={s.n} className="fade-up border-t pt-6 relative" style={{ borderColor: "hsl(var(--ink) / 0.14)" }}>
                  <SnowCap mode="edge" radius={0} />
                  {/* Extra tag sits by the step number so step titles stay on
                      one line, even in the narrow 4-column layout. */}
                  <div className="flex items-center gap-3 h-[22px]">
                    <span className="font-mono-rf text-[12px] tracking-[0.18em] text-ink-soft">{s.n}</span>
                    {s.extra && <span className="xmas-tag">Extra</span>}
                  </div>
                  <h3
                    className="font-serif-rf text-primary mt-3"
                    style={{ fontSize: "var(--fs-h4)", lineHeight: 1.2, fontWeight: 400 }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-ink-soft">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <ChildrensFAQ
          faqs={FAQS}
          headingId="xmas-faq-heading"
          headingSize="var(--fs-h3)"
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
                  <em className="italic font-light text-accent-warm">Christmas doorway.</em>
                </SectionTitle>
                <p className="text-[15.5px] leading-[1.7] max-w-[460px] mt-7" style={{ color: "hsl(var(--on-deep-soft))" }}>
                  Send a photo of your door with rough measurements and your
                  postcode, and I'll come back with ideas and a quote. Every
                  doorway is dressed by hand, so I can only take a small number
                  each December. If you'd rather call me, use this number:{" "}
                  <a href="tel:+447872114191" className="whitespace-nowrap underline underline-offset-4" style={{ color: "hsl(var(--on-deep))" }}>
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
                <SnowCap mode="edge" radius={14} ground="dark" />
                <input type="hidden" name="form-name" value="christmas-doorway" />
                <p className="hidden" aria-hidden="true">
                  <label>
                    Don't fill this out: <input name="bot-field" />
                  </label>
                </p>
                <div className="hidden md:block mb-5 text-left">
                  <h3
                    className="font-serif-rf text-primary"
                    style={{ fontSize: "var(--fs-h3)", lineHeight: 1.18, fontWeight: 400, letterSpacing: "-0.018em" }}
                  >
                    Tell me about your door
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
                    <select name="property" defaultValue="Home">
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
                    <span className="lbl">Photo of your door (optional)</span>
                    <input type="file" name="door-photo" accept="image/*" />
                  </label>
                  <label className="form-row full">
                    <span className="lbl">Colours or ideas</span>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder="Colours you love, the paint colour of your door, or anything else"
                    />
                  </label>
                  <label className="form-row full form-check">
                    <input type="checkbox" name="takedown" value="Yes" />
                    <span className="text-[14.5px] leading-[1.5] text-ink">
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
