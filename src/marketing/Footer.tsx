import { CWS_URL, HELLO_EMAIL } from '../links';
import { BrandMark } from './BrandMark';
import { CtaButton } from './CtaButton';

export function FinalCta() {
  return (
    <section className="site-final">
      <BrandMark mark="icon" size="lg" decorative />
      <h2>Your agent built it. Now make it right.</h2>
      <p>Tweak the live page, copy the change, paste it to your agent.</p>
      <CtaButton size="hero" />
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__row">
        <a className="site-footer__brand" href="/" aria-label="twiddle home">
          <BrandMark mark="lockup" size="sm" onDark decorative />
        </a>
        <nav className="site-footer__links" aria-label="Footer">
          <a href={CWS_URL} target="_blank" rel="noopener">
            Chrome Web Store
          </a>
          <a href="/privacy">Privacy</a>
          <a href={`mailto:${HELLO_EMAIL}`}>{HELLO_EMAIL}</a>
        </nav>
      </div>
      <p className="site-footer__note">
        What you edit stays in your browser — we never upload your page. Feedback you choose to send is the only
        exception.
      </p>
      <p className="site-footer__note">© 2026 twiddle. Beta.</p>
    </footer>
  );
}
