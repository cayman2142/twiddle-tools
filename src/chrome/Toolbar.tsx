import editHtml from './snapshots/toolbar-edit.html?raw';
import inspectHtml from './snapshots/toolbar-inspect.html?raw';

type Props = {
  mode?: 'inspect' | 'edit';
};

/* The dock is the real extension toolbar (0.1.6), captured from a running
 * build and renamed into the twc- namespace — not a hand-drawn copy. It is a
 * picture of the toolbar, so it is inert and hidden from assistive tech. */
export function Toolbar({ mode = 'inspect' }: Props) {
  return (
    <div
      className="scene-dock"
      aria-hidden="true"
      inert
      dangerouslySetInnerHTML={{ __html: mode === 'edit' ? editHtml : inspectHtml }}
    />
  );
}
