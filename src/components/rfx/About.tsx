import { useEffect, useRef, useState } from "react";
import studioImg from "@/assets/laura-portrait.webp";
import { useImageParallax } from "@/hooks/useImageParallax";

interface Stat {
  value: number;
  display: (n: number) => string;
  label: string;
}

const STATS: Stat[] = [
  { value: 400, display: (n) => `${n}+`, label: "Events styled" },
  { value: 8, display: (n) => `${n}`, label: "Years in Surrey" },
  { value: 100, display: (n) => `${n}%`, label: "Tailored designs" },
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
      className="flex min-w-0 flex-col items-center justify-start self-baseline"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: `opacity .8s ease ${delay}ms, transform .8s ease ${delay}ms`,
      }}
    >
      <div
        className="t-h2 tabular-nums text-center"
        style={{
          minHeight: "1em",
          paddingBottom: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {stat.display(n)}
      </div>
      <div className="t-eyebrow mt-3 text-center text-ink-soft">
        {stat.label}
      </div>
    </div>
  );
};

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
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-12 md:gap-20 rfx-md-stack">
          <div className="md:sticky md:top-24 md:self-start fade-up rfx-md-static">
            <div
              ref={studioWrap}
              className="ph ph-warm overflow-hidden rounded-media relative rfx-about-img"
              style={{ aspectRatio: "5/6", maxHeight: "472px" }}
            >
              {/*
                SEO REMINDER: Alt text must describe the image accurately and
                include "River Fox Events" + Surrey/service keywords where
                relevant. Never leave empty or generic alt text.
              */}
              <img
                ref={studioImgRef}
                src={studioImg}
                alt="Laura, the founder and stylist, photographed amongst Surrey bluebells in a branded tee"
                className="absolute inset-0 w-full h-full object-cover z-[2] will-change-transform"
                style={{
                  transform: "translate3d(0,0,0) scale(1.14)",
                  objectPosition: "center 28%",
                }}
                loading="lazy"
                decoding="async"
                width={1200}
                height={1499}
              />
            </div>
          </div>

          <div className="fade-up">
            <div className="t-eyebrow text-ink-soft mb-6">
              Meet Laura, Founder
            </div>

            <h2 id="about-heading" className="t-h2">
              Personally designed.{" "}
              <em className="t-accent">
                Personally delivered.
              </em>
            </h2>

            <div className="t-body mt-8 space-y-5 text-ink-soft max-w-[560px]">
              <p className="text-ink">
                <strong>
                  I started River Fox Events after owning a teepee sleepover
                  business and realising how much I loved creating the little
                  moments that stay with you long after the day is over.
                </strong>
              </p>
              <p>
                For me, it's never just been about balloons or decorations.
                It's the feeling when your child walks into a space created
                just for them, and the tiny details they (and you) remember
                years later.
              </p>
              <p>
                What began as a creative outlet grew into the business it is
                today. I now style children's parties, balloon installations
                and celebrations for families across Surrey and London.
              </p>
              <p>
                I keep the business intentionally small so I can stay
                hands-on with every event, from the first ideas through to
                installation day.
              </p>
            </div>

            <a
              href="/journal/"
              className="btn-link-rf t-ui mt-8"
              aria-label="Read the River Fox Events journal - notes, behind the scenes and trends from the studio"
            >
              Inside the studio · read the journal{" "}
              <span className="arr">→</span>
            </a>

            <div
              ref={statsRef}
              className="mt-12 grid grid-cols-3 gap-3 sm:gap-6 items-baseline border-t border-ink/20 pt-8 max-w-[560px]"
              style={{ alignItems: "baseline" }}
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
