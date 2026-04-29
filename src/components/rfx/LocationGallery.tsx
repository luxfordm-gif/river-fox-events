import { ReactNode } from "react";

export type GalleryImage = { src: string; alt: string };

type LocationGalleryProps = {
  eyebrow?: string;
  heading?: ReactNode;
  intro?: ReactNode;
  /** Large image — stays sticky in the left column on desktop. */
  mainImage: string;
  mainImageAlt: string;
  /** Scrolling images on the right. Max 4 recommended. */
  images: GalleryImage[];
  id?: string;
};

const LocationGallery = ({
  eyebrow,
  heading,
  intro,
  mainImage,
  mainImageAlt,
  images,
  id = "loc-gallery",
}: LocationGalleryProps) => {
  return (
    <section
      id={id}
      className="rfx-section white pt-14 md:pt-24 !pb-0"
      aria-labelledby={`${id}-heading`}
    >
      {(heading || eyebrow || intro) && (
        <div className="container-rfx mb-14 md:mb-20">
          <div className="text-center max-w-[760px] mx-auto fade-up">
            {eyebrow && (
              <div
                className="font-mono-rf text-[10.5px] tracking-[0.28em] uppercase text-ink-soft mb-4"
                style={{ fontWeight: 600 }}
              >
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2
                id={`${id}-heading`}
                className="font-serif-rf"
                style={{
                  fontSize: "clamp(36px, 3.8vw, 60px)",
                  lineHeight: 1.0,
                  fontWeight: 400,
                  letterSpacing: "-0.025em",
                  textWrap: "balance",
                }}
              >
                {heading}
              </h2>
            )}
            {intro && (
              <p
                className="text-[16px] leading-[1.7] text-ink-soft mt-6 max-w-[560px] mx-auto"
                style={{ textWrap: "pretty" }}
              >
                {intro}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Full-bleed split: sticky left image (desktop), scrolling right images on peach bg.
          On mobile the layout collapses to a single peach panel containing all images. */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Desktop only — sticky full-viewport-height image, edge-to-edge */}
        <div className="hidden md:block md:sticky md:top-0 md:self-start md:h-screen w-full">
          <img
            src={mainImage}
            alt={mainImageAlt}
            className="w-full h-full object-cover block"
            style={{ minHeight: "100%" }}
            loading="lazy"
            decoding="async"
            width={1280}
            height={1920}
          />
        </div>

        {/* Right (desktop) / single column (mobile) — peach panel with stacked images */}
        <div
          className="flex flex-col gap-6 md:gap-10 px-6 md:px-12 py-10 md:py-16"
          style={{ background: "hsl(var(--surface-warm))" }}
        >
          {/* Mobile only — main image rendered first inside the peach panel */}
          <div className="md:hidden overflow-hidden">
            <img
              src={mainImage}
              alt={mainImageAlt}
              className="w-full h-auto object-cover block"
              loading="lazy"
              decoding="async"
              width={1280}
              height={1280}
            />
          </div>
          {images.map((img, i) => (
            <div key={img.src + i} className="overflow-hidden">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-auto object-cover block"
                loading="lazy"
                decoding="async"
                width={1280}
                height={1280}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationGallery;
