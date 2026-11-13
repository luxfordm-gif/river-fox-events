import { makeLocation } from "./_makeLocation";

const forestRow = makeLocation({
  slug: "forest-row",
  cityName: "Forest Row",
  region: "the Ashdown Forest",
  images: {
    heroFan: ["dinosaur-ayaan", "naming-harvey-daisy", "baby-shower-bloom"],
    galleryMain: "wonka-chocolate-arch",
    galleryThumbs: ["stubbs-gender-reveal", "jungle-elephant", "veuve-disco"],
  },
  uniqueSeoDescription:
    "Forest-edge children's parties across the Ashdown Forest - first birthdays to big themed celebrations, individually designed and installed by Laura.",
  uniqueHeroLine: <>Forest Row birthdays,</>,
  uniqueHeroSub: <>Gardens on the edge of Ashdown Forest, around Hartfield and Nutley, suit balloon hoops, woodland-themed backdrops and picnic setups for little ones.</>,
  uniqueUspBody:
    "For Forest Row families wanting a celebration with a little more to it, I design days that feel personal, memorable and beautifully resolved. Built around statement balloon installations, bespoke backdrops and thoughtful styling, I transform homes and village venues into celebrations children and guests remember well beyond the day.",
  uniqueServicesHeading: (
    <>
      Children's parties are my specialism.{" "}
      <em className="t-accent">
        The grown‑up days too.
      </em>
    </>
  ),
  uniqueServicesIntro: (
    <>
      Most Forest Row bookings are for a child's birthday, and that's where
      my time goes. Christenings, milestones and corporate work are styled
      with the same care when you need them.
    </>
  ),
  nearbyVillages: [
    "Hartfield",
    "Wych Cross",
    "Coleman's Hatch",
    "Upper Hartfield",
    "Withyham",
    "Nutley",
  ],
  areas: [
    "Forest Row",
    "Hartfield",
    "Wych Cross",
    "Coleman's Hatch",
    "Upper Hartfield",
    "Withyham",
    "Nutley",
    "Chelwood Gate",
    "Danehill",
    "Maresfield",
    "East Grinstead",
    "Crowborough",
  ],
  mapQuery: "Forest+Row,East+Sussex,England,UK&z=11",
  jsonLdAreaServed: [
    "Forest Row",
    "Hartfield",
    "Wych Cross",
    "Coleman's Hatch",
    "Withyham",
    "Ashdown Forest",
    "East Sussex",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        River Fox Events is a Forest Row and Ashdown Forest event
        stylist designing tailored children's parties, milestone
        birthdays, christenings, baby showers, weddings and corporate
        styling across the RH18 postcode and the wider forest area.
        Every celebration is individually designed around your brief -
        concept, balloon installations, backdrops, signage, cake
        table and tablescape, all installed and broken down by me.
      </p>
      <p>
        My studio is in Horley, around thirty-five minutes south on
        the A22, and the Ashdown Forest patch is part of my regular
        coverage. Full install and breakdown handled - including the
        weather-contingency planning the forest setting often asks
        for.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Forest Row celebrations split between family at-home events
        across the village and the lanes towards Coleman's Hatch and
        Hartfield, country-house weddings and milestones at Ashdown
        Park Hotel and the venues set into the forest, and outdoor
        celebrations across the Ashdown Forest commons and clearings.
        I scale the styling to either: a single statement
        installation for an intimate gathering, or a full multi-zone
        styling for a forest-edge wedding across marquees, lawns and
        reception rooms.
      </p>
    </>
  ),
});

export default forestRow;
