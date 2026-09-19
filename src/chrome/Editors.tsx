import { Icon } from './icons';

export function SizeRow({ value, mode = 'Fixed' }: { value: string; mode?: 'Fixed' | 'Hug' | 'Fill' }) {
  const hug = mode !== 'Fixed';
  return (
    <span className="sl-ed-size">
      <span className="sl-ed-size__main">
        <label className="sl-ed">
          <input className="sl-ed__num" type="text" value={value} aria-label="Width" readOnly disabled={hug} />
          <span className="sl-ed__unit-sep" aria-hidden="true" />
          <span className="sl-dd sl-dd--unit">
            <button type="button" className="sl-dd__trigger sl-ed__unit" tabIndex={-1}>
              <span className="sl-dd__value">px</span>
            </button>
          </span>
        </label>
        <span className="sl-dd sl-dd--mode">
          <button type="button" className="sl-dd__trigger" aria-haspopup="menu" aria-expanded="false" tabIndex={-1}>
            <span className="sl-dd__value">{mode}</span>
            <span className="sl-dd__chev" aria-hidden="true">
              <Icon name="chevron-down" size={12} />
            </span>
          </button>
        </span>
      </span>
    </span>
  );
}

export function SidesEditor({ values }: { values: [string, string, string, string] }) {
  const sides: Array<[string, string, string]> = [
    ['Top', 'side-top', values[0]],
    ['Right', 'side-right', values[1]],
    ['Bottom', 'side-bottom', values[2]],
    ['Left', 'side-left', values[3]],
  ];
  return (
    <span className="sl-ed-sides" role="group" aria-label="Box sides">
      {sides.map(([label, icon, value]) => (
        <label className="sl-ed-sides__cell" key={label}>
          <span className="sl-ed-sides__ico" aria-hidden="true">
            <Icon name={icon} size={12} />
          </span>
          <input className="sl-ed__num" value={value} aria-label={`${label} spacing`} readOnly />
        </label>
      ))}
      <span className="sl-ed-sides__unit">px</span>
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
    <span className={`sl-ed sl-ed-color${bound ? ' is-token-bound' : ''}`}>
      <span className="sl-ed__main">
        <button type="button" className="sl-ed__swatch" style={{ ['--sl-swatch' as string]: swatch }} aria-label="color" tabIndex={-1}>
          <span className="sl-ed__swatch-fill" aria-hidden="true" />
        </button>
        {bound ? (
          <span className="sl-ed__tok">
            <button type="button" className="sl-ed__tok-face sl-ed__tok-face--tag" tabIndex={-1}>
              {token}
            </button>
          </span>
        ) : (
          <input className="sl-ed__hex" type="text" value={hex} readOnly aria-label="hex" />
        )}
        <button type="button" className="sl-var-btn" aria-label="Apply token" tabIndex={-1}>
          <Icon name="hexagon" size={12} />
        </button>
      </span>
      <span className="sl-ed__unit-sep" aria-hidden="true" />
      <span className="sl-ed__opacity">
        <input className="sl-ed__num sl-ed__num--alpha" type="text" value="100" aria-label="opacity" readOnly />
        <span className="sl-ed__unit" aria-hidden="true">
          %
        </span>
      </span>
    </span>
  );
}

export function TokenChip({ name }: { name: string }) {
  return (
    <span className="sl-tok">
      <span className="sl-tok__name">{name}</span>
    </span>
  );
}
