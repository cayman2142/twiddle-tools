import { Faq } from '../marketing/Faq';
import { FinalCta, Footer } from '../marketing/Footer';
import { Hero } from '../marketing/Hero';
import { HowItWorks } from '../marketing/HowItWorks';
import { SiteShell } from '../marketing/SiteShell';

export function Landing() {
  return (
    <SiteShell>
      <main>
        <Hero />
        <HowItWorks />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </SiteShell>
  );
}
