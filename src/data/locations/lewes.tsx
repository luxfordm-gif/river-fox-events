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
  uniqueSeoTitle: "Editorial Event Styling Lewes | River Fox Events",
  uniqueSeoDescription:
    "A short drive from Lewes — full-service East Sussex country-house celebrations. From design to clear-down, personally handled by Laura.",
  uniqueHeroSub: (
    <>
      Considered, drawn, delivered. Studio-led celebrations in Lewes and the
      East Sussex villages.
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
        BN8 postcodes. Every celebration is built from scratch around
        your brief — concept, balloon installations, backdrops,
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
