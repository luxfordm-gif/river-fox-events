import { ReactNode } from "react";

export type GalleryImage = { src: string; alt: string };

type LocationGalleryProps = {
  eyebrow?: string;
  heading?: ReactNode;
  intro?: ReactNode;
  /** Large image - stays sticky in the left column on desktop. */
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
      className="rfx-section white"
      aria-labelledby={`${id}-heading`}
    >
      {(heading || eyebrow || intro) && (
        <div className="container-rfx mb-14 md:mb-20">
          <div className="text-center max-w-[1000px] mx-auto fade-up">
            {eyebrow && (
              <div className="t-overline text-ink-soft mb-4">
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2
                id={`${id}-heading`}
                className="t-h2"
                style={{ textWrap: "balance" }}
              >
                {heading}
              </h2>
            )}
            {intro && (
              <p
                className="t-lead text-ink-soft heading-to-text max-w-[560px] mx-auto"
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
        {/* Desktop only - sticky full-viewport-height image, edge-to-edge */}
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

        {/* Right (desktop) / single column (mobile) - peach panel with stacked images.
            Phones: every photo in the same square frame, so a landscape shot
            doesn't come out shorter than the rest and break the stack, and
            the portrait ones aren't so deep (Matt,
            2026-11-09). Desktop keeps each photo's own shape. */}
        <div
          className="flex flex-col gap-6 md:gap-10 px-6 md:px-12 py-10 md:py-16"
          style={{ background: "hsl(var(--background-warm))" }}
        >
          {/* Mobile only - main image rendered first inside the peach panel */}
          <div className="md:hidden overflow-hidden">
            <img
              src={mainImage}
              alt={mainImageAlt}
              className="w-full aspect-square object-cover block"
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
                className="w-full aspect-square md:aspect-auto md:h-auto object-cover block"
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
