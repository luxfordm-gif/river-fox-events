import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * "In short" callout shown right after the hero. Styled as a soft warm
 * card so it stands apart from the prose without shouting. Designed to
 * hold 2–4 short bullets or a compact paragraph.
 */
const ArticleTLDR = ({ children }: Props) => (
  // Top margin tighter than bottom - pulls the card up close to the
  // social-share row at the foot of the article hero.
  <aside className="measure-reading mx-auto article-block-after article-pad">
    <div
      // Pinky-peach surface at 20% opacity - soft fill, full-strength stroke.
      className="rounded-large box-pad border bg-surface-warm/20 border-accent-warm"
    >
      <div
        className="t-overline label-to-list text-ink"
      >
        In short
      </div>
      <div className="t-small text-ink list-items">
        {children}
      </div>
    </div>
  </aside>
);

export default ArticleTLDR;
