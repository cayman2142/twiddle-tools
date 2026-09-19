import { SpecInspectPanel } from '../chrome/Panel';
import { Toolbar } from '../chrome/Toolbar';
import type { Scene } from './types';

export const adaptiveScene: Scene = {
  id: 'adaptive',
  eyebrow: 'Adaptive',
  title: 'Phone, tablet, desktop at real widths. Media queries actually run.',
  body: 'The same Relay page at a real phone width. The login moves under the hero because the layout is width, not a device emulator.',
  stateLabels: { a: 'Desktop', b: 'Phone' },
  host: (state) => ({
    width: state === 'b' ? 'phone' : 'desktop',
    pinned: 'login',
    tweaks: {
      sizeLabel: state === 'b' ? '390 wide' : '1200 wide',
    },
  }),
  chrome: () => (
    <>
      <SpecInspectPanel />
      <Toolbar mode="inspect" />
    </>
  ),
};
