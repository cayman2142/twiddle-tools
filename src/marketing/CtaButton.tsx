type Props = {
  className?: string;
};

export function CtaButton({ className }: Props) {
  return (
    <button type="button" className={className ?? 'site-cta'} disabled>
      Add to Chrome — coming soon
    </button>
  );
}
