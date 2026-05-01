import { makeLocation } from "./_makeLocation";

const cobham = makeLocation({
  slug: "cobham",
  cityName: "Cobham",
  region: "Surrey",
  nearbyVillages: [
    "Oxshott",
    "Stoke d'Abernon",
    "Downside",
    "Effingham",
    "Esher",
    "Weybridge",
  ],
  areas: [
    "Cobham",
    "Oxshott",
    "Stoke d'Abernon",
    "Downside",
    "Effingham",
    "Leatherhead",
    "Bookham",
    "Esher",
    "Weybridge",
    "Walton-on-Thames",
    "Hersham",
    "Claygate",
  ],
  mapQuery: "Cobham,Surrey,England,UK&z=11",
  jsonLdAreaServed: [
    "Cobham",
    "Oxshott",
    "Stoke d'Abernon",
    "Downside",
    "Effingham",
    "Surrey",
  ],
  uniqueWhatWeDoLead:
    "Cobham KT11 sits at the heart of our Surrey patch — busy village high street on one side, the Fairmile Lane estate roads on the other, and family homes throughout. The kind of variety that means no two celebrations look the same.",
  uniqueOccasionsLead:
    "Cobham celebrations span birthday parties at home along the Stoke d'Abernon end, christenings around the village centre, and milestone events at private gardens and homes throughout KT11. Notable venues in the surrounding area include Painshill Park and Brooklands, which sit just the other side of the A3.",
  uniquePresenceAnswer:
    "Yes — Cobham is a postcode we cover regularly. Coverage runs across the village high street, the Stoke d'Abernon end and the Fairmile Lane estate roads. Notable venues in the area include Painshill Park and Brooklands, both just the other side of the A3.",
  uniqueExtraFaq: {
    q: "Do you cover events at venues like Painshill Park or Brooklands?",
    a: "Yes — both are within our regular Cobham/Weybridge patch. Wherever your celebration is in or around Cobham, mention the venue when you enquire and we'll talk through how we'd approach the install.",
  },
});

export default cobham;
