type Props = {
  name: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
};

export function Thiing({ name, alt, size = 'md' }: Props) {
  return <img className={`site-thiing site-thiing--${size}`} src={`/thiings/${name}.png`} alt={alt} aria-hidden={alt === '' || undefined} />;
}
