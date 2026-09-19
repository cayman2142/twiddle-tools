import { Icon } from './icons';

type Props = {
  mode?: 'inspect' | 'edit';
};

export function Toolbar({ mode = 'inspect' }: Props) {
  return (
    <div className="sl-fab-dock">
      <button type="button" className="sl-fab-settings" aria-label="Settings" tabIndex={-1}>
        <Icon name="settings" size={16} />
      </button>
      <div className="sl-toolbar" role="toolbar" aria-label="Twiddle tools">
        <button type="button" className="sl-fab sl-toolbar__btn is-active" aria-pressed="true" aria-label="Inspect" tabIndex={-1}>
          <Icon name="inspect" size={16} />
        </button>
        <button type="button" className="sl-toolbar__btn" aria-pressed="false" aria-label="X-ray" tabIndex={-1}>
          <Icon name="xray" size={16} />
        </button>
        <div className="sl-mode sl-seg" role="radiogroup" aria-label="Interaction mode">
          <button
            type="button"
            className={`sl-mode__btn sl-toolbar__btn sl-seg__opt${mode === 'inspect' ? ' is-on' : ''}`}
            role="radio"
            aria-checked={mode === 'inspect'}
            aria-label="Inspect mode"
            tabIndex={-1}
          >
            <Icon name="mode-inspect" size={16} />
          </button>
          <button
            type="button"
            className={`sl-mode__btn sl-toolbar__btn sl-seg__opt${mode === 'edit' ? ' is-on' : ''}`}
            role="radio"
            aria-checked={mode === 'edit'}
            aria-label="Edit mode"
            tabIndex={-1}
          >
            <Icon name="edit" size={16} />
          </button>
        </div>
        <button type="button" className="sl-toolbar__btn" aria-label="Undo" tabIndex={-1}>
          <Icon name="undo-2" size={16} />
        </button>
        <button type="button" className="sl-toolbar__btn" aria-label="Redo" aria-disabled="true" tabIndex={-1}>
          <Icon name="redo-2" size={16} />
        </button>
        <button type="button" className="sl-toolbar__btn sl-toolbar__copy-block" aria-label="Copy as Agent MD" tabIndex={-1}>
          <Icon name="copy-block" size={16} />
        </button>
      </div>
    </div>
  );
}
