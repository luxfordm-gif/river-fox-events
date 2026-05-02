import { makeLocation } from "./_makeLocation";

const oxted = makeLocation({
  slug: "oxted",
  cityName: "Oxted",
  region: "East Surrey",
  nearbyVillages: [
    "Limpsfield",
    "Hurst Green",
    "Tandridge",
    "Godstone",
    "Caterham",
    "Woldingham",
  ],
  areas: [
    "Oxted",
    "Limpsfield",
    "Hurst Green",
    "Tandridge",
    "Godstone",
    "Caterham",
    "Woldingham",
    "Redhill",
    "Reigate",
    "Lingfield",
    "Edenbridge",
    "Westerham",
  ],
  mapQuery: "Oxted,Surrey,England,UK&z=10",
  jsonLdAreaServed: [
    "Oxted",
    "Limpsfield",
    "Hurst Green",
    "Tandridge",
    "Godstone",
    "Caterham",
    "Surrey",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        River Fox Events is an Oxted party stylist designing bespoke
        children's parties, milestone birthdays, christenings, baby
        showers, weddings and corporate styling across the RH8
        postcode. Every celebration is built from scratch around your
        brief — concept, balloon installations, backdrops, signage,
        cake table and tablescape, all installed and broken down by
        us.
      </p>
      <p>
        Our studio is in Horley, around twenty-five minutes east via
        the A25 and M25, and Oxted sits within our regular East
        Surrey coverage. Full install and breakdown handled, every
        detail designed and managed personally by Laura.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Oxted celebrations split between family at-home work across
        the residential roads off Bluehouse Lane, Limpsfield Chart
        and the properties up on Tandridge Hill, country-house
        weddings and milestones at Titsey Place, and smaller
        community-led celebrations at the Master Park pavilion. We
        scale the styling to either: a single statement installation
        for an intimate party, or a full multi-zone styling across
        reception rooms, gardens and marquees.
      </p>
    </>
  ),
  uniquePresenceAnswer:
    "Yes — Oxted, Limpsfield, Hurst Green, Tandridge, Godstone and Caterham are part of our regular East Surrey coverage. We cover the High Street, Master Park, the residential roads off Bluehouse Lane, Limpsfield Chart, and out into Tandridge, Woldingham and the Westerham edge. Venue work includes Titsey Place and the Master Park pavilion. Mention your venue or postcode in your enquiry and we'll come back with a styling proposal designed for your space.",
  uniqueExtraFaqs: [
    {
      q: "Do you cover events at Titsey Place?",
      a: "Yes — Titsey Place sits firmly within our Oxted patch and is one of the country-house venues we know best. The mansion rooms, the formal gardens and the marquee lawn each take a styling installation differently. Tell us which space you've booked and the date when you enquire and we'll come back with a styling proposal that respects the period architecture.",
    },
    {
      q: "Are at-home celebrations across Oxted and Limpsfield within your area?",
      a: "Yes — most Oxted celebrations happen at home, and that's the bulk of what we do across the area. We're set up to install discreetly across drawing rooms, kitchens and gardens within a single property, and to break down on the night so the house is back to itself by morning.",
    },
  ],
});

export default oxted;
