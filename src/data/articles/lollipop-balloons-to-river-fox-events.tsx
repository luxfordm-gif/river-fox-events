import ArticleProse from "@/components/article/ArticleProse";
import ArticleImage from "@/components/article/ArticleImage";
import ArticlePullQuote from "@/components/article/ArticlePullQuote";
import ArticleCta from "@/components/article/ArticleCta";
import ArticleTLDR from "@/components/article/ArticleTLDR";

import imgLead from "@/assets/luxury-event-stylist-surrey-river-fox-events.webp";
import imgCards from "@/assets/river-fox-events-business-cards-surrey.webp";

/**
 * First-article body for the Lollipop Balloons → River Fox Events rebrand.
 *
 * Editorial structure:
 *   1. Lead paragraph + opening image
 *   2. "Why the change" subhead
 *   3. Pull quote
 *   4. "What stays the same" subhead with service cross-links
 *   5. Mid-article inline CTA
 *   6. "What's new" subhead
 *   7. "What's next" subhead
 *   8. End-of-article CTA card (rendered by parent in Article.tsx)
 *
 * Cross-links to /childrens-parties/, /milestone-celebrations/ and
 * /corporate-brand-styling/ are deliberately spread through the body so
 * search engines see internal anchors with descriptive text, not "click
 * here".
 */
const LollipopRebrandArticle = () => (
  <>
    <ArticleTLDR>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Lollipop Balloons</strong> is now{" "}
          <strong>River Fox Events</strong>.
        </li>
        <li>
          Same designer (Laura), same studio in Surrey, same approach to
          design.
        </li>
        <li>
          Three core services unchanged: children's parties, milestone
          celebrations and corporate event styling.
        </li>
        <li>More to follow — and we're excited.</li>
      </ul>
    </ArticleTLDR>

    <ArticleProse>
      <p>
        For the past several years, you might have known us as{" "}
        <strong>Lollipop Balloons</strong>. Today we're stepping into a new
        name — <strong>River Fox Events</strong> — and a new chapter.
      </p>
      <p>
        Nothing about how we work is changing. Same studio in Horley. Same
        designer (Laura). Same approach to design — bespoke, nothing off a
        shelf, every detail considered. What's changing is the name on the
        door.
      </p>
    </ArticleProse>

    <ArticleImage
      src={imgLead}
      alt="River Fox Events branded hoodie in cream, photographed outside the Surrey studio"
      caption="The new identity, on the back of a hoodie outside the studio."
    />

    <ArticleProse>
      <h2>Why the change</h2>
      <p>
        When Lollipop Balloons started, the work was — as you'd guess —
        mostly balloons. A really good balloon installation could carry an
        entire celebration.
      </p>
      <p>
        Over the years that broadened. A typical celebration today combines
        installations, signage, dressed cake tables, considered florals and
        full-room transformations. Calling all of that "balloons" felt
        small.
      </p>
      <p>
        <em>River Fox Events</em> captures the bigger picture without
        losing the playfulness. The fox is for the colour and the
        character — bold, distinctive, agile. The river is for the calm —
        celebrations that feel composed rather than chaotic.
      </p>
    </ArticleProse>

    <ArticlePullQuote>
      Same hands. Same studio. New name. Same level of detail.
    </ArticlePullQuote>

    <ArticleProse>
      <h2>What stays the same</h2>
      <p>
        If you've worked with Lollipop Balloons before, here's what isn't
        changing:
      </p>
      <ul>
        <li>
          <strong>The studio.</strong> Still in Horley, Surrey. Still 15
          Apsley Rd.
        </li>
        <li>
          <strong>Laura.</strong> Still the only person designing your
          celebration. Still the one who'll meet you, sketch ideas with
          you, and install on the day.
        </li>
        <li>
          <strong>The three core services:</strong>{" "}
          <a href="/childrens-parties/">children's party styling</a>,{" "}
          <a href="/milestone-celebrations/">milestone celebrations</a>{" "}
          and{" "}
          <a href="/corporate-brand-styling/">corporate &amp; brand styling</a>.
        </li>
        <li>
          <strong>The Surrey patch.</strong> Cobham, Weybridge, Esher,
          Oxshott, Reigate, Guildford, Dorking and beyond.
        </li>
        <li>
          <strong>Pricing, process, response times.</strong> All
          unchanged.
        </li>
      </ul>
    </ArticleProse>

    <ArticleImage
      src={imgCards}
      alt="River Fox Events business cards in cream with the new brand identity, photographed on travertine"
      caption="The new identity, on paper. Cards going out to recent enquiries."
    />

    <ArticleCta variant="inline" label="Plan your celebration" />

    <ArticleProse>
      <h2>What's new</h2>
      <p>
        A name that reflects what we now do. A new website (this one)
        with proper service pages and area-specific information for the
        Surrey towns we work in. Cleaner styling for the brand itself.
      </p>
      <p>
        And a slightly broader ambition —{" "}
        <a href="/corporate-brand-styling/">
          corporate events and brand activations
        </a>{" "}
        are now a meaningful chunk of the work, alongside the{" "}
        <a href="/childrens-parties/">children's parties</a> and{" "}
        <a href="/milestone-celebrations/">milestones</a> we've always
        loved.
      </p>

      <h2>What's next</h2>
      <p>
        We're looking forward to continuing the relationships we've built
        with so many of you over the years — and to welcoming new clients
        into the next chapter.
      </p>
      <p>
        More to follow over the coming weeks. For now: thank you for being
        part of the journey, and here's to whatever you're celebrating
        next.
      </p>
      <p>
        — <em>Laura</em>
      </p>
    </ArticleProse>
  </>
);

export default LollipopRebrandArticle;
