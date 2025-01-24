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

// TODO: implement for objects
export type ObjectAnimations = 'usedDown' | 'unusedDown';

export interface GameObject {
  x: number;
  y: number;
  src: string;
  hasShadow: boolean;
  animations: PersonAnimationsMap;
  currentAnimation: PersonAnimations;
  currentAnimationFrame: number;
}

export type GameObjects = Record<string, GameObject>;
