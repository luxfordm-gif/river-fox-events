import ArticleProse from "@/components/article/ArticleProse";
import ArticleImage from "@/components/article/ArticleImage";
import ArticlePullQuote from "@/components/article/ArticlePullQuote";
import ArticleCta from "@/components/article/ArticleCta";
import ArticleTLDR from "@/components/article/ArticleTLDR";
import BalloonPieces from "@/components/illustration/BalloonPieces";
import ArticleImageCarousel from "@/components/article/ArticleImageCarousel";

/* Laura's own balloon work, already on the site. Same files and alt text as
   Our work (one image, one alt). The arch section shows a full arch over a
   front door, not a half arch on a panel (Matt, 2026-11-28). */
import imgGarland40th from "@/assets/services/milestones/40th-birthday-champagne-gold-garland-restaurant.webp";
import imgBlushHoop from "@/assets/services/milestones/blush-rose-hoop-garland-living-room.webp";
import imgReevaArch from "@/assets/river-fox-events-pastel-birthday-reeva-entrance-arch.webp";
import imgLakesideArch from "@/assets/services/corporate/lakeside-terrace-navy-balloon-arch.webp";
import imgBabyInBloom from "@/assets/river-fox-events-baby-shower-baby-in-bloom-arch-portrait.webp";
import imgShimmerWall from "@/assets/services/milestones/50th-birthday-gold-sequin-wall-navy-garland.webp";
import imgPastelWall from "@/assets/services/milestones/21st-pastel-balloon-wall-light-up-numbers.webp";
import imgAureliaHoop from "@/assets/services/childrens-parties/aurelia-first-birthday-pink-grey-balloon-hoop.webp";
import imgColumns from "@/assets/services/corporate/125-years-entrance-columns-green-white-gold-stars.webp";
import imgBubbles from "@/assets/services/milestones/navy-gold-bubble-balloon-table-centrepieces.webp";
import imgHotAirBalloon from "@/assets/services/childrens-parties/hot-air-balloon-teddy-basket-neutral.webp";

/* One of each kind of balloon piece, seven at most (Matt, 2026-11-28).
   Alt text is the gallery's, word for word (one image, one alt). */
const balloonKinds = [
  { src: imgLakesideArch, alt: "Navy, cobalt and chrome balloon arch framing a lakeside terrace with tables and parasols", caption: "An arch framing a lakeside terrace.", position: "70% 50%" },
  { src: imgBabyInBloom, alt: "Dusty blue and white Baby in Bloom balloon arch with floral accents for a baby shower", caption: "A garland for a baby shower.", position: "50% 35%" },
  { src: imgShimmerWall, alt: "Gold sequin wall framed by navy and gold balloons beside blue light-up 50 numbers in a panelled room", caption: "A shimmer wall framed with a garland." },
  { src: imgAureliaHoop, alt: "Pink, grey and white balloon hoop around a Welcome to Aurelia's 1st Birthday sign, with a Minnie Mouse 1 and ONE blocks", caption: "A hoop for a first birthday." },
  { src: imgColumns, alt: "Green, white and gold balloon columns with 125 Years star foils either side of a grand entrance", caption: "Balloon columns for an entrance." },
  { src: imgBubbles, alt: "Navy bubble balloon centrepieces with gold table numbers on gold stands, with navy and chrome gold bases", caption: "Bubble balloon centrepieces." },
  { src: imgHotAirBalloon, alt: "Hot air balloon of stone and cream balloons over a wicker basket with a teddy bear on a lawn", caption: "A hot air balloon sculpture.", position: "50% 40%" },
];

