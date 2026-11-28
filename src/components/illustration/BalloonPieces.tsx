import { BalloonPaints, BalloonTile } from "./balloonArt";
import { BALLOON_PIECES, type PieceId } from "./pieceList";

/**
 * Balloon piece drawings for any page (Matt, 2026-11-28). With no `pieces`
 * it shows all twelve; otherwise the ones named, in that order:
 *
 *   <BalloonPieces />                                    all twelve
 *   <BalloonPieces pieces={["arch", "balloon-wall"]} />  two, side by side
 *   <BalloonPieces pieces={["full-hoop"]} />             one on its own
 *
 * Grids end on a full row (two across on phones, three from tablets up), so
 * a set is 1, 2, 4, 6 or 12 pieces: 2 and 4 stay two across at every width.
 * src/test/balloon-pieces.test.ts checks every use. The look, the motion and
 * how to draw a new piece: docs/illustration.md.
 */
export const PIECE_COUNTS = [1, 2, 4, 6, 12];

const BalloonPieces = ({
  pieces,
  className = "article-pad article-block mx-auto",
}: {
  pieces?: PieceId[];
  /** the block's own classes; the default fits a journal article */
  className?: string;
}) => {
  const list = pieces ? pieces.map((id) => BALLOON_PIECES.find((p) => p.id === id)!) : BALLOON_PIECES;
  const layout = list.length === 1 ? " bp-grid-one" : list.length <= 4 ? " bp-grid-two" : "";
  return (
    <div className={`bp-guide ${className}`} data-track-location="balloon-piece-guide">
      <BalloonPaints />
      <div className={`bp-grid${layout}`}>
        {list.map((d) => (
          <BalloonTile key={d.id} {...d} />
        ))}
      </div>
    </div>
  );
};

export default BalloonPieces;
