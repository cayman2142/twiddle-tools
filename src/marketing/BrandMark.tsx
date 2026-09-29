type Mark = 'icon' | 'glyph' | 'wordmark' | 'lockup';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  decorative?: boolean;
  mark?: Mark;
  onDark?: boolean;
};

const SRC: Record<Mark, { light: string; dark: string }> = {
  icon: { light: '/logo-icon.svg', dark: '/logo-icon-on-dark.svg' },
  glyph: { light: '/glyph.svg', dark: '/glyph-on-dark.svg' },
  wordmark: { light: '/wordmark.svg', dark: '/wordmark-on-dark.svg' },
  lockup: { light: '/lockup.svg', dark: '/lockup-on-dark.svg' },
};

export function BrandMark({ size = 'sm', decorative = false, mark = 'icon', onDark = false }: Props) {
  return (
    <img
      className={`site-logo site-logo--${size} site-logo--${mark}`}
      src={onDark ? SRC[mark].dark : SRC[mark].light}
      alt={decorative ? '' : 'twiddle'}
      aria-hidden={decorative || undefined}
    />
  );
}
