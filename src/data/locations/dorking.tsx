import { makeLocation } from "./_makeLocation";

const dorking = makeLocation({
  slug: "dorking",
  cityName: "Dorking",
  region: "Surrey",
  images: {
    heroFan: ["naming-harvey-daisy", "dinosaur-ayaan", "40th-rose-gold"],
    galleryMain: "wonka-chocolate-arch",
    galleryThumbs: ["stubbs-gender-reveal", "pastel-safari-anaya", "jungle-elephant"],
  },
  uniqueSeoTitle: "Dorking Children's Party Styling | River Fox Events",
  uniqueSeoDescription:
    "Children's parties beneath the Surrey Hills - first birthdays to big themed celebrations in Dorking, individually designed by Laura.",
  uniqueHeroLine: <>Children's party styling in Dorking,</>,
  uniqueHeroSub: <>Party styling in Dorking, shaped by statement balloon installations, bespoke backdrops and details that feel personal.</>,
  uniqueUspBody:
    "For Dorking families after something a little more special, River Fox Events designs celebrations that feel personal, memorable and beautifully put together. Known for statement balloon installations, bespoke backdrops and thoughtful styling, we turn homes and venues around the town into days that children and guests talk about long afterwards.",
  uniqueServicesHeading: (
    <>
      Children's parties take the lead.{" "}
      <em className="italic font-light text-accent-warm">
        We style the grown-up days too.
      </em>
    </>
  ),
  uniqueServicesIntro: (
    <>
      Most Dorking work starts with a child's birthday, and that's where we
      spend our time. Christenings, milestones and corporate styling are
      handled with the same care when you need them.
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
