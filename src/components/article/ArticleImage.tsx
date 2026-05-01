type Props = {
  src: string;
  alt: string;
  caption?: string;
  /** Optional cap on image width. Defaults to 1120px (wider than the
   *  720px prose column, narrower than the page edge). Pass `"full"` for
   *  edge-to-edge on every screen. */
  width?: number | "full";
};

/**
 * Wide image break-out for articles. Centres a single image at up to
 * ~1120px on desktop, with optional italic caption. Drops to 100% width
 * on mobile so the image doesn't get squished.
 */
const ArticleImage = ({ src, alt, caption, width = 1120 }: Props) => {
  const cap = width === "full" ? "100%" : `${width}px`;
  return (
    <figure
      className="mx-auto px-6 md:px-12 my-12 md:my-16"
      style={{ maxWidth: cap }}
    >
      {/* 16:9 frame — `object-cover` crops portrait sources to landscape.
          Once we have native 16:9 photography this becomes a no-op. */}
      <div className="aspect-video overflow-hidden rounded-[12px]">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-[13px] italic text-ink-soft max-w-[640px] mx-auto">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ArticleImage;
