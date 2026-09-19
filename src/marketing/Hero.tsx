import { HostApp } from '../host/HostApp';
import { SpecInspectPanel } from '../chrome/Panel';
import { Toolbar } from '../chrome/Toolbar';
import { CtaButton } from './CtaButton';

export function Hero() {
  return (
    <section className="site-hero">
      <div className="site-hero__copy">
        <h1>Stop telling your agent “make it a bit smaller.”</h1>
        <p className="site-hero__sub">
          Tweak any live page by hand. Hand your agent the exact change — in your own design tokens. Any site. No repo, no
          Figma, no localhost, no setup.
        </p>
        <p className="site-hero__beta">
          Free while we test. A paid plan comes later; anyone who installs during beta keeps an early-supporter discount.
        </p>
        <CtaButton />
      </div>
      <div className="site-hero__stage">
        <div className="scene-stage">
          <div className="scene-stage__host">
            <HostApp
              pinned="cta"
              tweaks={{ hatch: true, sizeLabel: '168 × 44' }}
            />
          </div>
          <SpecInspectPanel />
          <Toolbar mode="inspect" />
        </div>
      </div>
    </section>
  );
}
