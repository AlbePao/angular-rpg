export type GameObjectFrameCoords = [number, number];

export interface AbstractGameObject {
  id: string;
  x: number;
  y: number;
  src: string;
  hasShadow: boolean;
  currentAnimationFrame: number;
  animationFrameLimit: number;
  animationFrameProgress: number;
  isPlayerControlled: boolean;
}
