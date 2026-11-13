import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import studioImg from "@/assets/laura-portrait.webp";
import { useImageParallax } from "@/hooks/useImageParallax";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { SectionHeading } from "@/components/rfx/SectionHeading";

interface Stat {
  value: number;
  display: (n: number) => string;
  label: string;
}

const STATS: Stat[] = [
  { value: 400, display: (n) => `${n}+`, label: "Events styled" },
  { value: 8, display: (n) => `${n}`, label: "Years in Surrey" },
  { value: 100, display: (n) => `${n}%`, label: "Individually designed" },
];

/** Animates a number from 0 to `value` over `duration` ms once visible.
 *  Until the stats actually scroll into view the DOM holds the final value,
 *  so the prerendered HTML, no-JS visitors and crawlers or AI readers that run
 *  JavaScript without scrolling all read "400+", never "0+" (SEO Vendor GEO
 *  audit, 2026-11-09). The stat is at opacity 0 until visible, and the reset
 *  to 0 happens in a layout effect, before the browser paints, so the final
 *  number never flashes. */
const useCountUp = (value: number, visible: boolean, armed: boolean, duration = 1600) => {
  const [n, setN] = useState(value);
  useLayoutEffect(() => {
    if (!armed || !visible) return;
    setN(0);
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
  }, [armed, visible, value, duration]);
  return n;
};

const StatItem = ({ stat, visible, armed, delay }: { stat: Stat; visible: boolean; armed: boolean; delay: number }) => {
  const n = useCountUp(stat.value, visible, armed);
  const shown = visible || !armed;
  return (
    <div
      className="flex min-w-0 flex-col items-center justify-start self-baseline"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(12px)",
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
      <div className="t-overline photo-caption text-center text-ink-soft">
        {stat.label}
      </div>
    </div>
  );
};

const About = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  // False in the prerender and with reduced motion: the stats then simply
  // show their final numbers.
  const [statsArmed, setStatsArmed] = useState(false);
  const studioWrap = useRef<HTMLDivElement>(null);
  // The panel starts full width and draws in to its rounded inset as it
  // scrolls up the screen (Matt, 2026-11-08).
  const panelRef = useRef<HTMLElement>(null);
  const onPanelProgress = useCallback((p: number) => {
    panelRef.current?.style.setProperty("--shrink", p.toFixed(3));
  }, []);
  useScrollProgress(panelRef, onPanelProgress, { from: 1, to: 0.35 });
  const studioImgRef = useRef<HTMLImageElement>(null);
  useImageParallax(studioWrap, studioImgRef, { intensity: 8, scale: 1.14 });
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    // The prerender (navigator.webdriver) bakes the final numbers into the HTML.
    if (navigator.webdriver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setStatsArmed(true);
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
    <section ref={panelRef} id="about" className="rfx-section warm rfx-panel" aria-labelledby="about-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] columns-gap rfx-md-stack">
          <div className="md:sticky md:top-24 md:self-start fade-up rfx-md-static">
            <div
              ref={studioWrap}
              className="ph ph-warm overflow-hidden rounded-large relative rfx-about-img"
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
            <div className="t-overline text-ink-soft eyebrow-above">
              Meet Laura, Founder
            </div>

            <SectionHeading id="about-heading" align="left">
              Personally designed.{" "}
              <em className="t-accent">
                Personally delivered.
              </em>
            </SectionHeading>

            <div className="t-body heading-to-text paragraphs text-ink-soft measure-lead">
              <p className="text-ink">
                <strong>
                  I started River Fox Events after running a teepee sleepover
                  business and realising how much I loved creating moments
                  that stay with you.
                </strong>
              </p>
              <p>
                It's never just been about balloons. It's the feeling when
                your child walks into a space made just for them, and the tiny
                details they (and you) remember years later.
              </p>
              <p>
                Today I style parties, balloon installations and celebrations
                across Surrey and London, and keep the business small so I'm
                hands-on with every event.
              </p>
            </div>

            <a
              href="/journal/"
              className="btn-link-rf t-label text-to-action"
              aria-label="Read the River Fox Events journal - notes, behind the scenes and trends from the studio"
            >
              Inside the studio · read the journal{" "}
              <span className="arr">→</span>
            </a>

            <div
              ref={statsRef}
              className="divided grid grid-cols-3 inline-gap items-baseline border-t border-hair-strong measure-lead"
              style={{ alignItems: "baseline" }}
            >
              {STATS.map((s, i) => (
                <StatItem key={s.label} stat={s} visible={statsVisible} armed={statsArmed} delay={i * 140} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
