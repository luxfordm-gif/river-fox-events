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
  uniqueWhatWeDoLead:
    "Dorking sits at the foot of the Surrey Hills — a market town with the Box Hill horizon on one side and Denbies Wine Estate on the other. A slower, scenic part of Surrey that lends itself to garden-focused, country-feel celebrations.",
  uniqueOccasionsLead:
    "Dorking celebrations often run against that Surrey Hills backdrop — vineyard-style milestones in the area around Denbies, country-house events at venues like Wotton House, and bespoke gatherings at private homes across the RH4 and RH5 postcodes.",
  uniquePresenceAnswer:
    "Yes — Dorking, Westcott, Brockham, Mickleham and the wider RH4/RH5 area are part of our regular Surrey coverage. Notable venues in the area include Denbies Wine Estate and Wotton House, with Beaverbrook a short hop towards Leatherhead.",
  uniqueExtraFaq: {
    q: "Are venues like Denbies Wine Estate or Wotton House within your area?",
    a: "Yes — both sit within our Dorking patch, along with Beaverbrook just up the road. If your celebration is at a country-house or vineyard venue around Dorking, share the venue in your enquiry and we'll come back with how we'd approach the install.",
  },
});

export default dorking;
