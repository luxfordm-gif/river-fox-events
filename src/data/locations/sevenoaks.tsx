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
  seoTitleRegion: "Kent",
  uniqueSeoTitle: "Sevenoaks Children's Party Styling | River Fox Events",
  uniqueSeoDescription:
    "West Kent children's parties in Sevenoaks - first birthdays to big themed celebrations, individually designed and installed by Laura.",
  uniqueHeroLine: <>Children's party styling in Sevenoaks,</>,
  uniqueHeroSub: (
    <>
      Homes, halls and marquees across Sevenoaks - children's parties styled
      with care, with christenings, milestones and corporate work alongside.
    </>
  ),
  uniqueUspBody:
    "A Sevenoaks children's party works across homes, halls and marquees alike - each one designed around your child, the theme and the space, with statement installations and careful detail installed and broken down by us.",
  uniqueServicesHeading: (
    <>
      Children's parties are the centre of it.{" "}
      <em className="italic font-light text-accent-warm">
        We cover the rest as well.
      </em>
    </>
  ),
  uniqueServicesIntro: (
    <>
      Most Sevenoaks bookings start with a child's birthday, and that's where
      most of our time goes. The same attention goes into christenings,
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
    "Chipstead",
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
        down by us.
      </p>
      <p>
        Our studio is in Horley, around forty-five minutes east via
        the M25, and Sevenoaks sits within our regular west Kent
        coverage. Full install and breakdown handled, every detail
        designed and managed personally by Laura.
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
        club hospitality suites. We scale the styling to either: an
        intimate cake-table install for a christening, or a full
        multi-zone styling across reception rooms and gardens.
      </p>
    </>
  ),
});

export default sevenoaks;
