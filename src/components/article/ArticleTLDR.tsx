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
  <aside className="max-w-[720px] mx-auto mt-6 mb-12 md:mt-10 md:mb-16 px-6">
    <div
      className="rounded-large px-6 md:px-8 py-6 md:py-7 border"
      style={{
        // Pinky-peach surface at 20% opacity - soft fill, full-strength stroke.
        background: "hsl(var(--background-warm) / 0.20)",
        borderColor: "hsl(var(--accent-dark))",
      }}
    >
      <div
        className="t-overline mb-3"
        style={{ color: "hsl(var(--text-primary))" }}
      >
        In short
      </div>
      <div className="t-small text-ink space-y-1.5">
        {children}
      </div>
    </div>
  </aside>
);

export default ArticleTLDR;
