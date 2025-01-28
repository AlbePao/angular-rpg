export type PersonAnimations =
  | 'idleDown'
  | 'idleRight'
  | 'idleUp'
  | 'idleLeft'
  | 'walkDown'
  | 'walkRight'
  | 'walkUp'
  | 'walkLeft';
export type PersonAnimationsMap = Record<PersonAnimations, [number, number][]>;

export type GameObjectDirections = 'up' | 'left' | 'down' | 'right';

export type ItemAnimations = 'usedDown' | 'unusedDown';

export interface GameObject {
  id: string;
  x: number;
  y: number;
  src: string;
  hasShadow: boolean;
  currentAnimationFrame: number;
}

export interface PersonGameObject extends GameObject {
  isPlayerControlled: boolean;
  movingProgressRemaining: number;
  type: 'person';
  direction: GameObjectDirections;
  animations: PersonAnimationsMap;
  currentAnimation: PersonAnimations;
}

export interface ItemGameObject extends GameObject {
  type: 'item';
  animations: unknown;
  currentAnimation: ItemAnimations;
}

export type PersonGameObjects = Record<string, PersonGameObject>;
export type ItemGameObjects = Record<string, ItemGameObject>;

export type GameObjects = Record<string, PersonGameObject | ItemGameObject>;
