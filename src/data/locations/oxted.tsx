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
        Most clients arrive with a feeling rather than a brief — a
        colour, a memory, a Pinterest board that hasn't quite
        landed. The first conversation is short and unhurried; you
        bring the vision, we shape it into something specific and
        buildable. From that point you can let go: sourcing, build,
        install on the morning, breakdown on the night.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        A first birthday in the garden. A fortieth that needs to
        feel like a proper night out. A christening lunch, a ruby
        wedding, a brand dinner for the team. Every brief looks
        different, but the question underneath is always the same —
        what do you want this day to feel like? The styling is
        designed backwards from the answer.
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
