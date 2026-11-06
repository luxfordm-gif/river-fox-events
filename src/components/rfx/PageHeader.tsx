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
};

/**
 * Shared header for inner pages (Our work, Journal, Contact, Privacy,
 * Welcome, 404). One top offset, one H1 size and weight, one intro style,
 * so moving between these pages the heading never jumps. Spacing lives in
 * `.page-header*` in index.css.
 */
const PageHeader = ({ title, intro, note, children, id }: PageHeaderProps) => (
  // Spacing sits on the outer <header>, not on .container-rfx: container
  // rules elsewhere reset padding with the shorthand and would undo it.
  <header className="page-header">
    <div className="container-rfx text-center">
      <h1 id={id} className="page-header__title font-serif-rf mx-auto">
        {title}
      </h1>
      {note && (
        <div className="page-header__note font-mono-rf text-ink-soft">{note}</div>
      )}
      {intro && <p className="page-header__intro mx-auto text-ink-soft">{intro}</p>}
      {children}
    </div>
  </header>
);

export default PageHeader;
