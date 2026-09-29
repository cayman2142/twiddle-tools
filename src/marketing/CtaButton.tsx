type Props = {
  size?: 'nav' | 'hero';
};

export function CtaButton({ size = 'nav' }: Props) {
  return (
    <button type="button" className={size === 'hero' ? 'site-cta site-cta--hero' : 'site-cta'} disabled>
      Coming soon
    </button>
  );
}
