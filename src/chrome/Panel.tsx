import type { ReactNode } from 'react';
import { Changes, type ChangeRow } from './Changes';
import { ColorField, SidesEditor, SizeRow, TokenChip, type SideTuple } from './Editors';
import { Icon, TabIcon } from './icons';

type Tab = 'spec' | 'colors' | 'type' | 'assets' | 'changes';

type Props = {
  tab?: Tab;
  children?: ReactNode;
};

function Tabs({ tab }: { tab: Tab }) {
  const items: Array<[Tab, string, string]> = [
    ['spec', 'spec', 'Inspector'],
    ['colors', 'colors', 'Colors'],
    ['type', 'type', 'Typography'],
    ['assets', 'assets', 'Assets'],
    ['changes', 'changes', 'Changes'],
  ];
  return (
    <div className="sl-panel__tabs" role="tablist" aria-label="Twiddle views">
      {items.map(([id, icon, label]) => {
        const on = tab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            className={`sl-panel__tab${on ? ' is-on' : ''}`}
            aria-selected={on}
            aria-label={label}
            tabIndex={-1}
          >
            <TabIcon name={icon} />
          </button>
        );
      })}
    </div>
  );
}

export function Panel({ tab = 'spec', children }: Props) {
  return (
    <div className="sl-panel is-visible">
      <div className="sl-panel__card sl-panel__card--chrome">
        <div className="sl-panel__handle" tabIndex={-1} aria-label="Move panel">
          <span className="sl-panel__grip" aria-hidden="true">
            <Icon name="grip" size={12} />
          </span>
        </div>
        <Tabs tab={tab} />
      </div>
      <div className="sl-rows">{children}</div>
    </div>
  );
}

export function SpecInspectPanel() {
  return (
    <Panel tab="spec">
      <div className="sl-panel__card sl-panel__card--meta">
        <div className="sl-panel__head">
          <div className="sl-panel__status">
            <button type="button" className="sl-panel__token-hint" title="No matching spacing token" tabIndex={-1}>
              No matching spacing token
            </button>
          </div>
          <div className="sl-panel__head-row">
            <span className="sl-panel__tag">button</span>
            <button type="button" className="sl-panel__pin" aria-pressed="true" tabIndex={-1}>
              <span className="sl-panel__pin-text">Pinned</span>
            </button>
          </div>
        </div>
      </div>
      <div className="sl-section">
        <button type="button" className="sl-section__head" aria-expanded="true" tabIndex={-1}>
          <span className="sl-section__label">Typography</span>
        </button>
        <div className="sl-section__body">
          <div className="sl-section__inner">
            <div className="sl-row">
              <span className="sl-row__key">font-size</span>
              <span className="sl-row__val">
                <TokenChip name="--text-md" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="sl-panel__footer">
        <div className="sl-panel__copy-split">
          <button type="button" className="sl-ghost" aria-label="Copy as Agent MD" tabIndex={-1}>
            Copy as Agent MD
          </button>
        </div>
      </div>
    </Panel>
  );
}

