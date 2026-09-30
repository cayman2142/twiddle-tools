import { adaptiveScene } from './adaptive';
import { editScene } from './edit';
import { tokensScene } from './tokens';
import type { Scene } from './types';

export const scenes: Scene[] = [editScene, tokensScene, adaptiveScene];
