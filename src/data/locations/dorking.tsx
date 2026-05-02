import { makeLocation } from "./_makeLocation";

const dorking = makeLocation({
  slug: "dorking",
  cityName: "Dorking",
  region: "Surrey",
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
        River Fox Events is a Dorking party stylist designing bespoke
        children's parties, milestone birthdays, christenings, baby
        showers, weddings and corporate styling across the RH4 and
        RH5 postcodes and the wider Surrey Hills. Every celebration
        is built from scratch around your brief — concept, balloon
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
  uniquePresenceAnswer:
    "Yes — Dorking, Westcott, Brockham, Mickleham and the wider Surrey Hills are part of our regular Surrey coverage. Venue work includes Denbies Wine Estate, Wotton House and Beaverbrook a short hop towards Leatherhead. Mention your venue or postcode in your enquiry and we'll come back with a styling proposal designed for your space.",
  uniqueExtraFaqs: [
    {
      q: "Are venues like Denbies Wine Estate or Wotton House within your area?",
      a: "Yes — both sit within our Dorking patch, along with Beaverbrook just up the road. If your celebration is at a country-house or vineyard venue around Dorking, share the venue in your enquiry and we'll come back with how we'd approach the install.",
    },
    {
      q: "Do you handle outdoor celebrations across the Surrey Hills?",
      a: "Yes — outdoor celebrations are part of the regular Dorking work. We've installed for vineyard-side milestone birthdays at Denbies, garden parties on the lanes towards Mickleham and Westcott, and christenings at properties looking up to Box Hill. We design for weather contingency from the start.",
    },
  ],
});

export default dorking;
