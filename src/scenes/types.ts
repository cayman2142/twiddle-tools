import type { ReactNode } from 'react';

export type SceneState = 'a' | 'b';

export type Scene = {
  id: string;
  eyebrow: string;
  icon: string;
  title: string;
  body: ReactNode;
  url: string;
  /** Two-state toggle; omit for a scene that shows everything at once. */
  stateLabels?: { a: string; b: string };
  /** Stage height on wide screens. */
  height?: number;
  /** Everything inside the browser frame. */
  view: (state: SceneState) => ReactNode;
};
