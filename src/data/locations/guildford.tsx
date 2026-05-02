import { makeLocation } from "./_makeLocation";

const guildford = makeLocation({
  slug: "guildford",
  cityName: "Guildford",
  region: "Surrey",
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
        Guildford is Surrey's county town — a cobbled high street
        running down to the River Wey, the cathedral on the hill
        above, and a mix of historic and contemporary venues. The
        kind of town where celebrations vary widely in setting and
        style.
      </p>
      <p>
        Each pocket of Guildford brings a different design
        challenge. Castle Street and the cobbled high-street
        properties suit intimate, properly considered styling that
        sits comfortably alongside the architecture. The wider GU
        residential roads — Merrow, Burpham, Worplesdon and
        Shalford — bring the at-home christenings and milestone
        birthdays. Loseley Park's house and walled garden, along
        with the Cathedral's Refectory and G Live's foyer spaces,
        each take a styled installation in completely different
        directions; we design accordingly rather than treating
        Guildford as one market.
      </p>
    </>
  ),
  uniqueOccasionsLead:
    "Guildford celebrations span intimate gatherings in Castle Street townhouses, family parties across the GU postcodes, milestone birthdays at country-house venues, and corporate launches in the city centre. Notable venues in the area include Loseley Park, the Mandolay Hotel and G Live.",
  uniquePresenceAnswer:
    "Yes — Guildford and the wider GU area are part of our Surrey coverage. The patch runs from the town centre down through Shalford and Godalming, and out into Compton, Merrow and the surrounding villages. Notable venues in the area include Loseley Park, the Mandolay Hotel and G Live.",
  uniqueExtraFaqs: [
    {
      q: "Are venues like Loseley Park or the Mandolay within your area?",
      a: "Yes — both sit firmly within our Guildford patch, along with G Live and the country-house venues across the GU postcodes. Whatever the venue, mention it in your enquiry and we'll come back with how we'd approach the styling.",
    },
    {
      q: "Do you cover the Surrey Hills villages south of Guildford?",
      a: "Yes — the lanes and villages south of Guildford (Compton, Shalford, Godalming, Bramley) are part of the same patch. Most celebrations across these villages happen at private homes; we install on-site, manage the day discreetly, and clear afterwards. Country-house and barn venues across the Surrey Hills are also within our regular coverage.",
    },
  ],
});

export default guildford;
