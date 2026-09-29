import { useState } from 'react';
import { HostApp } from '../host/HostApp';
import { Thiing } from '../marketing/Thiing';
import type { Scene, SceneState } from './types';

export function FeatureScene({ scene, flip = false }: { scene: Scene; flip?: boolean }) {
  const [state, setState] = useState<SceneState>('a');
  const host = scene.host(state);

  return (
    <section className={`site-band${flip ? ' site-band--wash' : ''}`} id={scene.id}>
      <div className="site-section">
        <div className="site-section__head">
          <div className="site-section__kicker-row">
            <Thiing name={scene.icon} alt="" size="md" />
            <p className="site-kicker">{scene.eyebrow}</p>
          </div>
          <h2>{scene.title}</h2>
          <p className="site-section__body">{scene.body}</p>
          <div className="scene-toggle" role="tablist" aria-label={`${scene.title} states`}>
            <button
              type="button"
              className={`scene-toggle__opt${state === 'a' ? ' is-on' : ''}`}
              role="tab"
              aria-selected={state === 'a'}
              onClick={() => setState('a')}
            >
              {scene.stateLabels.a}
            </button>
            <button
              type="button"
              className={`scene-toggle__opt${state === 'b' ? ' is-on' : ''}`}
              role="tab"
              aria-selected={state === 'b'}
              onClick={() => setState('b')}
            >
              {scene.stateLabels.b}
            </button>
          </div>
        </div>
        <div className="scene-stage">
          <div className="scene-stage__host">
            <HostApp {...host} />
          </div>
          {scene.chrome(state)}
        </div>
      </div>
    </section>
  );
}
