import { GameObjects } from './game-object';

export type MapCoords = `${number},${number}`;

export type OverworldMapWalls = Record<MapCoords, true>;

export interface OverworldMap {
  id: string;
  lowerSrc: string;
  upperSrc: string;
  gameObjects: GameObjects;
  walls: OverworldMapWalls;
  gameObjectWalls: OverworldMapWalls;
}

export type OverWorldMaps = Record<string, OverworldMap>;
