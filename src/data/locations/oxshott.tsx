import { makeLocation } from "./_makeLocation";

const oxshott = makeLocation({
  slug: "oxshott",
  cityName: "Oxshott",
  region: "Surrey",
  nearbyVillages: [
    "Cobham",
    "Esher",
    "Stoke d'Abernon",
    "Leatherhead",
    "Claygate",
    "Hinchley Wood",
  ],
  areas: [
    "Oxshott",
    "Cobham",
    "Esher",
    "Stoke d'Abernon",
    "Leatherhead",
    "Claygate",
    "Hinchley Wood",
    "Weybridge",
    "Walton-on-Thames",
    "Effingham",
    "Bookham",
    "Fetcham",
  ],
  mapQuery: "Oxshott,Surrey,England,UK&z=12",
  jsonLdAreaServed: [
    "Oxshott",
    "Cobham",
    "Esher",
    "Stoke d'Abernon",
    "Leatherhead",
    "Surrey",
  ],
  uniqueWhatWeDoBody: (
    <>
      <p>
        Tucked between Cobham and Esher, Oxshott is village in name,
        estate-belt in feel — large private homes, generous gardens
        and a community that takes celebrations seriously. Most
        Oxshott parties happen at home rather than at venues.
      </p>
      <p>
        It's the most home-led of our Surrey patches. The Crown
        Estate roads — Warren Lane, Sandy Lane, Stoke Road and the
        Heath properties around them — sit on properly generous
        plots, which means most celebrations run across multiple
        zones rather than a single room. Drawing-room and entrance-
        hall installations for arrival, garden marquees for the
        meal, kitchen-island bars for the after-dinner. We design
        across all of it as one piece, install across all of it in
        a single morning, and break down the same night.
      </p>
    </>
  ),
  uniqueOccasionsLead:
    "Oxshott celebrations often run across multiple zones of a private property — first birthdays in marquee-tented gardens, christenings styled around drawing rooms, and milestone moments dressed across kitchens, terraces and entertaining spaces.",
  uniquePresenceAnswer:
    "Yes — Oxshott sits firmly within our Surrey coverage, between Cobham and Esher. The patch runs across Oxshott Heath, the village centre, and the surrounding estate roads — Warren Lane, Sandy Lane, Stoke Road and beyond. Most local celebrations happen at private homes rather than at named venues.",
  uniqueExtraFaqs: [
    {
      q: "Do you cover private home parties in Oxshott?",
      a: "Yes — that's the bulk of what we do here. Oxshott is a town of large private properties, and most celebrations happen at home. We're set up to install across multiple rooms, gardens or marquees within a single property, and to handle the full breakdown discreetly afterwards.",
    },
    {
      q: "Can you handle a multi-zone Oxshott celebration in a single day?",
      a: "Yes — multi-zone installs are routine here. A typical Oxshott celebration might involve dressing the entrance hall and drawing room for arrival, a separate scheme in the garden marquee for dinner, and a third register for the kitchen-island after-dinner space. We design those zones as one piece so the celebration reads coherent rather than fragmented, and we install across all of them in a single morning.",
    },
  ],
});

export default oxshott;
