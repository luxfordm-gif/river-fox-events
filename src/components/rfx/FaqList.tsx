import { useId, useState, type ReactNode } from "react";

export type FaqListItem = { q: string; a: string; aNode?: ReactNode };

type FaqListProps = {
  items: FaqListItem[];
  /** Index of the question open on first load, or null for all closed. */
  defaultOpen?: number | null;
};

/**
 * Numbered FAQ list, one answer open at a time.
 *
 * Answers open and close with a CSS grid-row transition (0fr to 1fr), so the
 * row grows to its natural height without anyone measuring it first, and it
 * animates the same way in both directions. (The Radix accordion this
 * replaces measured the answer's height at the moment of the click; when
 * that went wrong the answer snapped open and vanished on close, which read
 * as a jolt.) Timing lives in index.css under .faq-rf-*.
 */
const FaqList = ({ items, defaultOpen = null }: FaqListProps) => {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const uid = useId();

  return (
    <div className="w-full">
      {items.map((it, i) => {
        const isOpen = open === i;
        const state = isOpen ? "open" : "closed";
        const qId = `${uid}-q${i}`;
        const aId = `${uid}-a${i}`;
        return (
          <div
            key={i}
            data-state={state}
            className="faq-rf-item border-t border-ink/20 last:border-b last:border-ink/20"
          >
            <h3 className="flex">
              <button
                type="button"
                id={qId}
                aria-expanded={isOpen}
                aria-controls={aId}
                data-state={state}
                onClick={() => setOpen(isOpen ? null : i)}
                className="faq-rf-trigger flex flex-1 items-center py-7 max-md:py-5 data-[state=open]:pb-[10px]"
              >
                <span className="grid grid-cols-[42px_1fr_40px] items-baseline inline-gap w-full text-left max-md:grid-cols-[22px_1fr_32px] max-md:gap-3.5">
                  <span className="t-overline text-ink-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="t-h5 text-ink">
                    {it.q}
                  </span>
                  <span className="faq-rf-plus inline-flex items-center justify-center t-icon text-ink" aria-hidden="true">
                    +
                  </span>
                </span>
              </button>
            </h3>
            <div
              id={aId}
              role="region"
              aria-labelledby={qId}
              aria-hidden={!isOpen}
              data-state={state}
              className="faq-rf-panel"
            >
              <div className="faq-rf-panel__inner">
                <div className="grid grid-cols-[42px_1fr_40px] inline-gap max-md:grid-cols-[22px_1fr_32px] max-md:gap-3.5">
                  <p className="col-start-2 t-body text-ink-soft max-w-[680px] pt-2 pb-6">
                    {it.aNode ?? it.a}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqList;
