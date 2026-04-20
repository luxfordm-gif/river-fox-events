import { useEffect, useRef, useState } from "react";

type IconProps = { size?: number; strokeWidth?: number };

// Custom inline icons — refined, hand-crafted line work for a more premium,
// editorial feel than off-the-shelf lucide glyphs.
const BalloonIcon = ({ size = 26, strokeWidth = 1.4 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3c3.6 0 6.2 2.6 6.2 6.2 0 3.7-2.8 6.6-6.2 6.6S5.8 12.9 5.8 9.2C5.8 5.6 8.4 3 12 3Z" />
    <path d="M11 15.6 12 18l1-2.4" />
    <path d="M12 18c-.4.6-.6 1.2-.2 1.8.4.5.4 1 0 1.6" />
    <path d="M9.6 6.2c-.9.7-1.5 1.7-1.7 2.9" />
  </svg>
);

const SparkleStarIcon = ({ size = 26, strokeWidth = 1.4 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3 13.6 9 19.5 10.4 14.6 14 16 20 12 16.6 8 20 9.4 14 4.5 10.4 10.4 9Z" />
  </svg>
);

const ArchwayIcon = ({ size = 26, strokeWidth = 1.4 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 21V10a8 8 0 0 1 16 0v11" />
    <path d="M4 21h16" />
    <path d="M8 21v-7a4 4 0 0 1 8 0v7" />
  </svg>
);

const CakeStandIcon = ({ size = 26, strokeWidth = 1.4 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3v2" />
    <circle cx="12" cy="3" r="0.6" fill="currentColor" stroke="none" />
    <path d="M7 9h10v3a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9Z" />
    <path d="M10 17h4" />
    <path d="M12 14v3" />
    <path d="M6 20h12" />
    <path d="M8 17l-2 3" />
    <path d="M16 17l2 3" />
  </svg>
);

const HandHeartIcon = ({ size = 26, strokeWidth = 1.4 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11.5 9.5c-.7-1.4-2.6-1.6-3.6-.4-.9 1-.7 2.5.3 3.4l3.3 3 3.3-3c1-.9 1.2-2.4.3-3.4-1-1.2-2.9-1-3.6.4Z" />
    <path d="M3 14v4a3 3 0 0 0 3 3h9l5-3-1.4-1.4a2 2 0 0 0-2.7-.1L13 18" />
    <path d="M3 14h2l3 3" />
  </svg>
);

const ITEMS = [
  {
    Icon: BalloonIcon,
    label: "Theme & palette",
    body: "Bespoke design concept built around your vision.",
  },
  {
    Icon: SparkleStarIcon,
    label: "Balloon installations",
    body: "Statement sculptural arrangements, hand-built on site.",
  },
  {
    Icon: ArchwayIcon,
    label: "Backdrops & signage",
    body: "Personalised pieces designed for your celebration.",
  },
  {
    Icon: CakeStandIcon,
    label: "Cake & party tables",
    body: "Fully styled and dressed, down to the last detail.",
  },
  {
    Icon: HandHeartIcon,
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
          className="mt-14 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-6"
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
