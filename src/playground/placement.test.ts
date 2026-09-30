import { describe, expect, it } from 'vitest';
import { placeHint } from './placement';

const VIEW = { width: 1100, height: 776 };
const HINT = { width: 260, height: 100 };

describe('placeHint', () => {
  it('sits left of an anchor in the right-hand panel', () =>
    expect(placeHint({ left: 850, top: 300, width: 200, height: 32 }, HINT, VIEW)).toEqual({ side: 'left', left: 578, top: 266, arrow: 50 }));
  it('sits right when there is no room on the left', () =>
    expect(placeHint({ left: 20, top: 300, width: 100, height: 20 }, HINT, VIEW)).toEqual({ side: 'right', left: 132, top: 260, arrow: 50 }));
  it('clamps to the top edge and keeps the arrow inside the hint', () =>
    expect(placeHint({ left: 850, top: 4, width: 40, height: 20 }, HINT, VIEW)).toEqual({ side: 'left', left: 578, top: 8, arrow: 12 }));
  it('goes above when neither side fits', () =>
    expect(placeHint({ left: 100, top: 400, width: 100, height: 20 }, HINT, { width: 300, height: 776 })).toEqual({ side: 'above', left: 20, top: 288, arrow: 130 }));
});
