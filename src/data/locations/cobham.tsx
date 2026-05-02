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
  uniqueWhatWeDoBody: (
    <>
      <p>
        Cobham sits at the heart of our Surrey patch — busy village
        high street on one side, the Fairmile Lane estate roads on
        the other, and family homes throughout. The kind of variety
        that means no two celebrations look the same.
      </p>
      <p>
        Each part of Cobham has its own personality. Stoke d'Abernon
        leans into its quieter, leafier side and tends to bring at-
        home garden parties and christenings. The village centre
        delivers the higher-energy birthdays and milestone dinners
        in the High Street's restaurants and at private rooms
        nearby. The Fairmile Estate roads and the Sandown Park
        edge bring the larger landmark celebrations — 50ths in
        full marquees, christenings spread across two reception
        rooms, milestone weekends that need a Friday-evening
        install and a Sunday-morning breakdown.
      </p>
    </>
  ),
  uniqueOccasionsLead:
    "Cobham celebrations span birthday parties at home along the Stoke d'Abernon end, christenings around the village centre, and milestone events at private gardens and homes across the area. Notable venues nearby include Painshill Park and Brooklands, which sit just the other side of the A3.",
  uniquePresenceAnswer:
    "Yes — Cobham is a postcode we cover regularly. Coverage runs across the village high street, the Stoke d'Abernon end and the Fairmile Lane estate roads. Notable venues in the area include Painshill Park and Brooklands, both just the other side of the A3.",
  uniqueExtraFaqs: [
    {
      q: "Do you cover events at venues like Painshill Park or Brooklands?",
      a: "Yes — both are within our regular Cobham/Weybridge patch. Wherever your celebration is in or around Cobham, mention the venue when you enquire and we'll talk through how we'd approach the install.",
    },
    {
      q: "Are at-home celebrations across the Cobham estate roads within your area?",
      a: "Yes — the Fairmile Lane and Sandown Park-adjacent estate properties make up a large share of the at-home work we do here. Many are set up to host across multiple zones (drawing room, kitchen, garden, marquee), and we install across all of them in a single morning, manage the day discreetly, and clear after the last guest has left.",
    },
  ],
});

export default cobham;
