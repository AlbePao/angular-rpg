export type GameObjectFrameCoords = [number, number];

export type PersonAnimations =
  | 'idle-down'
  | 'idle-right'
  | 'idle-up'
  | 'idle-left'
  | 'walk-down'
  | 'walk-right'
  | 'walk-up'
  | 'walk-left';
export type PersonAnimationsMap = Record<PersonAnimations, GameObjectFrameCoords[]>;

export type GameObjectDirections = 'up' | 'left' | 'down' | 'right';

export type ItemAnimations = 'usedDown' | 'unusedDown';

interface AbstractGameObject {
  id: string;
  x: number;
  y: number;
  src: string;
  hasShadow: boolean;
  currentAnimationFrame: number;
  animationFrameLimit: number;
  animationFrameProgress: number;
  currentFrameCoords: GameObjectFrameCoords;
}

export interface PersonGameObject extends AbstractGameObject {
  isPlayerControlled: boolean;
  movingProgressRemaining: number;
  type: 'person';
  direction: GameObjectDirections;
  directionUpdate: PersonDirectionUpdates;
  animations: PersonAnimationsMap;
  currentAnimation: PersonAnimations;
}

export type PersonDirectionUpdates = Record<GameObjectDirections, ['x' | 'y', -1 | 1]>;

export interface ItemGameObject extends AbstractGameObject {
  type: 'item';
  animations: unknown;
  currentAnimation: ItemAnimations;
}

export type GameObject = PersonGameObject | ItemGameObject;

export type PersonGameObjects = Record<string, PersonGameObject>;
export type ItemGameObjects = Record<string, ItemGameObject>;
export type GameObjects = Record<string, GameObject>;
