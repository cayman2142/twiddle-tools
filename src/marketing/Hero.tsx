import { lazy, Suspense } from 'react';
import { MousePointerClick } from 'lucide-react';
import { StageFrame } from '../app/StageFrame';
import { HeroDemo } from '../host/HeroDemo';
import { CtaButton } from './CtaButton';

const PixelBlast = lazy(() => import('./PixelBlast'));

export function Hero() {
  return (
    <section className="site-hero">
      <div className="site-hero__blast" aria-hidden="true">
        <Suspense fallback={null}>
          <PixelBlast color="#0090ff" variant="circle" pixelSize={3} patternDensity={1.35} edgeFade={0.2} />
        </Suspense>
      </div>
      <div className="site-hero__copy">
        <p className="site-hero__badge">
          <span aria-hidden="true" />
          Now on the Chrome Web Store · free beta
        </p>
        <h1>
          Stop telling your agent <span className="site-hero__accent">“make it a bit smaller.”</span>
        </h1>
        <p className="site-hero__sub">
          Tweak any live page like Figma, then hand your agent the exact change — in that page’s own design tokens. Any
          site. No repo, no setup.
        </p>
        <div className="site-hero__actions">
          <CtaButton size="hero" />
          <a className="site-ghost" href="#how">
            How it works
          </a>
        </div>
        <p className="site-hero__beta">
          Free while we test. A paid plan comes later; anyone who installs during beta keeps an early-supporter discount.
        </p>
      </div>
      <div className="site-hero__stage">
        <StageFrame
          url="relay.app/welcome"
          className="scene-stage--hero"
          hint={
            <>
              <MousePointerClick size={14} strokeWidth={2.25} aria-hidden="true" />
              Try it: click a box, then change the numbers
            </>
          }
        >
          <HeroDemo />
        </StageFrame>
      </div>
    </section>
  );
}