const BalloonArchGarlandOrWallArticle = () => (
  <>
    <ArticleTLDR>
      <ul className="bullet-list">
        <li>
          An arch frames a moment you walk through or stand beneath: a front
          door, an entrance, a cake table or a welcome&nbsp;sign.
        </li>
        <li>
          A garland is the most adaptable piece, climbing a wall or edging a
          table, and it suits low ceilings and smaller&nbsp;rooms.
        </li>
        <li>
          A balloon wall fills a whole backdrop with colour, so it works best
          where photos matter and guests have room to step&nbsp;back.
        </li>
        <li>
          Choose the piece for the room, not the room for
          the&nbsp;piece.
        </li>
      </ul>
    </ArticleTLDR>

    <ArticleProse>
      <p>
        On a phone screen, a balloon arch, a garland and a balloon wall can
        look much the same: lots of balloons in lovely colours. In a real room
        they do quite different jobs, and choosing the right one makes far more
        difference than simply adding more&nbsp;balloons.
      </p>
      <p>
        Balloon arches are where I started, and I still design and install
        arches, garlands, balloon walls, hoops and number stacks across Surrey.
        As I wrote in{" "}
        <a href="/journal/beyond-the-balloon-arch/">beyond the balloon arch</a>,
        balloons look their best when the room is styled around them, but the
        piece you choose still sets the tone. Here's how I'd choose between
        them for your room, your ceiling and your guests, with a few honest
        notes for anyone thinking of building their&nbsp;own.
      </p>

      <h2>Balloon arches, garlands and walls at a glance</h2>
      <p>
        Here are the pieces I'm asked for most, side by side: two kinds of
        arch, eight ways to use a garland, a full balloon wall and a number
        stack. Every one is built on site at your event and sized to your
        room, so use these as a starting point rather than a&nbsp;menu.
      </p>
    </ArticleProse>

    <BalloonPieces />

    <ArticleProse>
      <h2>Arch, garland or balloon wall: which should I choose?</h2>
      <p>
        The short answer: choose an arch to frame an entrance or a single
        moment, a garland when you want colour along a wall, a table or a
        backdrop, and a balloon wall when you want one full backdrop for
        photos. Hoops and number stacks suit smaller spaces, where you want a
        focal point without filling the&nbsp;room.
      </p>

      <h3>When does a balloon arch work best?</h3>
      <p>
        An arch is a threshold piece. It frames something you walk through or
        stand beneath, such as a front door, the entrance to a hall, a cake
        table or a sign welcoming your guests. It tells people where the
        celebration begins, and it's the place everyone pauses for a photo on
        the way&nbsp;in.
      </p>
      <p>
        Arches need height and a little space on either side, so they're
        happiest in doorways, porches, garden paths and venues with generous
        ceilings. An organic arch doesn't have to be a full semicircle, either.
        Curving up one side of a panel gives the same sense of a frame in a
        fraction of the floor&nbsp;space.
      </p>
    </ArticleProse>

    <ArticleImage
      src={imgReevaArch}
      aspect="natural"
      width={720}
      alt="Blush, peach and cream balloon arch over Reeva's birthday welcome easel at a front door"
      caption="Reeva's birthday arch around the front door, so the party starts before anyone steps&nbsp;inside."
    />

    <ArticleProse>

      <h3>When is a balloon garland the better choice?</h3>
      <p>
        A garland is the most adaptable piece I make. It can climb a wall,
        drape along the front of a table, wrap around a backdrop or run along
        a mantelpiece, and because it follows the shape of the room rather
        than standing in the middle of it, it works almost&nbsp;anywhere.
      </p>
      <p>
        That makes garlands a lovely choice for low ceilings, restaurants,
        function rooms with a set layout and living rooms where floor space
        matters. They're also the gentlest on budget, because a single garland
        costs much less than a full balloon&nbsp;wall.
      </p>
    </ArticleProse>

    <ArticleImage
      src={imgGarland40th}
      aspect="natural"
      width={560}
      alt="Champagne, ivory and gold balloon garland climbing a patterned wall beside rose gold 40 foil numbers"
      caption="A champagne, ivory and gold garland for a 40th, taking the colour up towards the ceiling in one corner of a&nbsp;restaurant."
    />

    <ArticleProse>
      <h3>Is a balloon wall worth it?</h3>
      <p>
        A balloon wall fills a whole backdrop with balloons, edge to edge, so
        there's colour in every part of the photo. It's the boldest of the
        three and gives guests one obvious place to gather, which is why it
        suits big birthdays, themed parties and brand events where the photos
        really&nbsp;matter.
      </p>
      <p>
        It does need space in front of it, so guests can step back and take a
        picture, and it uses far more balloons than a garland, so it's the
        bigger investment. If you love the idea of a full backdrop but would
        like a softer finish, a{" "}
        <a href="/journal/shimmer-wall-hire-surrey/">shimmer wall</a> framed
        with a garland gives a similar focal point that catches the light
        instead.
      </p>
    </ArticleProse>

    <ArticleImage
      src={imgPastelWall}
      aspect="square"
      width={560}
      alt="Giant light-up 21 set into a pastel balloon wall in lilac, sage, peach and lemon"
      caption="A pastel balloon wall in lilac, sage, peach and lemon, built around a light-up 21 for a&nbsp;21st."
    />

    <ArticleProse>
      <h3>Where do hoops and number stacks fit?</h3>
      <p>
        These are the smaller-scale options. A metal hoop dressed with a
        garland makes a round frame for a sign or for photos, and it sits
        happily in front of a window or in the corner of a living room. Number
        stacks build the age itself out of balloons, so the number becomes the
        decoration. Both are a good answer when you want a focal point without
        filling the&nbsp;room.
      </p>
    </ArticleProse>

    <ArticleImage
      src={imgBlushHoop}
      aspect="natural"
      width={560}
      alt="Gold hoop wrapped in blush, rose gold and cream balloons in front of a sheer-curtained window"
      caption="A blush, rose gold and cream hoop in front of a living room window, a lovely size for a celebration at&nbsp;home."
    />

    <ArticlePullQuote>
      Choose the piece for the room, not the room for the&nbsp;piece.
    </ArticlePullQuote>

    <ArticleProse>
      <h2>Does the size of my room matter?</h2>
      <p>
        Yes, more than anything else. The same arch can look generous in a
        hallway and lost in a marquee, so I size every piece to the room it's
        going into. I always ask about ceiling height, where the light comes
        from and where guests will naturally gather, because that's where the
        balloons should&nbsp;be.
      </p>
      <p>
        At home, space is usually tighter and ceilings lower, so a garland
        along a wall, a hoop by a window or an arch around the front door
        tends to work best. I'll also think about where the cake table sits,
        since that's where everyone ends up for the birthday&nbsp;song.
      </p>
      <p>
        Hired halls, marquees and hotel function rooms are the opposite
        challenge. They're big and often plain, and a small piece can simply
        disappear. Here scale does the work: a full arch at the entrance, a
        balloon wall behind the main table, or garlands repeated along a long
        table so the colour carries across the room. Venues often have their
        own rules about fixings and keeping exits clear, so it's worth checking
        those&nbsp;early.
      </p>
      <p>
        Gardens are lovely for arches and hoops, which make a natural frame
        against hedges and lawns. Sun and heat do shorten a balloon's life
        outdoors, so I'll suggest a spot with some shade and time the install
        so everything looks its best when your guests&nbsp;arrive.
      </p>
      <p>
        For{" "}
        <a href="/childrens-parties/">children's parties</a>, I like the main
        piece to sit behind the cake table, so it's in the background of every
        photo. For{" "}
        <a href="/milestone-celebrations/">milestone birthdays</a>, a garland
        or wall paired with light-up numbers gives the guest of honour
        somewhere to stand all&nbsp;evening.
      </p>
    </ArticleProse>

    <ArticleCta variant="inline" label="Reserve your date" />

    <ArticleProse>
      <h2>How do you create a balloon arch that looks full?</h2>
      <p>
        If you've been wondering how to create a balloon arch yourself, I
        completely understand the appeal. A few things separate an arch that
        looks full and lasts from one that looks thin by the&nbsp;afternoon:
      </p>
      <ul>
        <li>
          A sturdy frame. A professional arch is built onto a frame or stand,
          so it holds its shape and stays put when people brush past&nbsp;it.
        </li>
        <li>
          Mixed sizes. Large, medium and small balloons are clustered
          together, with the smallest tucked into the gaps, which is what
          gives that full, organic&nbsp;look.
        </li>
        <li>
          Clusters, not rows. Balloons grouped in uneven bunches look natural,
          while identical rows tend to look like a string of&nbsp;beads.
        </li>
        <li>
          Air, not helium. Arches and garlands are filled with air, which is
          why they stay full for days indoors. Helium is for balloons that
          need to float, and they last no more than a day, less in heat or
          very cold&nbsp;weather.
        </li>
      </ul>
      <p>
        It takes more balloons, more time and more patience than most people
        expect, especially on the morning of a party. If you'd rather hand it
        over, my balloon decorations for parties are designed around your
        colours and built on site at your event, never made in advance, so
        they're at their best when your guests arrive. I come back
        afterwards to take everything down. If you're in Surrey and have been
        searching for "balloon arch hire near me", you can see everything I
        make on my{" "}
        <a href="/balloon-installations/">balloon decorations</a>&nbsp;page.
      </p>
      <p>
        Here are a few of the pieces I make, one of each kind, from real&nbsp;celebrations.
      </p>
    </ArticleProse>

    <ArticleImageCarousel images={balloonKinds} aspect="square" width={720} />

    <ArticleProse>
      <h2>Why I love this part</h2>
      <p>
        I love the moment a room and a balloon piece click together. A garland
        that follows the line of a wall, or an arch that frames a front door
        exactly, looks as though it was always meant to be there, and that's
        when guests stop and&nbsp;notice.
      </p>
      <p>
        It's why I never think of arches, garlands and walls as a menu to pick
        from. They're tools, and the right one depends on your room, your
        guests and the moment you want to remember. It's always a privilege to
        help someone find&nbsp;it.
      </p>
      <p>
        If you're not sure which would suit your space, I'd love to help.{" "}
        <a href="/#enquire">Send me your date, your venue and a photo of the room</a>,
        and I'll suggest what would work&nbsp;best.
      </p>
      <p>Laura&nbsp;x</p>
    </ArticleProse>
  </>
);

export default BalloonArchGarlandOrWallArticle;
