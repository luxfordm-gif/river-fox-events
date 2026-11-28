# Illustrations

The only place the illustration rules are written down. The colours and sizes themselves live in the code (below); this file says what they are for and how to use and add drawings. First used for the balloon piece guide on the arch, garland or wall article (28 November 2026).

## Where everything is

| What | Where |
| --- | --- |
| Matt's reference images, made in Claude chat | Drive › River Fox Events › Brand › Illustrations (`00 - Reference grid.png`, then one image per piece, numbered in the grid's order) |
| The prompt that made them | `00 - Prompt.txt` in that folder (its only copy: use it in chat for any new reference image) |
| The drawing kit (balloon packing, sprigs, paints, the scroll motion) | `src/components/illustration/balloonArt.tsx` |
| The twelve pieces, each with an id | `src/components/illustration/pieceList.tsx` |
| What a page uses | `src/components/illustration/BalloonPieces.tsx` |
| Colours and line weights | the `--bp-*` tokens in `src/index.css` |
| Layout | `src/styles/balloon-pieces.css` |
| See them all, live | `/style-guide/`: S25 Balloon drawings, and the Balloon drawings colours under C · Colours |

The images from chat are the reference. The website draws its own versions in code: they animate, stay sharp at any size and weigh almost nothing.

## The look

- Softly shaded balloons with no outlines: blush and ivory lead, with a little warm sage and pale champagne gold. Gold sits mostly in the small and tiny balloons.
- Packed the way Laura builds them: big and medium balloons alternating along the line, small and tiny ones tucked into the gaps.
- Short olive sprigs at the ends of a garland, never many.
- Boards, doors, tables and frames softly shaded and lit from the left, with faint warm edges. Gold metal for hoops and stands.
- Warm cream panel, lighter in the middle, rounded corners (`rounded-large`).
- The name goes under the drawing in body text (`t-small`), never inside it, and fits one line at 360px wide.

Not this (each was tried and rejected, 28 November 2026): ink line drawings, a pencil sketch, anything blue (the window glass is a warm pale grey), people, text or logos in a drawing. Sailboards are boards with a fully arched top, never the fin shape in reference image 05.

The code enforces these, so they can't drift:

- **Margins:** balloons stay inside x 14 to 226 and below y 29 of the 240 square, and rest on the floor. Sprig tips stay inside x 12 to 228 and below y 20.
- **Colours:** no two sage or two gold balloons touch, and there is at most one big sage balloon per drawing (two on the balloon wall).
- **Sets:** `src/test/balloon-pieces.test.ts` fails if a page shows a set that doesn't end on a full row, or names a piece that doesn't exist.

## The motion

As each tile scrolls into view, its props draw on, then its balloons and sprigs inflate one by one along the garland, each with a small overshoot. The page's own scroll drives it (`useScrollProgress`), never a timer, so scrolling back up runs it backwards. It starts when the tile's top reaches 98% of the screen height and is finished by 50%. With reduced motion, or without JavaScript, every drawing shows finished.

It needs at least half a screen of page below the last row, or that row can't scroll high enough to finish. In an article that's always true; on another page, don't make the drawings the last thing above the footer.

## Using them on a page

```tsx
import BalloonPieces from "@/components/illustration/BalloonPieces";

<BalloonPieces />                                    // all twelve
<BalloonPieces pieces={["arch", "balloon-wall"]} />  // two, side by side
<BalloonPieces pieces={["full-hoop"]} />             // one on its own
```

A set is 1, 2, 4, 6 or 12 pieces, so every width ends on a full row: two across on phones, three from tablets up, while 2 and 4 stay two across. One piece on its own is `--bp-single` wide. The default classes suit a journal article; pass `className` for anywhere else.

The ids: `arch`, `half-arch`, `wall-garland`, `table-garland`, `mantelpiece`, `sailboard`, `sailboard-backdrop`, `shimmer-wall`, `full-hoop`, `half-hoop`, `balloon-wall`, `number-stack`.

## Drawing a new piece

1. **Start from a reference image.** Use one in the Drive folder. If there isn't one, Matt makes it in chat with `00 - Prompt.txt` (and the grid as the reference) and saves it there with the next number.
2. **Add it to `pieceList.tsx`** with an id, a short name in the Balloons page's words (what the piece is first, then where it goes) and a screen-reader label. Draw the props with `Prop` and the board helpers, and the balloons with `garland()` along a path (`bezier`, `arc` or `through`), using `swell` to make them bigger where Laura's are.
3. **Compare it with the reference.** Screenshot it at 360 and 390 wide next to the reference image. Have a fresh reviewer subagent compare the two in numbers (balloon sizes, colour share, spacing, margins), then make a design pass. Two rounds of that got close fast; Matt judges against his reference, so every step away from it costs another round.
4. **Check the set still ends on full rows** wherever the piece is shown, and add its id to the list above.

## The Brand Pack

The Brand Pack shows the illustration look as pictures only (the reference grid and a recording of the motion), with a pointer back here. No colour, size or rule is copied into it. If an illustration is ever used on social or print, the social rules for it (sizes, where it sits on a post) go in the pack, because the pack owns social and print.
