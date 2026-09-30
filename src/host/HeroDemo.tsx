import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { AtSign, Camera } from 'lucide-react';
import { BoxEditPanel } from '../chrome/Panel';
import { Toolbar } from '../chrome/Toolbar';
import { LiveHatch, type BoxRect } from '../chrome/Hatch';
import type { SideTuple } from '../chrome/Editors';
import './onboarding.css';

type MarkId = 'card' | 'avatar' | 'field' | 'cta';

type BoxStyle = {
  tag: string;
  padding: SideTuple;
  margin: SideTuple;
  radius: SideTuple;
};

const MARKS: MarkId[] = ['card', 'avatar', 'field', 'cta'];

const INITIAL: Record<MarkId, BoxStyle> = {
  card: {
    tag: 'form',
    padding: ['24', '24', '24', '24'],
    margin: ['0', '0', '0', '0'],
    radius: ['24', '24', '24', '24'],
  },
  avatar: {
    tag: 'img',
    padding: ['0', '0', '0', '0'],
    margin: ['0', '0', '0', '0'],
    radius: ['28', '28', '28', '28'],
  },
  field: {
    tag: 'input',
    padding: ['12', '12', '12', '12'],
    margin: ['0', '0', '0', '0'],
    radius: ['8', '8', '8', '8'],
  },
  cta: {
    tag: 'button',
    padding: ['12', '16', '12', '16'],
    margin: ['0', '0', '0', '0'],
    radius: ['8', '8', '8', '8'],
  },
};

function nums(tuple: SideTuple): [number, number, number, number] {
  return tuple.map((value) => {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : 0;
  }) as [number, number, number, number];
}

function boxStyle(box: BoxStyle): CSSProperties {
  const [pt, pr, pb, pl] = nums(box.padding);
  const [mt, mr, mb, ml] = nums(box.margin);
  const [tl, tr, br, bl] = nums(box.radius);
  return {
    padding: `${pt}px ${pr}px ${pb}px ${pl}px`,
    margin: `${mt}px ${mr}px ${mb}px ${ml}px`,
    borderRadius: `${tl}px ${tr}px ${br}px ${bl}px`,
  };
}

function liveBox(box: BoxRect, radius?: string): CSSProperties {
  return {
    ['--live-t' as string]: `${box.top}px`,
    ['--live-l' as string]: `${box.left}px`,
    ['--live-w' as string]: `${box.width}px`,
    ['--live-h' as string]: `${box.height}px`,
    ['--live-r' as string]: radius ?? '0px',
  };
}

function relBox(el: HTMLElement, root: HTMLElement): BoxRect {
  const a = el.getBoundingClientRect();
  const b = root.getBoundingClientRect();
  return {
    top: a.top - b.top,
    left: a.left - b.left,
    width: a.width,
    height: a.height,
  };
}

function Mark({
  id,
  className,
  style,
  markRef,
  onHover,
  onPin,
  role,
  children,
}: {
  id: MarkId;
  className: string;
  style: CSSProperties;
  markRef: (node: HTMLElement | null) => void;
  onHover: (id: MarkId | null) => void;
  onPin: (id: MarkId) => void;
  role?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-demo-mark={id}
      className={className}
      style={style}
      ref={markRef}
      role={role}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={(event) => {
        const next = event.relatedTarget;
        const node = next instanceof Element ? next : next instanceof Node ? next.parentElement : null;
        const mark = node?.closest('[data-demo-mark]');
        onHover(mark ? (mark.getAttribute('data-demo-mark') as MarkId) : null);
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onPin(id);
      }}
    >
      {children}
    </div>
  );
}

