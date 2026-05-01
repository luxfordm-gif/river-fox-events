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
  uniqueWhatWeDoLead:
    "Guildford is Surrey's county town — a cobbled high street running down to the River Wey, the cathedral on the hill above, and a mix of historic and contemporary venues. The kind of town where celebrations vary widely in setting and style.",
  uniqueOccasionsLead:
    "Guildford celebrations span intimate gatherings in Castle Street townhouses, family parties across the GU postcodes, milestone birthdays at country-house venues, and corporate launches in the city centre. Notable venues in the area include Loseley Park, the Mandolay Hotel and G Live.",
  uniquePresenceAnswer:
    "Yes — Guildford and the wider GU area are part of our Surrey coverage. The patch runs from the town centre down through Shalford and Godalming, and out into Compton, Merrow and the surrounding villages. Notable venues in the area include Loseley Park, the Mandolay Hotel and G Live.",
  uniqueExtraFaq: {
    q: "Are venues like Loseley Park or the Mandolay within your area?",
    a: "Yes — both sit firmly within our Guildford patch, along with G Live and the country-house venues across the GU postcodes. Whatever the venue, mention it in your enquiry and we'll come back with how we'd approach the styling.",
  },
});

export default guildford;
