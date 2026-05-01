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
  <aside className="max-w-[720px] mx-auto my-12 md:my-16 px-6">
    <div
      className="rounded-[14px] px-6 md:px-8 py-6 md:py-7 border"
      style={{
        background: "hsl(var(--surface-warm))",
        borderColor: "hsl(var(--ink) / 0.10)",
      }}
    >
      <div
        className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase mb-3"
        style={{ color: "hsl(var(--accent-warm))", fontWeight: 600 }}
      >
        In short
      </div>
      <div className="text-[15.5px] leading-[1.65] text-ink space-y-2">
        {children}
      </div>
    </div>
  </aside>
);

export default ArticleTLDR;
