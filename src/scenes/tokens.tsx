import { TokensPanel } from '../chrome/Panel';
import { Toolbar } from '../chrome/Toolbar';
import { HostApp } from '../host/HostApp';
import type { Scene } from './types';

export const tokensScene: Scene = {
  id: 'tokens',
  eyebrow: "This page's tokens",
  icon: 'palette',
  title: "Bind to the page's own tokens. Off-scale gets called out.",
  body: 'twiddle reads the variables this page already defines and tells you when a value is off its scale. Apply token is explicit — typed 24 stays 24, we do not guess.',
  url: 'relay.app/home',
  stateLabels: { a: 'Off-scale', b: 'Apply token' },
  view: (state) => {
    const off = state === 'a';
    return (
      <>
        <div className="scene-stage__host">
          <HostApp
            compact
            pinned="cta"
            tweaks={{
              ctaPadding: off ? 'off' : 'token',
              hatch: off ? 11 : 16,
              sizeLabel: off ? '130 × 42' : '134 × 52',
            }}
          />
        </div>
        <TokensPanel bound={!off} />
        <Toolbar mode="edit" />
      </>
    );
  },
};
