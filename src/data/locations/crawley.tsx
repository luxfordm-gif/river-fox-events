import { makeLocation } from "./_makeLocation";

const crawley = makeLocation({
  slug: "crawley",
  cityName: "Crawley",
  region: "West Sussex",
  images: {
    heroFan: ["stubbs-gender-reveal", "naming-harvey-daisy", "jungle-elephant"],
    galleryMain: "pastel-safari-anaya",
    galleryThumbs: ["fairy-kayla", "40th-rose-gold", "wonka-chocolate-arch"],
  },
  uniqueSeoDescription:
    "Children's birthday styling in Crawley and across West Sussex, from first birthdays to big themed parties - individually designed and installed by Laura.",
  uniqueHeroLine: <>Crawley kids' parties,</>,
  uniqueHeroSub: <>Pound Hill, Maidenbower and Three Bridges birthdays get balloon walls, light-up letters and themed props, set up and cleared by me on the day.</>,
  uniqueUspBody:
    "Celebrating in Crawley? River Fox Events combines considered styling, statement balloon installations and carefully chosen details into something your family will remember. Each event is individually designed around your child, your space and the day you have in mind, so the result feels personal, joyful and entirely your own.",
  uniqueServicesHeading: (
    <>
      Children's parties lead the way.{" "}
      <em className="t-accent">
        The grown‑up events follow.
      </em>
    </>
  ),
  uniqueServicesIntro: (
    <>
      Most Crawley work starts with a child's birthday, and that's where I
      spend my time. Christenings, milestone birthdays and corporate styling
      are handled with the same care when you need them.
    </>
  ),
  nearbyVillages: [
    "Three Bridges",
    "Ifield",
    "Pound Hill",
    "Maidenbower",
    "Tilgate",
    "Crawley Down",
  ],
  areas: [
    "Crawley",
    "Three Bridges",
    "Ifield",
    "Pound Hill",
    "Maidenbower",
    "Tilgate",
    "Crawley Down",
    "Worth",
    "Copthorne",
    "Southgate",
    "Bewbush",
    "Haywards Heath",
  ],
  mapQuery: "Crawley,West+Sussex,England,UK&z=11",
  jsonLdAreaServed: [
    "Crawley",
    "Three Bridges",
    "Ifield",
    "Pound Hill",
    "Maidenbower",
    "Tilgate",
    "West Sussex",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        River Fox Events is a Crawley event stylist designing tailored
        children's parties, milestone birthdays, christenings, baby
        showers, weddings and corporate brand activations across the
        RH10 and RH11 postcodes. Every celebration is built from
        scratch around your brief - concept, balloon installations,
        backdrops, signage, cake table and tablescape, all installed
        and broken down by me.
      </p>
      <p>
        My studio is in Horley, ten minutes north up the A23, which
        makes Crawley one of the closest towns I cover and the
        natural choice for both family celebrations and Gatwick-
        corridor corporate work.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Crawley splits broadly between family celebrations across
        Three Bridges, Pound Hill, Maidenbower and Tilgate - first
        birthdays, christenings, milestone weekends, often at home -
        and corporate work along the Gatwick corridor. Brand
        activations, conference styling, product launches and award
        nights at the airport hotels and at K2 Crawley are a regular
        thread; I scale the design to either, from a single statement
        balloon arch to a full venue install.
      </p>
    </>
  ),
});

export default crawley;
