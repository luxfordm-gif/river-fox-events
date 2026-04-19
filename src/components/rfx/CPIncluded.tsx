import { useEffect, useRef, useState } from "react";
import {
  Palette,
  Sparkles,
  Image as ImageIcon,
  Cake,
  Wrench,
} from "lucide-react";

const ITEMS = [
  {
    Icon: Palette,
    label: "Theme & palette",
    body: "Bespoke design concept built around your vision.",
  },
  {
    Icon: Sparkles,
    label: "Balloon installations",
    body: "Statement sculptural arrangements, hand-built on site.",
  },
  {
    Icon: ImageIcon,
    label: "Backdrops & signage",
    body: "Personalised pieces designed for your celebration.",
  },
  {
    Icon: Cake,
    label: "Cake & party tables",
    body: "Fully styled and dressed, down to the last detail.",
  },
  {
    Icon: Wrench,
    label: "Setup & breakdown",
    body: "Fully managed, start to finish — nothing for you to lift.",
  },
];

const CPIncluded = () => {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="cp-included"
      className="rfx-section white"
      aria-labelledby="cp-included-heading"
    >
      <div className="container-rfx">
        <div className="text-center max-w-[760px] mx-auto">
          <div
            className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-3"
            style={{ fontWeight: 600 }}
          >
            What's included
          </div>
          <h2
            id="cp-included-heading"
            className="font-serif-rf"
            style={{
              fontSize: "clamp(38px, 4.6vw, 64px)",
              lineHeight: 1.0,
              fontWeight: 400,
              letterSpacing: "-0.025em",
              textWrap: "balance",
            }}
          >
            Everything handled.{" "}
            <em className="italic font-light text-accent-warm">
              Nothing left to chance.
            </em>
          </h2>
          <p
            className="text-[16px] leading-[1.7] text-ink-soft mt-6 max-w-[520px] mx-auto"
            style={{ textWrap: "pretty" }}
          >
            Every River Fox party is fully managed, so you can be entirely
            present on the day.
          </p>
        </div>

        <div
          ref={ref}
          className="mt-14 md:mt-20 grid grid-cols-2 lg:grid-cols-5 gap-y-10 gap-x-6 md:gap-6"
        >
          {ITEMS.map(({ Icon, label, body }, i) => (
            <div
              key={label}
              className="flex flex-col items-center text-center px-4"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity .9s cubic-bezier(.22,.7,.2,1) ${
                  i * 120
                }ms, transform .9s cubic-bezier(.22,.7,.2,1) ${i * 120}ms`,
              }}
            >
              <div
                className="flex items-center justify-center mb-5"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "hsl(var(--surface-warm))",
                  color: "hsl(var(--accent-warm))",
                }}
              >
                <Icon strokeWidth={1.4} size={26} />
              </div>
              <h3
                className="font-serif-rf text-ink"
                style={{
                  fontSize: "20px",
                  lineHeight: 1.15,
                  fontWeight: 400,
                  letterSpacing: "-0.012em",
                }}
              >
                {label}
              </h3>
              <p
                className="text-[14px] leading-[1.6] text-ink-soft mt-2.5 max-w-[220px]"
                style={{ textWrap: "pretty" }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>

        <p
          className="italic text-ink text-center mt-14 max-w-[560px] mx-auto"
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 300,
            fontSize: "18px",
            lineHeight: 1.5,
            textWrap: "pretty",
          }}
        >
          All handled seamlessly, so you can enjoy every moment.
        </p>
      </div>
    </section>
  );
};

export default CPIncluded;
