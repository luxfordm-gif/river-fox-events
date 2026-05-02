import { makeLocation } from "./_makeLocation";

const oxted = makeLocation({
  slug: "oxted",
  cityName: "Oxted",
  region: "East Surrey",
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
        Oxted sits at the eastern edge of Surrey, where the North Downs
        meet the start of the Weald — the M25 cuts across the top of
        the town at Junction 6, the Oxted Tunnel runs underneath it,
        and Limpsfield Common sits a few minutes east. It's a corner of
        the county that rewards properly considered styling: family
        homes set into the chalk-and-greensand landscape, the High
        Street's mix of independents and old-school grocers, and a
        community that takes celebrations personally.
      </p>
      <p>
        From our Horley studio it's around twenty-five minutes east via
        the A25 and the M25 — far enough to feel like a different
        district, close enough that we cover it as a regular patch
        rather than a stretch. Most enquiries land at family homes
        across Oxted and Limpsfield, at the country-house and
        garden-feel venues set in the surrounding villages, and at the
        small cluster of celebration spaces in town.
      </p>
    </>
  ),
  uniqueOccasionsBody: (
    <>
      <p>
        On the venue side, Titsey Place sits a short drive east — the
        Tudor mansion and the formal gardens host weddings, milestone
        events and the occasional corporate hospitality day, and we've
        styled at all three. The Master Park pavilion handles the more
        community-led celebrations, and Foyle Riding at Limpsfield
        delivers the country-equestrian register some clients want.
      </p>
      <p>
        Family celebrations across Oxted tend to happen at home. The
        residential roads off Bluehouse Lane, the lanes towards
        Limpsfield Chart and the properties up on Tandridge Hill
        deliver the bulk of the at-home christenings, milestones and
        children's birthdays we work on here. We install before guests
        arrive, manage the day quietly, and clear afterwards so the
        property is back to itself by morning.
      </p>
    </>
  ),
  uniquePresenceAnswer:
    "Yes — Oxted, Limpsfield, Hurst Green, Tandridge, Godstone and Caterham are part of our regular East Surrey coverage. The patch runs across the High Street, Master Park, the residential roads off Bluehouse Lane, Limpsfield Chart, and out into Tandridge, Woldingham and the Westerham edge. Notable venues we work at include Titsey Place, the Master Park pavilion, Foyle Riding at Limpsfield, plus the country-house and garden-feel venues across the surrounding villages.",
  uniqueLeadTimeAnswer:
    "For Oxted 6–8 weeks ahead is the comfortable window. Local pressure points: Titsey Place's open-garden season runs through summer and compresses private-hire dates; weddings at the country-house venues across Tandridge and Limpsfield book twelve to eighteen months out for May–September Saturdays; and Christmas at the smaller venues fills early. Smaller at-home celebrations are often workable inside two weeks.",
  uniqueExtraFaqs: [
    {
      q: "Do you cover events at Titsey Place and the East Surrey country-house venues?",
      a: "Yes — Titsey Place sits firmly within our Oxted patch and is one of the country-house venues we know best. The mansion rooms, the formal gardens and the marquee lawn each take a styling installation differently. Tell us which space you've booked and the date when you enquire and we'll come back with a styling proposal that respects the period architecture.",
    },
    {
      q: "Are at-home celebrations across Oxted and Limpsfield within your area?",
      a: "Yes — most Oxted celebrations happen at home, and that's the bulk of what we do across the area. We're set up to install discreetly across drawing rooms, kitchens and gardens within a single property, and to break down on the night so the house is back to itself by morning. Mention the property and the day in your enquiry and we'll talk through how we'd approach it.",
    },
  ],
});

export default oxted;
