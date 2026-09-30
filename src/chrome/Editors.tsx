import { Icon } from './icons';

export function SizeRow({ value, mode = 'Fixed' }: { value: string; mode?: 'Fixed' | 'Hug' | 'Fill' }) {
  const hug = mode !== 'Fixed';
  return (
    <span className="twc-ed-size">
      <span className="twc-ed-size__main">
        <label className="twc-ed">
          <input className="twc-ed__num" type="text" value={value} aria-label="Width" readOnly disabled={hug} />
          <span className="twc-ed__unit-sep" aria-hidden="true" />
          <span className="twc-dd twc-dd--unit">
            <button type="button" className="twc-dd__trigger twc-ed__unit" tabIndex={-1}>
              <span className="twc-dd__value">px</span>
            </button>
          </span>
        </label>
        <span className="twc-dd twc-dd--mode">
          <button type="button" className="twc-dd__trigger" aria-haspopup="menu" aria-expanded="false" tabIndex={-1}>
            <span className="twc-dd__value">{mode}</span>
            <span className="twc-dd__chev" aria-hidden="true">
              <Icon name="chevron-down" size={12} />
            </span>
          </button>
        </span>
      </span>
    </span>
  );
}

export type SideTuple = [string, string, string, string];

export function SidesEditor({
  values,
  onChange,
  kind = 'box',
  edited = false,
}: {
  values: SideTuple;
  onChange?: (values: SideTuple) => void;
  kind?: 'box' | 'radius';
  edited?: boolean;
}) {
  const live = Boolean(onChange);
  const cells: Array<[string, string]> =
    kind === 'radius'
      ? [
          ['Top left', 'corner-tl'],
          ['Top right', 'corner-tr'],
          ['Bottom right', 'corner-br'],
          ['Bottom left', 'corner-bl'],
        ]
      : [
          ['Top', 'side-top'],
          ['Right', 'side-right'],
          ['Bottom', 'side-bottom'],
          ['Left', 'side-left'],
        ];
  return (
    <span className="twc-ed-sides" role="group" aria-label={kind === 'radius' ? 'Corners' : 'Box sides'}>
      {cells.map(([label, icon], index) => (
        <label className={`twc-ed-sides__cell${edited ? ' is-edited' : ''}`} key={label}>
          <span className="twc-ed-sides__ico" aria-hidden="true">
            <Icon name={icon} size={12} />
          </span>
          <input
            className="twc-ed__num"
            value={values[index]}
            aria-label={`${label} ${kind === 'radius' ? 'radius' : 'spacing'}`}
            inputMode="numeric"
            readOnly={!live}
            onChange={
              live
                ? (event) => {
                    const digits = event.target.value.replace(/[^\d]/g, '').slice(0, 3);
                    const next: SideTuple = [...values];
                    next[index] = digits;
                    onChange?.(next);
                  }
                : undefined
            }
            onBlur={
              live
                ? () => {
                    const next: SideTuple = [...values];
                    const n = Number.parseInt(next[index], 10);
                    next[index] = Number.isFinite(n) ? String(Math.min(96, Math.max(0, n))) : '0';
                    onChange?.(next);
                  }
                : undefined
            }
          />
        </label>
      ))}
      <span className="twc-ed-sides__unit">px</span>
    </span>
  );
}

export function ColorField({
  hex,
  token,
  swatch,
}: {
  hex?: string;
  token?: string;
  swatch: string;
}) {
  const bound = Boolean(token);
  return (
    <span className={`twc-ed twc-ed-color${bound ? ' is-token-bound' : ''}`}>
      <span className="twc-ed__main">
        <button type="button" className="twc-ed__swatch" style={{ ['--twc-swatch' as string]: swatch }} aria-label="color" tabIndex={-1}>
          <span className="twc-ed__swatch-fill" aria-hidden="true" />
        </button>
        {bound ? (
          <span className="twc-ed__tok">
            <button type="button" className="twc-ed__tok-face twc-ed__tok-face--tag" tabIndex={-1}>
              {token}
            </button>
          </span>
        ) : (
          <input className="twc-ed__hex" type="text" value={hex} readOnly aria-label="hex" />
        )}
        <button type="button" className="twc-var-btn" aria-label="Apply token" tabIndex={-1}>
          <Icon name="hexagon" size={12} />
        </button>
      </span>
      <span className="twc-ed__unit-sep" aria-hidden="true" />
      <span className="twc-ed__opacity">
        <input className="twc-ed__num twc-ed__num--alpha" type="text" value="100" aria-label="opacity" readOnly />
        <span className="twc-ed__unit" aria-hidden="true">
          %
        </span>
      </span>
    </span>
  );
}

export function TokenChip({ name }: { name: string }) {
  return (
    <span className="twc-tok">
      <span className="twc-tok__name">{name}</span>
    </span>
  );
}
