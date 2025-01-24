import { GameObjects } from './game-object';

export interface OverworldMap {
  id: string;
  lowerSrc: string;
  upperSrc: string;
  gameObjects: GameObjects;
}

export type OverWorldMaps = Record<string, OverworldMap>;
