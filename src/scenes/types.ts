import type { ReactNode } from 'react';
import type { HostProps } from '../host/HostApp';

export type SceneState = 'a' | 'b';

export type Scene = {
  id: string;
  eyebrow: string;
  icon: string;
  title: string;
  body: string;
  stateLabels: { a: string; b: string };
  host: (state: SceneState) => HostProps;
  chrome: (state: SceneState) => ReactNode;
};
