import { makeLocation } from "./_makeLocation";

const crawley = makeLocation({
  slug: "crawley",
  cityName: "Crawley",
  region: "West Sussex",
  images: {
    heroFan: ["stubbs-gender-reveal", "naming-harvey-daisy", "jungle-elephant"],
    galleryMain: "baby-shower-bloom",
    galleryThumbs: ["fairy-kayla", "40th-rose-gold", "wonka-chocolate-arch"],
  },
  seoTitleRegion: "West Sussex",
  uniqueSeoTitle: "Crawley Party & Event Stylist | River Fox Events",
  uniqueSeoDescription:
    "Easy reach across West Sussex from Crawley - full-service event styling for celebrations from concept to clear-down, personally by Laura.",
  uniqueHeroSub: (
    <>
      Designed, installed, delivered. Studio-led celebrations in Crawley and the
      surrounding villages.
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
