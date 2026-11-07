/**
 * "A little inspiration for your next ..." carousels on the three service pages.
 * Photos from Laura's Instagram (graded to the house look, Nov 2026), topped up with
 * gallery photos that page doesn't already show. One image, one alt.
 */
import type { InstagramStripImage } from "@/components/rfx/InstagramStrip";
import { galleryPhoto } from "@/data/gallery";

import igOttilieToyStory from "@/assets/services/childrens-parties/ottilie-toy-story-second-birthday-gingham-table.webp";
import igDukeLevel8Gaming from "@/assets/services/childrens-parties/duke-level-8-gaming-birthday-backdrop.webp";
import igTeddyBearFirstBirthdayPinkGreyBalloonHoop from "@/assets/services/childrens-parties/teddy-bear-first-birthday-pink-grey-balloon-hoop.webp";
import igRainbowUnicornPartyPastelSequinBackdrop from "@/assets/services/childrens-parties/rainbow-unicorn-party-pastel-sequin-backdrop.webp";
import igGraceFifthBirthdayRainbowArchUnicorn from "@/assets/services/childrens-parties/grace-fifth-birthday-rainbow-arch-unicorn.webp";
import igBerryFirstBirthdayStrawberryBalloonBackdrop from "@/assets/services/childrens-parties/berry-first-birthday-strawberry-balloon-backdrop.webp";
import igPinkDinosaurFourthBirthday4RoarTable from "@/assets/services/childrens-parties/pink-dinosaur-fourth-birthday-4-roar-table.webp";
import igCutestPumpkinAutumnFirstBirthdayTable from "@/assets/services/childrens-parties/cutest-pumpkin-autumn-first-birthday-table.webp";
import igDahliaFirstBirthdayPinkDaisyBalloons from "@/assets/services/childrens-parties/dahlia-first-birthday-pink-daisy-balloons.webp";
import igWildOnesJointBirthdaySageLeopardBalloons from "@/assets/services/childrens-parties/wild-ones-joint-birthday-sage-leopard-balloons.webp";
import igRudysRodeoCowboyPartyBackdrop from "@/assets/services/childrens-parties/rudys-rodeo-cowboy-party-backdrop.webp";
import igTwoSweetSecondBirthdaySprinkleBackdrop from "@/assets/services/childrens-parties/two-sweet-second-birthday-sprinkle-backdrop.webp";
import ig21stMidnightBlueLightUpNumbers from "@/assets/services/milestones/21st-midnight-blue-light-up-numbers.webp";
import ig60thBirthdayBlueChromeLightUp60 from "@/assets/services/milestones/60th-birthday-blue-chrome-light-up-60.webp";
import ig21stPastelBalloonWallLightUpNumbers from "@/assets/services/milestones/21st-pastel-balloon-wall-light-up-numbers.webp";
import igSurprise30thDuskyBlueGoldMoustacheGarland from "@/assets/services/milestones/surprise-30th-dusky-blue-gold-moustache-garland.webp";
import ig40thBirthdayGoldChampagneBowlingGarland from "@/assets/services/milestones/40th-birthday-gold-champagne-bowling-garland.webp";
import igBearlyWaitBabyShowerTeddyHotAirBalloon from "@/assets/services/milestones/bearly-wait-baby-shower-teddy-hot-air-balloon.webp";
import ig40thPurpleGoldLightUpNumbers from "@/assets/services/milestones/40th-purple-gold-light-up-numbers.webp";
import ig70thFloatingGoldOrbsRestaurantCeiling from "@/assets/services/milestones/70th-floating-gold-orbs-restaurant-ceiling.webp";
import ig18thBirthdayRedCarpetHollywoodEntrance from "@/assets/services/milestones/18th-birthday-red-carpet-hollywood-entrance.webp";
import igOfficeChristmasBlackGoldHalfArchStreamers from "@/assets/services/corporate/office-christmas-black-gold-half-arch-streamers.webp";
import igGalaDinnerStaircaseNavyGoldBalloonGarland from "@/assets/services/corporate/gala-dinner-staircase-navy-gold-balloon-garland.webp";

const fromGallery = (source: string): InstagramStripImage => {
  const p = galleryPhoto(source);
  return { src: p.src, alt: p.alt };
};

