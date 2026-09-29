import { TokensPanel } from '../chrome/Panel';
import { Toolbar } from '../chrome/Toolbar';
import type { Scene } from './types';

export const tokensScene: Scene = {
  id: 'tokens',
  eyebrow: "This page's tokens",
  icon: 'palette',
  title: "Bind color and space to the page's own tokens. Off-scale is called out.",
  body: 'Typed 24 stays 24 — we do not guess. Apply token is explicit. Off-scale is a verdict on this page, not a Figma file.',
  stateLabels: { a: 'Off-scale', b: 'Apply token' },
  host: (state) => ({
    width: 'desktop',
    pinned: 'cta',
    tweaks: {
      ctaPadding: state === 'a' ? 'off' : 'token',
      sizeLabel: state === 'a' ? '11px pad' : '--space-4',
    },
  }),
  chrome: (state) => (
    <>
      <TokensPanel bound={state === 'b'} />
      <Toolbar mode="edit" />
    </>
  ),
};
