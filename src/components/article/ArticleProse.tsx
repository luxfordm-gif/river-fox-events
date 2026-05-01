import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

/**
 * Centred, narrow prose column for article body copy. ChatGPT-style:
 * ~720px wide, generous line-height, serif body, comfortable
 * inter-paragraph spacing.
 *
 * Children are typically a sequence of <p> / <h2> / <h3> / <ul> / <a>.
 * Tailwind's prose classes are deliberately not used — the styling here
 * matches the rest of the site (Fraunces serif, ink colours, accent on
 * links) rather than Tailwind's defaults.
 */
const ArticleProse = ({ children }: Props) => (
  <div
    className="article-prose max-w-[720px] mx-auto px-6 font-serif-rf text-ink"
    style={{
      fontSize: "18px",
      lineHeight: 1.7,
      fontWeight: 400,
    }}
  >
    {children}
  </div>
);

export default ArticleProse;
