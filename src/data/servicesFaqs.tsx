import type { FaqItem } from "./homeFaqs";

/**
 * /services/ FAQs (Matt, 2026-11-24). Drafted in Claude chat, still for
 * Laura to edit. Checked against docs/voice.md: first person (Q11 changed
 * from "Laura designs" to "I design"), no em dashes, exclamation marks or
 * banned words. Facts checked against the site: the four clients are on the
 * Corporate page's list, christenings and baby showers sit under Milestone
 * celebrations, set-up and collection come with every event, and short
 * notice "do still get in touch" is the Children's parties FAQ's own line.
 * No cost question: that answer is Laura's call (and this page shows no prices).
 *
 * `a` is the plain answer (it goes into the FAQPage schema); `aNode` is the
 * same words with links, shown on the page. Keep the two word for word.
 */

const L = ({ href, children }: { href: string; children: string }) => (
  <a href={href} className="text-ink underline-offset-4 underline decoration-ink/30 hover:decoration-ink">
    {children}
  </a>
);

export const SERVICES_FAQS: FaqItem[] = [
  // Who she is
  {
    q: "What does River Fox Events do?",
    a: "River Fox Events is an event styling studio in Surrey, run by Laura. I design and install the look of your event: balloon installations, backdrops, signage and themed props for children's parties, milestone celebrations and corporate events. Everything is designed for you, built on site and taken away afterwards.",
  },
  {
    q: "Is River Fox Events the same as Lollipop Balloons Surrey?",
    a: "Yes, River Fox Events is the new name for Lollipop Balloons Surrey. It's still me, Laura, and the same studio. The name changed because the work grew beyond balloons into full styling for parties, milestone celebrations and corporate events.",
    aNode: (
      <>
        Yes, River Fox Events is the new name for Lollipop Balloons Surrey. It's still me, Laura, and the same studio.{" "}
        <L href="/journal/lollipop-balloons-to-river-fox-events/">The name changed</L> because the work grew beyond
        balloons into full styling for parties, milestone celebrations and corporate events.
      </>
    ),
  },
  {
    q: "Where is River Fox Events based, and how far does Laura travel?",
    a: "River Fox Events is based in Horley, Surrey. I style events across Surrey, including Reigate, Cobham, Esher, Weybridge, Guildford and Epsom, and in London. I also travel to Sussex, west Kent and the Home Counties on request. Everything is delivered and built at your home or venue.",
    aNode: (
      <>
        River Fox Events is based in Horley, Surrey. I style events{" "}
        <L href="/areas-we-cover/">across Surrey</L>, including Reigate, Cobham, Esher, Weybridge, Guildford and Epsom,
        and in London. I also travel to Sussex, west Kent and the Home Counties on request. Everything is delivered and
        built at your home or venue.
      </>
    ),
  },
  {
    q: "What's the difference between an event stylist and a party planner?",
    a: "An event stylist designs and builds how your event looks, while a party planner organises the day itself, such as the venue, catering and entertainment. River Fox Events is a styling studio. I design the backdrop, balloons, signage and props, install them and clear away, while you or your planner look after the rest.",
    aNode: (
      <>
        An <L href="/journal/hiring-an-event-stylist-surrey/">event stylist</L> designs and builds how your event
        looks, while a party planner organises the day itself, such as the venue, catering and entertainment. River Fox
        Events is a styling studio. I design the backdrop, balloons, signage and props, install them and clear away,
        while you or your planner look after the rest.
      </>
    ),
  },
  // Choosing a service
  {
    q: "What's the difference between balloon decorations and full party styling?",
    a: "Balloon decorations are a single feature, such as an arch or garland in your colours. Full party styling is the whole look designed together: backdrop, balloons, signage and themed props, so everything matches. Many River Fox Events clients start with balloons and build the styling around them.",
    aNode: (
      <>
        <L href="/balloon-installations/">Balloon decorations</L> are a single feature, such as an arch or garland in
        your colours. <L href="/childrens-parties/">Full party styling</L> is the whole look designed together:
        backdrop, balloons, signage and themed props, so everything matches. Many River Fox Events clients start with
        balloons and build the styling around them.
      </>
    ),
  },
  {
    q: "Which River Fox Events service is right for my event?",
    a: "River Fox Events has three main services: children's parties, milestone celebrations, and corporate and brand styling. Children's parties covers themed birthdays from the very first one. Milestone celebrations covers big birthdays and family occasions. Corporate and brand covers launches, openings and company events. If you're not sure, tell me the occasion and I'll point you the right way.",
    aNode: (
      <>
        River Fox Events has three main services: <L href="/childrens-parties/">children's parties</L>,{" "}
        <L href="/milestone-celebrations/">milestone celebrations</L>, and{" "}
        <L href="/corporate-brand-styling/">corporate and brand styling</L>. Children's parties covers themed birthdays
        from the very first one. Milestone celebrations covers big birthdays and family occasions. Corporate and brand
        covers launches, openings and company events. If you're not sure, tell me the occasion and I'll point you the
        right way.
      </>
    ),
  },
  {
    q: "Can I combine balloons, backdrops and signage in one booking?",
    a: "Yes, River Fox Events can combine balloons, backdrops and signage in one booking. Most events I style use several elements, and they're designed as one look so the colours and style match. You make one enquiry, and I design everything together.",
  },
  {
    q: "Does River Fox Events style corporate events and brand launches in Surrey and London?",
    a: "Yes, River Fox Events styles corporate events, brand launches and openings across Surrey and London. Clients include P&G, The Range, Foxhills and Taylor Wimpey. Installations are designed around your brand colours and built on site.",
    aNode: (
      <>
        Yes, River Fox Events styles <L href="/corporate-brand-styling/">corporate events</L>, brand launches and
        openings across Surrey and London. Clients include P&amp;G, The Range, Foxhills and Taylor Wimpey.
        Installations are designed around your brand colours and built on site.
      </>
    ),
  },
  {
    q: "Do you style christenings, baby showers and weddings?",
    a: "Yes, River Fox Events styles christenings and baby showers, and offers styling pieces for weddings. Christenings and baby showers are designed in the same way as birthdays. For weddings I make pieces such as welcome signs, balloons and centrepieces. I don't offer wedding planning.",
    aNode: (
      <>
        Yes, River Fox Events styles <L href="/milestone-celebrations/">christenings and baby showers</L>, and offers
        styling pieces for weddings. Christenings and baby showers are designed in the same way as birthdays. For
        weddings I make pieces such as welcome signs, balloons and centrepieces. I don't offer wedding planning.
      </>
    ),
  },
  // How it works
  {
    q: "What's included in every River Fox Events booking?",
    a: "Every River Fox Events booking includes a design made for your event, delivery, set-up at your home or venue, and collection afterwards. You don't need to build or clear away anything yourself.",
  },
  {
    q: "Can Laura design around my theme, colours or venue?",
    a: "Yes, I design every River Fox Events booking around your theme, colours and space. Balloons and backdrops are matched to your palette, and the layout is planned around your room or venue.",
  },
  {
    q: "How far in advance should I book River Fox Events?",
    a: "It's best to book River Fox Events six to eight weeks before your event. I take on a small number of events each month, so busy periods fill up sooner. If your date is closer than that, it's still worth asking.",
  },
];
