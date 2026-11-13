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
  <aside className="max-w-[720px] mx-auto article-block-after article-pad">
    <div
      className="rounded-large box-pad border"
      style={{
        // Pinky-peach surface at 20% opacity - soft fill, full-strength stroke.
        background: "hsl(var(--background-warm) / 0.20)",
        borderColor: "hsl(var(--accent-dark))",
      }}
    >
      <div
        className="t-overline label-to-list"
        style={{ color: "hsl(var(--text-primary))" }}
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
