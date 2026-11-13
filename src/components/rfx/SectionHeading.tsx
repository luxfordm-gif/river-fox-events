import type { CSSProperties, ReactNode } from "react";

/**
 * Section titles and the intro under them: one shared component for every
 * section on the site (Matt, 2026-11-13). Before this, about 20 components
 * built their own <h2 className="t-h2"> with their own widths (none, 18ch,
 * 20ch, 760px) and their own intro widths (460 to 680px), so titles wrapped
 * at different points from page to page.
 *
 * SectionHeading: Heading 2 style with balanced lines; centred titles are at
 * most the Title width (--measure-title), so they wrap sooner and evenly.
 * Hyphenated words in titles use a non-breaking hyphen (‑) so they never
 * split across lines ("grown‑up").
 * SectionIntro: the paragraph under it, Heading to text below the title and
 * at most the Intro width (--measure-lead).
 *
 * align: "centre" (default), "left", or centred on phones and left from
 * tablet ("md-left") or from desktop ("lg-left"), matching the layout around
 * it. Put any italic words in <em className="t-accent">.
 */
export type SectionAlign = "centre" | "left" | "md-left" | "lg-left";

const MARGIN: Record<SectionAlign, string> = {
  centre: "mx-auto",
  left: "",
  "md-left": "mx-auto md:mx-0",
  "lg-left": "mx-auto lg:mx-0",
};

type HeadingProps = {
  id?: string;
  children: ReactNode;
  align?: SectionAlign;
  className?: string;
};

// Centred titles get the Title width; left-aligned ones already sit in a
// column, so they only balance their lines (a three-line squeeze otherwise).
export const SectionHeading = ({ id, children, align = "centre", className = "" }: HeadingProps) => (
  <h2 id={id} className={`t-h2 ${align === "centre" ? "measure-title" : "text-balance"} ${MARGIN[align]} ${className}`.trim()}>
    {children}
  </h2>
);

type IntroProps = {
  children: ReactNode;
  /** Text style: lead (default), body or small. */
  size?: "lead" | "body" | "small";
  align?: SectionAlign;
  className?: string;
  style?: CSSProperties;
};

export const SectionIntro = ({ children, size = "lead", align = "centre", className = "text-ink-soft", style }: IntroProps) => (
  <p className={`t-${size} heading-to-text measure-lead text-pretty ${MARGIN[align]} ${className}`.trim()} style={style}>
    {children}
  </p>
);

export default SectionHeading;
