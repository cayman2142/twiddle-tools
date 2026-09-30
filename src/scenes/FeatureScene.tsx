import { useState, type CSSProperties } from 'react';
import { StageFrame } from '../app/StageFrame';
import { Thiing } from '../marketing/Thiing';
import type { Scene, SceneState } from './types';

export function FeatureScene({ scene, wash = false }: { scene: Scene; wash?: boolean }) {
  const [state, setState] = useState<SceneState>('a');
  const labels = scene.stateLabels;

  return (
    <section className={`site-band${wash ? ' site-band--wash' : ''}`} id={scene.id}>
      <div className="site-section site-section--scene">
        <div className="site-section__head">
          <div className="site-section__kicker-row">
            <Thiing name={scene.icon} alt="" size="md" />
            <p className="site-kicker">{scene.eyebrow}</p>
          </div>
          <h2>{scene.title}</h2>
          <p className="site-section__body">{scene.body}</p>
          {labels ? (
            <div className="scene-toggle" role="group" aria-label={`${scene.eyebrow}: switch the demo`}>
              {(['a', 'b'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`scene-toggle__opt${state === key ? ' is-on' : ''}`}
                  aria-pressed={state === key}
                  onClick={() => setState(key)}
                >
                  {labels[key]}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <StageFrame
          url={scene.url}
          style={scene.height ? ({ ['--stage-h' as string]: `${scene.height}px` } as CSSProperties) : undefined}
        >
          {scene.view(state)}
        </StageFrame>
      </div>
    </section>
  );
}