export function HeroDemo() {
  const hostRef = useRef<HTMLDivElement>(null);
  const marks = useRef<Partial<Record<MarkId, HTMLElement | null>>>({});
  const [pin, setPin] = useState<MarkId>('card');
  const [hover, setHover] = useState<MarkId | null>(null);
  const [boxes, setBoxes] = useState(INITIAL);
  const [pinBox, setPinBox] = useState<BoxRect | null>(null);
  const [hoverBox, setHoverBox] = useState<BoxRect | null>(null);

  const setMark = useCallback((id: MarkId) => (node: HTMLElement | null) => {
    marks.current[id] = node;
  }, []);

  const measure = useCallback(() => {
    const root = hostRef.current;
    if (!root) return;
    const pinned = marks.current[pin];
    setPinBox(pinned ? relBox(pinned, root) : null);
    if (hover && hover !== pin) {
      const hovered = marks.current[hover];
      setHoverBox(hovered ? relBox(hovered, root) : null);
    } else {
      setHoverBox(null);
    }
  }, [hover, pin, boxes]);

  useLayoutEffect(() => {
    measure();
    const root = hostRef.current;
    if (!root) return;
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    MARKS.forEach((id) => {
      const node = marks.current[id];
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [measure]);

  const current = boxes[pin];
  const patch = (key: keyof Omit<BoxStyle, 'tag'>) => (values: SideTuple) => {
    setBoxes((prev) => ({ ...prev, [pin]: { ...prev[pin], [key]: values } }));
  };

  return (
    <>
      <div className="scene-stage__host">
        <div
          className="host-onboard"
          ref={hostRef}
          onMouseLeave={() => setHover(null)}
        >
          <img className="host-onboard__photo" src="/demo/backdrop.webp" alt="" width="1600" height="1000" decoding="async" />
          <form className="host-onboard__form" onSubmit={(event) => event.preventDefault()}>
            <Mark
              id="card"
              className="host-onboard__card"
              style={boxStyle(boxes.card)}
              markRef={setMark('card')}
              onHover={setHover}
              onPin={setPin}
            >
              <Mark
                id="avatar"
                className="host-onboard__avatar"
                style={boxStyle(boxes.avatar)}
                markRef={setMark('avatar')}
                onHover={setHover}
                onPin={setPin}
              >
                <span className="host-onboard__face" aria-hidden="true">
                  M
                </span>
                <span className="host-onboard__cam" aria-hidden="true">
                  <Camera size={12} strokeWidth={2} />
                </span>
              </Mark>
              <h2 className="host-onboard__title">Welcome, you&apos;re starting your first journey here!</h2>
              <p className="host-onboard__lede">Add your avatar and pick a username for a quick start.</p>
              <Mark
                id="field"
                className="host-onboard__field"
                style={boxStyle(boxes.field)}
                markRef={setMark('field')}
                onHover={setHover}
                onPin={setPin}
              >
                <AtSign size={16} strokeWidth={2} aria-hidden="true" />
                <input type="text" placeholder="username" defaultValue="maya" readOnly tabIndex={-1} />
              </Mark>
              <Mark
                id="cta"
                className="host-onboard__cta"
                style={boxStyle(boxes.cta)}
                markRef={setMark('cta')}
                onHover={setHover}
                onPin={setPin}
                role="button"
              >
                Create an account
              </Mark>
            </Mark>
          </form>
          <div className="host-onboard__chrome">
            {pinBox ? (
              <div
                className={`twc-outline is-visible is-pinned is-live${hover === pin ? ' is-self-hover' : ''}`}
                style={liveBox(pinBox, String(boxStyle(current).borderRadius))}
              />
            ) : null}
            {hoverBox ? <div className="twc-hover-outline is-visible is-live" style={liveBox(hoverBox)} /> : null}
            {pinBox ? <LiveHatch box={pinBox} padding={nums(current.padding)} margin={nums(current.margin)} /> : null}
          </div>
        </div>
      </div>
      <BoxEditPanel
        tag={current.tag}
        padding={current.padding}
        margin={current.margin}
        radius={current.radius}
        onPadding={patch('padding')}
        onMargin={patch('margin')}
        onRadius={patch('radius')}
      />
      <Toolbar mode="edit" />
    </>
  );
}
