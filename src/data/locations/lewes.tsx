import { makeLocation } from "./_makeLocation";

const lewes = makeLocation({
  slug: "lewes",
  cityName: "Lewes",
  region: "East Sussex",
  images: {
    heroFan: ["pastel-safari-anaya", "stubbs-gender-reveal", "baby-shower-bloom"],
    galleryMain: "wonka-chocolate-arch",
    galleryThumbs: ["dinosaur-ayaan", "naming-harvey-daisy", "40th-rose-gold"],
  },
  seoTitleRegion: "East Sussex",
  uniqueSeoTitle: "Lewes Children's Party Styling | River Fox Events",
  uniqueSeoDescription:
    "Themed first birthdays and children's parties in Lewes and the East Sussex villages, individually designed and installed by Laura.",
  uniqueHeroLine: <>Children's party styling in Lewes,</>,
  uniqueHeroSub: (
    <>
      Character-filled celebrations for Lewes children - first birthdays to
      big themed parties, with christenings, milestones and corporate work
      alongside.
    </>
  ),
  uniqueUspBody:
    "A Lewes children's party can carry as much character as the town itself - each one designed around the child, the theme and the room, with statement installations and considered detail installed and broken down by us.",
  uniqueServicesHeading: (
    <>
      Children's parties are where we start.{" "}
      <em className="italic font-light text-accent-warm">
        We style the rest too.
      </em>
    </>
  ),
  uniqueServicesIntro: (
    <>
      Most Lewes bookings begin with a child's birthday, and that's where our
      time goes. Christenings, milestones and corporate work are styled with
      the same eye when the day calls for it.
    </>
  ),
  nearbyVillages: [
    "Cliffe",
    "Kingston near Lewes",
    "Rodmell",
    "Glynde",
    "Ringmer",
    "Barcombe",
  ],
  areas: [
    "Lewes",
    "Cliffe",
    "Kingston near Lewes",
    "Rodmell",
    "Glynde",
    "Ringmer",
    "Barcombe",
    "Plumpton",
    "Beddingham",
    "Iford",
    "Falmer",
    "Hamsey",
  ],
  mapQuery: "Lewes,East+Sussex,England,UK&z=11",
  jsonLdAreaServed: [
    "Lewes",
    "Cliffe",
    "Kingston near Lewes",
    "Rodmell",
    "Glynde",
    "Ringmer",
    "East Sussex",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        River Fox Events is a Lewes event stylist designing tailored
        children's parties, milestone birthdays, christenings, baby
        showers, weddings and corporate styling across the BN7 and
        BN8 postcodes. Every celebration is individually designed around
        your brief - concept, balloon installations, backdrops,
        signage, cake table and tablescape, all installed and broken
        down by us.
      </p>
      <p>
        Our studio is in Horley, around an hour south on the A23/A27,
        and Lewes is part of our regular East Sussex coverage. Full
        install and breakdown handled, every detail designed and
        managed personally by Laura.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Lewes celebrations split between family at-home work across
        the Cliffe and the residential roads above the High Street,
        country-house weddings at Glynde Place, Firle Place and
        Pelham House, and downland at-home celebrations across the
        Ouse-side and South Downs villages. We scale the styling to
        either: an intimate cake-table install for a christening at
        home, or a full multi-zone styling across reception rooms,
        gardens and marquees.
      </p>
    </>
  ),
});

export default lewes;
