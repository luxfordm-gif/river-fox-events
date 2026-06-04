import { makeLocation } from "./_makeLocation";

const horsham = makeLocation({
  slug: "horsham",
  cityName: "Horsham",
  region: "West Sussex",
  images: {
    heroFan: ["pastel-safari-anaya", "dinosaur-ayaan", "jungle-elephant"],
    galleryMain: "wonka-chocolate-arch",
    galleryThumbs: ["fairy-kayla", "veuve-disco", "baby-shower-bloom"],
  },
  seoTitleRegion: "West Sussex",
  uniqueSeoTitle: "Horsham Children's Party Styling | River Fox Events",
  uniqueSeoDescription:
    "Big themed birthdays and first-birthday styling in Horsham - children's parties individually designed and installed by Laura.",
  uniqueHeroLine: <>Children's party styling in Horsham,</>,
  uniqueHeroSub: (
    <>
      Slow, deliberate styling for Horsham children's parties - first
      birthdays to big themed celebrations, with milestones and corporate
      work alongside.
    </>
  ),
  uniqueUspBody:
    "Horsham children's parties are shaped slowly and deliberately, from the first idea to the last styled detail - a first birthday or a big themed celebration designed around your child and your space, installed and broken down by us.",
  uniqueServicesHeading: (
    <>
      Children's parties are the bulk of it.{" "}
      <em className="italic font-light text-accent-warm">
        We style the rest as well.
      </em>
    </>
  ),
  uniqueServicesIntro: (
    <>
      Horsham families mostly come to us for a child's birthday, and that's
      our focus. The same eye goes into christenings, milestones and corporate
      work when the occasion calls for it.
    </>
  ),
  nearbyVillages: [
    "Warnham",
    "Slinfold",
    "Itchingfield",
    "Mannings Heath",
    "Southwater",
    "Broadbridge Heath",
  ],
  areas: [
    "Horsham",
    "Warnham",
    "Slinfold",
    "Itchingfield",
    "Mannings Heath",
    "Southwater",
    "Broadbridge Heath",
    "Cowfold",
    "Lower Beeding",
    "Faygate",
    "Roffey",
    "Christ's Hospital",
  ],
  mapQuery: "Horsham,West+Sussex,England,UK&z=11",
  jsonLdAreaServed: [
    "Horsham",
    "Warnham",
    "Slinfold",
    "Itchingfield",
    "Mannings Heath",
    "Broadbridge Heath",
    "West Sussex",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        River Fox Events is a Horsham event stylist designing tailored
        children's parties, milestone birthdays, christenings, baby
        showers, weddings and corporate styling across the RH12 and
        RH13 postcodes. Every celebration is individually designed around
        your brief - concept, balloon installations, backdrops,
        signage, cake table and tablescape, all installed and broken
        down by us.
      </p>
      <p>
        Our studio is in Horley, around thirty minutes by road, and
        Horsham sits firmly within our regular coverage. Same-day
        install and breakdown, no travel surcharges for the standard
        celebration, and full management on the day so you don't lift
        a thing.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Horsham celebrations split between family at-home events
        around Roffey, Southwater and Broadbridge Heath, country-house
        weddings and milestone celebrations at South Lodge Hotel and
        the surrounding venues, and town-centre celebrations at the
        Capitol theatre and Field Place. We scale the styling to the
        room - from a single focal-point installation for an intimate
        celebration to a full multi-zone install across reception
        rooms, marquees and gardens.
      </p>
    </>
  ),
});

export default horsham;
