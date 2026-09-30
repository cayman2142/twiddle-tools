import { useLayoutEffect, useRef, useState } from 'react';
import { HostApp } from '../host/HostApp';

const FRAMES = [
  { label: 'Phone', width: 390 },
  { label: 'Tablet', width: 768 },
  { label: 'Desktop', width: 1280 },
] as const;
const GAP = 48;
const TOTAL = FRAMES.reduce((sum, frame) => sum + frame.width, 0) + GAP * (FRAMES.length - 1);
/* Below this the three frames would be too small to read when fitted, so the
 * canvas keeps a readable scale and scrolls sideways instead. */
const MIN_SCALE = 0.42;

type Fit = { scale: number; left: number; width: number; height: number };

/* Each frame renders Relay at its real width, then the whole row is scaled.
 * The container queries inside Relay see 390 / 768 / 1280, so the reflow is
 * the page's own, not a drawing of one. */
export function AdaptiveCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<Fit>({ scale: MIN_SCALE, left: 24, width: 0, height: 0 });

  useLayoutEffect(() => {
    const root = ref.current;
    const row = rowRef.current;
    if (!root || !row) return;
    const measure = () => {
      const pad = root.clientWidth < 600 ? 16 : 32;
      const scale = Math.max(MIN_SCALE, Math.min(1, (root.clientWidth - pad * 2) / TOTAL));
      const scaled = TOTAL * scale;
      setFit({
        scale,
        left: Math.max(pad, (root.clientWidth - scaled) / 2),
        width: scaled + pad * 2,
        height: row.offsetHeight * scale,
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(row);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="adaptive-canvas" ref={ref}>
      <div className="adaptive-canvas__sizer" style={{ width: fit.width || undefined, height: fit.height + 28 + 84 }}>
        <div
          className="adaptive-canvas__row"
          ref={rowRef}
          style={{ left: fit.left, transform: `scale(${fit.scale})`, gap: GAP, width: TOTAL, ['--s' as string]: fit.scale }}
        >
          {FRAMES.map((frame) => (
            <figure className="adaptive-frame" key={frame.label} style={{ width: frame.width }}>
              <figcaption>
                {frame.label} <span>{frame.width}</span>
              </figcaption>
              <div className="adaptive-frame__page">
                <HostApp pinned={frame.width === 390 ? 'login' : null} />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

