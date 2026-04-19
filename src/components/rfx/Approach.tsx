import studioImg from "@/assets/studio.jpg";

/** Editorial split — image left, copy right (Giardino style). */
const Approach = () => {
  return (
    <section id="work" className="rfx-section warm" aria-labelledby="approach-heading">
      <div className="container-rfx">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 md:gap-20 items-center rfx-md-stack">
          <div className="relative fade-up">
            <div
              className="ph ph-warm overflow-hidden"
              style={{ aspectRatio: "4/5" }}
            >
              <img
                src={studioImg}
                alt="River Fox Events studio — moodboard, fabric swatches and sketches in warm earth tones"
                className="absolute inset-0 w-full h-full object-cover z-[2]"
                loading="lazy"
                width={1024}
                height={1280}
              />
              <span className="ph-num">pl. 04</span>
              <span className="ph-label">studio · cobham</span>
            </div>
          </div>

          <div className="fade-up">
            <div className="eyebrow mb-7">— Our approach</div>
            <h2
              id="approach-heading"
              className="font-serif-rf"
              style={{
                fontSize: "clamp(40px, 5.4vw, 84px)",
                lineHeight: 1.02,
                fontWeight: 300,
                letterSpacing: "-0.025em",
              }}
            >
              Every celebration is designed.{" "}
              <em className="italic font-light text-accent-warm">
                Not assembled.
              </em>
            </h2>

            <div className="mt-8 space-y-5 text-[16px] leading-[1.7] text-ink-soft max-w-[520px]">
              <p>
                There are no packages here. No options off a shelf. Every River
                Fox Events celebration is built from scratch — around your child,
                your space, your vision.
              </p>
              <p>
                Laura personally designs and delivers every event. It's why we
                keep our client list deliberately small. And it's why the
                results look the way they do.
              </p>
            </div>

            <a href="#about" className="btn-link-rf mt-10">
              Meet Laura <span className="arr">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;
