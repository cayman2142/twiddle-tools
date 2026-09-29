import { Faq } from '../marketing/Faq';
import { Footer } from '../marketing/Footer';
import { Hero } from '../marketing/Hero';
import { SiteShell } from '../marketing/SiteShell';
import { FeatureScene } from '../scenes/FeatureScene';
import { scenes } from '../scenes/registry';

export function Landing() {
  return (
    <SiteShell>
      <main>
        <Hero />
        {scenes.map((scene, index) => (
          <FeatureScene key={scene.id} scene={scene} flip={index % 2 === 1} />
        ))}
        <Faq />
      </main>
      <Footer />
    </SiteShell>
  );
}
