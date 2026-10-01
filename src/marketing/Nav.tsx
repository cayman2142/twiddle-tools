import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { CtaButton } from './CtaButton';
import { NotchLeftWing, NotchRightWing } from './NotchWings';

const LINKS = [
  { href: '/#how', label: 'How it works' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/privacy', label: 'Privacy' },
];

function Brand() {
  return (
    <a className="site-nav__brand" href="/">
      <BrandMark mark="lockup" size="sm" onDark />
    </a>
  );
}

function Links() {
  return (
    <nav className="site-nav__links" aria-label="Page">
      {LINKS.map((link) => (
        <a key={link.href} href={link.href}>
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-notch">
      <div className="site-notch__menu">
        <NotchLeftWing />
        <Brand />
        <Links />
        <CtaButton />
        <NotchRightWing />
      </div>

      <div className="site-notch__island">
        <NotchLeftWing />
        <Brand />
        <button
          type="button"
          className="site-notch__menu-btn"
          aria-expanded={open}
          aria-controls="site-notch-drawer"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
          <ChevronDown size={16} strokeWidth={2} aria-hidden="true" className={open ? 'is-open' : undefined} />
        </button>
        <CtaButton />
        <NotchRightWing />
        <div
          id="site-notch-drawer"
          className={`site-notch__drawer${open ? ' is-open' : ''}`}
          inert={!open}
          aria-hidden={!open}
        >
          <div className="site-notch__drawer-panel">
            <nav aria-label="Page">
              {LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ))}
            </nav>
            <CtaButton />
          </div>
        </div>
      </div>
    </header>
  );
}
