import { useEffect, useRef, useState } from "react";

interface Props {
  /** Lines, each rendered as a slide-up word block. Use <em> tags inline if needed. */
  lines: string[];
}

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

  return (
    <section className="reveal-word" ref={ref} aria-hidden="true">
      <h3>
        {lines.map((ln, i) => (
          <span
            key={i}
            className={`word-reveal delay-${i} ${visible ? "in" : ""}`}
            dangerouslySetInnerHTML={{ __html: `<span>${ln}</span>` }}
          />
        )).reduce<React.ReactNode[]>((acc, el, i) => (i === 0 ? [el] : [...acc, " ", el]), [])}
      </h3>
    </section>
  );
};

export default RevealWord;
