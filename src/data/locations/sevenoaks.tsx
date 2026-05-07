import { makeLocation } from "./_makeLocation";

const sevenoaks = makeLocation({
  slug: "sevenoaks",
  cityName: "Sevenoaks",
  region: "Kent",
  seoTitleRegion: "Kent",
  uniqueSeoTitle: "Party Stylist Sevenoaks Kent | River Fox Events",
  uniqueSeoDescription:
    "West Kent events, fully managed from setup to breakdown — including Sevenoaks, Riverhead, Otford and Seal. Personally designed by Laura.",
  uniqueHeroSub: (
    <>
      Sevenoaks events, considered in detail. One stylist, one client, no
      templates.
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
        TN13–TN15 postcodes. Every celebration is built from scratch
        around your brief — concept, balloon installations, backdrops,
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
