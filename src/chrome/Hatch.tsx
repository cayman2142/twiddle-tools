type Props = {
  value?: string;
};

export function Hatch({ value = '16' }: Props) {
  return (
    <div className="sl-hatch is-visible" aria-hidden="true">
      <div className="sl-hatch__band sl-hatch__band--pad sl-hatch__band--top" style={{ height: 'var(--space-4, 16px)' }}>
        <span className="sl-hatch__badge">{value}</span>
      </div>
      <div className="sl-hatch__band sl-hatch__band--pad sl-hatch__band--bottom" style={{ height: 'var(--space-4, 16px)' }}>
        <span className="sl-hatch__badge">{value}</span>
      </div>
      <div className="sl-hatch__band sl-hatch__band--pad sl-hatch__band--left" style={{ width: 'var(--space-4, 16px)' }}>
        <span className="sl-hatch__badge">{value}</span>
      </div>
      <div className="sl-hatch__band sl-hatch__band--pad sl-hatch__band--right" style={{ width: 'var(--space-4, 16px)' }}>
        <span className="sl-hatch__badge">{value}</span>
      </div>
    </div>
  );
}

export function SizeChip({ label }: { label: string }) {
  return <div className="sl-size-cap is-visible is-pinned">{label}</div>;
}

export function Outline() {
  return <div className="sl-outline is-visible is-pinned" />;
}
