import { SpecInspectPanel } from '../chrome/Panel';
import { Toolbar } from '../chrome/Toolbar';
import type { Scene } from './types';

export const painScene: Scene = {
  id: 'pain',
  eyebrow: 'The loop',
  title: 'Stop explaining the tweak. Change the live page.',
  body: 'Stop pasting screenshots into your agent. Pin the thing that is off, see the hatch, then edit it on the page itself.',
  stateLabels: { a: 'Pin', b: 'Inspect' },
  host: (state) => ({
    width: 'desktop',
    pinned: 'cta',
    tweaks: {
      hatch: true,
      sizeLabel: state === 'b' ? '168 × 44' : '168 × 44',
    },
  }),
  chrome: () => (
    <>
      <SpecInspectPanel />
      <Toolbar mode="inspect" />
    </>
  ),
};
