import { makeLocation } from "./_makeLocation";

const dorking = makeLocation({
  slug: "dorking",
  cityName: "Dorking",
  region: "Surrey",
  images: {
    heroFan: ["naming-harvey-daisy", "dinosaur-ayaan", "40th-rose-gold"],
    galleryMain: "veuve-disco",
    galleryThumbs: ["stubbs-gender-reveal", "pastel-safari-anaya", "jungle-elephant"],
  },
  uniqueSeoTitle: "Party Stylist Dorking Surrey | River Fox Events",
  uniqueSeoDescription:
    "Editorial event styling around Denbies, Westcott and the Surrey Hills near Dorking. Layered, considered celebrations personally designed by Laura.",
  uniqueHeroSub: (
    <>
      Dorking events, considered in detail. One stylist, one client, no
      templates.
    </>
  ),
  nearbyVillages: [
    "Westcott",
    "Brockham",
    "Mickleham",
    "Wotton",
    "Holmwood",
    "Box Hill",
  ],
  areas: [
    "Dorking",
    "Westcott",
    "Brockham",
    "Mickleham",
    "Wotton",
    "Holmwood",
    "Box Hill",
    "Leatherhead",
    "Bookham",
    "Reigate",
    "Betchworth",
    "Capel",
  ],
  mapQuery: "Dorking,Surrey,England,UK&z=11",
  jsonLdAreaServed: [
    "Dorking",
    "Westcott",
    "Brockham",
    "Mickleham",
    "Wotton",
    "Surrey",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        River Fox Events is a Dorking party stylist designing tailored
        children's parties, milestone birthdays, christenings, baby
        showers, weddings and corporate styling across the RH4 and
        RH5 postcodes and the wider Surrey Hills. Every celebration
        is individually designed around your brief - concept, balloon
        installations, backdrops, signage, cake table and tablescape,
        all installed and broken down by us.
      </p>
      <p>
        Our studio is in Horley and Dorking sits within our regular
        Surrey coverage. Full install and breakdown handled, every
        detail designed and managed personally by Laura.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Dorking celebrations split between family at-home work across
        Dorking and the surrounding villages, vineyard-style
        milestone events around Denbies Wine Estate, and country-
        house weddings at Wotton House and Beaverbrook. We scale the
        styling to either: a single statement installation for an
        intimate at-home party, or a full multi-zone styling across
        reception rooms, gardens and marquees.
      </p>
    </>
  ),
});

export default dorking;
