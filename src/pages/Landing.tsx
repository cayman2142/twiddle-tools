import { Faq } from '../marketing/Faq';
import { Footer } from '../marketing/Footer';
import { Hero } from '../marketing/Hero';
import { Nav } from '../marketing/Nav';
import { FeatureScene } from '../scenes/FeatureScene';
import { scenes } from '../scenes/registry';

export function Landing() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        {scenes.map((scene) => (
          <FeatureScene key={scene.id} scene={scene} />
        ))}
        <Faq />
      </main>
      <Footer />
    </>
  );
}
