import { Faq } from '../marketing/Faq';
import { FinalCta, Footer } from '../marketing/Footer';
import { Handoff } from '../marketing/Handoff';
import { Hero } from '../marketing/Hero';
import { HowItWorks } from '../marketing/HowItWorks';
import { SiteShell } from '../marketing/SiteShell';
import { FeatureScene } from '../scenes/FeatureScene';
import { scenes } from '../scenes/registry';

export function Landing() {
  return (
    <SiteShell>
      <main>
        <Hero />
        <HowItWorks />
        {scenes.map((scene, index) => (
          <FeatureScene key={scene.id} scene={scene} wash={index % 2 === 0} />
        ))}
        <Handoff />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </SiteShell>
  );
}
