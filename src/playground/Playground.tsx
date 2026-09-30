import { useCallback, useEffect, useRef, useState } from 'react';
import { Power } from 'lucide-react';
import { StageFrame } from '../app/StageFrame';
import { connectBridge, type Bridge, type CopyResult } from './bridge';
import { Checklist } from './Checklist';
import { Coach } from './Coach';
import { FinishCard } from './FinishCard';
import { useNearViewport, useWideEnough } from './hooks';
import { NONE, type Done } from './tasks';
import './playground.css';

const FORGE_URL = '/playground/forge.html';
/** Stage width below which the engine's 324px panel and ~800px toolbar leave no room for the page. */
const WIDE_MIN = 880;
/* Cloudflare serves the landing for unknown paths, so a missing forge.html
 * would load the landing inside the iframe — and its playground, and so on. */
const EMBEDDED = window.self !== window.top;

type Status = 'loading' | 'ready' | 'off' | 'failed';

function Live() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const wide = useWideEnough(wrapRef, WIDE_MIN);
  const near = useNearViewport(wrapRef);
  const [run, setRun] = useState(0);
  const [status, setStatus] = useState<Status>('loading');
  const [done, setDone] = useState<Done>(NONE);
  const [copy, setCopy] = useState<CopyResult | null>(null);
  const [bridge, setBridge] = useState<Bridge | null>(null);
  const [tips, setTips] = useState(true);
  const live = wide === true && near && status !== 'failed';

  useEffect(() => {
    const frame = frameRef.current;
    if (!live || !frame) return;
    const next = connectBridge(frame, {
      onReady: () => setStatus('ready'),
      onFail: () => setStatus('failed'),
      onPower: (on) => setStatus(on ? 'ready' : 'off'),
      onChange: (kind) => setDone((d) => (d[kind] ? d : { ...d, [kind]: true })),
      onCopy: (result) => {
        setCopy(result);
        setDone((d) => (d.copy ? d : { ...d, copy: true }));
      },
    });
    setBridge(next);
    return () => {
      next.dispose();
      setBridge(null);
    };
  }, [live, run]);

  const reset = useCallback(() => {
    setRun((r) => r + 1);
    setStatus('loading');
    setDone(NONE);
    setCopy(null);
  }, []);

  return (
    <div ref={wrapRef} className="playground">
      <StageFrame url="forge.dev/login" className="scene-stage--playground">
        <div className="playground__view">
          {live ? (
            <iframe
              key={run}
              ref={frameRef}
              className="playground__frame"
              src={FORGE_URL}
              title="twiddle running on a sample sign-in page"
              allow="clipboard-write"
            />
          ) : null}
          {status === 'loading' ? (
            <div className="playground__veil">
              <span className="playground__spinner" aria-hidden="true" />
              Starting twiddle…
            </div>
          ) : null}
          {status === 'off' ? (
            <div className="playground__veil">
              <p>twiddle is off.</p>
              <button type="button" className="site-ghost" onClick={() => bridge?.turnOn()}>
                <Power size={16} strokeWidth={2.25} aria-hidden="true" />
                Turn it back on
              </button>
            </div>
          ) : null}
          {status === 'ready' && bridge && !copy && tips ? <Coach bridge={bridge} done={done} onClose={() => setTips(false)} /> : null}
          {copy ? <FinishCard copy={copy} onClose={() => setCopy(null)} /> : null}
        </div>
      </StageFrame>
      <Checklist done={done} onReset={reset} />
    </div>
  );
}

export function Playground() {
  return EMBEDDED ? null : <Live />;
}
