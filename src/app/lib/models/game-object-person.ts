import { GameObject, GameObjectDirections, GameObjectFrameCoords } from './game-object';

export interface GameObjectPerson extends GameObject {
  movingProgressRemaining: number;
  type: 'person';
  directionUpdate: PersonDirectionUpdates;
  animations: PersonAnimationsMap;
  currentAnimation: PersonAnimations;
}

export type PersonAnimations = `idle-${GameObjectDirections}` | `walk-${GameObjectDirections}`;

export type PersonAnimationsMap = Record<PersonAnimations, GameObjectFrameCoords[]>;

export type PersonDirectionUpdates = Record<GameObjectDirections, ['x' | 'y', -1 | 1]>;

export type PersonGameObjects = Record<string, GameObjectPerson>;
