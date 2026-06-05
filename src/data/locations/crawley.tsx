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
  seoTitleRegion: "West Sussex",
  uniqueSeoTitle: "Crawley Children's Party Styling | River Fox Events",
  uniqueSeoDescription:
    "Children's birthday styling in Crawley and across West Sussex, from first birthdays to big themed parties - individually designed and installed by Laura.",
  uniqueHeroLine: <>Children's party styling in Crawley,</>,
  uniqueHeroSub: <>Children's birthdays in Crawley, styled with statement balloon installations, bespoke backdrops and considered personal touches.</>,
  uniqueUspBody:
    "Celebrating in Crawley? River Fox Events combines considered styling, statement balloon installations and carefully chosen details into something your family will remember. Each event is individually designed around your child, your space and the day you have in mind, so the result feels personal, joyful and entirely your own.",
  uniqueServicesHeading: (
    <>
      Children's parties lead the way.{" "}
      <em className="italic font-light text-accent-warm">
        The grown-up events follow.
      </em>
    </>
  ),
  uniqueServicesIntro: (
    <>
      Most Crawley work starts with a child's birthday, and that's where we
      spend our time. Christenings, milestone birthdays and corporate styling
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
    "Gossops Green",
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
        and broken down by us.
      </p>
      <p>
        Our studio is in Horley, ten minutes north up the A23, which
        makes Crawley one of the closest towns we cover and the
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
        thread; we scale the design to either, from a single statement
        balloon arch to a full venue install.
      </p>
    </>
  ),
});

export default crawley;
