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
        Dorking sits at the foot of the Surrey Hills — a market town
        with the Box Hill horizon on one side and Denbies Wine
        Estate on the other. A slower, scenic part of Surrey that
        lends itself to garden-focused, country-feel celebrations.
      </p>
      <p>
        The landscape does a lot of the design work. Box Hill, the
        North Downs Way and the rolling country either side of the
        Mole valley give Dorking celebrations a backdrop that
        favours soft, layered styling over high-shine: meadow-led
        florals, natural-fibre tablecloths, signage that earns its
        place. Denbies' vineyard rows, Wotton House's formal
        gardens and the Surrey Hills villages — Mickleham, Brockham,
        Westcott — each lean into that register slightly
        differently, and we design accordingly.
      </p>
    </>
  ),
  uniqueOccasionsLead:
    "Dorking celebrations often run against that Surrey Hills backdrop — vineyard-style milestones in the area around Denbies, country-house events at venues like Wotton House, and bespoke gatherings at private homes across Dorking and the wider Surrey Hills.",
  uniquePresenceAnswer:
    "Yes — Dorking, Westcott, Brockham, Mickleham and the wider Surrey Hills are part of our regular Surrey coverage. Notable venues in the area include Denbies Wine Estate and Wotton House, with Beaverbrook a short hop towards Leatherhead.",
  uniqueExtraFaqs: [
    {
      q: "Are venues like Denbies Wine Estate or Wotton House within your area?",
      a: "Yes — both sit within our Dorking patch, along with Beaverbrook just up the road. If your celebration is at a country-house or vineyard venue around Dorking, share the venue in your enquiry and we'll come back with how we'd approach the install.",
    },
    {
      q: "Do you handle outdoor celebrations across the Surrey Hills?",
      a: "Yes — outdoor celebrations are part of the rhythm of the Dorking area. We've installed for vineyard-side milestone birthdays at Denbies, garden parties on the lanes towards Mickleham and Westcott, and christenings at properties looking up to Box Hill. We design for weather contingency from the start, and install and break down without leaving a trace on the landscape.",
    },
  ],
});

export default dorking;
