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
  uniqueSeoDescription:
    "Big themed birthdays and first-birthday styling in Horsham - children's parties individually designed and installed by Laura.",
  uniqueHeroLine: <>Horsham birthday balloons,</>,
  uniqueHeroSub: <>For parties in Southwater, Warnham and Broadbridge Heath, I bring the balloon columns, light-up number stacks and theme props, and take them all away after.</>,
  uniqueUspBody:
    "For Horsham families looking for a celebration with a little more care behind it, I design days that feel personal, memorable and beautifully finished. Known for statement balloon installations, bespoke backdrops and thoughtful styling, I turn homes and venues across the town into days children and guests carry with them.",
  uniqueServicesHeading: (
    <>
      Children's parties are the bulk of it.{" "}
      <em className="t-accent">
        I style the rest as well.
      </em>
    </>
  ),
  uniqueServicesIntro: (
    <>
      Horsham families mostly come to me for a child's birthday, and that's
      my focus. The same eye goes into christenings, milestones and corporate
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
    "Crawley",
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
        down by me.
      </p>
      <p>
        My studio is in Horley, around thirty minutes by road, and
        Horsham sits firmly within my regular coverage. Same-day
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
        Capitol theatre and Field Place. I scale the styling to the
        room - from a single focal-point installation for an intimate
        celebration to a full multi-zone install across reception
        rooms, marquees and gardens.
      </p>
    </>
  ),
});

export default horsham;
