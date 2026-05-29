import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Reviewer display name, e.g. "Samantha". */
  author: string;
  /** Optional link to the review on Google. */
  href?: string;
};

/**
 * A single Google review presented inside an article, styled to match the
 * homepage testimonials carousel (gold stars + "via Google" link). Used when
 * an article quotes the client whose event it documents.
 */
const ArticleReviewQuote = ({ children, author, href }: Props) => (
  <figure className="tcard fade-up max-w-[640px] mx-auto my-14 md:my-20">
    <span className="tcard-stars" aria-label="Five stars">
      {"★★★★★"}
    </span>
    <blockquote className="tcard-quote font-thin text-ink-soft">
      {children}
    </blockquote>
    <figcaption className="tcard-meta">
      <span className="name">{author}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="tcard-link"
          aria-label={`Read ${author}'s review on Google`}
        >
          via Google ↗
        </a>
      ) : (
        <span />
      )}
    </figcaption>
  </figure>
);

export default ArticleReviewQuote;
