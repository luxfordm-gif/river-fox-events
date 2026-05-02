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
        River Fox Events is a Cobham party stylist designing bespoke
        children's parties, milestone birthdays, christenings, baby
        showers, weddings and corporate styling across the KT11
        postcode. Every celebration is built from scratch around your
        brief — concept, balloon installations, backdrops, signage,
        cake table and tablescape, all installed and broken down by
        us.
      </p>
      <p>
        Our studio is in Horley and Cobham sits firmly in our
        regular Surrey coverage. Same-day install and breakdown, no
        travel surcharges for the standard celebration, and full
        management on the day.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Cobham celebrations split between family at-home work along
        the village high street, the Stoke d'Abernon end and the
        Fairmile Lane estate roads, and venue events at Painshill
        Park, Brooklands and the surrounding hospitality spaces. We
        scale the styling to either: a single statement installation
        for an intimate party, or a full multi-zone styling across
        drawing rooms, gardens and marquees.
      </p>
    </>
  ),
  uniquePresenceAnswer:
    "Yes — Cobham is a postcode we cover regularly. We work across the village high street, the Stoke d'Abernon end and the Fairmile Lane estate roads, plus venue work at Painshill Park, Brooklands and the surrounding spaces. Mention your venue or postcode in your enquiry and we'll come back with a styling proposal designed for your space.",
  uniqueExtraFaqs: [
    {
      q: "Do you cover events at venues like Painshill Park or Brooklands?",
      a: "Yes — both are within our regular Cobham/Weybridge patch. Wherever your celebration is in or around Cobham, mention the venue when you enquire and we'll talk through how we'd approach the install.",
    },
    {
      q: "Do you handle multi-zone at-home celebrations in Cobham?",
      a: "Yes — many of the larger Cobham at-home celebrations span multiple rooms or zones (drawing room, kitchen, garden, marquee). We design across all of them as one piece, install in a single morning, and clear after the last guest has left.",
    },
  ],
});

export default cobham;
