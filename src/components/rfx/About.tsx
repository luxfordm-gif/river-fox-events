import { useEffect, useRef, useState } from "react";
import studioImg from "@/assets/studio.jpg";
import { useImageParallax } from "@/hooks/useImageParallax";

interface Stat {
  value: number;
  display: (n: number) => string;
  label: string;
}

const STATS: Stat[] = [
  { value: 400, display: (n) => `${n}+`, label: "Events styled" },
  { value: 8, display: (n) => `${n}`, label: "Years in Surrey" },
  { value: 100, display: (n) => `${n}%`, label: "Bespoke designs" },
];

/** Animates a number from 0 to `value` over `duration` ms once visible. */
const useCountUp = (value: number, visible: boolean, duration = 1600) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, value, duration]);
  return n;
};

const StatItem = ({ stat, visible, delay }: { stat: Stat; visible: boolean; delay: number }) => {
  const n = useCountUp(stat.value, visible);
  return (
    <div
      className="flex-col flex items-center justify-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity .8s ease ${delay}ms, transform .8s ease ${delay}ms`,
      }}
    >
      <div
        className="font-serif-rf tabular-nums text-center"
        style={{
          fontSize: "clamp(44px, 5.5vw, 68px)",
          lineHeight: 1,
          fontWeight: 300,
          letterSpacing: "-0.022em",
        }}
      >
        {stat.display(n)}
      </div>
      <div className="font-mono-rf text-[10px] tracking-[0.22em] uppercase text-ink-soft mt-3 text-center">
        {stat.label}
      </div>
    </div>
  );
};

const About = () => {
const About = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const studioWrap = useRef<HTMLDivElement>(null);
  const studioImgRef = useRef<HTMLImageElement>(null);
  useImageParallax(studioWrap, studioImgRef, { intensity: 8, scale: 1.14 });
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStatsVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="about" className="rfx-section warm" aria-labelledby="about-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-12 md:gap-20 items-start rfx-md-stack">
          <div className="md:sticky md:top-24 fade-up rfx-md-static">
            <div
              className="ph ph-warm overflow-hidden rounded-sm"
              style={{ aspectRatio: "5/6" }}
            >
              <img
                src={studioImg}
                alt="Laura's studio in Surrey — moodboards, fabric and sketches"
                className="absolute inset-0 w-full h-full object-cover z-[2]"
                loading="lazy"
                width={1024}
                height={1280}
              />
            </div>
          </div>

          <div className="fade-up">
            <div className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-6">
              Meet Laura · Founder
            </div>

            <h2
              id="about-heading"
              className="font-serif-rf"
              style={{
                fontSize: "clamp(48px, 5.6vw, 84px)",
                lineHeight: 1.02,
                fontWeight: 300,
                letterSpacing: "-0.028em",
              }}
            >
              Personally designed.{" "}
              <em className="italic font-light text-accent-warm">
                Personally delivered.
              </em>
            </h2>

            <div className="mt-8 space-y-5 text-[16px] leading-[1.7] text-ink-soft max-w-[560px]">
              <p>
                I started River Fox Events from a single conviction — that a
                beautifully designed celebration changes how people feel. And
                those feelings become the memories they keep.
              </p>
              <p>
                There are no packages here. No options off a shelf. Every
                celebration is built from scratch — around your child, your
                space, your vision — and I personally design and deliver each
                one. It's why we keep our client list deliberately small. And
                it's why the results look the way they do.
              </p>
              <p>
                Based in Surrey. Working across the county and into London for
                clients who understand the difference that detail makes.
              </p>
            </div>

            <div
              ref={statsRef}
              className="mt-12 grid grid-cols-3 gap-6 border-t border-ink/20 pt-8 max-w-[560px]"
            >
              {STATS.map((s, i) => (
                <StatItem key={s.label} stat={s} visible={statsVisible} delay={i * 140} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
