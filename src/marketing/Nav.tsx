import { CtaButton } from './CtaButton';

export function Nav() {
  return (
    <header className="site-nav">
      <a className="site-nav__brand" href="/">
        <span className="site-nav__name">Twiddle</span>
        <span className="site-nav__desc">tell the agent exactly</span>
      </a>
      <nav className="site-nav__links" aria-label="Page">
        <a href="#pain">Features</a>
        <a href="#copy">How it works</a>
        <a href="/privacy">Privacy</a>
      </nav>
      <CtaButton />
    </header>
  );
}
