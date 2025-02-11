import { GameObject, GameObjectFrameCoords } from './game-object';

export interface GameObjectItem extends GameObject {
  type: 'item';
  animations: ItemAnimationsMap;
  currentAnimation: ItemAnimations;
}

export type ItemAnimations = 'usedDown' | 'unusedDown';

export type ItemAnimationsMap = Record<ItemAnimations, GameObjectFrameCoords[]>;

export type ItemGameObjects = Record<string, GameObjectItem>;
