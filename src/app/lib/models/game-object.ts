export type GameObjectFrameCoords = [number, number];

export interface GameObject {
  type: string;
  id: string;
  x: number;
  y: number;
  src: string;
  hasShadow: boolean;
  currentAnimationFrame: number;
  animationFrameProgress: number;
  isPlayerControlled: boolean;
  direction: GameObjectDirections;
  animations: GameObjectAnimationsMap;
  currentAnimation: string;
  behaviorLoop: GameObjectBehaviors[];
  behaviorLoopIndex: number;
  currentBehaviorTimeElapsed: number;
}

export type GameObjectBehaviorTypes = 'walk' | 'stand';

export type GameObjectBehaviors =
  | {
      type: Extract<GameObjectBehaviorTypes, 'walk'>;
      direction: GameObjectDirections;
    }
  | {
      type: Extract<GameObjectBehaviorTypes, 'stand'>;
      direction: GameObjectDirections;
      time: number;
    };

export type GameObjectDirections = 'up' | 'left' | 'down' | 'right';

export type GameObjectAnimationsMap = Record<string, GameObjectFrameCoords[]>;

export type GameObjectCoords = Pick<GameObject, 'x' | 'y'>;

export type GameObjects = Record<string, GameObject>;
