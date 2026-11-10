import { makeLocation } from "./_makeLocation";

const sevenoaks = makeLocation({
  slug: "sevenoaks",
  cityName: "Sevenoaks",
  region: "Kent",
  images: {
    heroFan: ["pastel-safari-anaya", "naming-harvey-daisy", "veuve-disco"],
    galleryMain: "jungle-elephant",
    galleryThumbs: ["stubbs-gender-reveal", "wonka-chocolate-arch", "baby-shower-bloom"],
  },
  uniqueSeoDescription:
    "West Kent children's parties in Sevenoaks - first birthdays to big themed celebrations, individually designed and installed by Laura.",
  uniqueHeroLine: <>Sevenoaks party decorations,</>,
  uniqueHeroSub: <>Birthday decorations for Otford, Kemsing and Riverhead, with jumbo balloons, light-up numbers and a themed backdrop ready before guests arrive.</>,
  uniqueUspBody:
    "For Sevenoaks families wanting a celebration with real care behind it, I design days that feel personal, memorable and beautifully put together. Known for statement balloon installations, bespoke backdrops and thoughtful styling, I transform homes and venues across the area into celebrations children and guests remember long afterwards.",
  uniqueServicesHeading: (
    <>
      Children's parties are the centre of it.{" "}
      <em className="t-accent">
        I cover the rest as well.
      </em>
    </>
  ),
  uniqueServicesIntro: (
    <>
      Most Sevenoaks bookings start with a child's birthday, and that's where
      most of my time goes. The same attention goes into christenings,
      milestones and corporate work when you need them.
    </>
  ),
  nearbyVillages: [
    "Riverhead",
    "Otford",
    "Kemsing",
    "Seal",
    "Weald",
    "Westerham",
  ],
  areas: [
    "Sevenoaks",
    "Riverhead",
    "Otford",
    "Kemsing",
    "Seal",
    "Weald",
    "Westerham",
    "Brasted",
    "Ide Hill",
    "Bessels Green",
    "Dunton Green",
    "Tunbridge Wells",
  ],
  mapQuery: "Sevenoaks,Kent,England,UK&z=11",
  jsonLdAreaServed: [
    "Sevenoaks",
    "Riverhead",
    "Otford",
    "Kemsing",
    "Seal",
    "Weald",
    "Kent",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        River Fox Events is a Sevenoaks event stylist designing
        tailored children's parties, milestone birthdays, christenings,
        baby showers, weddings and corporate styling across the
        TN13–TN15 postcodes. Every celebration is individually designed
        around your brief - concept, balloon installations, backdrops,
        signage, cake table and tablescape, all installed and broken
        down by me.
      </p>
      <p>
        My studio is in Horley, around forty-five minutes east via
        the M25, and Sevenoaks sits within my regular west Kent
        coverage. Full install and breakdown handled, every detail
        designed and managed personally by me.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Sevenoaks celebrations split between family at-home work
        across the residential roads around the Vine and Knole,
        country-house weddings and milestone events at Knole, Squerryes
        Court at Westerham and Riverhill Himalayan Gardens, and
        smaller in-town celebrations through the rugby and cricket
        club hospitality suites. I scale the styling to either: an
        intimate cake-table install for a christening, or a full
        multi-zone styling across reception rooms and gardens.
      </p>
    </>
  ),
});

export default sevenoaks;
