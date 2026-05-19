import { makeLocation } from "./_makeLocation";

const guildford = makeLocation({
  slug: "guildford",
  cityName: "Guildford",
  region: "Surrey",
  images: {
    heroFan: ["naming-harvey-daisy", "fairy-kayla", "40th-rose-gold"],
    galleryMain: "pastel-safari-anaya",
    galleryThumbs: ["stubbs-gender-reveal", "baby-shower-bloom", "wonka-chocolate-arch"],
  },
  uniqueSeoTitle: "Guildford Party & Event Stylist | River Fox Events",
  uniqueSeoDescription:
    "Ceiling drapery, balloon installations and milestone parties in Guildford from £460. Personally designed and installed by Laura.",
  uniqueHeroSub: (
    <>
      Guildford events, considered in detail. One stylist, one client, no
      templates.
    </>
  ),
  nearbyVillages: [
    "Godalming",
    "Shalford",
    "Compton",
    "Merrow",
    "Burpham",
    "Worplesdon",
  ],
  areas: [
    "Guildford",
    "Godalming",
    "Shalford",
    "Compton",
    "Merrow",
    "Burpham",
    "Worplesdon",
    "Ripley",
    "West Clandon",
    "Send",
    "Effingham",
    "Bookham",
  ],
  mapQuery: "Guildford,Surrey,England,UK&z=11",
  jsonLdAreaServed: [
    "Guildford",
    "Godalming",
    "Shalford",
    "Compton",
    "Merrow",
    "Surrey",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        River Fox Events is a Guildford party stylist designing
        tailored children's parties, milestone birthdays, christenings,
        baby showers, weddings and corporate styling across the GU1
        and GU2 postcodes and the wider GU area. Every celebration is
        built from scratch around your brief — concept, balloon
        installations, backdrops, signage, cake table and tablescape,
        all installed and broken down by us.
      </p>
      <p>
        Our studio is in Horley and Guildford sits within our regular
        Surrey coverage. Full install and breakdown handled, every
        detail designed and managed personally by Laura.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Guildford celebrations split between intimate gatherings in
        Castle Street townhouses, family at-home parties across the
        GU postcodes (Merrow, Burpham, Worplesdon, Shalford),
        country-house weddings at Loseley Park and corporate launches
        through the Mandolay Hotel and G Live. We scale the styling
        to either: a single statement installation for an intimate
        celebration, or a full multi-zone styling across reception
        rooms and gardens.
      </p>
    </>
  ),
});

export default guildford;
