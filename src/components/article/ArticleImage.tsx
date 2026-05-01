/** Display aspect for an article image.
 *  - "video"   16:9 landscape (default)
 *  - "4/3"     4:3 landscape — softer crop, good for room photos
 *  - "3/4"     3:4 portrait — for vertical photography
 *  - "square"  1:1
 *  - "natural" use the file's intrinsic aspect — no cropping. Ideal for
 *              sketches / renders / any image whose composition can't be
 *              cropped without losing meaning. */
type Aspect = "video" | "4/3" | "3/4" | "square" | "natural";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  /** Optional cap on image width. Defaults to 1120px (wider than the
   *  720px prose column, narrower than the page edge). Pass `"full"` for
   *  edge-to-edge on every screen. */
  width?: number | "full";
  /** Display aspect ratio. Defaults to 16:9 ("video"). */
  aspect?: Aspect;
};

const ASPECT_CLASS: Record<Exclude<Aspect, "natural">, string> = {
  video: "aspect-video",
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  square: "aspect-square",
};

/**
 * Wide image break-out for articles. Centres a single image at up to
 * ~1120px on desktop, with optional italic caption. Drops to 100% width
 * on mobile so the image doesn't get squished.
 */
const ArticleImage = ({
  src,
  alt,
  caption,
  width = 1120,
  aspect = "video",
}: Props) => {
  const cap = width === "full" ? "100%" : `${width}px`;
  return (
    <figure
      className="mx-auto px-6 md:px-12 my-12 md:my-16"
      style={{ maxWidth: cap }}
    >
      {aspect === "natural" ? (
        <div className="overflow-hidden rounded-[12px]">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto block"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : (
        <div
          className={`${ASPECT_CLASS[aspect]} overflow-hidden rounded-[12px]`}
        >
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      {caption && (
        <figcaption className="mt-4 text-center text-[13px] italic text-ink-soft max-w-[640px] mx-auto">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ArticleImage;
