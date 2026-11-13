import type { ReactNode } from "react";
import { handleEnquireClick } from "@/lib/enquire";

type Props = {
  /** Card heading. */
  heading?: ReactNode;
  /** Optional supporting copy under the heading. */
  body?: ReactNode;
  /** Button label. */
  label?: string;
  /** Button destination. */
  href?: string;
  /** "card" - large dark card at end of article (default).
   *  "inline" - small inline button used mid-article. */
  variant?: "card" | "inline";
};

/**
 * Call-to-action used twice in an article: once mid-flow as a discreet
 * button (variant="inline"), once at the end as a full dark card
 * (variant="card", default).
 */
const ArticleCta = ({
  heading,
  body,
  label = "Plan your celebration",
  href = "/#enquire",
  variant = "card",
}: Props) => {
  if (variant === "inline") {
    return (
      <div className="article-block max-w-[720px] mx-auto article-pad text-center">
        <a href={href} onClick={handleEnquireClick} className="btn-solid-rf accent">
          {label} <span>→</span>
        </a>
      </div>
    );
  }

  return (
    <aside className="max-w-[720px] mx-auto article-block article-pad">
      <div className="rounded-large bg-surface-deep text-on-deep panel-pad text-center">
        <h2 className="t-h4 max-w-[20ch] mx-auto">
          {heading ?? (
            <>
              Plan your{" "}
              <em className="t-accent">
                celebration.
              </em>
            </>
          )}
        </h2>
        {body && (
          <p
            className="t-small heading-to-text max-w-[440px] mx-auto text-ink-faint"
          >
            {body}
          </p>
        )}
        <a href={href} onClick={handleEnquireClick} className="btn-solid-rf accent text-to-action inline-flex">
          {label} <span>→</span>
        </a>
      </div>
    </aside>
  );
};

export default ArticleCta;
