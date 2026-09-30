import type { CSSProperties } from 'react';

type Props = {
  size?: number;
};

export type BoxRect = { top: number; left: number; width: number; height: number };
export type SideNums = [number, number, number, number];

type HatchKind = 'pad' | 'mar';
type HatchDir = 'back' | 'fwd';

/* Same tile as applyHatchBg() in spec-lens.js — SVG, not a CSS gradient.
   Chrome's repeating-linear-gradient at a diagonal looks like DevTools padding
   overlay and also drifts in thickness; the plugin paints a 6px SVG stripe. */
const HATCH_TILE = 6;
const HATCH_DIR: Record<HatchKind, HatchDir> = { pad: 'back', mar: 'fwd' };
const hatchBgCache = new Map<string, string>();
const hatchFillCache = new Map<HatchKind, CSSProperties>();

function hatchTileBg(colorA: string, colorB: string, dir: HatchDir) {
  const key = `${dir}|${colorA}|${colorB}`;
  const cached = hatchBgCache.get(key);
  if (cached) return cached;
  const n = HATCH_TILE;
  const half = n / 2;
  const d =
    dir === 'back'
      ? `M0,0 L${n},${n} M${-half},${half} L${half},${-half} M${n - half},${n + half} L${n + half},${n - half}`
      : `M0,${n} L${n},0 M${-half},${half} L${half},${-half} M${n - half},${n + half} L${n + half},${n - half}`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${n}" height="${n}">` +
    `<rect width="${n}" height="${n}" fill="${colorB}"/>` +
    `<path d="${d}" stroke="${colorA}" stroke-width="1"/>` +
    `</svg>`;
  const bg = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  hatchBgCache.set(key, bg);
  return bg;
}

function hatchFill(kind: HatchKind): CSSProperties {
  const cached = hatchFillCache.get(kind);
  if (cached) return cached;
  if (typeof document === 'undefined') return {};
  const cs = getComputedStyle(document.documentElement);
  const a = cs.getPropertyValue(`--twc-hatch-${kind}-a`).trim();
  const b = cs.getPropertyValue(`--twc-hatch-${kind}-b`).trim();
  const style: CSSProperties =
    !a || !b
      ? {}
      : {
          backgroundImage: hatchTileBg(a, b, HATCH_DIR[kind]),
          backgroundRepeat: 'repeat',
        };
  hatchFillCache.set(kind, style);
  return style;
}

function Band({
  kind,
  size,
  left,
  top,
  width,
  height,
}: {
  kind: HatchKind;
  size: number;
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  if (width < 0.5 || height < 0.5 || size < 0.5) return null;
  return (
    <div
      className={`twc-hatch__band twc-hatch__band--${kind}`}
      style={{
        left,
        top,
        width,
        height,
        ...hatchFill(kind),
        backgroundPosition: `${-left}px ${-top}px`,
      }}
    >
      {width >= 12 || height >= 12 ? <span className="twc-hatch__badge">{size}</span> : null}
    </div>
  );
}

/** Static padding hatch for the Relay scenes: four bands of `size` px. */
export function Hatch({ size = 16 }: Props) {
  const fill = hatchFill('pad');
  const band = `${size}px`;
  const label = String(size);
  return (
    <div className="twc-hatch is-visible" aria-hidden="true" style={{ ['--hatch' as string]: band }}>
      <div className="twc-hatch__band twc-hatch__band--pad twc-hatch__band--top" style={fill}>
        <span className="twc-hatch__badge">{label}</span>
      </div>
      <div className="twc-hatch__band twc-hatch__band--pad twc-hatch__band--bottom" style={fill}>
        <span className="twc-hatch__badge">{label}</span>
      </div>
      <div className="twc-hatch__band twc-hatch__band--pad twc-hatch__band--left" style={fill}>
        <span className="twc-hatch__badge">{label}</span>
      </div>
      <div className="twc-hatch__band twc-hatch__band--pad twc-hatch__band--right" style={fill}>
        <span className="twc-hatch__badge">{label}</span>
      </div>
    </div>
  );
}

export function LiveHatch({ box, padding, margin }: { box: BoxRect; padding: SideNums; margin: SideNums }) {
  const [pt, pr, pb, pl] = padding;
  const [mt, mr, mb, ml] = margin;
  const hasPad = pt + pr + pb + pl > 0;
  const hasMar = mt + mr + mb + ml > 0;
  const padStyle = {
    ['--live-t' as string]: `${box.top}px`,
    ['--live-l' as string]: `${box.left}px`,
    ['--live-w' as string]: `${box.width}px`,
    ['--live-h' as string]: `${box.height}px`,
  };
  const marStyle = {
    ['--live-t' as string]: `${box.top - mt}px`,
    ['--live-l' as string]: `${box.left - ml}px`,
    ['--live-w' as string]: `${box.width + ml + mr}px`,
    ['--live-h' as string]: `${box.height + mt + mb}px`,
  };
  const padMidH = Math.max(0, box.height - pt - pb);
  return (
    <>
      {hasPad ? (
        <div className="twc-hatch is-visible twc-hatch--live" style={padStyle} aria-hidden="true">
          <Band kind="pad" size={pt} left={0} top={0} width={box.width} height={pt} />
          <Band kind="pad" size={pr} left={box.width - pr} top={pt} width={pr} height={padMidH} />
          <Band kind="pad" size={pb} left={0} top={box.height - pb} width={box.width} height={pb} />
          <Band kind="pad" size={pl} left={0} top={pt} width={pl} height={padMidH} />
        </div>
      ) : null}
      {hasMar ? (
        <div className="twc-hatch is-visible twc-hatch--live" style={marStyle} aria-hidden="true">
          <Band kind="mar" size={mt} left={ml} top={0} width={box.width} height={mt} />
          <Band kind="mar" size={mr} left={ml + box.width} top={mt} width={mr} height={box.height} />
          <Band kind="mar" size={mb} left={ml} top={mt + box.height} width={box.width} height={mb} />
          <Band kind="mar" size={ml} left={0} top={mt} width={ml} height={box.height} />
        </div>
      ) : null}
    </>
  );
}

export function SizeChip({ label }: { label: string }) {
  return <div className="twc-size-cap is-visible is-pinned">{label}</div>;
}

export function Outline() {
  return <div className="twc-outline is-visible is-pinned" />;
}
