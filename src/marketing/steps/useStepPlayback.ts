import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from 'react';

/** Same breakpoint at which marketing.css stacks .site-steps into one column. */
const STACKED_QUERY = '(max-width: 720px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function useMedia(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export type StepPlayback = {
  /** Index of the step that plays, or -1 when nothing does (off-screen, reduced motion). */
  active: number;
  /** Bumps every time the active scene must start over; key the scene on it. */
  play: number;
  enter: (index: number, via: Hold) => void;
  leave: (index: number, via: Hold) => void;
};

type Hold = 'hover' | 'focus';

/**
 * One step plays at a time. In a row, the steps take turns and hover or focus
 * picks one; stacked, the step nearest the middle of the viewport plays. Each
 * scene loops by being restarted after `durations[i]` ms. Off-screen or with
 * reduced motion nothing plays.
 */
export function useStepPlayback(listRef: RefObject<HTMLElement | null>, durations: readonly number[]): StepPlayback {
  const reduced = useMedia(REDUCED_QUERY);
  const stacked = useMedia(STACKED_QUERY);
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [play, setPlay] = useState(0);
  const indexRef = useRef(0);
  const hovered = useRef<number | null>(null);
  const focused = useRef<number | null>(null);
  const running = visible && !reduced;

  const choose = useCallback((next: number) => {
    if (indexRef.current === next) return;
    indexRef.current = next;
    setIndex(next);
    setPlay((p) => p + 1);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    /* Per step, not the whole list: stacked, the list is ~2.5 viewports tall and
     * never reaches 30% visible even with a step centred. */
    const shown = new Set<Element>();
    let seen = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) shown.add(entry.target);
          else shown.delete(entry.target);
        }
        const next = shown.size > 0;
        if (next === seen) return;
        seen = next;
        setVisible(next);
        if (next) setPlay((p) => p + 1);
      },
      { threshold: 0.3 },
    );
    for (const child of list.children) observer.observe(child);
    return () => observer.disconnect();
  }, [listRef]);

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => {
      if (stacked || (hovered.current ?? focused.current) !== null) setPlay((p) => p + 1);
      else choose((indexRef.current + 1) % durations.length);
    }, durations[index]);
    return () => window.clearTimeout(id);
  }, [running, stacked, index, play, durations, choose]);

  useEffect(() => {
    const list = listRef.current;
    if (!running || !stacked || !list) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      let best = 0;
      let bestDistance = Infinity;
      [...list.children].forEach((child, i) => {
        const box = child.getBoundingClientRect();
        const distance = Math.abs(box.top + box.height / 2 - middle);
        if (distance < bestDistance) {
          best = i;
          bestDistance = distance;
        }
      });
      choose(best);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [running, stacked, listRef, choose]);

  /* Hover wins over focus; leaving with the mouse hands the hold back to a focused step. */
  const enter = useCallback(
    (i: number, via: Hold) => {
      if (stacked) return;
      (via === 'hover' ? hovered : focused).current = i;
      choose(hovered.current ?? i);
    },
    [stacked, choose],
  );

  const leave = useCallback(
    (i: number, via: Hold) => {
      const ref = via === 'hover' ? hovered : focused;
      if (ref.current !== i) return;
      ref.current = null;
      const still = hovered.current ?? focused.current;
      if (still !== null && !stacked) choose(still);
    },
    [stacked, choose],
  );

  return { active: running ? index : -1, play, enter, leave };
}
