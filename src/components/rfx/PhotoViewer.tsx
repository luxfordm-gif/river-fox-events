import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { ResolvedPhoto } from "@/data/gallery";

/* The photo tile and full-screen viewer used by /our-work/ and the town
   pages' photo grid. Moved out of OurWork.tsx so both share one look. */

export type ViewerItem = ResolvedPhoto & { title: string; place?: string };

/* A photo tile: pinches in on hover with a "View larger" label; opens the viewer. */
export const Tile = ({
  photo, sizes, onOpen, crop, eager,
}: { photo: ResolvedPhoto; sizes: string; onOpen: () => void; crop?: string; eager?: boolean }) => (
  <button type="button" className="work-tile" onClick={onOpen} aria-label={`View larger: ${photo.alt}`}>
    <img
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={sizes}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`block w-full ${crop ? "h-full object-cover" : "h-auto"}`}
      style={crop ? { aspectRatio: crop, objectPosition: photo.position } : undefined}
    />
    <span className="work-tile__over" aria-hidden="true">
      <span className="work-tile__label">
        <Expand size={18} strokeWidth={1.6} />
      </span>
    </span>
    <span className="work-tile__badge" aria-hidden="true">
      <Expand size={13} strokeWidth={1.9} />
    </span>
  </button>
);

/* Full-screen viewer: arrows, keyboard (←/→/Esc), swipe on touch, tap outside to close. */
export const Viewer = ({
  items, index, onIndex, onClose,
}: { items: ViewerItem[]; index: number; onIndex: (i: number) => void; onClose: () => void }) => {
  const item = items[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const startX = useRef<number | null>(null);
  const go = useCallback(
    (d: number) => onIndex((index + d + items.length) % items.length),
    [index, items.length, onIndex]
  );

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Preload the neighbours so stepping through feels instant.
  useEffect(() => {
    [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]].forEach((it) => {
      const img = new Image();
      img.src = it.large;
    });
  }, [index, items]);

  return (
    <div
      className="work-viewer"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title}, photo ${index + 1} of ${items.length}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onPointerDown={(e) => { startX.current = e.clientX; }}
      onPointerUp={(e) => {
        if (startX.current == null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <button ref={closeRef} type="button" className="work-viewer__btn work-viewer__close" onClick={onClose} aria-label="Close">
        <X size={20} strokeWidth={1.5} />
      </button>
      {items.length > 1 && (
        <>
          <button type="button" className="work-viewer__btn work-viewer__prev" onClick={() => go(-1)} aria-label="Previous photo">
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button type="button" className="work-viewer__btn work-viewer__next" onClick={() => go(1)} aria-label="Next photo">
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </>
      )}
      {/* Fixed-size stage: the photo centres inside it, so the caption and
          counter below stay put whatever the photo's shape. */}
      <div className="work-viewer__stage" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <img
          key={item.source}
          src={item.large}
          alt={item.alt}
          width={item.width}
          height={item.height}
          className="work-viewer__img"
          draggable={false}
        />
      </div>
      <div className="work-viewer__cap">
        <div className="t-small">{item.title}</div>
        <div className="meta-below t-overline opacity-70">
          {item.place ? `${item.place} · ` : ""}{index + 1} / {items.length}
        </div>
      </div>
    </div>
  );
};
