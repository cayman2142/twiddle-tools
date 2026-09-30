import { Icon } from './icons';

export type ChangeRow = {
  name: string;
  value: string;
  title: string;
};

type Props = {
  label?: string;
  selector?: string;
  rows: ChangeRow[];
};

export function Changes({ label = 'Primary button', selector = 'main > section.hero > button.cta', rows }: Props) {
  const empty = rows.length === 0;
  return (
    <div className="twc-changes">
      <div className="twc-changes__head">
        <span className={`twc-changes__badge${empty ? ' is-empty' : ''}`}>
          {empty ? 'No changes' : `${rows.length} ${rows.length === 1 ? 'change' : 'changes'}`}
        </span>
        <span className="twc-changes__spacer" />
        <button type="button" className="twc-changes__icon" aria-label="Copy all changes" disabled={empty} tabIndex={-1}>
          <Icon name="copy" size={10} />
        </button>
        <button type="button" className="twc-changes__icon" aria-label="Discard all changes" disabled={empty} tabIndex={-1}>
          <Icon name="trash" size={14} />
        </button>
      </div>
      <div className="twc-changes__body">
        {empty ? (
          <div className="twc-empty">
            <span className="twc-empty__icon" aria-hidden="true">
              <Icon name="edit" size={20} />
            </span>
            <span className="twc-empty__title">Nothing edited yet</span>
            <span className="twc-empty__hint">Switch to Edit mode and change a value.</span>
          </div>
        ) : (
          <section className="twc-changes__group is-focus">
            <div className="twc-changes__group-head">
              <span className="twc-changes__idx">#1</span>
              <div className="twc-changes__meta">
                <span className="twc-changes__label">{label}</span>
                <span className="twc-changes__sel">{selector}</span>
              </div>
              <span className="twc-changes__group-actions">
                <button type="button" className="twc-changes__icon" aria-label="Inspect element" tabIndex={-1}>
                  <Icon name="jump" size={14} />
                </button>
                <button type="button" className="twc-changes__icon" aria-label="Discard element changes" tabIndex={-1}>
                  <Icon name="trash" size={14} />
                </button>
              </span>
            </div>
            <ul className="twc-changes__props">
              {rows.map((row) => (
                <li className="twc-changes__prop" key={row.name}>
                  <span className="twc-changes__prop-name">{row.name}</span>
                  <span className="twc-changes__prop-val" title={row.title}>
                    {row.value}
                  </span>
                  <button type="button" className="twc-changes__prop-revert" aria-label={`Revert ${row.name}`} tabIndex={-1}>
                    <Icon name="close" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
