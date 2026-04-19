import { useEffect, useRef, useState } from "react";

interface Props {
  /** Lines, each rendered as a slide-up word block. Use <em> for inline italic accent words. */
  lines: string[];
}

/** Splits a line (possibly containing <em>...</em>) into word tokens, preserving emphasis. */
const tokenize = (line: string): { text: string; em: boolean }[] => {
  const out: { text: string; em: boolean }[] = [];
  const re = /<em>(.*?)<\/em>|([^\s<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    if (m[1] !== undefined) {
      m[1].split(/\s+/).filter(Boolean).forEach((w) => out.push({ text: w, em: true }));
    } else if (m[2]) {
      out.push({ text: m[2], em: false });
    }
  }
  return out;
};

const RevealWord = ({ lines }: Props) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Flatten into a single word index across lines for staggered animation
  let idx = -1;
  return (
    <section className="reveal-word" ref={ref} aria-hidden="true">
      <h3>
        {lines.map((ln, li) => {
          const tokens = tokenize(ln);
          return (
            <span key={li} className="block">
              {tokens.map((t, ti) => {
                idx += 1;
                return (
                  <span
                    key={`${li}-${ti}`}
                    className="word-reveal-mask"
                    style={{ transitionDelay: `${idx * 90}ms` }}
                  >
                    <span
                      className={`word-reveal-inner ${visible ? "in" : ""} ${t.em ? "em" : ""}`}
                      style={{ transitionDelay: `${idx * 90}ms` }}
                    >
                      {t.text}
                    </span>
                    {ti < tokens.length - 1 && <span className="word-gap">&nbsp;</span>}
                  </span>
                );
              })}
            </span>
          );
        })}
      </h3>
    </section>
  );
};

export default RevealWord;
