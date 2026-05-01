import type { ReactNode } from "react";

type Props = {
  /** Card heading. */
  heading?: ReactNode;
  /** Optional supporting copy under the heading. */
  body?: ReactNode;
  /** Button label. */
  label?: string;
  /** Button destination. */
  href?: string;
  /** "card" — large dark card at end of article (default).
   *  "inline" — small inline button used mid-article. */
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
      <div className="my-12 max-w-[720px] mx-auto px-6 text-center">
        <a href={href} className="btn-solid-rf accent">
          {label} <span>→</span>
        </a>
      </div>
    );
  }

  return (
    <aside className="max-w-[820px] mx-auto my-16 md:my-24 px-6">
      <div className="rounded-[18px] bg-surface-deep text-on-deep px-8 md:px-14 py-10 md:py-16 text-center">
        <h2
          className="font-serif-rf max-w-[20ch] mx-auto"
          style={{
            fontSize: "clamp(28px, 3vw, 44px)",
            lineHeight: 1.06,
            fontWeight: 300,
            letterSpacing: "-0.022em",
          }}
        >
          {heading ?? (
            <>
              Plan your{" "}
              <em className="italic font-light text-accent-warm">
                celebration.
              </em>
            </>
          )}
        </h2>
        {body && (
          <p
            className="mt-5 max-w-[440px] mx-auto text-[15px] leading-[1.65]"
            style={{ color: "hsl(var(--on-deep-soft))" }}
          >
            {body}
          </p>
        )}
        <a href={href} className="btn-solid-rf accent mt-8 inline-flex">
          {label} <span>→</span>
        </a>
      </div>
    </aside>
  );
};

export default ArticleCta;
