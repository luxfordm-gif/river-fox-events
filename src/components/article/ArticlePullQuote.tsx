import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  attribution?: string;
};

/**
 * Centred italic pull-quote for breaking up prose. Wider than the prose
 * column but narrower than the wide-image breakout, so it visually sits
 * between the two scales.
 */
const ArticlePullQuote = ({ children, attribution }: Props) => (
  <blockquote className="max-w-[820px] mx-auto px-6 my-14 md:my-20 text-center">
    <p
      className="t-quote italic text-ink"
      style={{ textWrap: "balance" }}
    >
      “{children}”
    </p>
    {attribution && (
      <cite className="t-eyebrow mt-5 inline-block text-ink-soft not-italic">
        - {attribution}
      </cite>
    )}
  </blockquote>
);

export default ArticlePullQuote;
