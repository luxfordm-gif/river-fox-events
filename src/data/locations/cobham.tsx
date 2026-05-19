import { makeLocation } from "./_makeLocation";

const cobham = makeLocation({
  slug: "cobham",
  cityName: "Cobham",
  region: "Surrey",
  images: {
    heroFan: ["pastel-safari-anaya", "40th-rose-gold", "jungle-elephant"],
    galleryMain: "wonka-chocolate-arch",
    galleryThumbs: ["baby-shower-bloom", "veuve-disco", "naming-harvey-daisy"],
  },
  uniqueSeoTitle: "Considered Event Styling in Cobham | River Fox Events",
  uniqueSeoDescription:
    "Studio-led styling at Painshill Park, Stoke d'Abernon and across Cobham. Statement parties and milestones from £460, personally by Laura.",
  uniqueHeroSub: (
    <>
      Tailored event styling in Cobham. From first idea to final breakdown,
      personally handled.
    </>
  ),
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
        River Fox Events is a Cobham party stylist designing tailored
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
  uniqueLocalProse: {
    eyebrow: "STYLING IN COBHAM",
    heading: (
      <>
        Local detail,{" "}
        <em className="italic font-light text-accent-warm">properly handled.</em>
      </>
    ),
    body: (
      <>
        <p>
          Cobham splits cleanly into two kinds of celebration. There's the
          at-home work along the village high street, the Stoke d'Abernon
          end and the Fairmile Lane estate roads — properties with the
          space to host across multiple zones. And there's the venue work
          at Painshill Park, Brooklands and the surrounding hospitality
          spaces, each of which takes a styling installation differently.
        </p>
        <p>
          Operationally the area is a quick run from us via the A3 and the
          M25, which keeps the day comfortable. Same-morning installs,
          late-night breakdowns once the last guest has gone, and no
          awkward overnight returns. Oxshott, Esher, Stoke d'Abernon and
          Effingham all fall inside the same easy-access band.
        </p>
        <p>
          Most enquiries arrive with a date, a venue or postcode and a
          rough feeling rather than a finished brief. From the first
          conversation we shape the rest together — palette, installations,
          tablescape, signage, the install and the breakdown. Laura designs
          and runs every event personally.
        </p>
      </>
    ),
  },
});

export default cobham;