export function EditPanel({ padding, widthMode = 'Hug' }: { padding: [string, string, string, string]; widthMode?: 'Fixed' | 'Hug' | 'Fill' }) {
  return (
    <Panel tab="spec">
      <div className="sl-panel__card sl-panel__card--meta">
        <div className="sl-panel__head">
          <div className="sl-panel__head-row">
            <span className="sl-panel__tag">form</span>
            <button type="button" className="sl-panel__pin" aria-pressed="true" tabIndex={-1}>
              <span className="sl-panel__pin-text">Pinned</span>
            </button>
          </div>
        </div>
      </div>
      <div className="sl-section">
        <button type="button" className="sl-section__head" aria-expanded="true" tabIndex={-1}>
          <span className="sl-section__label">Size</span>
        </button>
        <div className="sl-section__body">
          <div className="sl-section__inner">
            <div className="sl-row">
              <span className="sl-row__key">width</span>
              <span className="sl-row__val">
                <SizeRow value="320" mode={widthMode} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="sl-section">
        <button type="button" className="sl-section__head" aria-expanded="true" tabIndex={-1}>
          <span className="sl-section__label">Spacing</span>
        </button>
        <div className="sl-section__body">
          <div className="sl-section__inner">
            <div className="sl-row">
              <span className="sl-row__key">padding</span>
              <span className="sl-row__val">
                <SidesEditor values={padding} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="sl-section">
        <button type="button" className="sl-section__head" aria-expanded="true" tabIndex={-1}>
          <span className="sl-section__label">Fill</span>
        </button>
        <div className="sl-section__body">
          <div className="sl-section__inner">
            <div className="sl-row">
              <span className="sl-row__key">color</span>
              <span className="sl-row__val">
                <ColorField hex="0F766E" swatch="var(--color-brand)" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function BoxEditPanel({
  tag,
  padding,
  margin,
  radius,
  onPadding,
  onMargin,
  onRadius,
}: {
  tag: string;
  padding: SideTuple;
  margin: SideTuple;
  radius: SideTuple;
  onPadding: (values: SideTuple) => void;
  onMargin: (values: SideTuple) => void;
  onRadius: (values: SideTuple) => void;
}) {
  return (
    <Panel tab="spec">
      <div className="sl-panel__card sl-panel__card--meta">
        <div className="sl-panel__head">
          <div className="sl-panel__head-row">
            <span className="sl-panel__tag">{tag}</span>
            <button type="button" className="sl-panel__pin" aria-pressed="true" tabIndex={-1}>
              <span className="sl-panel__pin-text">Pinned</span>
            </button>
          </div>
        </div>
      </div>
      <div className="sl-section">
        <button type="button" className="sl-section__head" aria-expanded="true" tabIndex={-1}>
          <span className="sl-section__label">Spacing</span>
        </button>
        <div className="sl-section__body">
          <div className="sl-section__inner">
            <div className="sl-row">
              <span className="sl-row__key">padding</span>
              <span className="sl-row__val">
                <SidesEditor values={padding} onChange={onPadding} />
              </span>
            </div>
            <div className="sl-row">
              <span className="sl-row__key">margin</span>
              <span className="sl-row__val">
                <SidesEditor values={margin} onChange={onMargin} />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="sl-section">
        <button type="button" className="sl-section__head" aria-expanded="true" tabIndex={-1}>
          <span className="sl-section__label">Corner</span>
        </button>
        <div className="sl-section__body">
          <div className="sl-section__inner">
            <div className="sl-row">
              <span className="sl-row__key">radius</span>
              <span className="sl-row__val">
                <SidesEditor values={radius} onChange={onRadius} kind="radius" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function TokensPanel({ bound }: { bound: boolean }) {
  return (
    <Panel tab="spec">
      <div className="sl-panel__card sl-panel__card--meta">
        <div className="sl-panel__head">
          <div className="sl-panel__status">
            {bound ? (
              <button type="button" className="sl-panel__token-hint" tabIndex={-1}>
                Bound to this page
              </button>
            ) : (
              <span className="sl-off">off-scale</span>
            )}
          </div>
          <div className="sl-panel__head-row">
            <span className="sl-panel__tag">button</span>
            <button type="button" className="sl-panel__pin" aria-pressed="true" tabIndex={-1}>
              <span className="sl-panel__pin-text">Pinned</span>
            </button>
          </div>
        </div>
      </div>
      <div className="sl-section">
        <button type="button" className="sl-section__head" aria-expanded="true" tabIndex={-1}>
          <span className="sl-section__label">Spacing</span>
        </button>
        <div className="sl-section__body">
          <div className="sl-section__inner">
            <div className="sl-row">
              <span className="sl-row__key">padding</span>
              <span className="sl-row__val">
                {bound ? <TokenChip name="--space-4" /> : <span>11px</span>}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="sl-section">
        <button type="button" className="sl-section__head" aria-expanded="true" tabIndex={-1}>
          <span className="sl-section__label">Fill</span>
        </button>
        <div className="sl-section__body">
          <div className="sl-section__inner">
            <div className="sl-row">
              <span className="sl-row__key">background</span>
              <span className="sl-row__val">
                <ColorField
                  hex={bound ? undefined : '0F766E'}
                  token={bound ? '--color-brand' : undefined}
                  swatch="var(--color-brand)"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function ChangesPanel({ rows }: { rows: ChangeRow[] }) {
  return (
    <Panel tab="changes">
      <Changes rows={rows} />
    </Panel>
  );
}
