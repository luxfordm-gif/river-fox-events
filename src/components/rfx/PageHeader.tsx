import type { ReactNode } from "react";

type PageHeaderProps = {
  /** The H1. Pass an <em> for the italic accent word. */
  title: ReactNode;
  /** Optional plain paragraph under the H1. */
  intro?: ReactNode;
  /** Optional small label, shown under the H1 (never above it, so the H1
   *  always lands in the same place on every inner page). */
  note?: ReactNode;
  /** Optional extra content under the intro (jump links, buttons). */
  children?: ReactNode;
  id?: string;
  /** "paper" puts the header on the lighter cream (Our work). */
  tone?: "paper";
  /** Hairline under the intro, with equal space above and below (Our work). */
  divider?: boolean;
};

/**
 * Shared header for inner pages (Our work, Journal, Contact, Privacy,
 * Welcome, 404). One top offset, one H1 size and weight, one intro style,
 * so moving between these pages the heading never jumps. Spacing lives in
 * `.page-header*` in index.css.
 */
const PageHeader = ({ title, intro, note, children, id, tone, divider }: PageHeaderProps) => {
  const cls = ["page-header", tone === "paper" && "page-paper", divider && "page-header--rule"]
    .filter(Boolean)
    .join(" ");
  return (
  // Spacing sits on the outer <header>, not on .container-rfx: container
  // rules elsewhere reset padding with the shorthand and would undo it.
  <header className={cls}>
    <div className="container-rfx text-center">
      <h1 id={id} className="page-header__title font-serif-rf mx-auto">
        {title}
      </h1>
      {note && (
        <div className="page-header__note font-mono-rf text-ink-soft">{note}</div>
      )}
      {intro && <p className="page-header__intro mx-auto text-ink-soft">{intro}</p>}
      {children}
      {divider && <div className="page-header__rule" aria-hidden="true" />}
    </div>
  </header>
  );
};

export default PageHeader;
