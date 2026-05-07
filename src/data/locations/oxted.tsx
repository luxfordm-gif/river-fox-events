import { makeLocation } from "./_makeLocation";

const oxted = makeLocation({
  slug: "oxted",
  cityName: "Oxted",
  region: "East Surrey",
  uniqueSeoTitle: "Party Stylist Oxted Surrey | River Fox Events",
  uniqueSeoDescription:
    "Design-led event styling for celebrations across Oxted, Limpsfield and East Surrey. Parties, milestones and installations from £460, by Laura.",
  uniqueHeroSub: (
    <>
      Design-led event styling in Oxted and across Surrey — children's
      parties, milestone celebrations and tailored installations.
    </>
  ),
  nearbyVillages: [
    "Limpsfield",
    "Hurst Green",
    "Tandridge",
    "Godstone",
    "Caterham",
    "Woldingham",
  ],
  areas: [
    "Oxted",
    "Limpsfield",
    "Hurst Green",
    "Tandridge",
    "Godstone",
    "Caterham",
    "Woldingham",
    "Redhill",
    "Reigate",
    "Lingfield",
    "Edenbridge",
    "Westerham",
  ],
  mapQuery: "Oxted,Surrey,England,UK&z=10",
  jsonLdAreaServed: [
    "Oxted",
    "Limpsfield",
    "Hurst Green",
    "Tandridge",
    "Godstone",
    "Caterham",
    "Surrey",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        Most clients arrive with a feeling rather than a brief — a
        colour, a memory, a Pinterest board that hasn't quite
        landed. The first conversation is short and unhurried; you
        bring the vision, we shape it into something specific and
        buildable. From that point you can let go: sourcing, build,
        install on the morning, breakdown on the night.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        A first birthday in the garden. A fortieth that needs to
        feel like a proper night out. A christening lunch, a ruby
        wedding, a brand dinner for the team. Every brief looks
        different, but the question underneath is always the same —
        what do you want this day to feel like? The styling is
        designed backwards from the answer.
      </p>
    </>
  ),
  uniqueLocalProse: {
    eyebrow: "STYLING IN OXTED",
    heading: (
      <>
        Local knowledge,{" "}
        <em className="italic font-light text-accent-warm">properly used.</em>
      </>
    ),
    body: (
      <>
        <p>
          Oxted is mostly home work. The houses across the area sit on
          enough land that styling has to belong in the room rather
          than be imposed on it — a country house calls for different
          decisions than a London townhouse, and we make them
          differently. When the celebration moves out, it tends to be
          to a private garden, a country club, or one of the village
          halls East Surrey does well.
        </p>
        <p>
          M25 J6 keeps the practical side easy: same-day installs,
          late finishes, Sunday-morning breakdowns.
        </p>
      </>
    ),
  },
  uniquePresenceAnswer:
    "Yes — Oxted is part of our regular East Surrey coverage, along with Limpsfield, Hurst Green, Tandridge, Godstone and the surrounding villages.",
});

export default oxted;
