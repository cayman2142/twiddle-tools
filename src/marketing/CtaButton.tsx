import { CWS_URL } from '../links';

type Props = {
  size?: 'nav' | 'hero';
};

function ChromeGlyph() {
  return (
    <svg className="site-cta__glyph" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8.4h9.2M8.9 13.8 4.3 5.8M15.1 13.8l-4.6 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function CtaButton({ size = 'nav' }: Props) {
  const hero = size === 'hero';
  return (
    <a className={hero ? 'site-cta site-cta--hero' : 'site-cta'} href={CWS_URL} target="_blank" rel="noopener">
      <ChromeGlyph />
      {hero ? 'Add to Chrome — it’s free' : 'Add to Chrome'}
    </a>
  );
}
