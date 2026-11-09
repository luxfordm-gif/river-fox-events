import ArticleProse from "@/components/article/ArticleProse";
import ArticleImage from "@/components/article/ArticleImage";
import ArticlePullQuote from "@/components/article/ArticlePullQuote";
import ArticleReviewQuote from "@/components/article/ArticleReviewQuote";
import ArticleCta from "@/components/article/ArticleCta";
import ArticleTLDR from "@/components/article/ArticleTLDR";

/* Laura's own work, already on the site. Same files and alt text as Our
   work and the From design to delivery article. */
import imgReeva from "@/assets/river-fox-events-pastel-birthday-reeva-entrance-arch.webp";
import imgRender from "@/assets/journal/from-design-to-delivery/dinosaur-party-concept-render-surrey.webp";
import imgFinished from "@/assets/journal/from-design-to-delivery/dinosaur-party-styling-surrey-finished.webp";
import imgTheatre from "@/assets/river-fox-events-theatre-125-anniversary-marquee-wide.webp";

const HiringAnEventStylistSurreyArticle = () => (
  <>
    <ArticleTLDR>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          When you book me, one person looks after everything: the design, the
          delivery, the set-up and the clear-away at the&nbsp;end.
        </li>
        <li>
          You'll see a moodboard, a palette and, for bigger designs, a render
          of your setup before anything is ordered, so the day holds
          no&nbsp;surprises.
        </li>
        <li>
          Celebrations start from £300, and fuller designs that transform a
          whole room usually range from £800 to&nbsp;£1,500+.
        </li>
        <li>
          Styling should feel personal to you and your space, never like a kit
          dropped into a&nbsp;room.
        </li>
      </ul>
    </ArticleTLDR>

    <ArticleProse>
      <p>
        Many hosts tell me the styling is the part of their planning they feel
        least sure about. You know how you'd like the room to feel, but
        finding the balloons, the backdrop, someone to set it all up and
        someone to take it down again can quickly turn into four separate
        conversations with four different&nbsp;people.
      </p>
      <p>
        That's the gap I fill. I style children's parties, milestone
        celebrations and brand events across Surrey and into London, and I
        look after each one myself from start to finish. Here's what's
        actually included when you book me, what it costs and how it all
        comes&nbsp;together.
      </p>
    </ArticleProse>

    <ArticleImage
      src={imgReeva}
      aspect="4/3"
      width={720}
      alt="Blush, peach and cream balloon arch over Reeva's birthday welcome easel at a front door"
      caption="A pastel arch around the front door for Reeva's second birthday, so the party started on the&nbsp;doorstep."
    />

    <ArticleProse>
      <h2>One person, from the first idea to the clear-up</h2>
      <p>
        I personally design, deliver, install and clear every event. The
        person you share your ideas with is the same person who builds the
        setup on the morning and comes back to take it down, so nothing gets
        lost between a designer, a hire company and an install team. You have
        one point of contact for every decision, every timing question and
        every message from your&nbsp;venue.
      </p>
      <p>
        It also means I keep my diary deliberately small. I take on a limited
        number of events each month so that each one has my full attention,
        and I'd always rather do fewer events beautifully than squeeze more
        in. If your date falls on a weekend, it's worth getting in touch
        early.
      </p>
      <p>
        I style in homes, gardens, hired halls, hotels and brand spaces. A
        first birthday in a living room deserves just as much care as a dinner
        in a ballroom, and some of my favourite setups have been around a
        front door or in a family kitchen. You can see the range on my{" "}
        <a href="/childrens-parties/">children's parties</a> and{" "}
        <a href="/milestone-celebrations/">milestone celebrations</a>{" "}
        pages.
      </p>
    </ArticleProse>

    <ArticlePullQuote>
      Styling should feel personal to you and your space, never like a kit
      dropped into a&nbsp;room.
    </ArticlePullQuote>

    <ArticleProse>
      <h2>Seeing your setup before the day</h2>
      <p>
        Every design starts with a conversation about the occasion, your
        guests and the room itself. From there I put together a moodboard and
        a colour palette, and for larger setups a render, which is a drawing
        of the design in your space, so you can see the scale and the colours
        before anything is&nbsp;ordered.
      </p>
    </ArticleProse>

    <ArticleImage
      src={imgRender}
      aspect="natural"
      width={560}
      alt="Hand-drawn concept render of a dinosaur party with a sage garland, dinosaur cutouts, explorer crates and colour swatches"
      caption="The concept render for Ayaan's dinosaur party, with the palette agreed before anything was&nbsp;ordered."
    />

    <ArticleProse>
      <p>
        This is where we make the important decisions together: how big the
        balloon installation should be for your ceiling height, where the
        backdrop sits so it catches the light, and how the colours work with
        your walls and furniture. It's much easier to adjust a drawing than a
        room on the morning of a&nbsp;party.
      </p>
      <p>
        On the day, everything is delivered and installed before your guests
        arrive, so you can focus on hosting rather than inflating balloons in
        the hallway. When the last guest has gone, I come back and take it all
        down, so there's nothing left for you to dismantle, store or
        clear&nbsp;away.
      </p>
    </ArticleProse>

    <ArticleImage
      src={imgFinished}
      aspect="4/3"
      width={720}
      alt="Finished dinosaur party in a Surrey home: sage balloon arch, AYAAN name sign, dinosaur cutouts and wooden explorer crates"
      caption="And the finished room in Ayaan's family home, with the same palette, crates and dinosaurs as the&nbsp;render."
    />

    <ArticleReviewQuote
      author="Tolu Balogun"
      href="https://maps.app.goo.gl/dcLgoJHXnhjjzJKP6"
    >
      Laura is absolutely fantastic. It was such a smooth and seamless
      process, from our initial conversation to the design of my son's
      birthday backdrop and tablescape, and it all brought the wow factor. I
      highly recommend her and will be using her always.
    </ArticleReviewQuote>

    <ArticleCta variant="inline" label="Reserve your date" />

    <ArticleProse>
      <h2>What's included, and what it costs</h2>
      <p>Depending on your event, your styling can include:</p>
      <ul>
        <li>Balloon installations, from garlands and arches to columns and number stacks</li>
        <li>
          Backdrops and photo areas, including painted panels and{" "}
          <a href="/journal/shimmer-wall-hire-surrey/">sequin and shimmer walls</a>
        </li>
        <li>Signage, light-up numbers and letters, and personalised welcome signs</li>
        <li>A moodboard, a palette and, for larger designs, a render of your setup</li>
        <li>Delivery, set-up before guests arrive, and taking it all down afterwards</li>
      </ul>
      <p>
        Celebrations start from £300, and fuller designs that transform a
        whole room usually range from £800 to £1,500+. Every quote is shaped
        around your brief, the size of the space and what's involved on the
        day, so I'll always send you a clear proposal before anything
        is&nbsp;confirmed.
      </p>
      <p>
        If you're after the simplest possible decoration at the lowest price,
        a styling service like mine may not be the right fit, and that's
        completely fine. I'm the right person when you'd like ideas, care over
        the details and a finished room designed around your&nbsp;space.
      </p>
    </ArticleProse>

    <ArticleProse>
      <h2>Brand events and business celebrations</h2>
      <p>
        The same approach works for businesses. I create statement
        installations, branded backdrops, entrance displays and photo moments
        for launches, anniversaries and team celebrations, and I've been
        trusted by brands including P&amp;G, The Range and Foxhills. Matching
        your brand colours and working around a venue's access times are all
        part of the brief. There's more on my{" "}
        <a href="/corporate-brand-styling/">corporate and brand styling</a>{" "}
        page.
      </p>
    </ArticleProse>

    <ArticleImage
      src={imgTheatre}
      aspect="4/3"
      width={720}
      alt="125th anniversary light-up marquee numbers on a theatre staircase with cream and gold balloons"
      caption="Light-up numbers on a theatre staircase for its 125th anniversary, framed in teal, white and&nbsp;gold."
    />

    <ArticleProse>
      <p>
        Surrey is home, and I travel across the county, into London and
        further afield for the right event. I have pages for many of the towns
        I cover, such as{" "}
        <a href="/party-styling-reigate/">Reigate</a>, and wherever your
        venue is, just mention it when you enquire and I'll let you&nbsp;know.
      </p>
    </ArticleProse>

    <ArticleProse>
      <h2>Why I love this part</h2>
      <p>
        What I love most about working this way is that I see each
        celebration all the way through. I'm there when it's still an idea in
        someone's head, and I'm there on the morning when the room changes
        and it suddenly feels like a&nbsp;party.
      </p>
      <p>
        Being the one person involved also means I get to know the families
        and teams I work with, and it's always a privilege when they ask me
        back for the next birthday, the next christening or next year's
        Christmas&nbsp;party.
      </p>
      <p>
        If you have a celebration coming up, I'd love to hear about it.{" "}
        <a href="/#enquire">Send me your date, your venue and a few words about what you have in mind</a>,
        and I'll come back to you with&nbsp;ideas.
      </p>
      <p>Laura&nbsp;x</p>
    </ArticleProse>
  </>
);

export default HiringAnEventStylistSurreyArticle;
