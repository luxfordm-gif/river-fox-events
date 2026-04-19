import studioImg from "@/assets/studio.jpg";

const STATS = [
  { n: "400+", l: "Events" },
  { n: "8", l: "Years" },
  { n: "Surrey", l: "& Beyond" },
];

const About = () => {
  return (
    <section id="about" className="rfx-section" aria-labelledby="about-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] gap-12 md:gap-20 items-start rfx-md-stack">
          <div className="md:sticky md:top-24 fade-up rfx-md-static">
            <div
              className="ph ph-warm overflow-hidden"
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
              <span className="ph-num">pl. 13</span>
              <span className="ph-label">the old stables · cobham</span>
            </div>
          </div>

          <div className="fade-up">
            <div className="eyebrow mb-7">— The studio</div>
            <h2
              id="about-heading"
              className="font-serif-rf"
              style={{
                fontSize: "clamp(40px, 5.6vw, 84px)",
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
                Every event I take on receives my full personal attention, from
                the first conversation to the moment your guests walk in. I work
                with a deliberately small number of clients each month. Not as a
                sales tactic — because it's the only way to do this properly.
              </p>
              <p>
                Based in Surrey. Working across the county and into London for
                clients who understand the difference that detail makes.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-ink/20 pt-8 max-w-[560px]">
              {STATS.map((s) => (
                <div key={s.l}>
                  <div
                    className="font-serif-rf"
                    style={{
                      fontSize: "clamp(32px, 4vw, 52px)",
                      lineHeight: 1,
                      fontWeight: 300,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {s.n}
                  </div>
                  <div className="font-mono-rf text-[10px] tracking-[0.2em] uppercase text-ink-soft mt-2">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
