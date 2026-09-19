import { ChangesPanel } from '../chrome/Panel';
import { Toolbar } from '../chrome/Toolbar';
import type { Scene } from './types';

const ROWS = [
  { name: 'padding', value: '24px', title: '16px → 24px' },
  { name: 'color', value: 'var(--color-brand)', title: 'var(--fg) → var(--color-brand)' },
];

export const copyScene: Scene = {
  id: 'copy',
  eyebrow: 'Copy changes',
  title: 'Copy the exact change. Your agent gets was → want, not a screenshot.',
  body: 'Element identity plus the values you actually set. Not a guess. The change.',
  stateLabels: { a: 'The page', b: 'The handoff' },
  host: () => ({
    width: 'desktop',
    pinned: 'cta',
    tweaks: {
      ctaPadding: 'token',
      sizeLabel: '168 × 48',
    },
  }),
  chrome: (state) => (
    <>
      <ChangesPanel rows={ROWS} />
      {state === 'b' ? (
        <aside className="scene-payload" aria-label="Copy changes payload">
          <span className="scene-payload__kicker">Copy changes</span>
          {`button.cta
padding: 16px → 24px
color: var(--fg) → var(--color-brand)`}
        </aside>
      ) : null}
      <Toolbar mode="edit" />
    </>
  ),
};
