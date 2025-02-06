import { AbstractGameObject } from './game-object-abstract';

export interface GameObjectItem extends AbstractGameObject {
  type: 'item';
  animations: unknown;
  currentAnimation: ItemAnimations;
}

export type ItemAnimations = 'usedDown' | 'unusedDown';

export type ItemGameObjects = Record<string, GameObjectItem>;
