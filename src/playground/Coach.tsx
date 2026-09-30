import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { X } from 'lucide-react';
import type { Bridge } from './bridge';
import { placeHint, type Box } from './placement';
import { nextTask, type Done, type TaskId } from './tasks';

type Hint = { selector: string; title: string; body: string; foot?: string };

/* Tried in order; the first anchor on screen wins. Selectors target the
 * vendored engine's markup (public/playground/engine/VERSION). When none
 * matches, no hint shows and the checklist carries on alone. */
export const HINTS: Record<TaskId, Hint[]> = {
  space: [
    { selector: '.sl-panel [data-sl-edit="padding"]', title: 'Change the padding', body: 'Pick another token, or type a number — the card reflows as you go.' },
    { selector: '.sl-panel [data-sl-edit="border-radius"]', title: 'Change the radius', body: 'Pick another token, or type a number — the card reflows as you go.' },
    { selector: '.sl-panel [data-sl-edit="margin"]', title: 'Change the spacing', body: 'Type a number and press Enter.' },
    { selector: '.sl-panel', title: 'Scroll the panel to Layout', body: 'Padding, margin and radius are there. Change any of them.' },
  ],
  colour: [
    { selector: '.sl-panel .sl-ed__swatch[data-sl-edit="background-color"]', title: 'Recolour it', body: 'Open the swatch, or type a hex like FDE68A.' },
    { selector: '.sl-panel .sl-ed__swatch', title: 'Recolour it', body: 'Open the swatch, or type a hex like FDE68A.' },
    { selector: '.sl-panel', title: 'Find Colors in the panel', body: 'Open a swatch, or type a hex.' },
  ],
  text: [
    { selector: '.sl-text-edit-fab', title: 'Now edit the text', body: 'Hit this button, type anything, press Enter.' },
    { selector: '#auth-title', title: 'Click the title', body: 'Then use the text button next to it to rewrite it.' },
  ],
  copy: [
    {
      selector: '.sl-panel [data-sl-changes="copy"]',
      title: 'Copy all changes',
      body: 'That’s the exact text your agent gets.',
      foot: 'Or copy the whole block as a brief with the copy button in the toolbar.',
    },
    { selector: '.sl-panel__tab[data-sl-tab="changes"]', title: 'Open Changes', body: 'Every edit you made is listed here, was → want.' },
    { selector: '.sl-panel', title: 'Scroll the panel to the top', body: 'Open Changes, the last tab: every edit you made is listed there, was → want.' },
  ],
};

const HINT_WIDTH = 260;
const TRACK_MS = 250;
const IDLE_PULSE_MS = 20_000;
const PANEL = '.sl-panel';
const PANEL_CHILD = /^\.sl-panel[ _]/;

type Aim = { hint: Hint; anchor: Box };

const same = (a: Box, b: Box) =>
  Math.round(a.left) === Math.round(b.left) &&
  Math.round(a.top) === Math.round(b.top) &&
  Math.round(a.width) === Math.round(b.width) &&
  Math.round(a.height) === Math.round(b.height);

export function Coach({ bridge, done }: { bridge: Bridge; done: Done }) {
  const task = nextTask(done);
  const [aim, setAim] = useState<Aim | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [height, setHeight] = useState(96);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!task || dismissed) {
      setAim(null);
      return;
    }
    const track = () => {
      for (const hint of HINTS[task]) {
        const found = bridge.rectOf(hint.selector);
        /* A hint beside a control inside the panel would sit on the panel's
         * other controls; widen the anchor to the panel's left edge instead. */
        const panel = found && PANEL_CHILD.test(hint.selector) ? bridge.rectOf(PANEL) : null;
        const anchor = found && panel ? { ...found, left: panel.left, width: found.left + found.width - panel.left } : found;
        if (anchor) {
          setAim((prev) => (prev && prev.hint === hint && same(prev.anchor, anchor) ? prev : { hint, anchor }));
          return;
        }
      }
      setAim(null);
    };
    track();
    const id = window.setInterval(track, TRACK_MS);
    return () => window.clearInterval(id);
  }, [bridge, task, dismissed]);

  useEffect(() => {
    setPulse(false);
    const id = window.setTimeout(() => setPulse(true), IDLE_PULSE_MS);
    return () => window.clearTimeout(id);
  }, [done]);

  useLayoutEffect(() => {
    if (hintRef.current) setHeight(hintRef.current.offsetHeight);
  }, [aim?.hint]);

  if (!aim || dismissed || !task) return null;
  const place = placeHint(aim.anchor, { width: HINT_WIDTH, height }, bridge.viewport());
  const style = {
    left: place.left,
    top: place.top,
    width: HINT_WIDTH,
    [place.side === 'above' ? '--arrow-x' : '--arrow-y']: `${place.arrow}px`,
  } as CSSProperties;

  return (
    <div className="playground-coach">
      <div ref={hintRef} className={`playground-hint${pulse ? ' is-pulse' : ''}`} data-task={task} data-side={place.side} role="note" style={style}>
        <strong>{aim.hint.title}</strong>
        <p>{aim.hint.body}</p>
        {aim.hint.foot ? <p className="playground-hint__foot">{aim.hint.foot}</p> : null}
        <button type="button" className="playground-hint__close" aria-label="Hide tips" onClick={() => setDismissed(true)}>
          <X size={14} strokeWidth={2.25} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
