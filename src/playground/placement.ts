export type Box = { left: number; top: number; width: number; height: number };
export type Side = 'left' | 'right' | 'above';
/** `arrow` is the arrow's offset along the hint's edge (y for left/right, x for above). */
export type Placement = { left: number; top: number; side: Side; arrow: number };

const GAP = 12;
const EDGE = 8;
const ARROW_INSET = 12;

const clamp = (value: number, lo: number, hi: number) => Math.min(Math.max(value, lo), Math.max(lo, hi));

/* Most anchors live in the engine's right-hand panel, so left is tried first. */
export function placeHint(anchor: Box, hint: { width: number; height: number }, view: { width: number; height: number }): Placement {
  const midX = anchor.left + anchor.width / 2;
  const midY = anchor.top + anchor.height / 2;
  const top = clamp(midY - hint.height / 2, EDGE, view.height - hint.height - EDGE);
  const arrowY = clamp(midY - top, ARROW_INSET, hint.height - ARROW_INSET);

  if (anchor.left - GAP - EDGE >= hint.width) {
    return { side: 'left', left: anchor.left - GAP - hint.width, top, arrow: arrowY };
  }
  if (view.width - (anchor.left + anchor.width) - GAP - EDGE >= hint.width) {
    return { side: 'right', left: anchor.left + anchor.width + GAP, top, arrow: arrowY };
  }
  const left = clamp(midX - hint.width / 2, EDGE, view.width - hint.width - EDGE);
  return {
    side: 'above',
    left,
    top: Math.max(anchor.top - GAP - hint.height, EDGE),
    arrow: clamp(midX - left, ARROW_INSET, hint.width - ARROW_INSET),
  };
}
