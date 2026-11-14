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
  /* The wrapper carries the article side padding (like the enquire box), so
     the card lines up with the prose and never touches the screen edge. */
  <div className="measure-reading mx-auto article-block article-pad">
    <figure className="tcard fade-up">
      <span className="tcard-stars" aria-label="Five stars">
        {"★★★★★"}
      </span>
      <blockquote className="tcard-quote text-ink-soft">
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
  </div>
);

export default ArticleReviewQuote;
