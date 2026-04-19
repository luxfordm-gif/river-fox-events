import heroImg from "@/assets/cp-celebrations.jpg";

const CPHero = () => {
  return (
    <section
      id="top"
      className="pt-[96px] md:pt-[124px] pb-12 md:pb-16"
      aria-labelledby="cp-hero-heading"
    >
      <div className="container-rfx">
        <div className="mb-10 md:mb-14 flex flex-col items-center text-center">
          <div className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-6 fade-up in">
            Children's Party Styling · Surrey
          </div>

          <h1
            id="cp-hero-heading"
            className="font-serif-rf max-w-[16ch] md:max-w-none mx-auto break-words text-pretty"
            style={{
              fontSize: "clamp(56px, 9.2vw, 124px)",
              lineHeight: 1.02,
              fontWeight: 400,
              letterSpacing: "-0.038em",
            }}
          >
            <span className="word-reveal in">
              <span>Magical for children.</span>
            </span>
            <br />
            <span className="word-reveal in delay-1">
              <span>
                Effortless for{" "}
                <em className="italic font-normal text-accent-warm">parents.</em>
              </span>
            </span>
          </h1>

          <p className="text-[16.5px] leading-[1.65] text-ink-soft max-w-[560px] mt-6 md:mt-10 fade-up in text-center">
            Immersive, beautifully designed children's parties across Surrey —
            every detail considered, nothing left to chance.
          </p>

          <div className="flex items-center justify-center gap-5 flex-wrap mt-10 fade-up in">
            <a href="#enquire" className="btn-solid-rf accent">
              Start planning <span>→</span>
            </a>
            <a href="#how-it-works" className="btn-link-rf">
              See how it works <span className="arr">↓</span>
            </a>
          </div>
        </div>

        <div className="-mx-5 md:mx-0">
          <div
            className="ph ph-warm overflow-hidden rounded-sm relative"
            style={{ aspectRatio: "16/9" }}
          >
            <img
              src={heroImg}
              alt="Beautifully styled children's birthday celebration with pastel balloon arch, peonies and a dressed cake table in Surrey"
              className="absolute inset-0 w-full h-full object-cover z-[2]"
              width={1920}
              height={1080}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CPHero;
