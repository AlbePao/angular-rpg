import { GameObject, GameObjectFrameCoords } from './game-object';

export interface GameObjectPerson extends GameObject {
  movingProgressRemaining: number;
  type: 'person';
  direction: PersonDirections;
  directionUpdate: PersonDirectionUpdates;
  animations: PersonAnimationsMap;
  currentAnimation: PersonAnimations;
}

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

export type PersonDirections = 'up' | 'left' | 'down' | 'right';

export type PersonDirectionUpdates = Record<PersonDirections, ['x' | 'y', -1 | 1]>;

export type PersonGameObjects = Record<string, GameObjectPerson>;
