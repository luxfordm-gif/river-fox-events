import ArticleProse from "@/components/article/ArticleProse";
import ArticleImage from "@/components/article/ArticleImage";
import ArticlePullQuote from "@/components/article/ArticlePullQuote";
import ArticleCta from "@/components/article/ArticleCta";
import ArticleTLDR from "@/components/article/ArticleTLDR";

import imgLead from "@/assets/luxury-party-styling-occasions-surrey.webp";
import imgInline from "@/assets/corporate-gala-styling-surrey.webp";

const BeyondTheBalloonArchArticle = () => (
  <>
    <ArticleTLDR>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          The classic balloon arch is still beautiful — but it's no longer
          the headline.
        </li>
        <li>
          In 2026, the same budget is moving onto the table: layered
          fabrics, low florals, sculpted candles, considered place settings.
        </li>
        <li>
          Ceiling drapery and oversized bows are doing the work entrance
          arches used to do — they frame the whole room, not the doorway.
        </li>
        <li>
          Organic balloon installations haven't gone away. They've grown
          up — sized, sculpted and integrated, rather than stuck on a frame.
        </li>
      </ul>
    </ArticleTLDR>

    <ArticleProse>
      <p>
        For nearly a decade, the balloon arch was the photograph. Guests
        arrived, posed under it, posted it. It earned its place. But after
        styling hundreds of celebrations across Surrey — first as{" "}
        <em>Lollipop Balloons</em>, now as <strong>River Fox Events</strong>{" "}
        — the brief I receive in 2026 sounds different. Hosts still want a
        moment of drama. They just don't always want it at the door.
      </p>
    </ArticleProse>

    <ArticleImage
      src={imgLead}
      alt="Layered tablescape with velvet runner, peonies and tapered candles styled by River Fox Events in Surrey"
      caption="A recent Surrey milestone — velvet runner, layered linens, low florals. The drama lives on the table now."
    />

    <ArticleProse>
      <h2>The table is the new entrance</h2>
      <p>
        The biggest shift I'm seeing in{" "}
        <a href="/milestone-celebrations/">milestone bookings</a> — 40ths,
        50ths, anniversary dinners, intimate baby showers — is budget moving
        from the entrance to the table. Where a couple might once have asked
        for a 4-metre organic arch in the hallway, they now ask for a single,
        beautifully dressed long table that holds the room together. Velvet
        runners layered over linen. Cheesecloth cascading at the corners.
        Tapered candles in mixed heights. Florals that hover rather than
        tower.
      </p>
      <p>
        It photographs differently — less Instagram-arch, more editorial
        spread — and it changes how guests use the space. People sit longer.
        They linger.
      </p>
    </ArticleProse>

    <ArticlePullQuote>
      The drama hasn't gone — it's moved onto the table.
    </ArticlePullQuote>

    <ArticleProse>
      <h2>Drapery is doing the heavy lifting</h2>
      <p>
        What's replacing the entrance arch isn't nothing — it's drapery.
        Across the local industry, from venue stylists in Lingfield to
        wedding studios in Brighton, ceiling-mounted fabric is the
        installation everyone is talking about for 2026. Done well, it
        transforms a marquee, a barn or a hotel function room more
        completely than any single freestanding piece can. Done poorly, it
        looks like a school hall.
      </p>
      <p>
        The difference is weight, fall and finish. We use heavier weights of
        muslin and silk for milestone work — they catch light properly and
        they don't ripple in the way thin polyester does. For a 70th in
        Reigate last month, four panels of unbleached muslin draped from a
        central point gave us a tented feel inside a very ordinary ceiling.
        That's what guests photograph now.
      </p>
    </ArticleProse>

    <ArticleImage
      src={imgInline}
      alt="Ceiling drapery and statement floral installation at a Surrey corporate event styled by River Fox Events"
      caption="Ceiling drapery doing what the entrance arch used to — transforming the whole room, not just the doorway."
    />

    <ArticleCta variant="inline" label="Plan your 2026 celebration" />

    <ArticleProse>
      <h2>Balloons grew up</h2>
      <p>
        I want to be clear — balloons aren't going anywhere.{" "}
        <a href="/childrens-parties/">Children's parties</a> still want them,
        and they should. But for adult celebrations, the request has shifted
        from arches to organic sculptural pieces. Mixed sizes, varied finish
        (matte, chrome, confetti-filled), integrated with foliage and
        signage rather than sat on a wire frame.
      </p>
      <p>
        Two practical things have changed too. The latex we use is now
        biodegradable as standard, which matters more to clients than it
        used to. And the installations are increasingly designed to live
        alongside lighting — neon signage, marquee letters, soft uplighters
        — so they read at six in the evening as well as they did at two.
      </p>

      <h2>Colour: jewel tones with earth underneath</h2>
      <p>
        The palette conversation has moved on from the all-neutral, all-sage
        of the past few years. For 2026, I'm building boards around deep
        emerald and burgundy, butter yellow and burnt orange — but grounded
        with terracotta, clay and unbleached natural fabrics so it doesn't
        tip into Christmas. It's richer, warmer, more confident. It also
        flatters every age group, which matters when you're styling a party
        that has grandparents and toddlers in the same room.
      </p>

      <h2>What this means if you're planning something</h2>
      <p>
        If you're booking a celebration for later this year, the practical
        takeaways are simple. Spend on the table before you spend on the
        door. Ask for ceiling treatment if your venue's beams or ceiling
        height allow it — it's the single biggest transformation per pound.
        Keep balloons in the design if you love them, but ask for them
        sculpted into the room, not bolted to a frame at the entrance. And
        don't be frightened of richer colour.
      </p>
      <p>
        None of this is rules. Every celebration we style at River Fox
        Events is built from scratch around the person being celebrated — no
        templates, no packages. But if you've been looking at Pinterest
        boards from 2022 and wondering why nothing feels quite right, this
        is probably why.
      </p>
      <p>
        — <em>Laura</em>
      </p>
    </ArticleProse>
  </>
);

export default BeyondTheBalloonArchArticle;
