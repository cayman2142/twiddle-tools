import { EditPanel } from '../chrome/Panel';
import { Toolbar } from '../chrome/Toolbar';
import type { Scene } from './types';

export const editScene: Scene = {
  id: 'edit',
  eyebrow: 'Edit like Figma',
  title: 'Spacing, color, layout, blocks — the GUI you already know.',
  body: 'Fill / Fixed / Hug, four-sided padding, color, duplicate / cut / paste / drag. You are not typing CSS.',
  stateLabels: { a: 'Editors', b: 'Duplicate' },
  host: (state) => ({
    width: 'desktop',
    pinned: 'login',
    tweaks: {
      hatch: true,
      loginEdited: state === 'b',
      duplicatedCard: state === 'b',
      sizeLabel: '320 × 280',
    },
  }),
  chrome: (state) => (
    <>
      <EditPanel padding={state === 'b' ? ['24', '24', '24', '24'] : ['16', '16', '16', '16']} widthMode="Hug" />
      <Toolbar mode="edit" />
    </>
  ),
};