export const INSPIRATION_CHILDRENS: InstagramStripImage[] = [
  { src: igOttilieToyStory, alt: "Toy Story themed second birthday table for Ottilie with blue gingham, cowboy hats and toy box centrepieces" },
  { src: igDukeLevel8Gaming, alt: "Level 8 gaming birthday backdrop for Duke with blue and black balloons, a neon controller and drop crates" },
  { src: igTeddyBearFirstBirthdayPinkGreyBalloonHoop, alt: "Pink and grey balloon hoop around a teddy bear first birthday sign, with a light-up 1 and baby blocks" },
  { src: igRainbowUnicornPartyPastelSequinBackdrop, alt: "Pastel rainbow and unicorn party backdrop with a sequin arch, clouds and lilac, pink and lemon balloons" },
  { src: igGraceFifthBirthdayRainbowArchUnicorn, alt: "Rainbow arch and unicorn cutout for Grace's fifth birthday, framed by pastel rainbow balloon garlands" },
  { src: igBerryFirstBirthdayStrawberryBalloonBackdrop, alt: "Berry First birthday arch with red and pink balloons and giant strawberry foils on either side" },
  { src: igPinkDinosaurFourthBirthday4RoarTable, alt: "Pink 4-Roar dinosaur backdrop above a children's party table with pastel plates and florals" },
  { src: igCutestPumpkinAutumnFirstBirthdayTable, alt: "Autumn Cutest Pumpkin first birthday backdrop with orange and sage balloons over a low party table" },
  { src: igDahliaFirstBirthdayPinkDaisyBalloons, alt: "Dahlia Turns One pink arched backdrop with blush balloons and daisy balloon flowers" },
  { src: igWildOnesJointBirthdaySageLeopardBalloons, alt: "Wild Ones joint birthday board with photos, framed by sage, terracotta and leopard-print balloons" },
  { src: igRudysRodeoCowboyPartyBackdrop, alt: "Rudy's Rodeo cowboy party backdrop with sage, yellow and pink balloons, a horse foil and rope prop" },
  { src: igTwoSweetSecondBirthdaySprinkleBackdrop, alt: "Two Sweet second birthday backdrop with sprinkle detail and pink, lilac and mint balloons" },
  fromGallery("services/childrens-parties/savanna-london-party-bus-phone-box-backdrop.webp"),
  fromGallery("services/childrens-parties/aristotle-dinosaur-fifth-birthday-jungle-backdrop.webp"),
];

export const INSPIRATION_MILESTONES: InstagramStripImage[] = [
  { src: ig21stMidnightBlueLightUpNumbers, alt: "Light-up 21 wrapped in midnight blue and navy balloons against a sparkling curtain backdrop" },
  { src: ig60thBirthdayBlueChromeLightUp60, alt: "Light-up 60 framed by shades of blue and chrome balloons for a 60th birthday" },
  { src: ig21stPastelBalloonWallLightUpNumbers, alt: "Giant light-up 21 set into a pastel balloon wall in lilac, sage, peach and lemon" },
  { src: igSurprise30thDuskyBlueGoldMoustacheGarland, alt: "Happy 30th backdrop for a surprise party, with a dusky blue, grey and gold garland and moustache balloons" },
  { src: ig40thBirthdayGoldChampagneBowlingGarland, alt: "Champagne, gold and chrome balloon garland with a rose gold 40 foil against a houndstooth wall" },
  { src: igBearlyWaitBabyShowerTeddyHotAirBalloon, alt: "We Can Bearly Wait baby shower with a giant teddy, a hot air balloon cluster and neutral balloons" },
  { src: ig40thPurpleGoldLightUpNumbers, alt: "Light-up 40 with a purple, lilac and gold balloon arch for a 40th birthday" },
  { src: ig70thFloatingGoldOrbsRestaurantCeiling, alt: "Floating gold and white orb balloons above restaurant tables for a 70th birthday" },
  { src: ig18thBirthdayRedCarpetHollywoodEntrance, alt: "Red carpet entrance for an 18th birthday with red curtains, gold statues and a named marquee sign" },
  fromGallery("services/milestones/heart-hoop-red-blush-balloons-heart-foils.webp"),
  fromGallery("services/milestones/navy-gold-bubble-balloon-table-centrepieces.webp"),
];

export const INSPIRATION_CORPORATE: InstagramStripImage[] = [
  { src: igOfficeChristmasBlackGoldHalfArchStreamers, alt: "Black and gold balloon half arch with gold streamers and starbursts for an office Christmas party" },
  { src: igGalaDinnerStaircaseNavyGoldBalloonGarland, alt: "Navy, white and gold balloon garland climbing a staircase entrance for a charity gala dinner" },
  fromGallery("services/corporate/casino-night-balloon-columns-red-black-gold.webp"),
  fromGallery("services/corporate/restaurant-entrance-garland-black-gold-balloons.webp"),
  fromGallery("services/corporate/shop-entrance-arch-green-white-balloons.webp"),
  fromGallery("services/corporate/lakeside-terrace-navy-balloon-arch.webp"),
  fromGallery("services/corporate/enterprise-mobility-branded-backdrop-black-gold-balloons.webp"),
  fromGallery("services/corporate/bocketts-farm-easter-bunny-booth-balloon-garland.webp"),
  fromGallery("services/corporate/125-years-entrance-columns-green-white-gold-stars.webp"),
  fromGallery("journal/christmas-decorations-surrey/gold-sequin-wall-black-gold-balloons-office-party.webp"),
];

/* Balloons page: balloon-led pieces from across the three carousels (no new photos). */
export const INSPIRATION_BALLOONS: InstagramStripImage[] = [
  INSPIRATION_MILESTONES[2], // pastel 21 balloon wall
  INSPIRATION_CHILDRENS[3], // rainbow unicorn sequin backdrop
  INSPIRATION_CORPORATE[1], // gala staircase garland
  INSPIRATION_MILESTONES[5], // Bearly Wait hot air balloon
  INSPIRATION_CHILDRENS[2], // teddy bear balloon hoop
  INSPIRATION_MILESTONES[4], // champagne bowling garland
  INSPIRATION_CHILDRENS[8], // Dahlia daisy balloons
  INSPIRATION_MILESTONES[1], // blue 60
  INSPIRATION_CHILDRENS[5], // Berry First strawberries
  INSPIRATION_CORPORATE[0], // office Christmas half arch
  INSPIRATION_MILESTONES[7], // 70th floating orbs
];
