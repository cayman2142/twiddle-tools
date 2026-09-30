import { Toolbar } from '../chrome/Toolbar';
import { AdaptiveCanvas } from './AdaptiveCanvas';
import type { Scene } from './types';

export const adaptiveScene: Scene = {
  id: 'adaptive',
  eyebrow: 'Adaptive',
  icon: 'phone',
  title: 'Phone, tablet, desktop at once. Real widths, so @media actually runs.',
  body: 'Three live copies of the same page side by side. The sign-in card drops under the hero on the phone because the layout really is 390 wide — it is not a picture of a device.',
  url: 'relay.app/home',
  view: () => (
    <>
      <div className="scene-stage__host scene-stage__host--canvas">
        <AdaptiveCanvas />
      </div>
      <Toolbar mode="inspect" />
    </>
  ),
};
