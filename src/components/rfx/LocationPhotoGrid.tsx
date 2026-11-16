import { ReactNode } from "react";
import { SectionHeading, SectionIntro } from "@/components/rfx/SectionHeading";
import type { GalleryImage } from "@/components/rfx/LocationGallery";

type LocationPhotoGridProps = {
  eyebrow?: string;
  heading?: ReactNode;
  intro?: ReactNode;
  /** Photos in order. Every one gets the same frame, so the rows line up. */
  images: GalleryImage[];
  id?: string;
};

/**
 * A short, even grid of recent work for town pages: same-height frames,
 * two across on phones and four across from tablet up, so the section
 * is one screen tall and the visitor carries straight on down the page.
 * (The long sticky-photo gallery is still used on the Balloons page.)
 */
const LocationPhotoGrid = ({
  eyebrow,
  heading,
  intro,
  images,
  id = "loc-gallery",
}: LocationPhotoGridProps) => (
  <section id={id} className="rfx-section white" aria-labelledby={`${id}-heading`}>
    <div className="container-rfx">
      {(heading || eyebrow || intro) && (
        <div className="text-center fade-up heading-to-content">
          {eyebrow && (
            <div className="t-overline text-ink-soft eyebrow-above">{eyebrow}</div>
          )}
          {heading && <SectionHeading id={`${id}-heading`}>{heading}</SectionHeading>}
          {intro && <SectionIntro>{intro}</SectionIntro>}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 photos-gap">
        {images.map((img, i) => (
          <div key={img.src + i} className="overflow-hidden rounded-large">
            <img
              src={img.src}
              alt={img.alt}
              className="w-full aspect-[4/5] object-cover block"
              loading="lazy"
              decoding="async"
              width={800}
              height={1000}
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default LocationPhotoGrid;
