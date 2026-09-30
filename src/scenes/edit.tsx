import { EditPanel } from '../chrome/Panel';
import { Toolbar } from '../chrome/Toolbar';
import { HostApp } from '../host/HostApp';
import type { Scene } from './types';

export const editScene: Scene = {
  id: 'edit',
  eyebrow: 'Edit like Figma',
  icon: 'paintbrush',
  title: 'Spacing, color, size, blocks — in the GUI you already know.',
  body: 'Four-sided padding, Fill / Fixed / Hug, color, duplicate / cut / paste / drag. The live page updates as you type. You are not writing CSS.',
  url: 'relay.app/home',
  stateLabels: { a: 'Before', b: 'Padding 16 → 24' },
  view: (state) => {
    const pad = state === 'b' ? 24 : 16;
    const side = String(pad);
    return (
      <>
        <div className="scene-stage__host">
          <HostApp
            compact
            pinned="login"
            tweaks={{ hatch: pad, loginPadding: pad, sizeLabel: state === 'b' ? '300 × 318' : '300 × 302' }}
          />
        </div>
        <EditPanel padding={[side, side, side, side]} widthMode="Fill" edited={state === 'b'} />
        <Toolbar mode="edit" />
      </>
    );
  },
};
