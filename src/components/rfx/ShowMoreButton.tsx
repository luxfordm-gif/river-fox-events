/**
 * The one "Show more" button: the ghost button under a list or grid that
 * reveals more of it (the Journal, the Balloons page's "Recent work").
 * `className` only controls when the row shows (e.g. "flex md:hidden"), so a
 * page can show it on phones only; spacing and look come from the design
 * system. The footer's town list is a text toggle, a different control.
 */
type Props = { onClick: () => void; className?: string; /** A smaller, quieter version (the tile cards). */ compact?: boolean };

const ShowMoreButton = ({ onClick, className = "flex", compact = false }: Props) => (
  <div className={`${compact ? "text-to-action" : "text-to-content"} justify-center ${className}`}>
    <button type="button" onClick={onClick} className={compact ? "btn-ghost-rf btn-compact btn-hair" : "btn-ghost-rf"}>
      Show more
    </button>
  </div>
);

export default ShowMoreButton;
