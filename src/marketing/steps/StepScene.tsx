import type { CSSProperties, ReactNode } from 'react';
import { SCENE_MS } from './timing';
import './steps.css';

function Cursor() {
  return (
    <svg className="step-scene__cursor" viewBox="0 0 12 18">
      <path d="M1 1v14.2l3.6-3.4 2.3 5.2 2.4-1.1-2.3-5.1h4.9z" />
    </svg>
  );
}

function Bar() {
  return (
    <div className="step-scene__bar">
      <span className="step-scene__dots">
        <i />
        <i />
        <i />
      </span>
      <span className="step-scene__url" />
      <span className="step-scene__ext">
        <img src="/logo-icon.svg" alt="" />
        <span className="step-scene__ring" />
        <span className="step-scene__on" />
      </span>
    </div>
  );
}

/** The sample page all four scenes share: a nav row, a side column and the card that gets fixed. */
function Page({ children, card }: { children?: ReactNode; card?: ReactNode }) {
  return (
    <div className="step-scene__page">
      <div className="step-scene__nav">
        <i className="step-scene__logo" />
        <i className="step-scene__line" style={{ width: '1.6em' }} />
        <i className="step-scene__line" style={{ width: '1.6em' }} />
        <i className="step-scene__line" style={{ width: '1.6em' }} />
      </div>
      <div className="step-scene__side">
        <i className="step-scene__line step-scene__line--strong" style={{ width: '7em' }} />
        <i className="step-scene__line" style={{ width: '9em' }} />
        <i className="step-scene__line" style={{ width: '8em' }} />
        <i className="step-scene__line" style={{ width: '5.5em' }} />
      </div>
      <div className="step-scene__card">
        <i className="step-scene__line step-scene__line--strong" style={{ width: '6em' }} />
        <i className="step-scene__line" style={{ width: '8.5em' }} />
        <i className="step-scene__line" style={{ width: '7em' }} />
        <i className="step-scene__btn" />
        {card}
      </div>
      {children}
    </div>
  );
}

function Pin() {
  return (
    <>
      <span className="step-scene__hatch" />
      <span className="step-scene__outline" />
      <span className="step-scene__cap">
        <b>110 × 61</b>
        <b>120 × 71</b>
      </span>
    </>
  );
}

function PanelHead() {
  return (
    <div className="step-scene__head">
      <span className="step-scene__tag">div</span>card
    </div>
  );
}

function TurnOn() {
  return (
    <>
      <Bar />
      <Page>
        <div className="step-scene__toolbar">
          <i className="is-on" />
          <i />
          <i />
          <i />
          <span />
          <i />
        </div>
      </Page>
      <Cursor />
    </>
  );
}

function PinIt() {
  return (
    <>
      <Bar />
      <Page card={<Pin />}>
        <div className="step-scene__panel">
          <PanelHead />
          <div className="step-scene__row">
            padding<span className="step-scene__token">--space-4</span>
          </div>
          <div className="step-scene__row">
            fill
            <span className="step-scene__fill">
              <i className="step-scene__swatch" />
              #FFFFFF
            </span>
          </div>
        </div>
      </Page>
      <Cursor />
    </>
  );
}

function Tweak() {
  return (
    <>
      <Bar />
      <Page card={<Pin />}>
        <div className="step-scene__panel">
          <PanelHead />
          <div className="step-scene__row">
            padding
            <span className="step-scene__field">
              <b className="step-scene__was">16</b>
              <b className="step-scene__typed">2</b>
              <b className="step-scene__want">24</b>
              <i className="step-scene__caret" />
            </span>
          </div>
          <div className="step-scene__row">
            fill
            <span className="step-scene__fill">
              <i className="step-scene__swatch" />
              <span className="step-scene__swap">
                <b className="step-scene__hex-was">#FFFFFF</b>
                <b className="step-scene__hex-want">#E1FAF4</b>
              </span>
            </span>
          </div>
        </div>
      </Page>
      <Cursor />
    </>
  );
}

function Copy() {
  return (
    <>
      <Bar />
      <Page card={<Pin />}>
        <div className="step-scene__panel">
          <div className="step-scene__head">
            Changes<span className="step-scene__count">2</span>
          </div>
          <div className="step-scene__row">
            padding
            <span className="step-scene__diff">
              16 → <b>24</b>
            </span>
          </div>
          <div className="step-scene__row">
            fill
            <span className="step-scene__diff">
              <i className="step-scene__swatch" /> → <i className="step-scene__swatch step-scene__swatch--want" />
            </span>
          </div>
          <div className="step-scene__copy">
            <b>Copy changes</b>
            <b>
              <svg viewBox="0 0 12 12">
                <path d="M2.5 6.3 5 8.6l4.5-5" />
              </svg>
              Copied
            </b>
          </div>
        </div>
        <div className="step-scene__chip">
          <span>
            padding: <span className="step-scene__chip-was">16</span> → <span className="step-scene__chip-want">24</span>
          </span>
        </div>
      </Page>
      <Cursor />
    </>
  );
}

const SCENES = [TurnOn, PinIt, Tweak, Copy];

/**
 * A looping mini-UI for one "How it works" step. Decorative: hidden from
 * assistive tech and holds nothing focusable. The keyframes run only while
 * `playing`; otherwise the scene rests on its first frame (or, with reduced
 * motion, on its last). Change `playKey` to start it over.
 */
export function StepScene({ step, playing, playKey }: { step: number; playing: boolean; playKey: number | string }) {
  const Scene = SCENES[step - 1];
  return (
    <div
      className="step-scene"
      data-scene={step}
      data-playing={playing || undefined}
      aria-hidden="true"
      style={{ '--dur': `${SCENE_MS[step - 1]}ms` } as CSSProperties}
    >
      <div className="step-scene__stage" key={playKey}>
        <Scene />
      </div>
    </div>
  );
}
