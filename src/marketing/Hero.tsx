import { lazy, Suspense } from 'react';
import { HeroDemo } from '../host/HeroDemo';
import { CtaButton } from './CtaButton';

const PixelBlast = lazy(() => import('./PixelBlast'));

export function Hero() {
  return (
    <section className="site-hero">
      <div className="site-hero__blast">
        <Suspense fallback={null}>
          <PixelBlast color="#0090ff" variant="circle" pixelSize={3} patternDensity={1.35} edgeFade={0.2} />
        </Suspense>
      </div>
      <div className="site-hero__copy">
        <h1>
          Stop telling your agent <span className="site-hero__accent">“make it a bit smaller.”</span>
        </h1>
        <p className="site-hero__sub">
          Tweak any live page by hand. Hand your agent the exact change — in your own design tokens. Any site. No repo, no
          Figma, no localhost, no setup.
        </p>
        <CtaButton size="hero" />
        <p className="site-hero__beta">
          Free while we test. A paid plan comes later; anyone who installs during beta keeps an early-supporter discount.
        </p>
      </div>
      <div className="site-hero__stage">
        <div className="scene-stage">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
