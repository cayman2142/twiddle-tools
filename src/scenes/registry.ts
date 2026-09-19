import { adaptiveScene } from './adaptive';
import { copyScene } from './copy';
import { editScene } from './edit';
import { painScene } from './pain';
import { tokensScene } from './tokens';
import type { Scene } from './types';

export const scenes: Scene[] = [painScene, editScene, tokensScene, adaptiveScene, copyScene];
