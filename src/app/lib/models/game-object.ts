export type GameObjectFrameCoords = [number, number];

export interface GameObject {
  type: string;
  id: string;
  x: number;
  y: number;
  src: string;
  hasShadow: boolean;
  currentAnimationFrame: number;
  animationFrameLimit: number;
  animationFrameProgress: number;
  isPlayerControlled: boolean;
  animations: GameObjectAnimationsMap;
  currentAnimation: string;
}

export type GameObjectAnimationsMap = Record<string, GameObjectFrameCoords[]>;

export type GameObjectCoords = Pick<GameObject, 'x' | 'y'>;

export type GameObjects = Record<string, GameObject>;
