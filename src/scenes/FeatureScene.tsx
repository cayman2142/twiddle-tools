import { useState } from 'react';
import { HostApp } from '../host/HostApp';
import type { Scene, SceneState } from './types';

export function FeatureScene({ scene }: { scene: Scene }) {
  const [state, setState] = useState<SceneState>('a');
  const host = scene.host(state);

  return (
    <section className="site-section" id={scene.id}>
      <div className="site-section__head">
        <p className="site-kicker">{scene.eyebrow}</p>
        <h2>{scene.title}</h2>
        <p className="site-section__body">{scene.body}</p>
      </div>
      <div className="scene-toggle" role="tablist" aria-label={`${scene.title} states`}>
        <button type="button" className={state === 'a' ? 'is-on' : ''} role="tab" aria-selected={state === 'a'} onClick={() => setState('a')}>
          {scene.stateLabels.a}
        </button>
        <button type="button" className={state === 'b' ? 'is-on' : ''} role="tab" aria-selected={state === 'b'} onClick={() => setState('b')}>
          {scene.stateLabels.b}
        </button>
      </div>
      <div className="scene-stage">
        <div className="scene-stage__host">
          <HostApp {...host} />
        </div>
        {scene.chrome(state)}
      </div>
    </section>
  );
}
