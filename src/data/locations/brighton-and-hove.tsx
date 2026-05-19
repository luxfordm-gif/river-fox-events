import { makeLocation } from "./_makeLocation";

const brightonAndHove = makeLocation({
  slug: "brighton-and-hove",
  cityName: "Brighton & Hove",
  region: "East Sussex",
  images: {
    heroFan: ["dinosaur-ayaan", "pastel-safari-anaya", "wonka-chocolate-arch"],
    galleryMain: "40th-rose-gold",
    galleryThumbs: ["fairy-kayla", "baby-shower-bloom", "veuve-disco"],
  },
  seoTitleRegion: "East Sussex",
  uniqueSeoTitle: "Party Stylist Brighton & Hove | River Fox Events",
  uniqueSeoDescription:
    "A short drive from Brighton — full-service event styling across Brighton, Hove and East Sussex. From design to breakdown, by Laura.",
  uniqueHeroLine: <>Your Brighton & Hove event stylist.</>,
  uniqueHeroSub: (
    <>
      Celebrations brought to life across Brighton & Hove — personally designed
      and installed.
    </>
  ),
  nearbyVillages: [
    "Hove",
    "Kemp Town",
    "Preston Park",
    "Patcham",
    "Rottingdean",
    "Saltdean",
  ],
  areas: [
    "Brighton",
    "Hove",
    "Kemp Town",
    "Preston Park",
    "Patcham",
    "Rottingdean",
    "Saltdean",
    "Brunswick",
    "Adelaide Crescent",
    "Seven Dials",
    "Withdean",
    "Portslade",
  ],
  mapQuery: "Brighton,East+Sussex,England,UK&z=11",
  jsonLdAreaServed: [
    "Brighton",
    "Hove",
    "Kemp Town",
    "Preston Park",
    "Rottingdean",
    "Saltdean",
    "East Sussex",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        River Fox Events is a Brighton & Hove event stylist designing
        tailored children's parties, milestone birthdays, christenings,
        baby showers, weddings and corporate brand activations across
        the BN1, BN2 and BN3 postcodes. Every celebration is built
        from scratch around your brief — concept, balloon
        installations, backdrops, signage, cake table and tablescape,
        all installed and broken down by us.
      </p>
      <p>
        Our studio is in Horley, around an hour and ten south on the
        A23, and Brighton & Hove is the southern edge of our regular
        coverage. Full install and breakdown handled, every detail
        designed and managed personally by Laura.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        Brighton & Hove celebrations split between family at-home work
        across the Hove regency squares (Brunswick, Adelaide Crescent,
        Palmeira) and the Kemp Town terraces, venue weddings and
        landmark milestones at the Royal Pavilion, the Grand Hotel,
        Hotel du Vin and the Old Ship Hotel, and corporate brand
        activations at the Brighton Centre, Brighton Dome and the
        cultural-quarter spaces. We scale the styling to either: an
        intimate first-birthday installation in a Hove garden flat,
        or a full multi-zone styling for a seafront wedding.
      </p>
    </>
  ),
});

export default brightonAndHove;
